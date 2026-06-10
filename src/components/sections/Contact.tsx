import { Button } from '../ui/Button';

export const Contact = () => (
  <section id="contact" className="rounded-[2.5rem] border border-white/10 bg-slate-950/90 p-10 shadow-2xl shadow-slate-950/20">
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Let's build better access together
          </p>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Talk to our GIS planning experts.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Share your coverage goals, and we’ll show you how to combine spatial insights with real-world facility planning to deliver measurable improvements.
          </p>
        </div>

        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-900/80 p-8">
          <div className="rounded-3xl bg-slate-950/70 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Contact</p>
            <p className="mt-3 text-lg font-semibold text-white">hello@healthaccess.ai</p>
          </div>
          <div className="rounded-3xl bg-slate-950/70 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Office</p>
            <p className="mt-3 text-lg font-semibold text-white">Manila, Philippines</p>
          </div>
          <div className="rounded-3xl bg-emerald-500/10 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Speak with sales</p>
            <Button className="mt-4 w-full" variant="primary" size="md">Book a demo</Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
