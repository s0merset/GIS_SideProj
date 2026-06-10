import { Icon } from '../ui/Icon';

const FEATURE_DATA = [
  {
    id: 'gis',
    title: 'Interactive GIS mapping',
    desc: 'Visualize geographic coverage instantly with layers for population, transport, and facility access.',
    icon: 'layers'
  },
  {
    id: 'heatmaps',
    title: 'Accessibility heatmaps',
    desc: 'Identify underserved communities with color-coded risk zones and resource gap scores.',
    icon: 'heat_map'
  },
  {
    id: 'recommendation',
    title: 'Recommendation engine',
    desc: 'Generate high-impact placement scenarios using predictive demand and equity signals.',
    icon: 'auto_awesome'
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="inline-flex rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
            Built for actionable planning
          </p>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Everything teams need to plan better healthcare access.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">
            From real-time spatial analytics to predictive siting tools, this platform gives you the insight to close access gaps faster.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {FEATURE_DATA.map((feature) => (
            <div key={feature.id} className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/10 transition hover:-translate-y-1 hover:border-emerald-500/20">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20">
                <Icon name={feature.icon} className="text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-7">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
