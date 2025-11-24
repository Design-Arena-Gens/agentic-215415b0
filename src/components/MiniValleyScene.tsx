'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  PerspectiveCamera,
} from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import { MutableRefObject, Suspense, useMemo, useRef } from 'react';
import { CatmullRomCurve3, Color, Group, Mesh, Points, Vector3 } from 'three';
import { BlendFunction } from 'postprocessing';
import { createNoise2D } from 'simplex-noise';
import * as THREE from 'three';

const TRAJECTORY_DURATION = 8;

const curvePoints = [
  new Vector3(-1.4, 0, 0.6),
  new Vector3(-0.6, 0, 0.35),
  new Vector3(0.2, 0, 0.25),
  new Vector3(0.8, 0, 0.05),
  new Vector3(1.25, 0, -0.15),
];

const trackCurve = new CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5);

function createPRNG(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function randomRange(random: () => number, min: number, max: number) {
  return random() * (max - min) + min;
}

function useLoopedTime() {
  const time = useRef(0);

  useFrame(({ clock }) => {
    time.current = (clock.getElapsedTime() % TRAJECTORY_DURATION) / TRAJECTORY_DURATION;
  });

  return time;
}

const tmpPosition = new Vector3();
const tmpTangent = new Vector3();
const up = new Vector3(0, 1, 0);
const sideways = new Vector3();
const forward = new Vector3(1, 0, 0);

function alignToCurve(target: Group, t: number, tiltOffset = 0) {
  trackCurve.getPointAt(t, tmpPosition);
  trackCurve.getTangentAt(t, tmpTangent);
  tmpTangent.normalize();
  target.position.copy(tmpPosition);

  sideways.crossVectors(up, tmpTangent).normalize();
  const tilt = sideways.multiplyScalar(tiltOffset);
  target.position.add(tilt);

  target.quaternion.setFromUnitVectors(forward, tmpTangent);
}

function DustTrail({ origin }: { origin: Vector3 }) {
  const positions = useMemo(() => {
    const random = createPRNG(638729);
    const data: number[] = [];
    for (let i = 0; i < 250; i += 1) {
      const spread = randomRange(random, 0.01, 0.18);
      const angle = random() * Math.PI * 2;
      const height = randomRange(random, 0, 0.06);
      const drag = randomRange(random, 0.02, 0.2);
      data.push(-Math.cos(angle) * spread);
      data.push(height);
      data.push(-Math.sin(angle) * spread - drag);
    }
    return Float32Array.from(data);
  }, []);

  const pointsRef = useRef<Points>(null);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const elapsed = clock.getElapsedTime();
    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = 0.35 + Math.sin(elapsed * 2) * 0.05;
    pointsRef.current.position.set(origin.x, origin.y, origin.z);
  });

  return (
    <points ref={pointsRef} rotation={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f3d6a0"
        size={0.02}
        transparent
        opacity={0.32}
        depthWrite={false}
      />
    </points>
  );
}

function Wheel({ radius }: { radius: number }) {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.z -= delta * 8;
  });

  return (
    <mesh ref={mesh} castShadow rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[radius, radius, radius * 0.36, 18]} />
      <meshStandardMaterial color="#2d2d2f" roughness={0.4} metalness={0.2} />
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.64, radius * 0.64, radius * 0.24, 12]} />
        <meshStandardMaterial color="#8b8c90" roughness={0.35} metalness={0.65} />
      </mesh>
    </mesh>
  );
}

function Jax({ groupRef }: { groupRef: MutableRefObject<Group | null> }) {
  return (
    <group ref={groupRef} position={[0, 0.1, 0]} castShadow receiveShadow>
      <mesh castShadow receiveShadow position={[0, 0.085, 0]}>
        <boxGeometry args={[0.36, 0.18, 0.22]} />
        <meshStandardMaterial color="#d43a32" roughness={0.42} metalness={0.15} />
      </mesh>
      <mesh castShadow position={[0, 0.16, -0.015]}>
        <boxGeometry args={[0.24, 0.08, 0.16]} />
        <meshStandardMaterial color="#f06054" roughness={0.4} metalness={0.12} />
      </mesh>
      <mesh position={[0.1, 0.145, 0.115]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.12, 16]} />
        <meshStandardMaterial color="#7d2622" roughness={0.6} />
      </mesh>
      <Wheel radius={0.09} />
      <group position={[0.14, -0.02, 0.1]}>
        <Wheel radius={0.085} />
      </group>
      <group position={[0.14, -0.02, -0.1]}>
        <Wheel radius={0.085} />
      </group>
      <group position={[-0.14, -0.02, 0.1]}>
        <Wheel radius={0.085} />
      </group>
      <group position={[-0.14, -0.02, -0.1]}>
        <Wheel radius={0.085} />
      </group>
      <mesh position={[0.14, 0.095, -0.01]} castShadow>
        <boxGeometry args={[0.04, 0.045, 0.16]} />
        <meshStandardMaterial color="#c92b23" roughness={0.35} />
      </mesh>
      <mesh position={[0.12, 0.11, 0.14]}>
        <sphereGeometry args={[0.025, 18, 18]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffd6d2" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0.12, 0.11, -0.14]}>
        <sphereGeometry args={[0.025, 18, 18]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffd6d2" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0.18, 0.078, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.11, 12]} />
        <meshStandardMaterial color="#232323" roughness={0.8} />
      </mesh>
      <mesh position={[0.14, 0.094, 0.14]}>
        <sphereGeometry args={[0.016, 16, 16]} />
        <meshStandardMaterial color="#222" emissive="#3a3a3a" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.14, 0.094, -0.14]}>
        <sphereGeometry args={[0.016, 16, 16]} />
        <meshStandardMaterial color="#222" emissive="#3a3a3a" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.12, 0.095, 0.1]}>
        <planeGeometry args={[0.08, 0.04]} />
        <meshStandardMaterial color="#ffd7d1" emissive="#ffa38e" />
      </mesh>
      <mesh position={[0.12, 0.095, -0.1]}>
        <planeGeometry args={[0.08, 0.04]} />
        <meshStandardMaterial color="#ffd7d1" emissive="#ffa38e" />
      </mesh>
      <mesh position={[-0.08, 0.04, 0.12]} rotation={[0, 0, Math.PI / 14]}>
        <boxGeometry args={[0.08, 0.05, 0.026]} />
        <meshStandardMaterial color="#5f2d23" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Nino({ groupRef }: { groupRef: MutableRefObject<Group | null> }) {
  return (
    <group ref={groupRef} position={[0, 0.15, -0.2]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.02}>
        <mesh castShadow position={[0, 0.12, 0]}>
          <capsuleGeometry args={[0.05, 0.12, 12, 18]} />
          <meshStandardMaterial color="#4d9ddf" metalness={0.3} roughness={0.35} />
        </mesh>
      </Float>
      <mesh castShadow position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.07, 12]} />
        <meshStandardMaterial color="#306a99" roughness={0.55} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshStandardMaterial color="#d2ecff" emissive="#6eb3ff" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-0.04, 0.1, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.02, 0.1, 0.02]} />
        <meshStandardMaterial color="#316fa9" roughness={0.4} />
      </mesh>
      <mesh position={[0.04, 0.1, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.02, 0.1, 0.02]} />
        <meshStandardMaterial color="#316fa9" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.05, 0.055]}>
        <boxGeometry args={[0.09, 0.06, 0.035]} />
        <meshStandardMaterial color="#2f4d6b" />
      </mesh>
      <group position={[0, 0.18, 0.07]}>
        <Float speed={4} rotationIntensity={1.2} floatIntensity={0.08}>
          <mesh rotation={[Math.PI / 12, 0, Math.PI / 10]}>
            <boxGeometry args={[0.12, 0.08, 0.04]} />
            <meshStandardMaterial color="#f4aa3d" roughness={0.3} />
          </mesh>
        </Float>
      </group>
    </group>
  );
}

function Ground() {
  const noise2D = useMemo(() => createNoise2D(createPRNG(59241)), []);

  const vertices = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(6, 4, 120, 80);
    const positionAttribute = geometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i += 1) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const elevation = noise2D(x * 0.45, y * 0.45) * 0.1;
      positionAttribute.setZ(i, elevation);
    }
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, [noise2D]);

  return (
    <mesh
      geometry={vertices}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      position={[0, -0.02, 0]}
    >
      <meshStandardMaterial
        color="#88b469"
        roughness={0.9}
        metalness={0.05}
        polygonOffset
        polygonOffsetFactor={1}
        polygonOffsetUnits={1}
      />
    </mesh>
  );
}

function Road() {
  const geometry = useMemo(() => {
    const tubularSegments = 300;
    const radius = 0.1;
    const radialSegments = 16;
    const closed = false;
    const tubeGeometry = new THREE.TubeGeometry(trackCurve, tubularSegments, radius, radialSegments, closed);
    return tubeGeometry;
  }, []);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color="#d2a679" roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

function Pebbles() {
  const count = 80;
  const pebbles = useMemo(() => {
    const random = createPRNG(904211);
    const palette = ['#a98d7a', '#bfa68a', '#c9b99e'];
    const arr: Array<{ position: Vector3; size: number; color: string }> = [];
    for (let i = 0; i < count; i += 1) {
      const base = trackCurve.getPoint(random());
      const offset = new Vector3(
        randomRange(random, -0.35, 0.35),
        0,
        randomRange(random, -0.35, 0.35),
      );
      const position = base.clone().add(offset);
      const size = randomRange(random, 0.03, 0.05);
      const colorIndex = Math.floor(random() * palette.length);
      arr.push({ position, size, color: palette[colorIndex] });
    }
    return arr;
  }, []);

  return (
    <group>
      {pebbles.map(({ position, size, color }, idx) => (
        <mesh
          key={idx}
          position={[position.x, position.y + 0.015, position.z]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[size, 0]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function GrassTufts() {
  const clusters = useMemo(() => {
    const random = createPRNG(745231);
    const arr: { position: Vector3; scale: number; hue: number; rotation: number }[] = [];
    for (let i = 0; i < 120; i += 1) {
      const p = new Vector3(
        randomRange(random, -2.6, 2.6),
        0,
        randomRange(random, -1.6, 1.6),
      );
      if (Math.abs(p.x) < 1.3 && Math.abs(p.z) < 0.5) continue;
      arr.push({
        position: p,
        scale: randomRange(random, 0.32, 0.67),
        hue: 90 + randomRange(random, 0, 20),
        rotation: random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {clusters.map(({ position, scale, hue, rotation }, index) => (
        <group
          key={index}
          position={[position.x, position.y + 0.02, position.z]}
          scale={scale}
          rotation={[0, rotation, 0]}
        >
          {[0, 1, 2].map((blade) => (
            <mesh key={blade} rotation={[0, (blade / 3) * Math.PI * 2, 0]}>
              <planeGeometry args={[0.08, 0.4, 1, 6]} />
              <meshStandardMaterial
                color={new Color(`hsl(${hue}, 50%, 55%)`)}
                side={THREE.DoubleSide}
                roughness={0.9}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Tree({ position, scale, rotation = 0 }: { position: [number, number, number]; scale: number; rotation?: number }) {
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      <mesh castShadow receiveShadow position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.28, 8]} />
        <meshStandardMaterial color="#7d5540" roughness={0.8} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
        <coneGeometry args={[0.25, 0.6, 16]} />
        <meshStandardMaterial color="#4d7d4b" roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#5c9359" roughness={0.6} />
      </mesh>
    </group>
  );
}

function TreeLine() {
  const trees = useMemo(() => {
    const random = createPRNG(394581);
    const positions: Array<{ position: [number, number, number]; scale: number; rotation: number }> =
      [];
    for (let i = 0; i < 12; i += 1) {
      const side = i % 2 === 0 ? 1 : -1;
      positions.push({
        position: [
          side * randomRange(random, 0.6, 2.3),
          0,
          randomRange(random, -0.5, 1.5),
        ],
        scale: randomRange(random, 0.6, 1),
        rotation: random() * Math.PI,
      });
    }
    return positions;
  }, []);

  return (
    <group>
      {trees.map((tree, idx) => (
        <Tree key={idx} position={tree.position} scale={tree.scale} rotation={tree.rotation} />
      ))}
    </group>
  );
}

function CameraRig({ jaxGroup }: { jaxGroup: MutableRefObject<Group | null> }) {
  useFrame(({ camera }) => {
    if (!jaxGroup.current) return;
    const targetPos = jaxGroup.current.position;
    const focus = new Vector3().copy(targetPos).add(new Vector3(0, 0.05, 0));
    const offset = new Vector3(-0.32, 0.18, 0.28);
    camera.position.copy(targetPos.clone().add(offset));
    camera.lookAt(focus);
  });

  return null;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[2.4, 2.6, 1.5]}
        intensity={2.4}
        color="#ffe7bd"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight
        position={[-2, 3, 2]}
        angle={0.6}
        penumbra={0.4}
        intensity={1.3}
        color="#fff3dd"
        castShadow
      />
      <Environment background blur={0.6}>
        <group rotation={[0, Math.PI / 2, 0]}>
          <Lightformer
            form="rect"
            intensity={1.2}
            position={[0, 2, -2]}
            scale={[8, 4, 1]}
            color="#f3d4b8"
          />
        </group>
      </Environment>
    </>
  );
}

function SceneContent() {
  const jaxRef = useRef<Group>(null);
  const ninoRef = useRef<Group>(null);
  const dustOrigin = useMemo(() => new Vector3(), []);
  const dustTangent = useMemo(() => new Vector3(), []);
  const looped = useLoopedTime();

  useFrame(() => {
    if (!jaxRef.current || !ninoRef.current) return;
    const t = looped.current;
    const eased = 0.12;
    alignToCurve(jaxRef.current, (t + 0.02) % 1, 0.02);
    alignToCurve(ninoRef.current, (t - eased + 1) % 1, -0.04);
    trackCurve.getPointAt((t + 0.02) % 1, dustOrigin);
    trackCurve.getTangentAt((t + 0.02) % 1, dustTangent);
    dustOrigin.addScaledVector(dustTangent, -0.14);
    dustOrigin.setY(0.015);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[1.8, 0.4, 1.4]} fov={42} />
      <Lighting />
      <Ground />
      <Road />
      <Pebbles />
      <GrassTufts />
      <TreeLine />
      <Jax groupRef={jaxRef} />
      <Nino groupRef={ninoRef} />
      <DustTrail origin={dustOrigin} />
      <ContactShadows
        frames={1}
        position={[0, -0.035, 0]}
        opacity={0.4}
        scale={5}
        blur={1.3}
        far={1.2}
      />
      <EffectComposer multisampling={2}>
        <DepthOfField focusDistance={0.014} focalLength={0.024} bokehScale={3} />
        <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.3} height={512} intensity={0.4} />
        <Vignette eskil={false} offset={0.2} darkness={0.75} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
      <CameraRig jaxGroup={jaxRef} />
    </>
  );
}

export function MiniValleyScene() {
  return (
    <div className="h-[420px] w-full rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-1 shadow-xl shadow-emerald-900/40 md:h-[520px]">
      <div className="h-full w-full overflow-hidden rounded-[26px] bg-[#0c1517]">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, toneMappingExposure: 1.1 }}
        >
          <Suspense fallback={null}>
            <SceneContent />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
