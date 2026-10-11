import { useEffect, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import { Plane, Quaternion, Raycaster, Vector3 } from "three";

export type DragOptions = {
    stiffness?: number;          
    damping?: number;            
    maxAccel?: number;           
    maxSpeed?: number;           
    dragAngularDamping?: number; 
    restAngularDamping?: number; 
    minY?: number;               
};

export function useDragBody(
    bodyRef: React.RefObject<RapierRigidBody | null>,
    {
        stiffness = 40,
        damping = 0.7,
        maxAccel = 1500,
        maxSpeed = 40,
        dragAngularDamping = 0.8,
        restAngularDamping = 0.6,
        minY = 0.3,
    }: DragOptions = {}
) {
    const get = useThree((s) => s.get);

    const dragging = useRef(false);
    const hasPrev = useRef(false);
    const plane = useRef(new Plane());
    const raycaster = useRef(new Raycaster());

    const target = useRef(new Vector3());
    const prevTarget = useRef(new Vector3());
    const targetVel = useRef(new Vector3());
    const rawVel = useRef(new Vector3());
    const localGrab = useRef(new Vector3());
    const worldGrab = useRef(new Vector3());
    const com = useRef(new Vector3());
    const rel = useRef(new Vector3());
    const pointVel = useRef(new Vector3());
    const accel = useRef(new Vector3());
    const quat = useRef(new Quaternion());
    const tmp = useRef(new Vector3());
    const tmp2 = useRef(new Vector3());

    const setControls = (enabled: boolean) => {
        const controls = get().controls as unknown as { enabled: boolean } | null;
        if (controls) controls.enabled = enabled;
    };

    const release = () => {
        if (!dragging.current) return;
        dragging.current = false;
        setControls(true);
        bodyRef.current?.setAngularDamping(restAngularDamping);
        document.body.style.cursor = "auto";
    };

    useEffect(() => {
        window.addEventListener("pointerup", release);
        window.addEventListener("pointercancel", release);
        window.addEventListener("blur", release);
        return () => {
            window.removeEventListener("pointerup", release);
            window.removeEventListener("pointercancel", release);
            window.removeEventListener("blur", release);
            document.body.style.cursor = "auto";
        };
    }, []);

    useFrame(({ pointer, camera }, delta) => {
        const body = bodyRef.current;
        if (!dragging.current || !body) return;

        const dt = Math.min(Math.max(delta, 1 / 240), 1 / 30);

        
        raycaster.current.setFromCamera(pointer, camera);
        if (!raycaster.current.ray.intersectPlane(plane.current, target.current)) return;
        if (target.current.y < minY) target.current.y = minY;

        
        if (hasPrev.current) {
            rawVel.current.copy(target.current).sub(prevTarget.current).divideScalar(dt);
            rawVel.current.clampLength(0, maxSpeed);
            targetVel.current.lerp(rawVel.current, 0.35);
        }
        prevTarget.current.copy(target.current);
        hasPrev.current = true;

        
        const t = body.translation();
        const r = body.rotation();
        quat.current.set(r.x, r.y, r.z, r.w);
        worldGrab.current
            .copy(localGrab.current)
            .applyQuaternion(quat.current)
            .add(tmp.current.set(t.x, t.y, t.z));

        
        const c = body.worldCom();
        com.current.set(c.x, c.y, c.z);
        rel.current.copy(worldGrab.current).sub(com.current);
        const lv = body.linvel();
        const av = body.angvel();
        pointVel.current
            .set(lv.x, lv.y, lv.z)
            .add(tmp.current.set(av.x, av.y, av.z).cross(rel.current));

        
        const k = stiffness * stiffness;
        const cd = 2 * damping * stiffness;
        accel.current
            .copy(target.current)
            .sub(worldGrab.current)
            .multiplyScalar(k)
            .add(tmp2.current.copy(targetVel.current).sub(pointVel.current).multiplyScalar(cd))
            .clampLength(0, maxAccel);

        const m = body.mass();
        body.applyImpulseAtPoint(accel.current.multiplyScalar(m * dt), worldGrab.current, true);
    });

    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
        const body = bodyRef.current;
        if (!body) return;
        e.stopPropagation();

        const normal = new Vector3();
        get().camera.getWorldDirection(normal);
        plane.current.setFromNormalAndCoplanarPoint(normal, e.point);

        const t = body.translation();
        const r = body.rotation();
        const inv = new Quaternion(r.x, r.y, r.z, r.w).invert();
        localGrab.current
            .copy(e.point)
            .sub(tmp.current.set(t.x, t.y, t.z))
            .applyQuaternion(inv);

        hasPrev.current = false;
        targetVel.current.set(0, 0, 0);
        dragging.current = true;
        setControls(false);
        body.setAngularDamping(dragAngularDamping);
        body.wakeUp();
        document.body.style.cursor = "grabbing";
    };

    const onPointerOver = () => {
        if (!dragging.current) document.body.style.cursor = "grab";
    };
    const onPointerOut = () => {
        if (!dragging.current) document.body.style.cursor = "auto";
    };

    return { onPointerDown, onPointerOver, onPointerOut };
}