import { Button } from '../ui/Button';

export const CTA = () => (
  <section className="py-24">
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-[3rem] border border-emerald-500/10 bg-gradient-to-br from-slate-950/95 via-slate-950 to-slate-900/90 p-12 text-center shadow-2xl shadow-emerald-500/10">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Ready to make better facility decisions?</p>
        <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Start building more resilient healthcare networks.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Book a demo and see how live GIS analytics, accessibility scoring, and deployment guidance can accelerate your next site strategy.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg">Request Demo</Button>
          <Button variant="outline" size="lg">Contact Sales</Button>
        </div>
      </div>
    </div>
  </section>
);