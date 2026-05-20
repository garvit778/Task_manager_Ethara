import { motion } from "framer-motion";

export const AuthShell = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <div className="grid min-h-screen bg-[linear-gradient(135deg,#061826,#102332_45%,#f97316_180%)] p-4 text-white lg:grid-cols-[1.1fr_0.9fr]">
    <section className="hidden items-end rounded-lg bg-[url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center p-10 lg:flex">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
        <p className="mb-4 text-sm font-bold uppercase text-cyan-200">ProjectPilot SaaS</p>
        <h1 className="text-5xl font-black leading-tight">Bring every sprint, launch, and handoff into one polished workspace.</h1>
      </motion.div>
    </section>
    <section className="flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass w-full max-w-md rounded-lg p-8 text-foreground shadow-glow">
        <h2 className="text-3xl font-black">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </motion.div>
    </section>
  </div>
);
