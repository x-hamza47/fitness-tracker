import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Html, useProgress } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, type RapierRigidBody } from "@react-three/rapier";
import { useRef, useEffect, useState, Suspense, type RefObject } from "react";
import { Object3D, SpotLight, Group } from "three";
import Dumbbell from "@/components/three/models/Dumbbell";
import PunchingBag from "@/components/three/models/PunchingBag";
import SmallDumbbell from "@/components/three/models/SmallDumbbell";
import WaterBottle from "@/components/three/models/WaterBottle";
import CameraRig from "@/components/three/CameraRig";

const ROOM_HEIGHT = 15;
const ROOM_WIDTH = 25;
const ROOM_LENGTH = 30;
const ROOM_CENTER_Z = -ROOM_LENGTH / 2;
const BACK_Z = -ROOM_LENGTH;

const SIZE = 2.5;
const ROWS = 3;
const DROP_HEIGHT = 0.1;
const STACK_CENTER: [number, number] = [0, ROOM_CENTER_Z];
const STACK_HEIGHT = ROWS * SIZE * 1.02;

const CAMERA_END_POSITION: [number, number, number] = [-3, 6, -26];
const CAMERA_END_TARGET: [number, number, number] = [-3, 7, -30];

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="text-xs tracking-[0.25em] text-white/50">
                LOADING {progress.toFixed(0)}%
            </div>
        </Html>
    );
}

function Floor() {
    return (
        <RigidBody type="fixed" colliders="cuboid" restitution={0.6} friction={0.8}>
            <mesh position={[0, -0.5, ROOM_CENTER_Z]} receiveShadow>
                <boxGeometry args={[ROOM_WIDTH, 1, ROOM_LENGTH]} />
                <meshStandardMaterial color="#181818" roughness={0.5} metalness={0} />
            </mesh>
        </RigidBody>
    );
}

function Ceiling() {
    return (
        <RigidBody type="fixed" colliders="cuboid" restitution={0.6} friction={0.8}>
            <mesh position={[0, ROOM_HEIGHT + 0.5, ROOM_CENTER_Z]}>
                <boxGeometry args={[ROOM_WIDTH, 1, ROOM_LENGTH]} />
                <meshStandardMaterial color="#141414" roughness={0.8} />
            </mesh>
        </RigidBody>
    );
}

type WallProps = {
    position: [number, number, number];
    size: [number, number, number];
};

function Wall({ position, size }: WallProps) {
    return (
        <RigidBody type="fixed" colliders="cuboid" restitution={0.6} friction={0.8}>
            <mesh position={position} receiveShadow>
                <boxGeometry args={size} />
                <meshStandardMaterial color="#171717" roughness={0.75} metalness={0.05} />
            </mesh>
        </RigidBody>
    );
}

function RightBoundary() {
    return (
        <RigidBody type="fixed" restitution={0.6} friction={0.8}>
            <CuboidCollider
                args={[0.15, ROOM_HEIGHT / 2, ROOM_LENGTH / 2]}
                position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, ROOM_CENTER_Z]}
            />
        </RigidBody>
    );
}


function BoxSpotlight({
    center = STACK_CENTER,
    height = STACK_HEIGHT,
    color = "#ffd9a0",
    intensity = 400,
    angle = 0.9,
    penumbra = 0.8,
    distance = 100,
    decay = 2,
    shadows = true,
}: {
    center?: [number, number];
    height?: number;
    color?: string;
    intensity?: number;
    angle?: number;
    penumbra?: number;
    distance?: number;
    decay?: number;
    shadows?: boolean;
}) {
    const light = useRef<SpotLight>(null);
    const targetRef = useRef<Object3D>(null);

    useEffect(() => {
        if (light.current && targetRef.current) {
            light.current.target = targetRef.current;
        }
    }, []);

    return (
        <>
            <object3D ref={targetRef} position={[center[0], height * 0.3, center[1]]} />
            <spotLight
                ref={light}
                position={[center[0], ROOM_HEIGHT - 1, center[1]]}
                color={color}
                intensity={intensity}
                angle={angle}
                penumbra={penumbra}
                distance={distance}
                decay={decay}
                castShadow={shadows}
                shadow-mapSize={[2048, 2048]}
                shadow-radius={4}
                shadow-bias={-0.0005}
                shadow-normalBias={0.02}
            />
        </>
    );
}

type StackPointLightProps = {
    center?: [number, number];
    height?: number;
    color?: string;
    intensity?: number;
    distance?: number;
    decay?: number;
    offset?: [number, number, number];
    showMarker?: boolean;
};

function StackPointLight({
    center = STACK_CENTER,
    height = STACK_HEIGHT,
    color = "#ff17cd",
    intensity = 160,
    distance = 50,
    decay = 2,
    offset = [0, 0, 0],
    showMarker = false,
}: StackPointLightProps) {
    const position: [number, number, number] = [
        center[0] + offset[0],
        height * 1.6 + offset[1],
        center[1] + offset[2],
    ];

    return (
        <>
            <pointLight
                position={position}
                color={color}
                intensity={intensity}
                distance={distance}
                decay={decay}
            />
            {showMarker && (
                <mesh position={position}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshBasicMaterial color={color} />
                </mesh>
            )}
        </>
    );
}


type TrainingBoxProps = {
    position: [number, number, number];
    color: string;
    size: number;
};

function TrainingBox({ position, color, size }: TrainingBoxProps) {
    const half = size / 2;
    const body = useRef<RapierRigidBody>(null);
    const squashGroup = useRef<Group>(null);

    const squash = useRef(0);
    const squashVel = useRef(0);
    const lastSpeed = useRef(0);

    useFrame((_, delta) => {
        const dt = Math.min(delta, 1 / 30);


        const v = body.current?.linvel();
        if (v) lastSpeed.current = Math.hypot(v.x, v.y, v.z);


        const k = 300;
        const c = 12;
        squashVel.current += (-k * squash.current - c * squashVel.current) * dt;
        squash.current += squashVel.current * dt;

        const g = squashGroup.current;
        if (g) {
            g.scale.set(1 - squash.current * 0.5, 1 + squash.current, 1 - squash.current * 0.5);
            g.position.y = half * squash.current;
        }
    });

    const onHit = () => {
        const speed = lastSpeed.current;
        if (speed < 1) return;
        squashVel.current = -Math.min(speed * 0.25, 2.5);
    };

    return (
        <RigidBody
            ref={body}
            position={position}
            restitution={0.3}
            friction={0.9}
            linearDamping={0.3}
            angularDamping={1}
            onCollisionEnter={onHit}
        >
            <CuboidCollider args={[half, half, half]} restitution={0.3} friction={0.9} />
            <group ref={squashGroup}>
                <RoundedBox
                    args={[size, size, size]}
                    radius={size * 0.18}
                    smoothness={5}
                    castShadow
                    receiveShadow
                >
                    <meshPhysicalMaterial
                        color={color}
                        roughness={0.4}
                        metalness={0}
                        clearcoat={1}
                        clearcoatRoughness={0.15}
                        sheen={0.7}
                        sheenRoughness={0.4}
                        sheenColor="#ffffff"
                    />
                </RoundedBox>
            </group>
        </RigidBody>
    );
}

const COLORS = ["#c93a3a", "#e8a23a", "#3f73c9", "#4fb06a", "#b84bc2", "#e8c34a", "#34aeb8"];

type TrainingBoxesProps = {
    size?: number;
    center?: [number, number];
    rows?: number;
    dropHeight?: number;
    frontBox?: boolean;
};

function TrainingBoxes({
    size = SIZE,
    center = STACK_CENTER,
    rows = ROWS,
    dropHeight = DROP_HEIGHT,
    frontBox = true,
}: TrainingBoxesProps) {
    const gap = size * 0.02;
    const s = size + gap;
    const [cx, cz] = center;

    const boxes: { position: [number, number, number]; color: string }[] = [];
    let n = 0;

    for (let r = 0; r < rows; r++) {
        const count = rows - r;
        for (let i = 0; i < count; i++) {
            boxes.push({
                position: [cx + (i - (count - 1) / 2) * s, size / 2 + r * s + dropHeight, cz],
                color: COLORS[n++ % COLORS.length],
            });
        }
    }

    if (frontBox) {
        boxes.push({
            position: [cx + 0.3, size / 2 + dropHeight, cz + s * 1.15],
            color: COLORS[n % COLORS.length],
        });
    }

    return (
        <>
            {boxes.map((box, i) => (
                <TrainingBox
                    key={`${size}-${rows}-${cx}-${cz}-${i}`}
                    position={box.position}
                    color={box.color}
                    size={size}
                />
            ))}
        </>
    );
}

type HeroVisualsProps = {
    progress: RefObject<{ value: number }>;
};
function HeroVisuals({ progress }: HeroVisualsProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { rootMargin: "200px 0px" } 
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div ref={wrapRef} className="h-svh w-full">
            <Canvas
                frameloop={visible ? "always" : "never"}
                shadows="percentage"
                camera={{ position: [7, 5, 6], fov: 43 }}
            >
                <OrbitControls
                    makeDefault
                    enableZoom={false}
                    enablePan={false}
                    target={[STACK_CENTER[0] - 2, 3, STACK_CENTER[1]]}
                    minPolarAngle={Math.PI / 2.9}
                    maxPolarAngle={Math.PI / 2.05}
                    minAzimuthAngle={-Math.PI / 8}
                    maxAzimuthAngle={Math.PI / 2.7}
                />

                <CameraRig
                    progress={progress}
                    endPosition={CAMERA_END_POSITION}
                    endTarget={CAMERA_END_TARGET}
                />
                <ambientLight intensity={0.3} />
                <directionalLight position={[-6, 8, 2]} intensity={1} />
                <StackPointLight offset={[1, -2.5, 5]} color="#ff5500" />
                <StackPointLight offset={[1, -2.5, -5]} color="#ff5500" />
                <BoxSpotlight angle={0.6} intensity={1600} />

                <Physics gravity={[0, -9.81, 0]}>
                    <Floor />
                    <Ceiling />
                    <Wall
                        position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, ROOM_CENTER_Z]}
                        size={[0.3, ROOM_HEIGHT, ROOM_LENGTH]}
                    />
                    <Wall
                        position={[0, ROOM_HEIGHT / 2, BACK_Z]}
                        size={[ROOM_WIDTH, ROOM_HEIGHT, 0.3]}
                    />
                    <RightBoundary />
                    <TrainingBoxes />
                    <Suspense fallback={<Loader />}>
                        <Dumbbell position={[0, 2, -4.5]} rotation={[0, 0, 0]} />
                        <SmallDumbbell position={[3, 2, -15]} />
                        <SmallDumbbell position={[STACK_CENTER[0], STACK_HEIGHT + 1.5, STACK_CENTER[1]]} rotation={[0, Math.PI / 1.7, 0]} />
                        <WaterBottle position={[3, 3, -12]} />
                        <WaterBottle position={[-2, 1.5, -6]} />
                        <WaterBottle position={[0.3, 5, -12]} />
                        <PunchingBag
                            position={[5, -18]}
                            ceilingY={ROOM_HEIGHT}
                            size={12}
                            floorGap={2}
                            bagFraction={0.6}
                            mass={70}
                            minPunch={3}
                            maxPunch={14}
                            maxHoldTime={1.5}
                            punchStrength={30}
                            breakForce={500000}
                        />
                    </Suspense>
                </Physics>
            </Canvas>
        </div>
    );
}

export default HeroVisuals;