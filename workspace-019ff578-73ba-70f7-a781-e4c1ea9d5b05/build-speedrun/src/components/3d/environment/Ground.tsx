"use client";

import { BUILDING } from "@/data/buildingConfig";

export function Ground({ landscape }: { landscape: number }) {
  const paved = landscape;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial
          color={paved > 0.4 ? "#3a3a38" : "#6b5a45"}
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[90, 70]} />
        <meshStandardMaterial
          color={paved > 0.15 ? "#4a4844" : "#7a684e"}
          roughness={0.92}
        />
      </mesh>
      {paved > 0.35 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, BUILDING.footprintDepth / 2 + 8]} receiveShadow>
          <planeGeometry args={[8, 18]} />
          <meshStandardMaterial color="#5c5a56" roughness={0.85} />
        </mesh>
      )}
    </group>
  );
}
