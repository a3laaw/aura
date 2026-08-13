export const BUILDING = {
  name: "Aether Residences",
  floors: 20,
  floorHeight: 3.45,
  slabThickness: 0.28,
  footprintWidth: 28,
  footprintDepth: 16.5,
  setbackX: 1.1,
  setbackZ: 0.85,
  columnSize: 0.55,
  beamHeight: 0.42,
  beamWidth: 0.32,
  gridX: 5,
  gridZ: 4,
  balconyDepth: 1.55,
  balconyWidth: 3.4,
  windowInset: 0.12,
  facadeThickness: 0.18,
  pileDepth: 8.5,
  pileRadius: 0.28,
  foundationHeight: 1.4,
  lobbyHeight: 5.2,
  roofOverhang: 0.45,
} as const;

export type BuildingConfig = typeof BUILDING;

export function columnPositions() {
  const { footprintWidth: w, footprintDepth: d, gridX, gridZ } = BUILDING;
  const xs: number[] = [];
  const zs: number[] = [];
  for (let i = 0; i < gridX; i++) xs.push(-w / 2 + (i * w) / (gridX - 1));
  for (let j = 0; j < gridZ; j++) zs.push(-d / 2 + (j * d) / (gridZ - 1));
  const cols: { x: number; z: number; id: string }[] = [];
  xs.forEach((x, i) =>
    zs.forEach((z, j) => {
      cols.push({ x, z, id: `C${i}${j}` });
    })
  );
  return { xs, zs, cols };
}

export function floorY(floorIndex: number) {
  // floor 0 slab top
  return floorIndex * BUILDING.floorHeight;
}

export function buildingHeight() {
  return BUILDING.floors * BUILDING.floorHeight + 1.2;
}

export function balconyFloors() {
  return Array.from({ length: BUILDING.floors - 1 }, (_, i) => i + 1);
}

export function validateArchitecture() {
  const errors: string[] = [];
  if (BUILDING.floors !== 20) errors.push(`Floor count ${BUILDING.floors} !== 20`);
  const { cols, xs, zs } = columnPositions();
  if (cols.length !== BUILDING.gridX * BUILDING.gridZ) {
    errors.push("Column count mismatch");
  }
  if (xs.length !== BUILDING.gridX || zs.length !== BUILDING.gridZ) {
    errors.push("Grid mismatch");
  }
  const unique = new Set(cols.map((c) => `${c.x.toFixed(3)},${c.z.toFixed(3)}`));
  if (unique.size !== cols.length) errors.push("Duplicate column coordinates");
  return { ok: errors.length === 0, errors };
}
