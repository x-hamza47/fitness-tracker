import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
    RigidBody,
    CylinderCollider,
    useRopeJoint,
    type RapierRigidBody,
} from "@react-three/rapier";
import { Box3, Mesh, Quaternion, Vector3 } from "three";
import { useDragBody, type DragOptions } from "@/hooks/useDragBody";

type Vec3 = [number, number, number];
type BodyRef = React.RefObject<RapierRigidBody>;

const URL = "/models/punching-bag.glb";

export type PunchingBagProps = {
    url?: string;
    position?: [number, number];   // [x, z]
    ceilingY?: number;             // height of the ceiling
    size?: number;                 // size of the model (chain + bag)
    floorGap?: number;             // bottom of the bag stays this high above the floor
    bagFraction?: number;          // bottom part of the model that is the bag (0-1)
    mass?: number;
    breakForce?: number;           // contact force (thrown objects) that snaps the chain
    unbreakable?: boolean;
    modelRotation?: Vec3;
    minPunch?: number;             // power of a quick tap
    maxPunch?: number;             // power at full charge (human max)
    maxHoldTime?: number;          // seconds of holding to reach full charge
    punchStrength?: number;        // fixed fist strength: heavier bag = moves less
    breakPunchPower?: number;      // punch power that snaps the chain (undefined = punches never break it)
    drag?: DragOptions;            // right-click drag settings
    onBreak?: () => void;
};

/* rope from the ceiling to the model's top + extra chain drawn between them */
function BagChain({
    anchorRef,
    bodyRef,
    anchor,
    halfHeight,
    length,
}: {
    anchorRef: BodyRef;
    bodyRef: BodyRef;
    anchor: Vec3;
    halfHeight: number;
    length: number;
}) {
    useRopeJoint(anchorRef, bodyRef, [[0, 0, 0], [0, halfHeight, 0], length]);

    const mesh = useRef<Mesh>(null);
    const up = useMemo(() => new Vector3(0, 1, 0), []);
    const a = useMemo(() => new Vector3(...anchor), [anchor]);
    const pos = useMemo(() => new Vector3(), []);
    const top = useMemo(() => new Vector3(), []);
    const dir = useMemo(() => new Vector3(), []);
    const q = useMemo(() => new Quaternion(), []);

    useFrame(() => {
        const b = bodyRef.current;
        const m = mesh.current;
        if (!b || !m) return;
        const t = b.translation();
        const r = b.rotation();
        q.set(r.x, r.y, r.z, r.w);
        pos.set(t.x, t.y, t.z);
        top.set(0, halfHeight, 0).applyQuaternion(q).add(pos);
        dir.copy(top).sub(a);
        const len = dir.length() || 0.001;
        m.position.copy(a).addScaledVector(dir, 0.5);
        m.quaternion.setFromUnitVectors(up, dir.normalize());
        m.scale.set(1, len, 1);
    });

    return (
        <mesh ref={mesh} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
            <meshStandardMaterial color="#6b6b6b" metalness={0.9} roughness={0.35} />
        </mesh>
    );
}

export default function PunchingBag({
    url = URL,
    position = [5, -18],
    ceilingY = 15,
    size = 7,
    floorGap = 2,
    bagFraction = 0.6,
    mass = 40,
    breakForce = 6000,
    unbreakable = false,
    modelRotation = [0, 0, 0],
    minPunch = 3,
    maxPunch = 14,
    maxHoldTime = 1.5,
    punchStrength = 40,
    breakPunchPower,
    drag: dragOptions,
    onBreak,
}: PunchingBagProps) {
    const { scene } = useGLTF(url);
    const get = useThree((s) => s.get);
    const body = useRef<RapierRigidBody>(null) as BodyRef;
    const anchorBody = useRef<RapierRigidBody>(null) as BodyRef;
    const bornAt = useRef(0);
    const [broken, setBroken] = useState(false);

    // charging state: set on left press, used on release
    const charge = useRef<{ start: number; point: Vector3; dir: Vector3 } | null>(null);

    useEffect(() => {
        bornAt.current = performance.now();
    }, []);

    const anchor: Vec3 = [position[0], ceilingY, position[1]];

    // right-click drag
    const drag = useDragBody(body, {
        stiffness: 20,
        damping: 0.8,
        maxAccel: 400,
        maxSpeed: 25,
        dragAngularDamping: 1.5,
        restAngularDamping: 1.5,
        minY: 0.3,
        ...dragOptions,
    });

    const setControls = (enabled: boolean) => {
        const controls = get().controls as unknown as { enabled: boolean } | null;
        if (controls) controls.enabled = enabled;
    };

    const { object, scale, offset, halfHeight, radius } = useMemo(() => {
        const clone = scene.clone(true);
        clone.traverse((o) => {
            if ((o as Mesh).isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });
        clone.updateMatrixWorld(true);

        const box = new Box3().setFromObject(clone);
        const dim = box.getSize(new Vector3());
        const center = box.getCenter(new Vector3());
        const s = size / (Math.max(dim.x, dim.y, dim.z) || 1);

        return {
            object: clone,
            scale: s,
            offset: center.clone().multiplyScalar(-s).toArray() as Vec3,
            halfHeight: (dim.y * s) / 2,
            radius: (Math.max(dim.x, dim.z) * s) / 2,
        };
    }, [scene, size]);

    const bagHalf = halfHeight * bagFraction;
    const colliderY = -halfHeight + bagHalf;

    const gap = Math.max(0.05, ceilingY - floorGap - size);
    const startPos: Vec3 = [anchor[0], anchor[1] - gap - halfHeight, anchor[2]];

    /* ---------- left click = charge, right click = drag ---------- */
    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
        if (broken) return;

        if (e.nativeEvent.button === 2) {
            drag.onPointerDown(e); // right click = drag
            return;
        }

        e.stopPropagation(); // left click = charge a punch
        charge.current = {
            start: performance.now(),
            point: e.point.clone(),
            dir: e.ray.direction.clone().normalize(),
        };
        setControls(false); // stop the camera from orbiting while charging
        document.body.style.cursor = "grabbing";
    };

    useEffect(() => {
        const cancel = () => {
            if (!charge.current) return;
            charge.current = null;
            setControls(true);
            document.body.style.cursor = "auto";
        };

        const release = () => {
            const c = charge.current;
            if (!c) return; // right-click drags are handled by useDragBody
            charge.current = null;
            setControls(true);
            document.body.style.cursor = "auto";

            const b = body.current;
            if (!b || broken) return;

            // 0..1, capped: holding longer than maxHoldTime adds nothing
            const held = Math.min((performance.now() - c.start) / 1000 / maxHoldTime, 1);
            const power = minPunch + (maxPunch - minPunch) * held;

            // fixed fist strength, so a heavier bag moves less
            const impulse = c.dir.clone().multiplyScalar(punchStrength * power);
            b.applyImpulseAtPoint(impulse, c.point, true);

            if (!unbreakable && breakPunchPower !== undefined && power >= breakPunchPower) {
                setBroken(true);
                onBreak?.();
            }
        };

        window.addEventListener("pointerup", release);
        window.addEventListener("pointercancel", cancel);
        window.addEventListener("blur", cancel);
        return () => {
            window.removeEventListener("pointerup", release);
            window.removeEventListener("pointercancel", cancel);
            window.removeEventListener("blur", cancel);
            document.body.style.cursor = "auto";
        };
    }, [broken, minPunch, maxPunch, maxHoldTime, punchStrength, unbreakable, breakPunchPower, onBreak]);

    /* ---------- break from thrown objects (dumbbell etc.) ---------- */
    const handleContactForce = (p: { totalForceMagnitude: number }) => {
        if (unbreakable || broken) return;
        if (performance.now() - bornAt.current < 1500) return;
        if (p.totalForceMagnitude > breakForce) {
            setBroken(true);
            onBreak?.();
        }
    };

    return (
        <>
            <RigidBody ref={anchorBody} type="fixed" position={anchor} colliders={false} />

            <RigidBody
                ref={body}
                position={startPos}
                colliders={false}
                linearDamping={0.15}
                angularDamping={1.5}
                restitution={0.2}
                friction={0.9}
                ccd
                onContactForce={handleContactForce}
            >
                <CylinderCollider
                    args={[bagHalf, radius * 0.9]}
                    position={[0, colliderY, 0]}
                    mass={mass}
                />
                <primitive
                    object={object}
                    scale={scale}
                    position={offset}
                    rotation={modelRotation}
                    onPointerDown={onPointerDown}
                    onContextMenu={(e: ThreeEvent<MouseEvent>) => e.nativeEvent.preventDefault()}
                    onPointerOver={() => {
                        if (!charge.current) document.body.style.cursor = "pointer";
                    }}
                    onPointerOut={() => {
                        if (!charge.current) document.body.style.cursor = "auto";
                    }}
                />
            </RigidBody>

            {!broken && (
                <BagChain
                    anchorRef={anchorBody}
                    bodyRef={body}
                    anchor={anchor}
                    halfHeight={halfHeight}
                    length={gap}
                />
            )}
        </>
    );
}

useGLTF.preload(URL);