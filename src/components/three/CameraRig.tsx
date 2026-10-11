import { useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

type Vec3 = [number, number, number];

export type CameraRigProps = {
    progress: RefObject<{ value: number }>;
    endPosition: Vec3;
    endTarget: Vec3;
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

type OrbitLike = {
    enabled: boolean;
    target: Vector3;
    update: () => void;
};

export default function CameraRig({ progress, endPosition, endTarget }: CameraRigProps) {
    const controls = useThree((s) => s.controls) as unknown as OrbitLike | null;

    const active = useRef(false);
    const startPos = useRef(new Vector3());
    const startTarget = useRef(new Vector3());

    const endP = useMemo(() => new Vector3(...endPosition), [endPosition]);
    const endT = useMemo(() => new Vector3(...endTarget), [endTarget]);
    const look = useMemo(() => new Vector3(), []);

    useFrame(({ camera }) => {
        if (!controls) return;

        const t = progress.current.value;


        if (t <= 0.001) {
            if (active.current) {
                active.current = false;
                camera.position.copy(startPos.current);
                controls.target.copy(startTarget.current);
                controls.enabled = true;
                controls.update();
            }
            return;
        }

        if (!active.current) {
            active.current = true;
            startPos.current.copy(camera.position);
            startTarget.current.copy(controls.target);
        }

        controls.enabled = false;

        const e = easeInOut(Math.min(t, 1));
        camera.position.lerpVectors(startPos.current, endP, e);
        look.lerpVectors(startTarget.current, endT, e);
        camera.lookAt(look);
    });

    return null;
}