"use client";

import { BUILDING, floorY } from "@/data/buildingConfig";
import { remap } from "@/utils/ease";

export function Facade({ progress, visible, highlightFloor }: { progress: number; visible: boolean; highlightFloor: number | null }) {
  const t = remap(progress, 0.76, 0.9);
  if (!visible || t <= 0) return null;
  const { floors, footprintWidth: w, footprintDepth: d, floorHeight: fh } = BUILDING;
  const floorsOn = Math.max(1, Math.ceil(t * floors));

  return (
    <group>
      {Array.from({ length: floorsOn }, (_, floor) => {
        const dim = highlightFloor == null ? 1 : highlightFloor === floor ? 1 : 0.22;
        const y = floorY(floor) + fh * 0.5;
        const glassH = fh * 0.78;
        const stoneH = fh * 0.18;
        return (
          <group key={floor}>
            {(["n", "s", "e", "w"] as const).map((side) => {
              const isNS = side === "n" || side === "s";
              const pos: [number, number, number] =
                side === "n"
                  ? [0, y, d / 2 + 0.08]
                  : side === "s"
                    ? [0, y, -d / 2 - 0.08]
                    : side === "e"
                      ? [w / 2 + 0.08, y, 0]
                      : [-w / 2 - 0.08, y, 0];
              const gw = isNS ? w - 0.4 : d - 0.4;
              return (
                <group key={side} position={pos}>
                  <mesh>
                    <boxGeometry args={isNS ? [gw, glassH, 0.08] : [0.08, glassH, gw]} />
                    <meshPhysicalMaterial
                      color="#9ec4d4"
                      metalness={0.15}
                      roughness={0.08}
                      transmission={0.55}
                      thickness={0.4}
                      transparent
                      opacity={0.85 * dim}
                    />
                  </mesh>
                  <mesh position={[0, -glassH / 2 - 0.05, 0]}>
                    <boxGeometry args={isNS ? [gw + 0.2, stoneH, 0.14] : [0.14, stoneH, gw + 0.2]} />
                    <meshStandardMaterial color="#d8d2c6" roughness={0.72} />
                  </mesh>
                </group>
              );
            })}
            {floor > 0 && floor % 1 === 0 && (
              <>
                <mesh position={[w / 2 + BUILDING.balconyDepth / 2, y - fh * 0.35, 0]} castShadow>
                  <boxGeometry args={[BUILDING.balconyDepth, 0.12, BUILDING.balconyWidth]} />
                  <meshStandardMaterial color="#2a2a2c" roughness={0.4} metalness={0.35} />
                </mesh>
                <mesh position={[-w / 2 - BUILDING.balconyDepth / 2, y - fh * 0.35, 2.2]} castShadow>
                  <boxGeometry args={[BUILDING.balconyDepth, 0.12, BUILDING.balconyWidth]} />
                  <meshStandardMaterial color="#2a2a2c" roughness={0.4} metalness={0.35} />
                </mesh>
              </>
            )}
          </group>
        );
      })}
      {t > 0.85 && (
        <mesh position={[0, floors * fh + 0.4, 0]} castShadow>
          <boxGeometry args={[w + 0.8, 0.45, d + 0.8]} />
          <meshStandardMaterial color="#2c2c2e" roughness={0.45} metalness={0.3} />
        </mesh>
      )}
      {t > 0.7 && (
        <group position={[0, 2.4, d / 2 + 0.2]}>
          <mesh>
            <boxGeometry args={[7.2, 4.8, 0.25]} />
            <meshPhysicalMaterial color="#b8d4e0" roughness={0.1} transmission={0.4} transparent opacity={0.75} />
          </mesh>
          <mesh position={[0, -2.6, 1.2]}>
            <boxGeometry args={[8, 0.2, 4]} />
            <meshStandardMaterial color="#3d3d3f" />
          </mesh>
        </group>
      )}
    </group>
  );
}
