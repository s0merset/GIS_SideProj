import { Layers, Flame, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const FEATURES = [
  {
    id: 'gis',
    title: 'Interactive GIS mapping',
    desc: 'Overlay population density, transport routes, and facility catchment areas on a live map — updated as conditions change.',
    icon: Layers,
  },
  {
    id: 'heatmaps',
    title: 'Accessibility heatmaps',
    desc: 'Color-coded risk zones reveal which communities are farthest from care and by how much, down to the barangay level.',
    icon: Flame,
  },
  {
    id: 'recommendation',
    title: 'Placement engine',
    desc: 'Model the impact of new facilities before committing resources, ranked by projected coverage improvement and equity gain.',
    icon: Sparkles,
  },
];

export const Features = () => (
  <section id="features" className="bg-[#060c18] py-28">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-16 max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Core capabilities
        </p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Built for planners who need to act, not just analyze.
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Card
            key={f.id}
            className="rounded-3xl bg-[#060c18] ring-white/8 transition-colors hover:bg-[#0a1628]"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                <f.icon className="h-5 w-5" />
              </div>
              <span className="font-mono text-xs text-slate-600">0{i + 1}</span>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
