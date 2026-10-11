import { useGLTF } from "@react-three/drei";
import InteractiveModel, { type InteractiveModelProps } from "../InteractiveModel";

const URL = "/models/dumbbell-single.glb";

export default function Dumbbell(props: Partial<InteractiveModelProps>) {
    return (
        <InteractiveModel
            url={URL}
            size={8}
            colliders="hull"
            mass={80}
            restitution={0.05}
            friction={0.9}
            drag={{
                stiffness: 12,
                damping: 0.9,
                maxAccel: 200,
                dragAngularDamping: 1.5,
                restAngularDamping: 0.3,
                maxSpeed: 8,
                minY: 0.3,
            }}
            {...props}
        />
    );
}

useGLTF.preload(URL);