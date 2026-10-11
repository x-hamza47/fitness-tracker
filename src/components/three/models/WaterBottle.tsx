import { useGLTF } from "@react-three/drei";
import InteractiveModel, { type InteractiveModelProps } from "../InteractiveModel";

const URL = "/models/water-bottle.glb";

export default function WaterBottle(props: Partial<InteractiveModelProps>) {
    return (
        <InteractiveModel
            url={URL}
            size={2}
            colliders="cuboid"
            mass={2}
            restitution={0.3}
            friction={0.6}
            drag={{
                stiffness: 10,
                damping: 0.7,
                maxAccel: 120,
                maxSpeed: 15,
            }}
            {...props}
        />
    );
}

useGLTF.preload(URL);