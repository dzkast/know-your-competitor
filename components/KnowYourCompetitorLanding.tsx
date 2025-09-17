"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Gauge, Globe, DollarSign, Users, BellRing, ChartBarIncreasing, Sparkles, Lightbulb, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Utility: simple container
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1100px] px-4 md:px-6 ${className}`}>{children}</div>
  );
}

// Reusable gradient blob
function Blob({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full opacity-40 blur-3xl will-change-transform ${className}`}
      aria-hidden
    />
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const features = [
  { icon: Gauge, title: "Performance Analytics", desc: "Track site speed, uptime, engagement metrics, and benchmark vs. peers." },
  { icon: Globe, title: "SEO Intelligence", desc: "Discover top keywords, backlinks, and SERP movements by page." },
  { icon: DollarSign, title: "Pricing Analysis", desc: "Compare pricing models, discounting, and revenue levers." },
  { icon: Users, title: "Audience Insights", desc: "Uncover segments, interests, and behavior to sharpen targeting." },
  { icon: ChartBarIncreasing, title: "Real-time Monitoring", desc: "Get alerts on content, traffic spikes, and tech changes." },
  { icon: Lightbulb, title: "Competitive Advantage", desc: "Map positioning, messaging, and differentiators that win." },
  { icon: BellRing, title: "Historical Tracking", desc: "Audit archives and see what changed, when, and why." },
  { icon: Sparkles, title: "Action Recommendations", desc: "AI tips with clear next steps to outperform competitors." },
];

const mockStats = [
  { label: "Monthly Visits", your: "128k", comp: "186k" },
  { label: "Conversion Rate", your: "3.2%", comp: "2.8%" },
  { label: "Avg. Session", your: "5:21", comp: "5:05" },
  { label: "Engagement", your: "62%", comp: "58%" },
];

export default function KnowYourCompetitorLanding() {
  const [yourUrl, setYourUrl] = useState("");
  const [compUrl, setCompUrl] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const handleAnalyze = (e?: React.FormEvent) => {
    e?.preventDefault();
    setShowDialog(true);
    // Simulate calculation, replace with real API later
    setTimeout(() => {
      setShowDialog(false);
      // navigate or show results
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0c0b10] text-white">
      {/* Global subtle noise & vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(124,58,237,0.20),transparent_60%),radial-gradient(40%_40%_at_90%_0%,rgba(168,85,247,0.20),transparent_60%),radial-gradient(50%_50%_at_0%_100%,rgba(59,130,246,0.20),transparent_60%)]" />

      {/* HERO */}
      <section className="relative isolate pt-24 md:pt-28 pb-20">
        <Blob className="-top-20 left-1/3 h-64 w-64 bg-fuchsia-600/30" />
        <Blob className="top-40 -left-10 h-72 w-72 bg-indigo-600/30" />
        <Blob className="top-10 right-0 h-80 w-80 bg-purple-700/30" />

        <Container className="text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500"><Sparkles size={14} /></span>
            AI‑Powered Competitor Analysis
          </motion.div>

          <motion.h1
            className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.06 }}
          >
            <span className="block text-white">Know Your</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400">Competitor</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-white/70"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.12 }}
          >
            Instantly analyze any website's strategy, pricing, and performance. Get actionable insights to outsmart your competition in minutes, not months.
          </motion.p>

          {/* Search bar */}
          <motion.form
            onSubmit={handleAnalyze}
            className="mx-auto mt-8 flex w-full max-w-4xl flex-col items-stretch gap-3 rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur sm:flex-row sm:items-center"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.18 }}
          >
            {/* Your URL */}
            <div className="relative flex-1 rounded-2xl border border-white/10 bg-[#0f0e14]/60 p-2">
              <span className="pointer-events-none absolute -top-2 left-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/60">Your URL</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 opacity-60" size={18} />
              <Input
                className="h-11 w-full border-0 bg-transparent pl-10 pr-3 text-sm placeholder:text-white/40 focus-visible:ring-0"
                placeholder="e.g., acme.co"
                value={yourUrl}
                onChange={(e) => setYourUrl(e.target.value)}
              />
            </div>

            {/* VS divider */}
            <div className="relative mx-auto flex items-center justify-center sm:mx-2">
              <div className="hidden h-10 w-px bg-white/10 sm:block" />
              <span className="mx-3 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-white/70">vs</span>
              <div className="hidden h-10 w-px bg-white/10 sm:block" />
            </div>

            {/* Competitor URL */}
            <div className="relative flex-1 rounded-2xl border border-white/10 bg-[#0f0e14]/60 p-2">
              <span className="pointer-events-none absolute -top-2 left-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/60">Competitor URL</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 opacity-60" size={18} />
              <Input
                className="h-11 w-full border-0 bg-transparent pl-10 pr-3 text-sm placeholder:text-white/40 focus-visible:ring-0"
                placeholder="e.g., competitor.com"
                value={compUrl}
                onChange={(e) => setCompUrl(e.target.value)}
              />
            </div>

            <Button type="submit" className="h-11 shrink-0 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 text-sm shadow-lg shadow-fuchsia-500/20 hover:opacity-90">
              Analyze Now
            </Button>
          </motion.form>

          {/* Loading dialog */}
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="border-white/10 bg-[#0f0e14]/95 text-white backdrop-blur">
              <DialogHeader>
                <DialogTitle className="text-white">Calculating results</DialogTitle>
                <DialogDescription className="text-white/60">
                  {yourUrl && compUrl ? (
                    <span>
                      Analyzing <span className="text-white/80">{yourUrl}</span> vs {" "}
                      <span className="text-white/80">{compUrl}</span>…
                    </span>
                  ) : (
                    <span>Preparing analysis…</span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 flex items-center gap-3">
                <Loader2 className="animate-spin" />
                <div className="text-sm text-white/70">This may take a few moments.</div>
              </div>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-2 w-1/3 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500" />
              </div>

              <style jsx>{`
                @keyframes loading {
                  0% { transform: translateX(-100%); }
                  50% { transform: translateX(50%); }
                  100% { transform: translateX(120%); }
                }
              `}</style>
            </DialogContent>
          </Dialog>

          {/* Social proof */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.24 }}
            className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60"
          >
            <div className="inline-flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1">4.9/5 from 2,800+ reviews</span>
            </div>
            <span className="hidden h-3 w-px bg-white/10 md:inline-block" />
            <div>2,847 businesses analyzed this week</div>
            <span className="hidden h-3 w-px bg-white/10 md:inline-block" />
            <div>Free analysis · No credit card required · Get results in 30 seconds</div>
          </motion.div>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="relative py-16 md:py-20">
        <Container>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-xl font-semibold text-white/90 md:text-2xl">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">win the market</span></h2>
            <p className="mt-3 text-sm text-white/60">Our AI‑powered platform gives you comprehensive insights into your competitors' strategies, helping you make data‑driven decisions that drive growth.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, idx) => (
              <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} transition={{ delay: idx * 0.04 }}>
                <Card className="h-full border-white/10 bg-white/5 backdrop-blur hover:border-white/20">
                  <CardHeader className="pb-2">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600/40 to-indigo-600/40">
                      <f.icon size={18} />
                    </div>
                    <CardTitle className="text-base text-white">{f.title}</CardTitle>
                    <CardDescription className="text-white/60">{f.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="relative py-16 md:py-20">
        <Container>
          <div className="mx-auto mb-10 max-w-xl text-center">
            <h3 className="text-xl font-semibold text-white/90 md:text-2xl">See the <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">full picture</span></h3>
            <p className="mt-3 text-sm text-white/60">Get comprehensive competitor analysis in a realtime dashboard. Compare metrics, track changes, and discover opportunities at a glance.</p>
          </div>

          <Card className="border-white/10 bg-[#0f0e14]">
            <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-white">Competitor Analysis</CardTitle>
                <CardDescription className="text-white/60">acme.co vs competitor.ai</CardDescription>
              </div>
              <div className="text-xs text-white/50">Updated 3m ago</div>
            </CardHeader>
            <CardContent>
              {/* Top grid: your site vs competition */}
              <div className="grid gap-4 md:grid-cols-2">
                {["Your Website", "Competition"].map((side, idx) => (
                  <div key={side} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm font-medium text-white/90">{side}</div>
                      <div className="text-[10px] text-white/50">Tracking</div>
                    </div>
                    <div className="space-y-3">
                      {mockStats.map((s) => (
                        <div key={`${side}-${s.label}`}>
                          <div className="mb-1 flex items-center justify-between text-xs text-white/60">
                            <span>{s.label}</span>
                            <span className="font-medium text-white/80">{idx === 0 ? s.your : s.comp}</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500`}
                              style={{ width: idx === 0 ? (s.label === "Monthly Visits" ? "72%" : s.label === "Conversion Rate" ? "68%" : s.label === "Avg. Session" ? "64%" : "62%") : (s.label === "Monthly Visits" ? "90%" : s.label === "Conversion Rate" ? "58%" : s.label === "Avg. Session" ? "60%" : "58%") }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom insights */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 text-sm font-semibold text-white">Key Insights & Recommendations</div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
                    <li>Capture high‑intent keywords your rival doesn't rank for.</li>
                    <li>Improve LCP on top 5 landing pages to lift conversions.</li>
                    <li>Test value‑based pricing on your Pro tier to improve ARPU.</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 text-sm font-semibold text-white">Areas to Watch</div>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-white/70">
                    <li>They're scaling a new affiliate network; monitor backlinks.</li>
                    <li>New pricing A/B likely aimed at SMB; expect promo pushes.</li>
                    <li>More feature bundles debuted in their last release.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <Blob className="left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-fuchsia-600/30" />
        <Container>
          <div className="relative mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 text-center shadow-2xl shadow-fuchsia-500/10">
            <h3 className="text-2xl font-bold text-white md:text-3xl">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">dominate</span> your market?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
              Join thousands using <span className="font-semibold text-white">Know Your Competitor</span> to gain the edge. Start free and get your first analysis in seconds.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button className="h-11 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 text-sm shadow-lg shadow-fuchsia-500/20 hover:opacity-90">Start Free Analysis</Button>
              <Button variant="secondary" className="h-11 rounded-xl border-white/15 bg-white/10 px-5 text-sm text-white hover:bg-white/15">Book a Demo</Button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-white/50">
              <span>No credit card</span>
              <span className="h-3 w-px bg-white/10" />
              <span>Cancel anytime</span>
              <span className="h-3 w-px bg-white/10" />
              <span>Secure signup</span>
            </div>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center text-xs text-white/50">
        <Container>
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <div className="order-2 md:order-1">© {new Date().getFullYear()} Know Your Competitor</div>
            <div className="order-1 md:order-2 inline-flex items-center gap-3">
              <a className="hover:text-white" href="#">Privacy</a>
              <span className="h-3 w-px bg-white/10" />
              <a className="hover:text-white" href="#">Terms</a>
              <span className="h-3 w-px bg-white/10" />
              <a className="hover:text-white" href="#">Support</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
