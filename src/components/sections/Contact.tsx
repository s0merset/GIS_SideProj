import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Contact = () => (
  <section id="contact" className="bg-[#07101f] py-28">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Get in touch
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Talk to our GIS planning team.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Share your coverage goals and we'll show you how to combine spatial data with facility planning to deliver measurable improvements in access.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Card className="rounded-2xl bg-[#060c18] ring-white/8">
            <CardHeader>
              <CardDescription className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Email
              </CardDescription>
              <CardTitle className="font-mono text-base text-white">
                hello@healthaccess.ai
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl bg-[#060c18] ring-white/8">
            <CardHeader>
              <CardDescription className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Office
              </CardDescription>
              <CardTitle className="font-mono text-base text-white">
                Manila, Philippines
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl bg-cyan-500/5 ring-cyan-500/15">
            <CardHeader>
              <CardDescription className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Speak with sales
              </CardDescription>
              <CardDescription className="text-sm text-slate-400">
                30-minute walkthrough, no commitment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Book a demo</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
);
