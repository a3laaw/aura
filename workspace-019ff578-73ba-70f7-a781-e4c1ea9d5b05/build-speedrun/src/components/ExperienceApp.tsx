"use client";

import { useEffect } from "react";
import { Experience } from "./3d/Experience";
import { HUD } from "./ui/HUD";
import { Loader } from "./ui/Loader";
import { useApp } from "@/state/store";
import Link from "next/link";

export function ExperienceApp() {
  const setProgress = useApp((s) => s.setProgress);
  const scrollMode = useApp((s) => s.scrollMode);
  const toggleDebug = useApp((s) => s.toggleDebug);
  const started = useApp((s) => s.started);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "d" || e.key === "D") toggleDebug();
      if (e.key === " ") {
        e.preventDefault();
        const st = useApp.getState();
        st.setPlaying(!st.playing);
        st.setStarted(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleDebug]);

  useEffect(() => {
    if (!scrollMode || !started) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY / 4000;
      setProgress(useApp.getState().progress + delta);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [scrollMode, started, setProgress]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0a0c10]">
      <Experience />
      <HUD />
      <Loader />
      <nav className="pointer-events-auto absolute left-5 top-[7.5rem] z-20 flex gap-4 text-[10px] tracking-[0.28em] text-white/45">
        <Link href="/" className="text-white/80">EXPERIENCE</Link>
        <Link href="/projects">PROJECTS</Link>
        <Link href="/about">ABOUT</Link>
      </nav>
    </div>
  );
}
