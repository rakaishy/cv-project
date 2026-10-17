# CV Project — Interactive Resume with AI Chat

A modern, interactive CV/resume website built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**. Features an AI chat assistant that answers questions about the candidate's background, and a PDF export with the same styling.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | React framework with SSR and static generation |
| **TypeScript** | Type safety across the entire codebase |
| **Tailwind CSS v4** | Utility-first styling with dark mode support |
| **Framer Motion** | Scroll-triggered animations and micro-interactions |
| **Vercel AI SDK** | Provider-agnostic chat completions (OpenAI, Ollama, llama.cpp) |
| **html2canvas + jsPDF** | Client-side PDF generation matching page styles |

## Features

- **Clean, minimal CV layout** — responsive, accessible, dark mode ready
- **AI Chat Assistant** — floating chat widget answers visitor questions using the CV data as context
- **PDF Export** — one-click download preserving the page's typography, colors, and layout
- **Structured CV Data** — all content lives in `data/cv.json`, cleanly separated from UI logic
- **Scroll Animations** — sections fade and slide into view as you scroll
- **Dark Mode** — follows the system preference, with a manual toggle that persists
- **Hardened chat endpoint** — server-side prompt, request validation, and per-IP rate limiting; the API key never reaches the browser

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

Edit `data/cv.json` with your personal information, experience, skills, and projects. The TypeScript
types in `src/types/cv.ts` define the expected shape.

- Dates use `"YYYY-MM"` (for example `"2011-01"`) and are rendered as `Jan 2011`. Use `null` for the
  current role so it shows as **Present**.
- `education` and `projects` are **optional** — if you omit them (or leave them empty), the
  Education and Projects sections are hidden automatically.

## Project Structure

```
cv-project/
├── data/
│   └── cv.json                  # Your CV data (edit this!)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with fonts, metadata, theme script
│   │   ├── page.tsx             # Main page composing all CV sections
│   │   ├── globals.css          # Tailwind base + custom theme
│   │   └── api/chat/
│   │       └── route.ts         # Provider-agnostic, rate-limited chat endpoint
│   ├── components/
│   │   ├── cv/
│   │   │   ├── Header.tsx       # Name, title, contact, theme + PDF buttons
│   │   │   ├── Summary.tsx      # Professional summary
│   │   │   ├── Experience.tsx   # Work history timeline
│   │   │   ├── Education.tsx    # Degrees (hidden when cv.education is absent)
│   │   │   ├── Skills.tsx       # Categorized skill tags with levels
│   │   │   └── Projects.tsx     # Featured projects (hidden when cv.projects is absent)
│   │   ├── ai/
│   │   │   ├── ChatButton.tsx   # Floating action button
│   │   │   ├── ChatDialog.tsx   # Slide-in chat panel
│   │   │   └── ChatMessage.tsx  # Message bubble component
│   │   ├── icons/               # Self-contained SVG icon components
│   │   └── ui/
│   │       └── ThemeToggle.tsx  # Dark mode toggle
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

### GitHub Pages (static)

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which builds a static export and
publishes it to **https://rakaishy.github.io/cv-project/**.

Two one-time repository settings are required:

1. **Settings → General → Danger Zone → Change visibility → Public** — GitHub Pages on a private
   repository requires a paid plan; on the free plan the repo must be public.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions** — without this the deploy step
   fails with *"Get Pages site failed"*.

After changing those, re-run the workflow (Actions tab → *Deploy CV to GitHub Pages* → Re-run), or push
a new commit.

The static build runs with:

| Variable | Value | Why |
|---|---|---|
| `STATIC_EXPORT` | `true` | Emits `out/` instead of a server build |
| `NEXT_PUBLIC_CHAT_ENABLED` | `false` | Pages can't run `/api/chat`, so the chat UI is not rendered |
| `NEXT_PUBLIC_BASE_PATH` | `/<repo>` | Project sites are served from a subpath; without this every `_next/*` asset 404s |

To preview the published build locally:

```bash
STATIC_EXPORT=true NEXT_PUBLIC_CHAT_ENABLED=false NEXT_PUBLIC_BASE_PATH=/cv-project npm run build
npx serve out   # open http://localhost:3000/cv-project
```

The AI chat only runs where server code can execute (`npm run dev`, or a host like Vercel). It is
deliberately absent from the Pages build.

### Vercel (full app, chat included)

The repo is also ready for Vercel with zero configuration, which is the way to keep the chat online:

```bash
npx vercel
```

Add the AI provider variables (`AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`) in the Vercel project settings.

## License

MIT
