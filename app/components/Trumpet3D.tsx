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

const VALVE_X = [-0.44, -0.08, 0.28];
const CAP_REST_Y = 0.9;
const CAP_PRESS = 0.14;
const MAIN_R = 0.075;
const INK = "#151412";

type Point = [number, number, number?];

function Gold({
  color = "#f2ad26",
  roughness = 0.18,
}: {
  color?: string;
  roughness?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={1}
      roughness={roughness}
      envMapIntensity={1.45}
    />
  );
}

function InkMaterial() {
  return (
    <meshStandardMaterial
      color={INK}
      metalness={0.1}
      roughness={0.46}
      envMapIntensity={0.25}
    />
  );
}

function Silver({ color = "#e8ddcc" }: { color?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={0.75}
      roughness={0.2}
      envMapIntensity={1.1}
    />
  );
}

function Pearl() {
  return (
    <meshStandardMaterial
      color="#fff2d4"
      metalness={0.15}
      roughness={0.32}
      envMapIntensity={0.8}
    />
  );
}

function Tube({
  points,
  r = MAIN_R,
  segments = 96,
  outline = true,
  children,
}: {
  points: Point[];
  r?: number;
  segments?: number;
  outline?: boolean;
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
  const ink = useMemo(
    () => new THREE.TubeGeometry(curve, segments, r + 0.028, 18, false),
    [curve, r, segments],
  );

  return (
    <group>
      {outline && (
        <mesh geometry={ink}>
          <InkMaterial />
        </mesh>
      )}
      <mesh geometry={body}>{children ?? <Gold />}</mesh>
    </group>
  );
}

function CylinderPart({
  position,
  rotation,
  radius,
  radiusTop,
  radiusBottom,
  length,
  outline = true,
  children,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  radius?: number;
  radiusTop?: number;
  radiusBottom?: number;
  length: number;
  outline?: boolean;
  children?: ReactNode;
}) {
  const top = radiusTop ?? radius ?? MAIN_R;
  const bottom = radiusBottom ?? radius ?? MAIN_R;

  return (
    <group position={position} rotation={rotation}>
      {outline && (
        <mesh>
          <cylinderGeometry args={[top + 0.026, bottom + 0.026, length, 28]} />
          <InkMaterial />
        </mesh>
      )}
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
        <torusGeometry args={[radius, tube + 0.024, 18, 64]} />
        <InkMaterial />
      </mesh>
      <mesh>
        <torusGeometry args={[radius, tube, 18, 64]} />
        {children ?? <Gold />}
      </mesh>
    </group>
  );
}

function Bell() {
  const { outline, shell, inside } = useMemo(() => {
    const profile = [
      [0.09, 0],
      [0.1, 0.18],
      [0.12, 0.42],
      [0.17, 0.68],
      [0.28, 0.94],
      [0.46, 1.15],
      [0.66, 1.28],
      [0.84, 1.34],
    ].map(([x, y]) => new THREE.Vector2(x, y));

    const outlineProfile = profile.map(
      (p) => new THREE.Vector2(p.x + 0.04, p.y),
    );
    const insideProfile = [
      [0.08, 0.05],
      [0.12, 0.38],
      [0.23, 0.74],
      [0.47, 1.05],
      [0.75, 1.27],
    ].map(([x, y]) => new THREE.Vector2(x, y));

    return {
      outline: new THREE.LatheGeometry(outlineProfile, 72),
      shell: new THREE.LatheGeometry(profile, 72),
      inside: new THREE.LatheGeometry(insideProfile, 72),
    };
  }, []);

  const position: [number, number, number] = [1.54, 0.36, 0];
  const rotation: [number, number, number] = [0, 0, -Math.PI / 2];
  const mouthX = position[0] + 1.34;

  return (
    <group>
      <mesh geometry={outline} position={position} rotation={rotation}>
        <InkMaterial />
      </mesh>
      <mesh geometry={shell} position={position} rotation={rotation}>
        <Gold color="#f2a91f" roughness={0.16} />
      </mesh>
      <mesh
        geometry={inside}
        position={position}
        rotation={rotation}
        scale={0.92}
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
        position={[mouthX, 0.36, 0]}
        rotation={[0, Math.PI / 2, 0]}
        radius={0.84}
        tube={0.035}
      >
        <Gold color="#ffd45b" roughness={0.13} />
      </RingPart>
    </group>
  );
}

function Mouthpiece() {
  const cup = useMemo(() => {
    const profile = [
      [0.05, 0],
      [0.07, 0.08],
      [0.15, 0.16],
      [0.2, 0.25],
      [0.1, 0.34],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(profile, 40);
  }, []);

  return (
    <group>
      <CylinderPart
        position={[-3.07, 0.36, 0]}
        rotation={[0, 0, Math.PI / 2]}
        radius={0.045}
        length={0.34}
      >
        <Silver />
      </CylinderPart>
      <mesh
        geometry={cup}
        position={[-3.2, 0.36, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <InkMaterial />
      </mesh>
      <mesh
        geometry={cup}
        position={[-3.2, 0.36, 0]}
        rotation={[0, 0, Math.PI / 2]}
        scale={0.88}
      >
        <Silver color="#f0d39d" />
      </mesh>
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
        <group key={i} position={[x, 0, i === 1 ? 0.03 : 0]}>
          <CylinderPart position={[0, 0.05, 0]} radius={0.105} length={1.05}>
            <Gold color="#d6901c" roughness={0.15} />
          </CylinderPart>
          <CylinderPart position={[0, -0.48, 0]} radius={0.12} length={0.09}>
            <Gold color="#f6ba37" roughness={0.14} />
          </CylinderPart>
          <CylinderPart position={[0, 0.61, 0]} radius={0.122} length={0.09}>
            <Gold color="#f6ba37" roughness={0.14} />
          </CylinderPart>
          <CylinderPart position={[0, 0.72, 0]} radius={0.033} length={0.22}>
            <Silver color="#f0d9a9" />
          </CylinderPart>
          <group
            ref={(group) => {
              caps.current[i] = group;
            }}
            position={[0, CAP_REST_Y, 0]}
          >
            <mesh>
              <cylinderGeometry args={[0.155, 0.14, 0.12, 36]} />
              <InkMaterial />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.13, 0.115, 0.11, 36]} />
              <Gold color="#f2b23b" roughness={0.17} />
              <mesh position={[0, 0.065, 0]}>
                <cylinderGeometry args={[0.105, 0.105, 0.034, 36]} />
                <Pearl />
              </mesh>
            </mesh>
          </group>
        </group>
      ))}

      <Tube
        points={[
          [VALVE_X[0], -0.47, 0],
          [VALVE_X[0] - 0.24, -0.74, 0],
          [VALVE_X[0] - 0.58, -0.68, 0],
          [VALVE_X[0] - 0.54, -0.28, 0],
        ]}
        r={0.052}
        segments={54}
      />
      <Tube
        points={[
          [VALVE_X[1] - 0.03, 0.55, 0],
          [VALVE_X[1] + 0.08, 0.75, 0],
          [VALVE_X[1] + 0.28, 0.7, 0],
          [VALVE_X[1] + 0.3, 0.48, 0],
        ]}
        r={0.046}
        segments={42}
      />
      <Tube
        points={[
          [VALVE_X[2], -0.43, 0],
          [VALVE_X[2] + 0.28, -0.75, 0],
          [VALVE_X[2] + 0.78, -0.73, 0],
          [VALVE_X[2] + 0.86, -0.36, 0],
        ]}
        r={0.052}
        segments={64}
      />
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
      rotation={[0.11, -0.35, -0.36]}
      position={[-0.08, 0.18, 0]}
      scale={0.78}
    >
      <Mouthpiece />

      {/* Long leadpipe and bell branch */}
      <Tube
        points={[
          [-2.9, 0.36, 0],
          [-1.55, 0.36, 0],
          [-0.2, 0.36, 0],
          [1.55, 0.36, 0],
        ]}
        r={0.07}
        segments={96}
      />
      <Tube
        points={[
          [-2.35, 0.22, -0.01],
          [-1.25, 0.16, -0.01],
          [-0.1, 0.11, -0.01],
          [1.16, 0.13, -0.01],
        ]}
        r={0.06}
        segments={72}
      />
      <Tube
        points={[
          [-2.04, -0.27, 0.02],
          [-1.1, -0.27, 0.02],
          [0.18, -0.28, 0.02],
          [1.14, -0.28, 0.02],
        ]}
        r={0.061}
        segments={72}
      />

      {/* Sweeping tuning slides and lower bows */}
      <Tube
        points={[
          [-2.42, 0.34, 0],
          [-2.78, 0.12, 0],
          [-2.83, -0.45, 0],
          [-2.5, -0.72, 0],
          [-2.03, -0.64, 0],
          [-1.78, -0.34, 0],
          [-1.45, -0.26, 0],
        ]}
        r={0.067}
        segments={112}
      />
      <Tube
        points={[
          [-1.84, -0.28, 0.03],
          [-2.16, -0.4, 0.03],
          [-2.14, -0.77, 0.03],
          [-1.74, -0.95, 0.03],
          [-1.18, -0.82, 0.03],
          [-1.06, -0.49, 0.03],
          [-1.34, -0.32, 0.03],
        ]}
        r={0.057}
        segments={96}
      />
      <Tube
        points={[
          [-0.62, -0.88, 0.02],
          [0.38, -0.88, 0.02],
          [0.96, -0.76, 0.02],
          [1.18, -0.34, 0.02],
          [1.18, 0.13, 0.02],
        ]}
        r={0.057}
        segments={86}
      />
      <Tube
        points={[
          [0.9, -0.29, -0.01],
          [1.18, -0.52, -0.01],
          [1.48, -0.44, -0.01],
          [1.56, 0.12, -0.01],
          [1.54, 0.36, -0.01],
        ]}
        r={0.068}
        segments={70}
      />

      <Bell />
      <ValveCluster pressedRef={pressedRef} />

      {/* Braces and detail rings */}
      <Tube
        points={[
          [-1.42, 0.29, 0.01],
          [-1.35, -0.2, 0.01],
          [-1.45, -0.63, 0.01],
        ]}
        r={0.022}
        segments={26}
      >
        <Gold color="#ffcf55" roughness={0.2} />
      </Tube>
      <Tube
        points={[
          [1.18, 0.26, 0.01],
          [1.12, -0.16, 0.01],
          [0.98, -0.64, 0.01],
        ]}
        r={0.022}
        segments={26}
      >
        <Gold color="#ffcf55" roughness={0.2} />
      </Tube>
      <Tube
        points={[
          [-0.82, 0.27, 0.04],
          [-0.64, 0.08, 0.04],
          [-0.52, -0.2, 0.04],
        ]}
        r={0.023}
        segments={28}
      >
        <Gold color="#ffd86f" roughness={0.22} />
      </Tube>
      <RingPart
        position={[0.73, -0.37, 0.11]}
        rotation={[0, 0, 0]}
        radius={0.13}
        tube={0.014}
      >
        <Gold color="#f8c247" roughness={0.16} />
      </RingPart>
      <RingPart
        position={[-0.86, -0.13, 0.12]}
        rotation={[0, 0, 0]}
        radius={0.15}
        tube={0.014}
      >
        <Gold color="#f8c247" roughness={0.16} />
      </RingPart>

      {/* Painted vector-style highlights */}
      <Tube
        points={[
          [-2.2, 0.45, 0.12],
          [-1.35, 0.45, 0.12],
          [-0.52, 0.45, 0.12],
        ]}
        r={0.014}
        segments={42}
        outline={false}
      >
        <Gold color="#ffe486" roughness={0.3} />
      </Tube>
      <Tube
        points={[
          [-1.78, -0.16, 0.13],
          [-1.08, -0.15, 0.13],
          [-0.26, -0.16, 0.13],
        ]}
        r={0.012}
        segments={34}
        outline={false}
      >
        <Gold color="#ffe486" roughness={0.32} />
      </Tube>
      <Tube
        points={[
          [-2.62, -0.34, 0.13],
          [-2.5, -0.62, 0.13],
          [-2.16, -0.57, 0.13],
        ]}
        r={0.012}
        segments={30}
        outline={false}
      >
        <Gold color="#ffe486" roughness={0.34} />
      </Tube>
    </group>
  );
}

/** Procedural studio reflections baked from area lights. */
function Studio() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <Lightformer
        intensity={3.2}
        position={[0, 3.5, 4]}
        scale={[7, 4, 1]}
        color="#fff0bf"
      />
      <Lightformer
        intensity={1.8}
        position={[-5, 1.5, 2]}
        scale={[4, 4, 1]}
        color="#ffb833"
      />
      <Lightformer
        intensity={1.4}
        position={[5, -1, 3]}
        scale={[5, 4, 1]}
        color="#ffdd75"
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
      camera={{ position: [0, 0.05, 8.4], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.15} color="#fff3cc" />
      <directionalLight
        position={[-3, -2, 4]}
        intensity={0.35}
        color="#ffbe45"
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
        position={[0, -1.55, 0]}
        opacity={0.28}
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
          intensity={0.16}
          luminanceThreshold={0.88}
          luminanceSmoothing={0.34}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
