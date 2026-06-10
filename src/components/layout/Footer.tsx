export const Footer = () => (
  <footer className="border-t border-slate-800 bg-slate-950 py-12">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">HealthAccess GIS</p>
        <p className="mt-3 text-sm text-slate-500">Data sources: DOH, PSA. Spatial analytics for better healthcare coverage.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#analysis" className="hover:text-white transition-colors">Analysis</a>
        <a href="#contact" className="hover:text-white transition-colors">Contact</a>
      </div>

      <p className="text-sm text-slate-500">© 2024 HealthAccess GIS</p>
    </div>
  </footer>
);