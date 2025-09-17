# How to Get Real Google PageSpeed Insights Data

Currently, the app uses mock data because we've hit the Google API quota limit. To get **real Lighthouse performance data**, follow these steps:

## 🔑 **Get Your Google API Key (5 minutes)**

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account
3. Create a new project (or use existing)

### Step 2: Enable PageSpeed Insights API
1. Go to **APIs & Services** → **Library**
2. Search for "PageSpeed Insights API"
3. Click on it and press **"Enable"**

### Step 3: Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **"API Key"**
3. Copy the generated API key
4. (Optional) Click **"Restrict Key"** and limit it to PageSpeed Insights API only

### Step 4: Add to Your Project
1. In your project, create/edit `.env.local`:
```bash
GOOGLE_PAGESPEED_API_KEY=your_api_key_here
USE_MOCK_DATA=false
```

2. Restart your dev server:
```bash
npm run dev
```

## 📊 **API Quota Limits**

- **Free tier**: 25,000 requests per day
- **With API key**: Higher quotas available
- **Cost**: Usually free for reasonable usage

## 🎯 **What You'll Get**

Real data from Google Lighthouse:
- ✅ **Actual performance scores** (not estimates)
- ✅ **Real Core Web Vitals** (FCP, LCP, TBT, CLS)
- ✅ **Current SEO & Accessibility** scores
- ✅ **Live website analysis** (not cached mock data)

## 🚨 **Without API Key**

The app will continue using intelligent mock data based on:
- Real performance profiles of major websites
- Industry-typical performance patterns
- Realistic but not live data

## 🔧 **Alternative: Use Different Quota**

If you don't want to set up an API key, the quotas reset daily. Try again tomorrow for a few free requests.

---

**Questions?** The app works great with mock data for demos, but real API data gives you actual competitive intelligence!
