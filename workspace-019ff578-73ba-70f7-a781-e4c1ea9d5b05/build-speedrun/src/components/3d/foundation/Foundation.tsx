"use client";

import { useMemo } from "react";
import { BUILDING, columnPositions } from "@/data/buildingConfig";
import { remap, overshoot } from "@/utils/ease";

export function Foundation({ progress }: { progress: number }) {
  const { cols } = useMemo(() => columnPositions(), []);
  const pilesT = remap(progress, 0.22, 0.3);
  const rebarT = remap(progress, 0.27, 0.33);
  const beamsT = remap(progress, 0.3, 0.36);
  const slabT = remap(progress, 0.33, 0.4);
  const { footprintWidth: w, footprintDepth: d, pileDepth, foundationHeight } = BUILDING;

  return (
    <group>
      {cols.map((c, i) => {
        const local = remap(pilesT, i / cols.length * 0.4, 0.4 + (i / cols.length) * 0.6);
        const y = -pileDepth / 2 + (1 - local) * pileDepth;
        return (
          <mesh key={c.id} position={[c.x, y, c.z]} castShadow>
            <cylinderGeometry args={[BUILDING.pileRadius, BUILDING.pileRadius, pileDepth, 10]} />
            <meshStandardMaterial color="#6d6a64" roughness={0.85} />
          </mesh>
        );
      })}
      {cols.map((c) => {
        const h = 1.8 * rebarT;
        if (h < 0.05) return null;
        return (
          <mesh key={`r${c.id}`} position={[c.x, 0.2 + h / 2, c.z]}>
            <cylinderGeometry args={[0.12, 0.12, h, 8]} />
            <meshStandardMaterial color="#8a8f96" metalness={0.7} roughness={0.35} />
          </mesh>
        );
      })}
      <mesh
        position={[0, -foundationHeight / 2 + overshoot(slabT) * foundationHeight * 0.15, 0]}
        scale={[1, Math.max(0.001, slabT), 1]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[w + 1.6, foundationHeight, d + 1.6]} />
        <meshStandardMaterial color="#8a8680" roughness={0.9} />
      </mesh>
      {beamsT > 0 && (
        <mesh position={[0, 0.15, 0]} scale={[1, beamsT, 1]}>
          <boxGeometry args={[w + 0.4, 0.35, d + 0.4]} />
          <meshStandardMaterial color="#7a7670" roughness={0.88} />
        </mesh>
      )}
    </group>
  );
}
