"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/state/store";
import { validateArchitecture } from "@/data/buildingConfig";

const STEPS = ["SITE", "STRUCTURE", "MATERIALS", "ANIMATION SYSTEM", "ENVIRONMENT"];

export function Loader() {
  const started = useApp((s) => s.started);
  const setStarted = useApp((s) => s.setStarted);
  const setLoaded = useApp((s) => s.setLoaded);
  const [i, setI] = useState(0);
  const [ready, setReady] = useState(false);
  const [val] = useState(() => validateArchitecture());

  useEffect(() => {
    const t = setInterval(() => {
      setI((n) => {
        if (n >= STEPS.length - 1) {
          clearInterval(t);
          setReady(true);
          setLoaded(true);
          return n;
        }
        return n + 1;
      });
    }, 380);
    return () => clearInterval(t);
  }, [setLoaded]);

  if (started) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#07090c]/92 text-white backdrop-blur-sm">
      <div className="text-[11px] tracking-[0.5em] text-cyan-300/80">BUILD SPEEDRUN</div>
      <h1 className="mt-3 text-center text-3xl font-extralight tracking-[0.2em] md:text-5xl">
        INITIALIZING ARCHITECTURAL ENGINE
      </h1>
      <div className="mt-10 w-72 space-y-2">
        {STEPS.map((step, idx) => (
          <div key={step} className="flex justify-between text-[11px] tracking-widest">
            <span className={idx <= i ? "text-white" : "text-white/30"}>{step}</span>
            <span className="text-cyan-300/80">{idx < i ? "OK" : idx === i ? "…" : ""}</span>
          </div>
        ))}
      </div>
      {!val.ok && (
        <div className="mt-6 text-xs text-red-400">FAIL VALIDATION · {val.errors.join(" · ")}</div>
      )}
      {ready && val.ok && (
        <button
          onClick={() => setStarted(true)}
          className="mt-10 rounded-full border border-cyan-300/50 px-10 py-3 text-xs tracking-[0.35em] text-cyan-100 hover:bg-cyan-300/10"
        >
          START BUILD
        </button>
      )}
    </div>
  );
}
