import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] overflow-hidden rounded-b-[3rem] bg-slate-950 px-4 pt-16 pb-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.92),_rgba(15,23,42,1))]" />
      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 text-center">
        <div className="inline-flex items-center justify-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm text-emerald-300 backdrop-blur-sm">
          <Icon name="insights" className="text-emerald-300" />
          Real-time coverage scoring for community health
        </div>

        <div className="space-y-8">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Visualize accessibility, prioritize facility placement, and bring care closer to communities.
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            HealthAccess blends spatial intelligence with predictive analytics so planners can identify gaps, compare scenario outcomes, and make faster, evidence-based decisions.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore features
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Contact sales
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Live coverage maps', value: '24/7' },
            { label: 'Predictive facility impact', value: '98% accurate' },
            { label: 'Faster site selection', value: '40% reduction' },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-5 text-left">
              <p className="text-3xl font-semibold text-white">{item.value}</p>
              <p className="mt-2 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
