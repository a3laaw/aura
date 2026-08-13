"use client";

import { remap } from "@/utils/ease";
import { BUILDING } from "@/data/buildingConfig";

const TREES: [number, number][] = [
  [-22, 14],
  [-24, 4],
  [-20, -12],
  [22, 16],
  [24, 6],
  [21, -10],
  [-16, 22],
  [14, 22],
  [-8, -20],
  [10, -21],
];

export function Landscape({ progress, visible }: { progress: number; visible: boolean }) {
  const t = remap(progress, 0.88, 0.98);
  if (!visible || t <= 0) return null;
  return (
    <group>
      {t > 0.2 &&
        TREES.slice(0, Math.ceil(t * TREES.length)).map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.7, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.24, 1.4, 8]} />
              <meshStandardMaterial color="#4a3424" roughness={0.9} />
            </mesh>
            <mesh position={[0, 2.1, 0]} castShadow>
              <sphereGeometry args={[1.15, 12, 10]} />
              <meshStandardMaterial color="#3d5c3a" roughness={0.85} />
            </mesh>
          </group>
        ))}
      {t > 0.4 &&
        [
          [-18, 10],
          [18, 12],
          [-14, -14],
          [16, -14],
        ].map(([x, z], i) => (
          <mesh key={`l${i}`} position={[x, 2.1, z]}>
            <cylinderGeometry args={[0.06, 0.06, 4.2, 8]} />
            <meshStandardMaterial color="#cfc8b8" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
      {t > 0.55 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[BUILDING.footprintWidth / 2 + 10, 0.04, 0]}>
          <planeGeometry args={[14, 22]} />
          <meshStandardMaterial color="#3f5a38" roughness={1} />
        </mesh>
      )}
    </group>
  );
}
