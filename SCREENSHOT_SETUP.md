# Screenshot Preview Setup Guide

The CRO Analyzer can display landing page previews, but this requires a screenshot API service.

## Current Status
- ✅ CRO Analysis (headlines, pricing, discounts) - **Working**
- ⚠️ Screenshot Previews - **Disabled** (shows placeholder instead)

## Why Screenshots are Disabled

Most screenshot services require:
1. API key / authentication
2. Paid subscription for commercial use
3. Rate limiting on free tiers

## How to Enable Screenshot Previews

### Option 1: Free Screenshot Services

**ScreenshotOne** (Free tier available)
1. Sign up at https://screenshotone.com
2. Get your API access key
3. Update `app/api/analyze-landing-pages/route.ts`:

```typescript
function getScreenshotUrl(url: string): string | undefined {
  const API_KEY = "your_screenshotone_api_key"
  const encodedUrl = encodeURIComponent(url)
  return `https://api.screenshotone.com/take?access_key=${API_KEY}&url=${encodedUrl}&viewport_width=1200&viewport_height=800&format=jpg`
}
```

**ScreenshotAPI.net**
- Free tier: 100 screenshots/month
- Sign up: https://screenshotapi.net
- Similar setup as above

### Option 2: Self-Hosted with Puppeteer

Create a serverless function using Puppeteer:

```typescript
// api/screenshot/route.ts
import puppeteer from 'puppeteer'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  const screenshot = await page.screenshot({ 
    type: 'jpeg',
    fullPage: false,
    clip: { x: 0, y: 0, width: 1200, height: 800 }
  })
  await browser.close()
  
  return new Response(screenshot, {
    headers: { 'Content-Type': 'image/jpeg' }
  })
}
```

### Option 3: Other Services

- **Urlbox** - https://urlbox.io (paid)
- **ApiFlash** - https://apiflash.com (paid)
- **Microlink** - https://microlink.io (free tier)
- **Shot.so** - https://shot.so (free tier)

## Current Design

Without screenshots, the app shows:
- ✅ Beautiful gradient placeholder
- ✅ Globe icon
- ✅ "Landing Page Analysis" text
- ✅ All CRO data still works perfectly

The app looks professional even without screenshots!

## Recommendation

For development and testing, the current placeholder design works great. For production with many users, consider:
1. **ScreenshotOne** - Best free tier (100 screenshots/day)
2. **Self-hosted Puppeteer** - Full control, but requires server resources
3. **Make it optional** - Let users paste their own screenshots

The CRO analysis is the main feature - screenshots are a nice visual bonus!

