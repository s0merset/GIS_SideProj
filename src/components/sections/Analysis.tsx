import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import barangaySummary from '../../assets/barangay_summary.json';

interface BarangaySummary {
  rank: number;
  category: string;
  population: number;
  facilities: number;
  facilities_per_10k: number;
}

const SUMMARY = barangaySummary as BarangaySummary[];

// Real metrics derived from the barangay dataset at module load.
const totalPopulation = SUMMARY.reduce((acc, b) => acc + b.population, 0);
const totalFacilities = SUMMARY.reduce((acc, b) => acc + b.facilities, 0);
const veryLowPopulation = SUMMARY
  .filter((b) => b.category === 'Very Low Access')
  .reduce((acc, b) => acc + b.population, 0);
const veryLowShare = Math.round((veryLowPopulation / totalPopulation) * 100);
const noFacilityShare = Math.round(
  (SUMMARY.filter((b) => b.facilities === 0).length / SUMMARY.length) * 100
);

const METRICS = [
  { value: SUMMARY.length.toLocaleString(), unit: '', label: 'Barangays analyzed' },
  { value: totalFacilities.toLocaleString(), unit: '', label: 'Health facilities on record' },
  { value: String(veryLowShare), unit: '%', label: 'Population in very-low-access areas' },
  { value: String(noFacilityShare), unit: '%', label: 'Barangays with no facility' },
];

export const Analysis = () => (
  <section id="analysis" className="bg-[#07101f] py-28">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Accessibility analytics
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Insights that help planners act faster.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Compare coverage across municipalities, surface resource gaps, and model what-if scenarios with transparent scores — not black-box outputs.
          </p>
          <Separator className="mt-8 max-w-16 bg-cyan-500/40" />
          <p className="mt-6 text-sm text-slate-500">
            Population: PSA 2020 Census of Population and Housing. Facility counts: DOH records
            in the source dataset. Map markers: OpenStreetMap.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {METRICS.map((m) => (
            <Card
              key={m.label}
              className="rounded-3xl bg-[#060c18] ring-white/8 transition hover:ring-cyan-500/20"
            >
              <CardContent>
                <p className="font-mono text-4xl font-semibold text-white">
                  {m.value}
                  <span className="text-xl text-slate-500">{m.unit}</span>
                </p>
                <p className="mt-3 text-sm text-slate-500">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </section>
);
