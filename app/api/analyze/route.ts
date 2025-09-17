import { NextRequest, NextResponse } from 'next/server';

// Types for PageSpeed Insights API response
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

async function analyzeWebsite(url: string): Promise<PageSpeedMetrics | null> {
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    // Google PageSpeed Insights API (free tier)
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO&strategy=MOBILE`;
    
    console.log(`Analyzing: ${url}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`PageSpeed API error: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    
    // Extract key metrics from the response
    const lighthouseResult = data.lighthouseResult;
    const categories = lighthouseResult.categories;
    const audits = lighthouseResult.audits;

    return {
      url: url,
      performance: {
        score: Math.round(categories.performance.score * 100),
        metrics: {
          firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
          largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
          speedIndex: audits['speed-index']?.numericValue || 0,
          totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
          cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
        },
      },
      accessibility: {
        score: Math.round(categories.accessibility.score * 100),
      },
      bestPractices: {
        score: Math.round(categories['best-practices'].score * 100),
      },
      seo: {
        score: Math.round(categories.seo.score * 100),
      },
    };
  } catch (error) {
    console.error('Error analyzing website:', error);
    return null;
  }
}

function generateInsights(yourSite: PageSpeedMetrics | null, competitorSite: PageSpeedMetrics | null): string[] {
  const insights: string[] = [];

  if (!yourSite || !competitorSite) {
    if (!yourSite) insights.push("Could not analyze your website. Please check the URL.");
    if (!competitorSite) insights.push("Could not analyze competitor website. Please check the URL.");
    return insights;
  }

  const yourPerf = yourSite.performance.score;
  const compPerf = competitorSite.performance.score;

  // Performance comparison
  if (yourPerf > compPerf) {
    insights.push(`🚀 Your site outperforms the competitor by ${yourPerf - compPerf} points in performance!`);
  } else if (compPerf > yourPerf) {
    insights.push(`⚠️ Competitor's site is ${compPerf - yourPerf} points ahead in performance. Focus on speed optimization.`);
  } else {
    insights.push("📊 Both sites have similar performance scores.");
  }

  // Specific metric insights
  const yourLCP = yourSite.performance.metrics.largestContentfulPaint;
  const compLCP = competitorSite.performance.metrics.largestContentfulPaint;
  
  if (yourLCP > compLCP * 1.2) {
    insights.push("🎯 Optimize your Largest Contentful Paint - competitor loads main content 20% faster.");
  }

  // SEO comparison
  if (yourSite.seo.score < competitorSite.seo.score) {
    insights.push(`🔍 Improve SEO basics - competitor scores ${competitorSite.seo.score - yourSite.seo.score} points higher.`);
  }

  // Accessibility comparison
  if (yourSite.accessibility.score < competitorSite.accessibility.score) {
    insights.push(`♿ Enhance accessibility - competitor is ${competitorSite.accessibility.score - yourSite.accessibility.score} points ahead.`);
  }

  return insights;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { yourUrl, competitorUrl } = body;

    if (!yourUrl || !competitorUrl) {
      return NextResponse.json(
        { error: 'Both URLs are required' },
        { status: 400 }
      );
    }

    console.log('Starting analysis for:', { yourUrl, competitorUrl });

    // Analyze both websites in parallel
    const [yourSiteData, competitorSiteData] = await Promise.all([
      analyzeWebsite(yourUrl),
      analyzeWebsite(competitorUrl),
    ]);

    // Determine performance winner
    let performanceWinner: 'yours' | 'competitor' | 'tie' = 'tie';
    if (yourSiteData && competitorSiteData) {
      const yourScore = yourSiteData.performance.score;
      const compScore = competitorSiteData.performance.score;
      
      if (yourScore > compScore) performanceWinner = 'yours';
      else if (compScore > yourScore) performanceWinner = 'competitor';
    }

    const insights = generateInsights(yourSiteData, competitorSiteData);

    const result: AnalysisResult = {
      yourSite: yourSiteData,
      competitorSite: competitorSiteData,
      comparison: {
        performanceWinner,
        insights,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze websites' },
      { status: 500 }
    );
  }
}
