"use client";

import { Line } from "@react-three/drei";
import { BUILDING, columnPositions } from "@/data/buildingConfig";
import { remap } from "@/utils/ease";

export function Blueprint({ progress, visible }: { progress: number; visible: boolean }) {
  const t = remap(progress, 0.1, 0.24);
  if (!visible || t <= 0) return null;
  const { footprintWidth: w, footprintDepth: d } = BUILDING;
  const { cols, xs, zs } = columnPositions();
  const y = 0.06;

  const perimeter: [number, number, number][] = [
    [-w / 2, y, -d / 2],
    [w / 2, y, -d / 2],
    [w / 2, y, d / 2],
    [-w / 2, y, d / 2],
    [-w / 2, y, -d / 2],
  ];

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <planeGeometry args={[w + 6, d + 6]} />
        <meshBasicMaterial color="#06202a" transparent opacity={0.35 * t} />
      </mesh>
      <Line points={perimeter} color="#7ef0ff" lineWidth={1.5} transparent opacity={t} />
      {xs.map((x, i) => (
        <Line
          key={`gx${i}`}
          points={[
            [x, y, -d / 2],
            [x, y, d / 2],
          ]}
          color="#9ae8ff"
          lineWidth={0.8}
          transparent
          opacity={0.55 * t}
        />
      ))}
      {zs.map((z, i) => (
        <Line
          key={`gz${i}`}
          points={[
            [-w / 2, y, z],
            [w / 2, y, z],
          ]}
          color="#9ae8ff"
          lineWidth={0.8}
          transparent
          opacity={0.55 * t}
        />
      ))}
      {cols.map((c) => (
        <mesh key={c.id} position={[c.x, y, c.z]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 12]} />
          <meshBasicMaterial color="#7ef0ff" transparent opacity={0.85 * t} />
        </mesh>
      ))}
    </group>
  );
}
