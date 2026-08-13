import Link from "next/link";

export default function Projects() {
  return (
    <main className="min-h-dvh overflow-auto bg-[#07090c] px-8 py-16 text-white">
      <Link href="/" className="text-[11px] tracking-[0.3em] text-cyan-300">
        ← EXPERIENCE
      </Link>
      <h1 className="mt-8 text-4xl font-extralight">Projects</h1>
      <article className="mt-10 max-w-lg rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="text-[10px] tracking-[0.3em] text-cyan-300">01</div>
        <h2 className="mt-2 text-2xl">Aether Residences</h2>
        <p className="mt-3 text-sm text-white/60">
          20-floor premium residential complex. Graphite structure, natural stone, floor-to-ceiling
          glass, recessed balconies. Construction visualized from empty site to final reveal.
        </p>
        <Link href="/" className="mt-6 inline-block text-xs tracking-widest text-cyan-200">
          OPEN SPEEDRUN →
        </Link>
      </article>
    </main>
  );
}
