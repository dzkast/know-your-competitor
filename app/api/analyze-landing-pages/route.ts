import { type NextRequest, NextResponse } from "next/server"

interface CROAnalysis {
  mainHeadline: string
  hasPricing: boolean
  pricingStartsFrom: string
  hasDiscount: boolean
  hasFreeTrial: boolean
}

interface AnalysisResult {
  url: string
  analysis: CROAnalysis
  screenshot?: string
}

const NEXOS_API_KEY =
  "nexos-b9bb13a27fbb2efca753ab78df097c6c5e11cd5d40fc73fb4c0a9ddf987f26773cb1f6611fca93c681264aa5b70e6d7965a78a22a49f0ff4542812568b519c72"

// Helper function to generate screenshot URL
function getScreenshotUrl(url: string): string {
  // Using Microlink API as primary (free, no API key required)
  // Fallback to Thum.io if needed
  const encodedUrl = encodeURIComponent(url)
  
  // Primary: Microlink API - free screenshot service
  return `https://api.microlink.io/?url=${encodedUrl}&screenshot=true&meta=false&embed=screenshot.url`
  
  // Fallback option (Thum.io) - can be used as backup:
  // return `https://image.thum.io/get/width/1200/crop/800/noanimate/${url}`
}

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls)) {
      console.error("[CRO] Invalid request: URLs array is required")
      return NextResponse.json({ error: "URLs array is required" }, { status: 400 })
    }

    console.log("[CRO] Analyzing landing pages:", urls.length, urls)

    let modelId = ""
    try {
      const modelsResponse = await fetch("https://api.nexos.ai/v1/models", {
        headers: {
          Authorization: `Bearer ${NEXOS_API_KEY}`,
        },
      })

      if (modelsResponse.ok) {
        const modelsData = await modelsResponse.json()
        console.log("[CRO] Available models:", JSON.stringify(modelsData))

        // Try to find GPT-4 or GPT-3.5 model
        if (modelsData.data && Array.isArray(modelsData.data)) {
          const preferredModel =
            modelsData.data.find((m: any) => m.id?.includes("gpt-4")) ||
            modelsData.data.find((m: any) => m.id?.includes("gpt")) ||
            modelsData.data[0]

          if (preferredModel) {
            modelId = preferredModel.id
            console.log("[CRO] Using model:", modelId)
          }
        }
      } else {
        console.error("[CRO] Failed to fetch models. Status:", modelsResponse.status)
        const errorText = await modelsResponse.text()
        console.error("[CRO] Models API error:", errorText)
      }
    } catch (error) {
      console.error("[CRO] Error fetching models:", error)
    }

    if (!modelId) {
      console.error("[CRO] No valid model found")
      return NextResponse.json(
        { error: "No valid model found. Please check your Nexos AI API key and model access." },
        { status: 500 },
      )
    }

    // Fetch each URL content
    const pageContents = await Promise.all(
      urls.map(async (url: string) => {
        try {
          const response = await fetch(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
          })
          const html = await response.text()

          // Extract text content from HTML (simple approach)
          const textContent = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .substring(0, 12000) // Limit to first 12000 chars to capture more pricing info

          console.log("[CRO] Successfully fetched content from:", url, "Length:", textContent.length)
          return { url, content: textContent }
        } catch (error) {
          console.error("[CRO] Error fetching", url, error)
          return { url, content: "" }
        }
      }),
    )

    console.log("[CRO] Fetched", pageContents.length, "pages")

    // Analyze with LLM
    const analyses: AnalysisResult[] = await Promise.all(
      pageContents.map(async ({ url, content }) => {
        if (!content) {
          return {
            url,
            analysis: {
              mainHeadline: "Unable to fetch page",
              hasPricing: false,
              pricingStartsFrom: "N/A",
              hasDiscount: false,
              hasFreeTrial: false,
            },
            screenshot: getScreenshotUrl(url),
          }
        }

        try {
          const prompt = `You are analyzing a pricing or landing page. Extract the following information with EXTREME ACCURACY. Read the ENTIRE content carefully.

**TASK:**
1. **Main Headline**: Find the primary H1 or main marketing headline (not the page title)
2. **Has Pricing**: Are there ANY prices, pricing tiers, or cost information displayed? (true/false)
3. **Pricing Starts From**: Find the LOWEST/CHEAPEST **FINAL** price mentioned on the page. This could be:
   - Pay-as-you-go price (e.g., "$4/GB", "€9/month")
   - Lowest tier price
   - Starting price with "from", "starts at", "as low as"
   - Look for currency symbols: $, €, £, etc.
   - Include the unit (per GB, per month, per IP, etc.)
   - **CRITICAL**: If there's a strikethrough/crossed-out price (e.g., ~~$8~~), IGNORE IT completely
   - **ONLY use the final price AFTER discount** (e.g., if it shows "$8 $4/GB", use "$4/GB")
   - If multiple final prices exist, choose the LOWEST one
4. **Has Discount**: Look for ACTIVE discount indicators on the MAIN pricing:
   - TWO prices shown together (old price + new price), e.g., "$8 $4/GB"
   - Strikethrough/crossed-out prices (e.g., ~~$100~~ $50)
   - Percentage badges directly on pricing cards (e.g., "50% OFF" badge)
   - Promo codes that apply to the main plans
   - **IGNORE**: Yearly plan discounts, volume discounts, or conditional offers
   - **Return FALSE** if only regular monthly pricing tiers are shown
5. **Free Trial**: Is "free trial", "start free", "try free", or similar explicitly mentioned?

**CRITICAL INSTRUCTIONS:**
- The MAIN product/service of this page is usually in the H1 or page title
- Find pricing for THE MAIN PRODUCT ONLY (not related/other products)
- Look for pricing tables, pricing cards, or pricing sections
- Common patterns: "Starts from $X", "$X/GB", "$X/month", "$X per unit"

**IMPORTANT RULES:**
- **FREE TRIAL IS NOT A PRICE**: If you see "Free trial" or "$0", that's NOT the starting price
  * Look for the FIRST PAID PLAN after free trial
  * Example: "Free trial" then "Micro $49/month" → return "$49/month"
- **DISCOUNT DETECTION**: Only mark hasDiscount as TRUE if you see:
  * Percentage off badges (e.g., "50% OFF", "20% discount")
  * Promo codes or coupon banners
  * TWO prices shown together (e.g., "$8 $4")
  * Strikethrough prices (e.g., ~~$100~~)
  * If you ONLY see regular pricing tiers without discounts → hasDiscount = FALSE
- **PRICE EXTRACTION**: Use the LOWEST PAID PLAN price (skip free tier)
  * If page shows "$8 $4/GB" → return "$4/GB"
  * If page shows "~~$100~~ $50/month" → return "$50/month"
  * If page shows "$5 $2.50 / GB" → return "$2.50/GB"
  * If page shows "Free trial, then Micro $49/month" → return "$49/month"

**EXAMPLES:**
- Oxylabs: "Free trial (0), Micro ($49 + VAT)" → return "$49 + VAT/month", hasDiscount = FALSE
- Bright Data: "$8 $4/GB with 50% OFF" → return "$4/GB", hasDiscount = TRUE
- Be precise with currency ($, €, £) and unit (/GB, /month, /IP, per 1K results)
- DO NOT pick pricing from unrelated products or services

**Landing Page Content:**
${content}

**Respond with ONLY this JSON (no other text):**
{
  "mainHeadline": "exact headline text",
  "hasPricing": true/false,
  "pricingStartsFrom": "exact price with unit (e.g., $4/GB, €9/month) or N/A",
  "hasDiscount": true/false,
  "hasFreeTrial": true/false
}`

          const llmResponse = await fetch("https://api.nexos.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${NEXOS_API_KEY}`,
            },
            body: JSON.stringify({
              model: modelId, // Use UUID instead of name
              messages: [
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.3,
            }),
          })

          if (!llmResponse.ok) {
            const errorText = await llmResponse.text()
            console.error("[v0] LLM API error:", llmResponse.status, errorText)
            throw new Error(`LLM API error: ${errorText}`)
          }

          const llmData = await llmResponse.json()
          const analysisText = llmData.choices[0].message.content

          console.log("[CRO] LLM response for", url, ":", analysisText)

          // Parse JSON from response
          const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
          if (!jsonMatch) {
            throw new Error("No JSON found in LLM response")
          }

          const analysis: CROAnalysis = JSON.parse(jsonMatch[0])

          return { 
            url, 
            analysis,
            screenshot: getScreenshotUrl(url),
          }
        } catch (error) {
          console.error("[CRO] Error analyzing with LLM:", error)
          return {
            url,
            analysis: {
              mainHeadline: "Analysis failed",
              hasPricing: false,
              pricingStartsFrom: "N/A",
              hasDiscount: false,
              hasFreeTrial: false,
            },
            screenshot: getScreenshotUrl(url),
          }
        }
      }),
    )

    console.log("[CRO] Analysis complete for", analyses.length, "pages")

    return NextResponse.json({ analyses })
  } catch (error) {
    console.error("[CRO] Error in analyze-landing-pages:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to analyze landing pages"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

