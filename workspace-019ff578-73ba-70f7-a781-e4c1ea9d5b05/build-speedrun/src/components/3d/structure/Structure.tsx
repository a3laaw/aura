"use client";

import { useMemo } from "react";
import { BUILDING, columnPositions, floorY } from "@/data/buildingConfig";
import { floorsVisible } from "@/state/store";
import { remap } from "@/utils/ease";

export function Structure({
  progress,
  visible,
  highlightFloor,
}: {
  progress: number;
  visible: boolean;
  highlightFloor: number | null;
}) {
  const { cols, xs, zs } = useMemo(() => columnPositions(), []);
  const n = floorsVisible(progress);
  if (!visible || n <= 0) return null;

  const { columnSize: cs, floorHeight: fh, beamHeight, beamWidth } = BUILDING;

  return (
    <group>
      {Array.from({ length: n }, (_, floor) => {
        const dim = highlightFloor == null ? 1 : highlightFloor === floor ? 1 : 0.28;
        const local = remap(progress, 0.4 + (floor / BUILDING.floors) * 0.38, 0.4 + ((floor + 1) / BUILDING.floors) * 0.38);
        const colH = Math.max(0.05, fh * Math.min(1, local * 1.4));
        const y0 = floorY(floor);
        return (
          <group key={floor} userData={{ floor }}>
            {cols.map((c) => (
              <mesh
                key={`${floor}-${c.id}`}
                position={[c.x, y0 + colH / 2, c.z]}
                castShadow
              >
                <boxGeometry args={[cs, colH, cs]} />
                <meshStandardMaterial
                  color="#3a3a3c"
                  roughness={0.55}
                  metalness={0.15}
                  opacity={dim}
                  transparent={dim < 1}
                />
              </mesh>
            ))}
            {local > 0.45 &&
              xs.map((x, i) =>
                zs.slice(0, -1).map((z, j) => {
                  const z1 = zs[j + 1];
                  const len = Math.abs(z1 - z);
                  return (
                    <mesh
                      key={`bz${floor}-${i}-${j}`}
                      position={[x, y0 + fh - beamHeight / 2, (z + z1) / 2]}
                    >
                      <boxGeometry args={[beamWidth, beamHeight, len]} />
                      <meshStandardMaterial color="#2e2e30" roughness={0.5} metalness={0.2} />
                    </mesh>
                  );
                })
              )}
            {local > 0.55 &&
              zs.map((z, j) =>
                xs.slice(0, -1).map((x, i) => {
                  const x1 = xs[i + 1];
                  const len = Math.abs(x1 - x);
                  return (
                    <mesh
                      key={`bx${floor}-${i}-${j}`}
                      position={[(x + x1) / 2, y0 + fh - beamHeight / 2, z]}
                    >
                      <boxGeometry args={[len, beamHeight, beamWidth]} />
                      <meshStandardMaterial color="#2e2e30" roughness={0.5} metalness={0.2} />
                    </mesh>
                  );
                })
              )}
            {local > 0.7 && (
              <mesh
                position={[0, y0 + fh + BUILDING.slabThickness / 2, 0]}
                receiveShadow
                castShadow
              >
                <boxGeometry
                  args={[
                    BUILDING.footprintWidth + 0.2,
                    BUILDING.slabThickness,
                    BUILDING.footprintDepth + 0.2,
                  ]}
                />
                <meshStandardMaterial color="#b7b2aa" roughness={0.88} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
