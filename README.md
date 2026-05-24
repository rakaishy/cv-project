# CV Project — Interactive Resume with AI Chat

A modern, interactive CV/resume website built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Features an AI chat assistant that answers questions about the candidate's background, and a PDF export with the same styling.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | React framework with SSR and static generation |
| **TypeScript** | Type safety across the entire codebase |
| **Tailwind CSS v4** | Utility-first styling with dark mode support |
| **Framer Motion** | Scroll-triggered animations and micro-interactions |
| **Vercel AI SDK** | Provider-agnostic AI streaming (OpenAI, Ollama, llama.cpp) |
| **html2canvas + jsPDF** | Client-side PDF generation matching page styles |

## Features

- **Clean, minimal CV layout** — responsive, accessible, dark mode ready
- **AI Chat Assistant** — floating chat widget answers visitor questions using the CV data as context
- **PDF Export** — one-click download preserving the page's typography, colors, and layout
- **Structured CV Data** — all content lives in `data/cv.json`, cleanly separated from UI logic
- **Scroll Animations** — sections fade and slide into view as you scroll

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example env file:

```bash
cp .env.example .env.local
```

The AI chat supports **three providers**. Configure one in `.env.local`:

**OpenAI (default):**
```
AI_MODEL=gpt-4o-mini
AI_API_KEY=sk-your-key-here
```

**Ollama (local):**
```
AI_BASE_URL=http://localhost:11434/v1
AI_MODEL=llama3.2
```

**llama.cpp (local):**
```
AI_BASE_URL=http://localhost:8080/v1
AI_MODEL=llama-3.2-3b-instruct
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### 4. Customize with your own CV

Edit `data/cv.json` with your personal information, experience, skills, and projects. The TypeScript types in `src/types/cv.ts` define the expected shape.

## Project Structure

```
cv-project/
├── data/
│   └── cv.json                  # Your CV data (edit this!)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with fonts and metadata
│   │   ├── page.tsx             # Main page composing all CV sections
│   │   ├── globals.css          # Tailwind base + custom theme
│   │   └── api/chat/
│   │       └── route.ts         # Server endpoint proxying OpenAI
│   ├── components/
│   │   ├── cv/
│   │   │   ├── Header.tsx       # Name, title, contact, PDF button
│   │   │   ├── Summary.tsx      # Professional summary
│   │   │   ├── Experience.tsx   # Work history timeline
│   │   │   ├── Education.tsx    # Degrees and certifications
│   │   │   ├── Skills.tsx       # Categorized skill tags with levels
│   │   │   └── Projects.tsx     # Featured project cards
│   │   └── ai/
│   │       ├── ChatButton.tsx   # Floating action button
│   │       ├── ChatDialog.tsx   # Slide-in chat panel
│   │       └── ChatMessage.tsx  # Message bubble component
│   ├── lib/
│   │   ├── cv.ts                # CV data loader
│   │   └── pdf.ts               # PDF generation utility
│   └── types/
│       └── cv.ts                # TypeScript interfaces
├── .env.example
└── package.json
```

## Build

```bash
npm run build
```

## Deploy

This project is ready to deploy on **Vercel** with zero configuration:

```bash
npx vercel
```

Don't forget to add the required environment variables (`AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`) in your Vercel project settings.

## License

MIT
