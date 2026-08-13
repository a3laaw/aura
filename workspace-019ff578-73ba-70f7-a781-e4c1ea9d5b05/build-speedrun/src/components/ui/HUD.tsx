"use client";

import { useApp, stageFromProgress, STAGE_AT } from "@/state/store";
import { BUILDING } from "@/data/buildingConfig";
import { floorsVisible } from "@/state/store";

const SPEEDS = [0.5, 1, 2, 5, 10];

export function HUD() {
  const s = useApp();
  const stage = stageFromProgress(s.progress);
  const floor = floorsVisible(s.progress);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-white">
      <header className="pointer-events-auto flex items-start justify-between p-5 md:p-8">
        <div>
          <div className="text-[10px] tracking-[0.35em] text-cyan-200/80">BUILD SPEEDRUN</div>
          <div className="mt-1 text-lg font-light tracking-wide">{BUILDING.name}</div>
          <div className="text-[11px] text-white/50">20 FLOORS · STONE + GLASS · RC FRAME</div>
        </div>
        <div className="rounded-md border border-white/15 bg-black/30 px-3 py-2 backdrop-blur-md">
          <div className="text-[10px] tracking-[0.25em] text-cyan-300">{stage.toUpperCase()}</div>
          <div className="font-mono text-2xl tabular-nums">{Math.round(s.progress * 100)}%</div>
          <div className="text-[10px] text-white/50">FLOOR {String(Math.max(1, floor)).padStart(2, "0")} / 20</div>
        </div>
      </header>

      <div className="pointer-events-auto absolute bottom-6 left-1/2 w-[min(92vw,720px)] -translate-x-1/2 rounded-xl border border-white/12 bg-black/35 p-3 backdrop-blur-xl">
        <input
          aria-label="Construction progress"
          type="range"
          min={0}
          max={1000}
          value={Math.round(s.progress * 1000)}
          onChange={(e) => {
            s.setScrollMode(true);
            s.setPlaying(false);
            s.setProgress(Number(e.target.value) / 1000);
          }}
          className="mb-3 w-full accent-cyan-300"
        />
        <div className="mb-3 flex justify-between text-[9px] tracking-widest text-white/40">
          {STAGE_AT.map((st) => (
            <button
              key={st.id}
              className={`pointer-events-auto ${stage === st.id ? "text-cyan-300" : ""}`}
              onClick={() => {
                s.setProgress(st.t);
                s.setPlaying(false);
              }}
            >
              {st.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex gap-1.5">
            <Btn onClick={() => { s.setScrollMode(false); s.setPlaying(!s.playing); s.setStarted(true); }}>
              {s.playing ? "PAUSE" : "PLAY"}
            </Btn>
            <Btn onClick={() => s.restart()}>RESTART</Btn>
            <Btn onClick={() => s.setScrollMode(!s.scrollMode)}>{s.scrollMode ? "SCROLL" : "AUTO"}</Btn>
            <Btn onClick={() => s.setMuted(!s.muted)}>{s.muted ? "MUTED" : "AUDIO"}</Btn>
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-1 text-white/40">SPEED</span>
            {SPEEDS.map((v) => (
              <Btn key={v} active={s.speed === v} onClick={() => s.setSpeed(v)}>
                {v}×
              </Btn>
            ))}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
          <Btn onClick={() => s.toggle("showBlueprint")} active={s.showBlueprint}>BLUEPRINT</Btn>
          <Btn onClick={() => s.toggle("showStructure")} active={s.showStructure}>STRUCTURE</Btn>
          <Btn onClick={() => s.toggle("showFacade")} active={s.showFacade}>FACADE</Btn>
          <Btn onClick={() => s.toggle("showLandscape")} active={s.showLandscape}>LANDSCAPE</Btn>
        </div>
      </div>

      <aside className="pointer-events-auto absolute right-4 top-1/2 hidden max-h-[60vh] -translate-y-1/2 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-2 backdrop-blur md:block">
        <div className="mb-1 text-center text-[9px] tracking-widest text-cyan-200/70">FLOOR</div>
        {Array.from({ length: 20 }, (_, i) => 20 - i).map((n) => (
          <button
            key={n}
            aria-label={`Floor ${n}`}
            onClick={() => s.setFloor(s.selectedFloor === n - 1 ? null : n - 1)}
            className={`mb-0.5 block w-10 rounded py-0.5 font-mono text-[10px] ${
              s.selectedFloor === n - 1 ? "bg-cyan-400/30 text-cyan-100" : "text-white/50 hover:text-white"
            }`}
          >
            F{String(n).padStart(2, "0")}
          </button>
        ))}
      </aside>

      {s.progress > 0.96 && (
        <div className="pointer-events-none absolute left-8 top-1/3 hidden rounded-lg border border-white/12 bg-black/40 px-5 py-4 text-[11px] tracking-wide backdrop-blur md:block">
          <div className="text-[10px] text-cyan-300">PROJECT</div>
          <div className="mb-2 text-sm">PREMIUM RESIDENTIAL COMPLEX</div>
          <div>20 FLOORS</div>
          <div>STATUS 100%</div>
          <div>STRUCTURAL SYSTEM · RC</div>
          <div>FACADE · STONE + GLASS</div>
          <div>COMPLETED</div>
        </div>
      )}

      {s.debug && <Debug />}
    </div>
  );
}

function Btn({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded border px-2 py-1 tracking-wider ${
        active ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-100" : "border-white/15 bg-white/5 text-white/80"
      }`}
    >
      {children}
    </button>
  );
}

function Debug() {
  const s = useApp();
  return (
    <div className="pointer-events-none absolute left-4 top-28 rounded border border-amber-400/30 bg-black/60 p-3 font-mono text-[10px] text-amber-100">
      <div>DEBUG</div>
      <div>stage {stageFromProgress(s.progress)}</div>
      <div>progress {s.progress.toFixed(3)}</div>
      <div>floor {floorsVisible(s.progress)}</div>
      <div>playing {String(s.playing)}</div>
      <div>speed {s.speed}</div>
    </div>
  );
}
