import { useScroll } from './hooks/useScroll';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Features } from './components/sections/Features';
import { Analysis } from './components/sections/Analysis';
import { CTA } from './components/sections/CTA';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/layout/Footer';

export default function App() {
  const isScrolled = useScroll();

  return (
    <div className="min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
      <Navbar scrolled={isScrolled} />

      <main className="w-full">
        <section className="relative min-h-screen px-4 pt-32 sm:px-6 lg:px-8">
          <Hero />
        </section>

        <section className="bg-slate-950 px-4 py-24 sm:px-6 lg:px-8">
          <Features />
        </section>

        <section className="bg-slate-900 px-4 py-24 sm:px-6 lg:px-8">
          <Analysis />
        </section>

        <section className="bg-slate-950 px-4 py-24 sm:px-6 lg:px-8">
          <CTA />
        </section>

        <section className="bg-slate-900 px-4 py-24 sm:px-6 lg:px-8">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
}
