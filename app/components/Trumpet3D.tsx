import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Environment,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import * as THREE from "three";

const VALVE_X = [-0.96, -0.58, -0.2];
const CAP_REST_Y = 0.84;
const CAP_PRESS = 0.12;
const MAIN_R = 0.075;

type Point = [number, number, number?];

function Gold({
  color = "#c99732",
  roughness = 0.2,
}: {
  color?: string;
  roughness?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.96}
      roughness={roughness}
      clearcoat={0.55}
      clearcoatRoughness={0.16}
      envMapIntensity={1.9}
    />
  );
}

function Silver({ color = "#e8ddcc" }: { color?: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0.96}
      roughness={0.16}
      clearcoat={0.4}
      clearcoatRoughness={0.12}
      envMapIntensity={1.7}
    />
  );
}

function Tube({
  points,
  r = MAIN_R,
  segments = 96,
  children,
}: {
  points: Point[];
  r?: number;
  segments?: number;
  children?: ReactNode;
}) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        points.map(([x, y, z = 0]) => new THREE.Vector3(x, y, z)),
        false,
        "centripetal",
        0.35,
      ),
    [points],
  );
  const body = useMemo(
    () => new THREE.TubeGeometry(curve, segments, r, 18, false),
    [curve, r, segments],
  );
  return (
    <mesh geometry={body}>{children ?? <Gold />}</mesh>
  );
}

function CylinderPart({
  position,
  rotation,
  radius,
  radiusTop,
  radiusBottom,
  length,
  children,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  radiusTop?: number;
  radiusBottom?: number;
  length: number;
  children?: ReactNode;
}) {
  const top = radiusTop ?? radius ?? MAIN_R;
  const bottom = radiusBottom ?? radius ?? MAIN_R;

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[top, bottom, length, 28]} />
        {children ?? <Gold />}
      </mesh>
    </group>
  );
}

function RingPart({
  position,
  rotation,
  radius,
  tube,
  children,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius: number;
  tube: number;
  children?: ReactNode;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <torusGeometry args={[radius, tube, 18, 64]} />
        {children ?? <Gold />}
      </mesh>
    </group>
  );
}

function Bell() {
  const { shell, inside } = useMemo(() => {
    const profile = [
      [0.08, 0],
      [0.09, 0.18],
      [0.12, 0.4],
      [0.17, 0.65],
      [0.28, 0.92],
      [0.46, 1.15],
      [0.7, 1.31],
      [0.92, 1.4],
    ].map(([x, y]) => new THREE.Vector2(x, y));

    const insideProfile = [
      [0.06, 0.05],
      [0.1, 0.36],
      [0.2, 0.7],
      [0.42, 1.03],
      [0.8, 1.34],
    ].map(([x, y]) => new THREE.Vector2(x, y));

    return {
      shell: new THREE.LatheGeometry(profile, 72),
      inside: new THREE.LatheGeometry(insideProfile, 72),
    };
  }, []);

  const position: [number, number, number] = [1.52, 0.34, -0.01];
  const rotation: [number, number, number] = [0, 0, -Math.PI / 2];
  const mouthX = position[0] + 1.4;

  return (
    <group>
      <mesh geometry={shell} position={position} rotation={rotation}>
        <Gold color="#bd8625" roughness={0.18} />
      </mesh>
      <mesh
        geometry={inside}
        position={position}
        rotation={rotation}
        scale={0.96}
      >
        <meshStandardMaterial
          color="#19130a"
          metalness={0.45}
          roughness={0.52}
          side={THREE.BackSide}
          envMapIntensity={0.45}
        />
      </mesh>
      <RingPart
        position={[mouthX, 0.34, -0.01]}
        rotation={[0, Math.PI / 2, 0]}
        radius={0.92}
        tube={0.026}
      >
        <Gold color="#e7b84b" roughness={0.18} />
      </RingPart>
    </group>
  );
}

function Mouthpiece() {
  const cup = useMemo(() => {
    const profile = [
      [0.045, 0],
      [0.06, 0.08],
      [0.14, 0.16],
      [0.22, 0.25],
      [0.16, 0.34],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(profile, 40);
  }, []);

  return (
    <group>
      <CylinderPart
        position={[-3.05, 0.34, 0]}
        rotation={[0, 0, Math.PI / 2]}
        radius={0.045}
        length={0.34}
      >
        <Silver />
      </CylinderPart>
      <mesh
        geometry={cup}
        position={[-3.18, 0.34, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <Silver color="#a9b0b5" />
      </mesh>
      <RingPart
        position={[-3.5, 0.34, 0]}
        rotation={[0, Math.PI / 2, 0]}
        radius={0.16}
        tube={0.026}
      >
        <Silver color="#d4d9dc" />
      </RingPart>
    </group>
  );
}

function ValveCluster({
  pressedRef,
}: {
  pressedRef: MutableRefObject<boolean[]>;
}) {
  const caps = useRef<(THREE.Group | null)[]>([null, null, null]);

  useFrame((_state, dt) => {
    for (let i = 0; i < 3; i++) {
      const cap = caps.current[i];
      if (!cap) continue;
      const target = pressedRef.current[i]
        ? CAP_REST_Y - CAP_PRESS
        : CAP_REST_Y;
      cap.position.y += (target - cap.position.y) * Math.min(1, dt * 18);
    }
  });

  return (
    <group>
      {VALVE_X.map((x, i) => (
        <group key={i} position={[x, 0, i === 1 ? 0.025 : 0]}>
          <CylinderPart position={[0, 0.02, 0]} radius={0.11} length={0.94}>
            <Gold color="#ad7620" roughness={0.2} />
          </CylinderPart>
          <CylinderPart position={[0, -0.49, 0]} radius={0.124} length={0.085}>
            <Gold color="#d2a13b" roughness={0.18} />
          </CylinderPart>
          <CylinderPart position={[0, 0.53, 0]} radius={0.124} length={0.085}>
            <Gold color="#d2a13b" roughness={0.18} />
          </CylinderPart>
          <CylinderPart position={[0, 0.66, 0]} radius={0.03} length={0.22}>
            <Silver color="#c1c7ca" />
          </CylinderPart>
          <group
            ref={(group) => {
              caps.current[i] = group;
            }}
            position={[0, CAP_REST_Y, 0]}
          >
            <mesh>
              <cylinderGeometry args={[0.145, 0.135, 0.095, 36]} />
              <Silver color="#aab2b7" />
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.11, 0.11, 0.03, 36]} />
                <Silver color="#e5e8e9" />
              </mesh>
            </mesh>
          </group>
        </group>
      ))}

      <Tube
        points={[
          [VALVE_X[0], -0.39, 0],
          [VALVE_X[0] - 0.14, -0.62, 0],
          [VALVE_X[0] - 0.48, -0.62, 0],
          [VALVE_X[0] - 0.5, -0.36, 0],
        ]}
        r={0.044}
        segments={54}
      />
      <Tube
        points={[
          [VALVE_X[1] - 0.04, 0.46, 0],
          [VALVE_X[1] + 0.04, 0.64, 0],
          [VALVE_X[1] + 0.24, 0.64, 0],
          [VALVE_X[1] + 0.29, 0.45, 0],
        ]}
        r={0.04}
        segments={42}
      />
      <Tube
        points={[
          [VALVE_X[2], -0.4, 0],
          [VALVE_X[2] + 0.2, -0.64, 0],
          [VALVE_X[2] + 0.7, -0.64, 0],
          [VALVE_X[2] + 0.77, -0.35, 0],
        ]}
        r={0.044}
        segments={64}
      >
        <Silver color="#b9c0c3" />
      </Tube>
    </group>
  );
}

function TrumpetModel({
  pressedRef,
  spin,
}: {
  pressedRef: MutableRefObject<boolean[]>;
  spin: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_state, dt) => {
    if (spin && group.current) {
      group.current.rotation.y =
        (group.current.rotation.y + dt * 0.42) % (Math.PI * 2);
    }
  });

  return (
    <group
      ref={group}
      rotation={[0.04, -0.24, -0.04]}
      position={[-0.02, 0.02, 0]}
      scale={0.9}
    >
      <Mouthpiece />

      {/* Leadpipe: a single straight run from the mouthpiece into the valves. */}
      <Tube
        points={[
          [-2.9, 0.34, 0],
          [-2.2, 0.34, 0],
          [-1.45, 0.34, 0],
          [-0.78, 0.34, 0],
          [-0.2, 0.34, 0],
        ]}
        r={0.066}
        segments={72}
      />
      <CylinderPart
        position={[-1.73, 0.34, 0]}
        rotation={[0, 0, Math.PI / 2]}
        radius={0.076}
        length={0.54}
      >
        <Silver color="#bdc3c6" />
      </CylinderPart>

      {/* Bell tail: the long top run that expands into the bell flare. */}
      <Tube
        points={[
          [VALVE_X[0], 0.38, -0.025],
          [-0.35, 0.4, -0.025],
          [0.45, 0.4, -0.025],
          [1.08, 0.37, -0.02],
          [1.52, 0.34, -0.01],
        ]}
        r={0.068}
        segments={84}
      />

      {/* Lower return tube and rising bell bow. */}
      <Tube
        points={[
          [VALVE_X[2], -0.37, 0.02],
          [0.18, -0.4, 0.02],
          [0.72, -0.38, 0.015],
          [1.12, -0.25, 0],
          [1.4, 0.02, -0.01],
          [1.52, 0.34, -0.01],
        ]}
        r={0.064}
        segments={88}
      />

      {/* Main U-shaped tuning slide to the left of the valve block. */}
      <Tube
        points={[
          [-1.9, 0.32, 0.015],
          [-2.13, 0.15, 0.015],
          [-2.14, -0.25, 0.015],
          [-1.94, -0.47, 0.015],
          [-1.56, -0.48, 0.015],
          [-1.31, -0.29, 0.015],
          [-1.31, -0.06, 0.015],
        ]}
        r={0.062}
        segments={90}
      />
      <CylinderPart
        position={[-1.74, -0.48, 0.015]}
        rotation={[0, 0, Math.PI / 2]}
        radius={0.068}
        length={0.36}
      >
        <Silver color="#bbc2c5" />
      </CylinderPart>

      <Bell />
      <ValveCluster pressedRef={pressedRef} />

      {/* Structural braces, finger hook, and water key. */}
      <Tube
        points={[
          [-1.43, 0.29, 0.04],
          [-1.39, 0.02, 0.04],
          [-1.33, -0.31, 0.04],
        ]}
        r={0.018}
        segments={26}
      >
        <Gold color="#dda83c" roughness={0.25} />
      </Tube>
      <Tube
        points={[
          [0.92, 0.34, 0.04],
          [0.91, 0.04, 0.04],
          [0.82, -0.32, 0.04],
        ]}
        r={0.018}
        segments={26}
      >
        <Gold color="#dda83c" roughness={0.25} />
      </Tube>

      {/* Curved pinky hook beside the valve block. */}
      <Tube
        points={[
          [-0.1, 0.35, 0.07],
          [0.03, 0.48, 0.07],
          [0.06, 0.69, 0.07],
          [-0.02, 0.76, 0.07],
        ]}
        r={0.016}
        segments={30}
      >
        <Gold color="#d7a33d" roughness={0.22} />
      </Tube>

      {/* Third-valve slide pull ring. */}
      <RingPart
        position={[0.08, -0.2, 0.13]}
        rotation={[0, 0, 0]}
        radius={0.13}
        tube={0.015}
      >
        <Gold color="#e3b04a" roughness={0.23} />
      </RingPart>

      {/* Water-key lever on the lower bow. */}
      <Tube
        points={[
          [0.72, -0.38, 0.05],
          [0.78, -0.55, 0.06],
          [0.97, -0.62, 0.06],
        ]}
        r={0.015}
        segments={24}
      >
        <Silver color="#c9ced0" />
      </Tube>
      <CylinderPart
        position={[0.98, -0.62, 0.06]}
        rotation={[Math.PI / 2, 0, 0]}
        radius={0.032}
        length={0.16}
      >
        <Silver color="#d9dddf" />
      </CylinderPart>
    </group>
  );
}

/** Procedural studio reflections baked from area lights. */
function Studio() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <Lightformer
        intensity={3.6}
        position={[0, 3.5, 4]}
        scale={[7, 4, 1]}
        color="#fff8e8"
      />
      <Lightformer
        intensity={2.2}
        position={[-5, 1.5, 2]}
        scale={[4, 4, 1]}
        color="#dce5e9"
      />
      <Lightformer
        intensity={1.7}
        position={[5, -1, 3]}
        scale={[5, 4, 1]}
        color="#efc76c"
      />
      <Lightformer
        intensity={0.8}
        position={[0, -4, -3]}
        scale={[8, 3, 1]}
        color="#352315"
      />
    </Environment>
  );
}

export function Trumpet3D({
  pressedRef,
  autoRotate = false,
  interactive = false,
}: {
  pressedRef?: MutableRefObject<boolean[]>;
  autoRotate?: boolean;
  interactive?: boolean;
}) {
  const fallback = useRef<boolean[]>([false, false, false]);
  const ref = pressedRef ?? fallback;

  return (
    <Canvas
      camera={{ position: [0, 0.05, 8.7], fov: 39 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.58} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} color="#fff8e8" />
      <directionalLight
        position={[-3, -2, 4]}
        intensity={0.42}
        color="#c7d9df"
      />
      <Studio />

      {autoRotate ? (
        <Float speed={1.6} rotationIntensity={0.18} floatIntensity={0.36}>
          <TrumpetModel pressedRef={ref} spin />
        </Float>
      ) : (
        <TrumpetModel pressedRef={ref} spin={false} />
      )}

      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.22}
        scale={8}
        blur={2.5}
        far={3}
        color="#000000"
      />

      {interactive && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 3.15}
          maxPolarAngle={Math.PI / 1.85}
          target={[0, 0, 0]}
        />
      )}

      <EffectComposer>
        <Bloom
          intensity={0.09}
          luminanceThreshold={0.92}
          luminanceSmoothing={0.34}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
