import { create } from "zustand";
import { BUILDING } from "@/data/buildingConfig";

export type StageId =
  | "site"
  | "blueprint"
  | "foundation"
  | "structure"
  | "floors"
  | "facade"
  | "landscape"
  | "final";

export const STAGE_AT: { id: StageId; t: number; label: string }[] = [
  { id: "site", t: 0, label: "SITE" },
  { id: "blueprint", t: 0.12, label: "BLUEPRINT" },
  { id: "foundation", t: 0.25, label: "FOUNDATION" },
  { id: "structure", t: 0.4, label: "STRUCTURE" },
  { id: "floors", t: 0.52, label: "FLOORS" },
  { id: "facade", t: 0.78, label: "FACADE" },
  { id: "landscape", t: 0.9, label: "LANDSCAPE" },
  { id: "final", t: 0.98, label: "FINAL" },
];

export function stageFromProgress(p: number): StageId {
  let s: StageId = "site";
  for (const st of STAGE_AT) if (p >= st.t) s = st.id;
  return s;
}

export function floorsVisible(p: number) {
  // structure 0.4–0.78 maps floors 0–20
  if (p < 0.4) return 0;
  if (p >= 0.78) return BUILDING.floors;
  const t = (p - 0.4) / 0.38;
  return Math.min(BUILDING.floors, Math.floor(t * BUILDING.floors + 0.001));
}

interface AppState {
  progress: number;
  playing: boolean;
  speed: number;
  scrollMode: boolean;
  muted: boolean;
  reducedMotion: boolean;
  debug: boolean;
  loaded: boolean;
  showBlueprint: boolean;
  showStructure: boolean;
  showFacade: boolean;
  showLandscape: boolean;
  selectedFloor: number | null;
  started: boolean;
  setProgress: (p: number) => void;
  setPlaying: (v: boolean) => void;
  setSpeed: (v: number) => void;
  setScrollMode: (v: boolean) => void;
  setMuted: (v: boolean) => void;
  toggleDebug: () => void;
  setLoaded: (v: boolean) => void;
  setStarted: (v: boolean) => void;
  toggle: (k: "showBlueprint" | "showStructure" | "showFacade" | "showLandscape") => void;
  setFloor: (n: number | null) => void;
  restart: () => void;
}

export const useApp = create<AppState>((set) => ({
  progress: 0,
  playing: false,
  speed: 1,
  scrollMode: true,
  muted: true,
  reducedMotion: false,
  debug: false,
  loaded: false,
  showBlueprint: true,
  showStructure: true,
  showFacade: true,
  showLandscape: true,
  selectedFloor: null,
  started: false,
  setProgress: (p) => set({ progress: Math.max(0, Math.min(1, p)) }),
  setPlaying: (v) => set({ playing: v }),
  setSpeed: (v) => set({ speed: v }),
  setScrollMode: (v) => set((s) => ({ scrollMode: v, playing: v ? false : s.playing })),
  setMuted: (v) => set({ muted: v }),
  toggleDebug: () => set((s) => ({ debug: !s.debug })),
  setLoaded: (v) => set({ loaded: v }),
  setStarted: (v) => set({ started: v, playing: v, progress: v ? 0.02 : 0 }),
  toggle: (k) => set((s) => ({ [k]: !s[k] })),
  setFloor: (n) => set({ selectedFloor: n }),
  restart: () => set({ progress: 0, playing: true, selectedFloor: null }),
}));
