"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { SceneRig } from "./environment/SceneRig";
import { useApp } from "@/state/store";

export function Experience() {
  const playing = useApp((s) => s.playing);
  const speed = useApp((s) => s.speed);
  const scrollMode = useApp((s) => s.scrollMode);
  const setProgress = useApp((s) => s.setProgress);
  const started = useApp((s) => s.started);

  useEffect(() => {
    if (!playing || !started || scrollMode) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const p = useApp.getState().progress;
      const next = p + (dt * speed) / 22;
      if (next >= 1) {
        useApp.getState().setProgress(1);
        useApp.getState().setPlaying(false);
      } else {
        setProgress(next);
        raf = requestAnimationFrame(loop);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, scrollMode, started, setProgress]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ fov: 62, near: 0.1, far: 280, position: [18, 1.72, 28] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <SceneRig />
      </Suspense>
    </Canvas>
  );
}
