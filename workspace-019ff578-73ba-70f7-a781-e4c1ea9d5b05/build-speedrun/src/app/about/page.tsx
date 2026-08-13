import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-dvh overflow-auto bg-[#07090c] px-8 py-16 text-white">
      <Link href="/" className="text-[11px] tracking-[0.3em] text-cyan-300">
        ← EXPERIENCE
      </Link>
      <h1 className="mt-8 text-4xl font-extralight tracking-wide">About the technology</h1>
      <p className="mt-6 max-w-xl text-white/70 leading-relaxed">
        BUILD SPEEDRUN is a real-time BIM-style construction visualization. One locked
        architectural definition drives foundation, structure, slabs, facade, and landscape.
        Progress is a single timeline you can play, pause, or scrub.
      </p>
      <ul className="mt-8 space-y-2 text-sm text-white/60">
        <li>Next.js · React Three Fiber · Three.js</li>
        <li>20-floor reinforced concrete frame</li>
        <li>Stone + glass facade from the same footprint</li>
        <li>Keyboard: D debug · Space play/pause</li>
      </ul>
    </main>
  );
}
