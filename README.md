# Know Your Competitor

A beautiful, modern landing page for an AI-powered competitive analysis tool built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern dark theme with gradient accents
- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🔍 Interactive competitor analysis form
- 🎯 Beautiful UI components with shadcn/ui
- 🚀 Built with Next.js 14 and TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Font**: Inter (Google Fonts)

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # Reusable UI components
│   └── KnowYourCompetitorLanding.tsx  # Main landing page component
├── lib/
│   └── utils.ts           # Utility functions
└── ...config files
```

## Customization

### Colors & Theme

The project uses a custom dark theme with purple/fuchsia gradients. Colors can be customized in:

- `app/globals.css` - CSS custom properties
- `tailwind.config.js` - Tailwind theme extension

### Components

UI components are built with shadcn/ui and can be found in `components/ui/`. The main landing page component is in `components/KnowYourCompetitorLanding.tsx`.

## Deployment

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/know-your-competitor)

## License

MIT License - feel free to use this project for your own purposes.
