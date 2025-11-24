import { MiniValleyScene } from "@/components/MiniValleyScene";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950 text-white">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-6 py-16 md:px-12">
        <header className="grid gap-8 text-balance md:grid-cols-[1.5fr_1fr] md:items-center">
          <div className="flex flex-col gap-6">
            <span className="inline-flex max-w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs tracking-[0.2em] uppercase text-emerald-200/80">
              Miniature Pixar Chase • 8s Loop
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-emerald-100 drop-shadow md:text-5xl">
              JAX &amp; NINO race through a sunlit miniature valley.
            </h1>
            <p className="text-lg leading-relaxed text-emerald-50/80 md:text-xl">
              Morning light spills across a handcrafted world: warm soil, flickering grasses, and
              cinematic depth of field that tracks JAX&apos;s spinning wheels while NINO scrambles to
              keep up with an overstuffed toolkit.
            </p>
            <div className="grid gap-3 text-sm text-emerald-100/80 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-xs uppercase tracking-[0.18em] text-emerald-200/70">
                  Dialogue
                </h2>
                <p className="mt-2 font-semibold text-emerald-100">
                  JAX: <span className="font-normal">&ldquo;Come on, Nino! If you&apos;re slow, we won’t make it!&rdquo;</span>
                </p>
                <p className="mt-2 font-semibold text-emerald-100">
                  NINO: <span className="font-normal">&ldquo;Wait! This bag is too heavy!&rdquo;</span>
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-xs uppercase tracking-[0.18em] text-emerald-200/70">
                  Camera Brief
                </h2>
                <p className="mt-2">
                  Low left tracking shot hugging the dirt road, focus locked on JAX&apos;s wheels while
                  soft bokeh burns through the tree canopy.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-emerald-900/20 px-5 py-6 text-sm text-emerald-50/75 backdrop-blur">
            <h2 className="text-xs uppercase tracking-[0.18em] text-emerald-200/60">
              Scene Breakdown
            </h2>
            <ul className="mt-4 space-y-3">
              <li>
                <strong className="text-emerald-50">Setting:</strong> Sebuah lembah miniatur pagi hari,
                rumput pendek yang bergoyang dan batu mungil alami.
              </li>
              <li>
                <strong className="text-emerald-50">Lighting:</strong> Hangat, sinar matahari menerobos
                sela pepohonan menciptakan volumetric glow ala film keluarga.
              </li>
              <li>
                <strong className="text-emerald-50">Mood:</strong> Ceria, penuh semangat dengan sentuhan
                urgent namun bersahabat.
              </li>
            </ul>
          </div>
        </header>
        <section className="space-y-6">
          <MiniValleyScene />
          <p className="text-center text-sm uppercase tracking-[0.4em] text-emerald-200/60">
            Looping 8s previs • Pixar-inspired miniature realism
          </p>
        </section>
        <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-sm leading-relaxed text-emerald-100/90 md:grid-cols-3">
          <div>
            <h3 className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">Action beats</h3>
            <ol className="mt-4 space-y-3">
              <li><strong className="text-emerald-50">0s-2s</strong> • Kamera menempel pada roda JAX, debu tipis beterbangan.</li>
              <li><strong className="text-emerald-50">2s-5s</strong> • NINO tersandung ringan, tas perkakas terguncang.</li>
              <li><strong className="text-emerald-50">5s-8s</strong> • Cahaya menyorot wajah karakter saat jalan menanjak.</li>
            </ol>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">
              Texture palette
            </h3>
            <p className="mt-4">
              Tanah bertekstur tanah liat hangat, rumput fiber halus, body JAX lacquer merah
              metalik dengan noda lumpur lembut, dan casing biru metalik NINO yang memantulkan
              sinar pagi.
            </p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">
              Story intent
            </h3>
            <p className="mt-4">
              Menekankan dinamika pasangan: JAX percaya diri memimpin misi, NINO yang gugup namun setia.
              Latar lembah miniatur memberikan nuansa petualangan hangat untuk penonton segala usia.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
