import { useState } from 'react';
import { Button } from '../ui/Button';
import { Shield, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Navbar = ({ scrolled }: { scrolled: boolean }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "shadow-xl shadow-slate-950/40 py-3" : "py-6"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6",
          scrolled ? "bg-slate-950/90 backdrop-blur-md border-b border-white/10" : "bg-slate-950/70 backdrop-blur-xl border border-white/10"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20">
            <Shield className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">HealthAccess</p>
            <p className="text-xs text-slate-400">Spatial healthcare intelligence</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">
            Features
          </a>
          <a href="#analysis" className="text-sm text-slate-300 hover:text-white transition-colors">
            Solutions
          </a>
          <a href="#contact" className="text-sm text-slate-300 hover:text-white transition-colors">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" className="font-medium">
            Get Started
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-slate-200 transition hover:bg-slate-900 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 px-4 pb-4 pt-3 backdrop-blur-xl">
          <div className="flex flex-col gap-3">
            <a href="#features" className="rounded-2xl px-4 py-3 text-sm text-slate-200 hover:bg-slate-900">
              Features
            </a>
            <a href="#analysis" className="rounded-2xl px-4 py-3 text-sm text-slate-200 hover:bg-slate-900">
              Solutions
            </a>
            <a href="#contact" className="rounded-2xl px-4 py-3 text-sm text-slate-200 hover:bg-slate-900">
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
