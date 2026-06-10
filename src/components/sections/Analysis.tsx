export const Analysis = () => (
  <section id="analysis" className="py-24">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">Accessibility analytics</p>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Insights that help planners act faster.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Compare coverage across communities, spot resource gaps, and prioritize new service locations using transparent accessibility scores and interactive what-if scenarios.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { value: '92', label: 'Coverage score' },
            { value: '18', label: 'Avg. travel minutes' },
            { value: '4.8', label: 'Facility readiness' },
            { value: '80%', label: 'At-risk zone visibility' },
          ].map((item) => (
            <div key={item.label} className="rounded-[2rem] border border-slate-800 bg-slate-900/75 p-6">
              <p className="text-4xl font-semibold text-white">{item.value}</p>
              <p className="mt-3 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);