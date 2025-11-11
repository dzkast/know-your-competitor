"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, CheckCircle2, XCircle, DollarSign, Gift, Clock, Sparkles, Plus, Trash2, Globe, ExternalLink, Maximize2, Lightbulb, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CROAnalysis {
  mainHeadline: string;
  hasPricing: boolean;
  pricingStartsFrom: string;
  hasDiscount: boolean;
  hasFreeTrial: boolean;
}

interface AnalysisResult {
  url: string;
  analysis: CROAnalysis;
  screenshot?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// Helper function to extract domain name from URL
function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

// Helper function to parse price for comparison
function parsePrice(priceStr: string): number | null {
  const match = priceStr.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

// Helper function to generate comparison insights
function generateInsights(results: AnalysisResult[]) {
  if (results.length < 2) return null;

  const insights: { type: 'advantage' | 'disadvantage' | 'recommendation'; text: string }[] = [];

  // Extract domain names for clearer comparison
  const domains = results.map(r => getDomain(r.url));

  // Analyze pricing transparency
  const withPricing = results.filter(r => r.analysis.hasPricing);
  const withoutPricing = results.filter(r => !r.analysis.hasPricing);
  
  if (withoutPricing.length > 0 && withPricing.length > 0) {
    const noPricingDomains = withoutPricing.map(r => getDomain(r.url)).join(', ');
    const hasPricingDomains = withPricing.map(r => getDomain(r.url)).join(', ');
    
    insights.push({
      type: withPricing[0].url === results[0].url ? 'advantage' : 'recommendation',
      text: `${noPricingDomains} ${withoutPricing.length > 1 ? 'don\'t' : 'doesn\'t'} show pricing upfront, while ${hasPricingDomains} ${withPricing.length > 1 ? 'do' : 'does'}. Transparent pricing builds trust and can increase conversions by up to 20%.`
    });
  }

  // Compare pricing values
  if (withPricing.length >= 2) {
    const prices = withPricing.map(r => ({
      domain: getDomain(r.url),
      price: r.analysis.pricingStartsFrom,
      numPrice: parsePrice(r.analysis.pricingStartsFrom)
    })).filter(p => p.numPrice !== null);

    if (prices.length >= 2) {
      const sorted = [...prices].sort((a, b) => (a.numPrice || 0) - (b.numPrice || 0));
      const lowest = sorted[0];
      const highest = sorted[sorted.length - 1];
      
      if (lowest.numPrice && highest.numPrice && lowest.numPrice < highest.numPrice) {
        const priceDiff = ((highest.numPrice - lowest.numPrice) / lowest.numPrice * 100).toFixed(0);
        insights.push({
          type: lowest.domain === domains[0] ? 'advantage' : 'disadvantage',
          text: `${lowest.domain} offers the lowest starting price at ${lowest.price}, while ${highest.domain} starts at ${highest.price} (${priceDiff}% higher). ${lowest.domain === domains[0] ? 'Your competitive pricing is a strong advantage!' : `Consider adjusting your pricing strategy or emphasizing additional value to justify the price difference.`}`
        });
      }
    }
  }

  // Analyze discounts with domain names
  const withDiscount = results.filter(r => r.analysis.hasDiscount);
  const withoutDiscount = results.filter(r => !r.analysis.hasDiscount);
  
  if (withDiscount.length > 0) {
    const discountDomains = withDiscount.map(r => getDomain(r.url)).join(', ');
    const noDiscountDomains = withoutDiscount.map(r => getDomain(r.url)).join(', ');
    
    if (withoutDiscount.length > 0) {
      insights.push({
        type: withDiscount.some(r => r.url === results[0].url) ? 'advantage' : 'disadvantage',
        text: `${discountDomains} ${withDiscount.length > 1 ? 'are' : 'is'} running active promotions${noDiscountDomains ? `, while ${noDiscountDomains} ${withoutDiscount.length > 1 ? 'are' : 'is'} not` : ''}. ${withDiscount.some(r => r.url === results[0].url) ? 'Your promotional strategy is working to create urgency!' : 'Limited-time offers can increase conversion rates by 15-30%. Consider adding a discount or promotional offer.'}`
      });
    }
  }

  // Analyze free trials with domain names
  const withFreeTrial = results.filter(r => r.analysis.hasFreeTrial);
  const withoutFreeTrial = results.filter(r => !r.analysis.hasFreeTrial);
  
  if (withFreeTrial.length > 0 && withoutFreeTrial.length > 0) {
    const trialDomains = withFreeTrial.map(r => getDomain(r.url)).join(', ');
    const noTrialDomains = withoutFreeTrial.map(r => getDomain(r.url)).join(', ');
    
    insights.push({
      type: withFreeTrial.some(r => r.url === results[0].url) ? 'advantage' : 'recommendation',
      text: `${trialDomains} ${withFreeTrial.length > 1 ? 'offer' : 'offers'} free trials, while ${noTrialDomains} ${withoutFreeTrial.length > 1 ? 'don\'t' : 'doesn\'t'}. ${withFreeTrial.some(r => r.url === results[0].url) ? 'Your free trial reduces purchase friction and builds trust - keep it!' : 'Free trials can reduce purchase anxiety and increase qualified sign-ups by 25-40%. Strongly consider adding one.'}`
    });
  }

  // Comprehensive competitive advantage analysis
  if (results.length === 2) {
    const first = results[0];
    const second = results[1];
    const firstDomain = getDomain(first.url);
    const secondDomain = getDomain(second.url);
    
    const firstAdvantages = [];
    const secondAdvantages = [];
    
    if (first.analysis.hasPricing && !second.analysis.hasPricing) firstAdvantages.push('transparent pricing');
    if (!first.analysis.hasPricing && second.analysis.hasPricing) secondAdvantages.push('transparent pricing');
    
    if (first.analysis.hasDiscount && !second.analysis.hasDiscount) firstAdvantages.push('active promotions');
    if (!first.analysis.hasDiscount && second.analysis.hasDiscount) secondAdvantages.push('active promotions');
    
    if (first.analysis.hasFreeTrial && !second.analysis.hasFreeTrial) firstAdvantages.push('free trial');
    if (!first.analysis.hasFreeTrial && second.analysis.hasFreeTrial) secondAdvantages.push('free trial');
    
    if (firstAdvantages.length > 0 || secondAdvantages.length > 0) {
      insights.push({
        type: 'recommendation',
        text: `Competitive positioning: ${firstAdvantages.length > 0 ? `${firstDomain} leads with ${firstAdvantages.join(', ')}` : ''}${firstAdvantages.length > 0 && secondAdvantages.length > 0 ? '; ' : ''}${secondAdvantages.length > 0 ? `${secondDomain} leads with ${secondAdvantages.join(', ')}` : ''}. Focus on strengthening your weaknesses while maintaining your advantages.`
      });
    }
  }

  return insights;
}

export default function CROAnalyzer() {
  const [urls, setUrls] = useState<string[]>([""]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedScreenshot, setExpandedScreenshot] = useState<{ url: string; screenshot: string } | null>(null);

  const addUrlField = () => {
    setUrls([...urls, ""]);
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
    }
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validUrls = urls.filter(url => url.trim() !== "");
    
    if (validUrls.length === 0) {
      setError("Please enter at least one URL");
      return;
    }

    // Validate URLs
    const urlPattern = /^https?:\/\/.+/;
    const invalidUrls = validUrls.filter(url => !urlPattern.test(url));
    if (invalidUrls.length > 0) {
      setError("Please enter valid URLs starting with http:// or https://");
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setResults([]);

    try {
      console.log('Sending request to analyze:', validUrls);
      
      const response = await fetch('/api/analyze-landing-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: validUrls }),
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze landing pages');
      }

      if (data.analyses && Array.isArray(data.analyses)) {
        setResults(data.analyses);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setUrls([""]);
    setResults([]);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0c0b10] text-white">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(60%_60%_at_50%_10%,rgba(124,58,237,0.15),transparent_60%),radial-gradient(50%_50%_at_0%_100%,rgba(59,130,246,0.15),transparent_60%)]" style={{ willChange: 'auto' }} />

      {/* Header */}
      <section className="relative pt-24 pb-12">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <motion.div 
            variants={fadeUp} 
            initial="hidden" 
            animate="show" 
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 mb-6">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500">
                <Sparkles size={14} />
              </span>
              AI-Powered Pricing Analysis
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl mb-4">
              <span className="block text-white">Competitor</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-400">
                Pricing Analyzer
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm md:text-base text-white/70">
              Compare pricing strategies across competitors: analyze pricing models, discounts, promotions, and value propositions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Analysis Form */}
      <section className="relative pb-12">
        <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
          >
            <Card className="border-white/10 bg-white/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Enter Pricing Page URLs</CardTitle>
                <CardDescription className="text-white/60">
                  Add one or more URLs to compare pricing strategies and models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnalyze} className="space-y-4">
                  {/* URL inputs */}
                  <div className="space-y-3">
                    {urls.map((url, index) => (
                      <div key={index} className="space-y-1">
                        <label className="text-xs text-white/60 pl-1">
                          {index === 0 ? 'Enter your domain' : `Enter competitor ${index} domain`}
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-60 text-white" size={18} />
                            <Input
                              className="h-11 w-full border-white/10 bg-[#0f0e14]/60 pl-10 pr-3 text-sm text-white placeholder:text-white/40 focus:text-white"
                              placeholder="https://example.com"
                              value={url}
                              onChange={(e) => updateUrl(index, e.target.value)}
                            />
                          </div>
                          {urls.length > 1 && (
                            <Button
                              type="button"
                              variant="secondary"
                              className="h-11 w-11 border-white/10 bg-white/5 p-0 hover:bg-white/10"
                              onClick={() => removeUrlField(index)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add URL button */}
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full border-white/10 bg-white/5 hover:bg-white/10"
                    onClick={addUrlField}
                  >
                    <Plus size={18} className="mr-2" />
                    Add Another URL
                  </Button>

                  {/* Error message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 p-3"
                    >
                      <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                  )}

                  {/* Submit button */}
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isAnalyzing}
                      className="flex-1 h-11 bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:opacity-90"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={18} />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2" size={18} />
                          Analyze Pages
                        </>
                      )}
                    </Button>
                    {results.length > 0 && (
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-11 border-white/10 bg-white/5 hover:bg-white/10"
                        onClick={resetAnalysis}
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      {results.length > 0 && (
        <section className="relative pb-20">
          <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-white mb-2">Analysis Results</h2>
              <p className="text-sm text-white/60">
                Found {results.length} page{results.length !== 1 ? 's' : ''} analyzed
              </p>
            </motion.div>

            {/* Comparison Insights & Recommendations */}
            {results.length >= 2 && (() => {
              const insights = generateInsights(results);
              return insights && insights.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <Card className="border-white/10 bg-white/5 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Lightbulb size={20} className="text-fuchsia-400" />
                        Pricing Insights & Recommendations
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        Based on comparison of {results.length} pricing pages
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {insights.map((insight, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4 hover:border-white/20 transition-colors"
                        >
                          <div className="shrink-0 mt-0.5">
                            {insight.type === 'advantage' ? (
                              <CheckCircle2 size={18} className="text-green-400" />
                            ) : insight.type === 'disadvantage' ? (
                              <AlertCircle size={18} className="text-orange-400" />
                            ) : (
                              <TrendingUp size={18} className="text-fuchsia-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed text-white">{insight.text}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : null;
            })()}

            <div className="grid gap-6 md:grid-cols-2">
              {results.map((result, index) => (
                <motion.div
                  key={result.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-white/10 bg-white/5 backdrop-blur hover:border-white/20 transition-colors overflow-hidden">
                    {/* Landing Page Preview or Placeholder */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-fuchsia-950/20 via-purple-950/20 to-indigo-950/20 overflow-hidden border-b border-white/10 group">
                      {result.screenshot ? (
                        <>
                          <img
                            src={result.screenshot}
                            alt={`Preview of ${result.url}`}
                            className="w-full h-full object-cover object-top transition-transform duration-500 cursor-pointer"
                            onClick={() => setExpandedScreenshot({ url: result.url, screenshot: result.screenshot! })}
                            onError={(e) => {
                              const target = e.currentTarget;
                              // Fallback to Thum.io if Microlink fails
                              if (!target.src.includes('thum.io')) {
                                target.src = `https://image.thum.io/get/width/1200/crop/800/noanimate/${result.url}`;
                              } else {
                                target.style.display = 'none';
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c0b10]/90"></div>
                          
                          {/* Action buttons overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              className="bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20"
                              onClick={() => setExpandedScreenshot({ url: result.url, screenshot: result.screenshot! })}
                            >
                              <Maximize2 size={14} className="mr-1" />
                              Expand
                            </Button>
                            <Button
                              size="sm"
                              className="bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20"
                              onClick={() => window.open(result.url, '_blank')}
                            >
                              <ExternalLink size={14} className="mr-1" />
                              Open Site
                            </Button>
                          </div>
                          
                          <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/10 backdrop-blur px-2 py-1 text-[10px] text-white/70">
                            <Globe size={10} />
                            Live Preview
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <Globe size={40} className="mx-auto mb-2 text-white/30" />
                            <div className="text-xs text-white/50">Pricing Page Analysis</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-white text-base break-all">
                        {result.url}
                      </CardTitle>
                      <CardDescription className="text-white/80 font-medium mt-2">
                        {result.analysis.mainHeadline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Pricing Info */}
                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-gradient-to-br from-fuchsia-600/40 to-indigo-600/40 p-2">
                            <DollarSign size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white mb-1">Pricing starts from</div>
                            {result.analysis.hasPricing ? (
                              <div>
                                <div className="text-sm font-semibold text-white/90 mb-1">
                                  {result.analysis.pricingStartsFrom}
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 size={14} className="text-green-400" />
                                  <span className="text-xs text-white/60">Pricing available</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <XCircle size={16} className="text-white/40" />
                                <span className="text-xs text-white/60">No pricing displayed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Discount */}
                        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Gift size={16} className={result.analysis.hasDiscount ? "text-green-400" : "text-white/40"} />
                            <span className="text-xs font-medium text-white/80">Discount</span>
                          </div>
                          <div className="text-xs text-white/60">
                            {result.analysis.hasDiscount ? "Active offer" : "No discount"}
                          </div>
                        </div>

                        {/* Free Trial */}
                        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock size={16} className={result.analysis.hasFreeTrial ? "text-green-400" : "text-white/40"} />
                            <span className="text-xs font-medium text-white/80">Free Trial</span>
                          </div>
                          <div className="text-xs text-white/60">
                            {result.analysis.hasFreeTrial ? "Available" : "Not offered"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <section className="relative pb-20">
          <div className="mx-auto w-full max-w-[1100px] px-4 md:px-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur">
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <Loader2 className="animate-spin text-fuchsia-400 mb-4" size={40} />
                  <h3 className="text-lg font-semibold text-white mb-2">Analyzing Pricing Strategies</h3>
                  <p className="text-sm text-white/60 max-w-md">
                    Using AI to extract pricing models, discounts, promotions, and competitive positioning...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Expanded Screenshot Modal */}
      <Dialog open={!!expandedScreenshot} onOpenChange={() => setExpandedScreenshot(null)}>
        <DialogContent className="max-w-5xl border-white/10 bg-[#0f0e14]/95 text-white backdrop-blur">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              <span className="break-all pr-4">{expandedScreenshot?.url}</span>
              <Button
                size="sm"
                variant="secondary"
                className="border-white/15 bg-white/10 hover:bg-white/15 text-white shrink-0"
                onClick={() => window.open(expandedScreenshot?.url, '_blank')}
              >
                <ExternalLink size={14} className="mr-1" />
                Open Live Site
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {expandedScreenshot?.screenshot && (
              <div className="relative rounded-lg overflow-hidden border border-white/10">
                <img
                  src={expandedScreenshot.screenshot}
                  alt={`Expanded preview of ${expandedScreenshot.url}`}
                  className="w-full h-auto"
                  onError={(e) => {
                    const target = e.currentTarget;
                    // Fallback to Thum.io if Microlink fails
                    if (!target.src.includes('thum.io')) {
                      target.src = `https://image.thum.io/get/width/1400/crop/1000/noanimate/${expandedScreenshot.url}`;
                    }
                  }}
                />
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-3 py-1.5 text-xs text-white">
                  <Globe size={12} />
                  Screenshot Preview
                </div>
              </div>
            )}
            <p className="text-xs text-white/50 mt-3 text-center">
              This is a static screenshot. Click "Open Live Site" to interact with the actual page.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

