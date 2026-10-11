import { useMemo, useRef, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import {
    RigidBody,
    CuboidCollider,
    ConvexHullCollider,
    type RapierRigidBody,
} from "@react-three/rapier";
import { Box3, Mesh, Vector3 } from "three";
import { type DragOptions, useDragBody } from "@/hooks/useDragBody";

type Vec3 = [number, number, number];

export type InteractiveModelProps = {
    url: string;
    size?: number;
    position?: Vec3;
    rotation?: Vec3;
    colliders?: "hull" | "cuboid";
    density?: number;
    restitution?: number;
    friction?: number;
    linearDamping?: number;
    angularDamping?: number;
    draggable?: boolean;
    dragStiffness?: number;
    children?: ReactNode;
    mass?: number;       
    drag?: DragOptions;
};

export default function InteractiveModel({
    url,
    size = 2,
    position = [0, 2, 0],
    rotation = [0, 0, 0],
    colliders = "hull",
    density = 1,
    restitution = 0.4,
    friction = 0.8,
    linearDamping = 0.2,
    angularDamping = 0.6,
    draggable = true,
    dragStiffness = 12,
    children,
    mass,
    drag: dragOptions,
}: InteractiveModelProps) {
    const body = useRef<RapierRigidBody>(null);
    const { scene } = useGLTF(url);
    const drag = useDragBody(body, {
        stiffness: dragStiffness,
        restAngularDamping: angularDamping,
        ...dragOptions,
    });

    const { object, scale, offset, halfExtents, hull } = useMemo(() => {
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
        const maxDim = Math.max(dim.x, dim.y, dim.z) || 1;
        const s = size / maxDim;
        const off = center.clone().multiplyScalar(-s);

        let hullPoints: Float32Array | null = null;
        if (colliders === "hull") {
            const pts: number[] = [];
            const v = new Vector3();
            clone.traverse((o) => {
                const m = o as Mesh;
                if (!m.isMesh) return;
                const pos = m.geometry?.attributes?.position;
                if (!pos) return;
                const stride = Math.max(1, Math.floor(pos.count / 2000));
                for (let i = 0; i < pos.count; i += stride) {
                    v.fromBufferAttribute(pos, i)
                        .applyMatrix4(m.matrixWorld)
                        .multiplyScalar(s)
                        .add(off);
                    if (Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z)) {
                        pts.push(v.x, v.y, v.z);
                    }
                }
            });
            if (pts.length >= 12) hullPoints = new Float32Array(pts); // need 4+ points
        }

        return {
            object: clone,
            scale: s,
            offset: off.toArray() as Vec3,
            halfExtents: [(dim.x * s) / 2, (dim.y * s) / 2, (dim.z * s) / 2] as Vec3,
            hull: hullPoints,
        };
    }, [scene, size, colliders]);

    return (
        <RigidBody
            ref={body}
            position={position}
            rotation={rotation}
            colliders={false}
            density={density}
            restitution={restitution}
            friction={friction}
            linearDamping={linearDamping}
            angularDamping={angularDamping}
            ccd
        >
            {hull ? (
                <ConvexHullCollider args={[hull]} mass={mass} density={mass ? undefined : density} />
            ) : (
                <CuboidCollider args={halfExtents} mass={mass} density={mass ? undefined : density} />
            )}
            <primitive
                object={object}
                scale={scale}
                position={offset}
                {...(draggable ? drag : {})}
            />
            {children}
        </RigidBody>
    );
}