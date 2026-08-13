"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useApp } from "@/state/store";

function Glove({ side }: { side: "L" | "R" }) {
  const s = side === "L" ? -1 : 1;
  const mat = (
    <meshStandardMaterial color="#111214" roughness={0.42} metalness={0.18} />
  );
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0.15, 0, s * 0.08]}>
        <boxGeometry args={[0.18, 0.08, 0.26]} />
        {mat}
      </mesh>
      {[
        [-0.07, 0.02, -0.18],
        [-0.025, 0.03, -0.2],
        [0.02, 0.03, -0.21],
        [0.065, 0.02, -0.18],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <capsuleGeometry args={[0.016, 0.07, 4, 8]} />
          {mat}
        </mesh>
      ))}
      <mesh position={[s * -0.1, -0.01, -0.04]} rotation={[0.4, s * 0.6, 0]}>
        <capsuleGeometry args={[0.016, 0.05, 4, 8]} />
        {mat}
      </mesh>
    </group>
  );
}

export function Hands() {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const playing = useApp((s) => s.playing);
  const progress = useApp((s) => s.progress);

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.copy(camera.position);
    group.current.quaternion.copy(camera.quaternion);
    const t = state.clock.elapsedTime;
    const tap = playing && progress < 0.15 ? Math.sin(t * 10) * 0.02 : 0;
    group.current.children[0]?.position.set(-0.28, -0.22, -0.48);
    group.current.children[1]?.position.set(0.3, -0.2 + tap, -0.46);
  });

  return (
    <group ref={group}>
      <group>
        <Glove side="L" />
      </group>
      <group>
        <Glove side="R" />
      </group>
    </group>
  );
}
