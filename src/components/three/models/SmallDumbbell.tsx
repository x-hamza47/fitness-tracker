import { useGLTF } from "@react-three/drei";
import InteractiveModel, { type InteractiveModelProps } from "../InteractiveModel";

const URL = "/models/small-dumbbell.glb";

export default function SmallDumbbell(props: Partial<InteractiveModelProps>) {
    return (
        <InteractiveModel
            url={URL}
            size={2.5}
            colliders="hull"
            mass={15}
            restitution={0.1}
            friction={0.9}
            drag={{
                stiffness: 7,
                damping: 0.9,
                maxAccel: 150,
                maxSpeed: 10,
                dragAngularDamping: 1.5,
            }}
            {...props}
        />
    );
}

useGLTF.preload(URL);