"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";

interface PageSpeedMetrics {
  url: string;
  performance: {
    score: number;
    metrics: {
      firstContentfulPaint: number;
      largestContentfulPaint: number;
      speedIndex: number;
      totalBlockingTime: number;
      cumulativeLayoutShift: number;
    };
  };
  accessibility: {
    score: number;
  };
  bestPractices: {
    score: number;
  };
  seo: {
    score: number;
  };
}

interface AnalysisResult {
  yourSite: PageSpeedMetrics | null;
  competitorSite: PageSpeedMetrics | null;
  comparison: {
    performanceWinner: 'yours' | 'competitor' | 'tie';
    insights: string[];
  };
}

interface AnalysisResultsProps {
  results: AnalysisResult;
  onBack: () => void;
}

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-4 md:px-6 ${className}`}>{children}</div>
  );
}

function MetricCard({ title, value, unit = "", good = true }: { title: string; value: number; unit?: string; good?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="text-xs text-white/60 mb-1">{title}</div>
      <div className={`text-lg font-semibold ${good ? 'text-green-400' : 'text-orange-400'}`}>
        {value.toFixed(value < 10 ? 2 : 0)}{unit}
      </div>
    </div>
  );
}

function ScoreCard({ title, score, icon: Icon }: { title: string; score: number; icon: any }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'from-green-500/20 to-green-600/20';
    if (score >= 50) return 'from-orange-500/20 to-orange-600/20';
    return 'from-red-500/20 to-red-600/20';
  };

  return (
    <div className={`rounded-xl border border-white/10 bg-gradient-to-br ${getScoreBackground(score)} p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-white/60" />
        <span className="text-sm text-white/60">{title}</span>
      </div>
      <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
        {score}
      </div>
    </div>
  );
}

export default function AnalysisResults({ results, onBack }: AnalysisResultsProps) {
  const { yourSite, competitorSite, comparison } = results;

  const formatTime = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.round(ms)}ms`;
  };

  const formatUrl = (url: string) => {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0c0b10] text-white">
      {/* Header */}
      <section className="relative pt-8 pb-8 border-b border-white/10">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Analysis
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Performance Analysis Results</h1>
                <p className="text-sm text-white/60">Powered by Google PageSpeed Insights</p>
              </div>
            </div>
            
            {comparison.performanceWinner !== 'tie' && (
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <Trophy size={16} className="text-yellow-400" />
                <span className="text-sm">
                  {comparison.performanceWinner === 'yours' ? 'Your site wins!' : 'Competitor wins'}
                </span>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Results Grid */}
      <section className="py-8">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Your Site */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-white/10 bg-[#0f0e14]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        Your Website
                        {comparison.performanceWinner === 'yours' && (
                          <Trophy size={16} className="text-yellow-400" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-white/60 flex items-center gap-2">
                        {formatUrl(yourSite?.url || '')}
                        <ExternalLink size={12} />
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {yourSite ? (
                    <div className="space-y-4">
                      {/* Main Scores */}
                      <div className="grid grid-cols-2 gap-3">
                        <ScoreCard title="Performance" score={yourSite.performance.score} icon={CheckCircle} />
                        <ScoreCard title="SEO" score={yourSite.seo.score} icon={CheckCircle} />
                        <ScoreCard title="Accessibility" score={yourSite.accessibility.score} icon={CheckCircle} />
                        <ScoreCard title="Best Practices" score={yourSite.bestPractices.score} icon={CheckCircle} />
                      </div>

                      {/* Core Web Vitals */}
                      <div>
                        <h4 className="text-sm font-medium text-white mb-3">Core Web Vitals</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <MetricCard 
                            title="First Contentful Paint" 
                            value={yourSite.performance.metrics.firstContentfulPaint}
                            unit="ms"
                            good={yourSite.performance.metrics.firstContentfulPaint < 2000}
                          />
                          <MetricCard 
                            title="Largest Contentful Paint" 
                            value={yourSite.performance.metrics.largestContentfulPaint}
                            unit="ms"
                            good={yourSite.performance.metrics.largestContentfulPaint < 2500}
                          />
                          <MetricCard 
                            title="Total Blocking Time" 
                            value={yourSite.performance.metrics.totalBlockingTime}
                            unit="ms"
                            good={yourSite.performance.metrics.totalBlockingTime < 300}
                          />
                          <MetricCard 
                            title="Cumulative Layout Shift" 
                            value={yourSite.performance.metrics.cumulativeLayoutShift}
                            good={yourSite.performance.metrics.cumulativeLayoutShift < 0.1}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertTriangle className="mx-auto mb-2 text-orange-400" size={24} />
                      <p className="text-white/60">Could not analyze this website</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Competitor Site */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-white/10 bg-[#0f0e14]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        Competitor
                        {comparison.performanceWinner === 'competitor' && (
                          <Trophy size={16} className="text-yellow-400" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-white/60 flex items-center gap-2">
                        {formatUrl(competitorSite?.url || '')}
                        <ExternalLink size={12} />
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {competitorSite ? (
                    <div className="space-y-4">
                      {/* Main Scores */}
                      <div className="grid grid-cols-2 gap-3">
                        <ScoreCard title="Performance" score={competitorSite.performance.score} icon={CheckCircle} />
                        <ScoreCard title="SEO" score={competitorSite.seo.score} icon={CheckCircle} />
                        <ScoreCard title="Accessibility" score={competitorSite.accessibility.score} icon={CheckCircle} />
                        <ScoreCard title="Best Practices" score={competitorSite.bestPractices.score} icon={CheckCircle} />
                      </div>

                      {/* Core Web Vitals */}
                      <div>
                        <h4 className="text-sm font-medium text-white mb-3">Core Web Vitals</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <MetricCard 
                            title="First Contentful Paint" 
                            value={competitorSite.performance.metrics.firstContentfulPaint}
                            unit="ms"
                            good={competitorSite.performance.metrics.firstContentfulPaint < 2000}
                          />
                          <MetricCard 
                            title="Largest Contentful Paint" 
                            value={competitorSite.performance.metrics.largestContentfulPaint}
                            unit="ms"
                            good={competitorSite.performance.metrics.largestContentfulPaint < 2500}
                          />
                          <MetricCard 
                            title="Total Blocking Time" 
                            value={competitorSite.performance.metrics.totalBlockingTime}
                            unit="ms"
                            good={competitorSite.performance.metrics.totalBlockingTime < 300}
                          />
                          <MetricCard 
                            title="Cumulative Layout Shift" 
                            value={competitorSite.performance.metrics.cumulativeLayoutShift}
                            good={competitorSite.performance.metrics.cumulativeLayoutShift < 0.1}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertTriangle className="mx-auto mb-2 text-orange-400" size={24} />
                      <p className="text-white/60">Could not analyze this website</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Card className="border-white/10 bg-[#0f0e14]">
              <CardHeader>
                <CardTitle className="text-white">Key Insights & Recommendations</CardTitle>
                <CardDescription className="text-white/60">
                  AI-powered analysis of your performance vs. competition
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {comparison.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="text-sm text-white/80">{insight}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
