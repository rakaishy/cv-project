## Project: cv-project — Interactive CV with AI Chat

### Tech Stack
- Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion
- Vercel AI SDK + `@ai-sdk/openai` (works with OpenAI, Ollama, and llama.cpp)
- html2canvas + jsPDF for PDF export (pixel-perfect, preserves all styles)

### Project Structure

```
cv-project/
├── data/cv.json                         # CV content (edit this)
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout, fonts, metadata
│   │   ├── page.tsx                     # Main page composing all CV sections
│   │   ├── globals.css                  # Tailwind base + @media print styles
│   │   └── api/chat/route.ts            # AI provider-agnostic chat endpoint
│   ├── components/
│   │   ├── icons/                       # Self-contained SVG icon components
│   │   │   ├── index.ts                 # Barrel exports
│   │   │   ├── MailIcon.tsx             # Envelope
│   │   │   ├── PhoneIcon.tsx            # Phone
│   │   │   ├── LocationIcon.tsx         # Map pin
│   │   │   ├── GitHubIcon.tsx           # GitHub logo
│   │   │   ├── LinkedInIcon.tsx         # LinkedIn logo
│   │   │   ├── PrinterIcon.tsx          # Save as PDF button
│   │   │   ├── ExternalLinkIcon.tsx     # External link (project cards)
│   │   │   ├── ChatIcon.tsx             # Chat bubble (FAB)
│   │   │   ├── CloseIcon.tsx            # X close (chat dialog)
│   │   │   └── SendIcon.tsx             # Send arrow (chat dialog)
│   │   ├── cv/
│   │   │   ├── Header.tsx              # Name, title, contact links, Save as PDF btn
│   │   │   ├── Summary.tsx             # Professional summary
│   │   │   ├── Experience.tsx          # Timeline with highlights + tech tags
│   │   │   ├── Education.tsx           # Degree details
│   │   │   ├── Skills.tsx              # Grouped by category, color-coded by level
│   │   │   └── Projects.tsx            # Project cards with links + highlights
│   │   └── ai/
│   │       ├── ChatButton.tsx          # Floating FAB (fixed bottom-right)
│   │       ├── ChatDialog.tsx          # Slide-in panel with message history
│   │       └── ChatMessage.tsx         # Single message bubble
│   ├── lib/
│   │   ├── cv.ts                       # Loads cv.json
│   │   └── pdf.ts                      # html2canvas + jsPDF multi-page export
│   └── types/
│       └── cv.ts                       # TypeScript interfaces (Contact, Experience, etc.)
├── .env.example                         # AI_BASE_URL, AI_API_KEY, AI_MODEL
├── AGENTS.md
└── README.md
```

### Current State (all completed)
- [x] Project scaffolded, dependencies installed
- [x] CV types (`src/types/cv.ts`) and sample data (`data/cv.json`)
- [x] All 6 CV section components (Header, Summary, Experience, Education, Skills, Projects)
- [x] Scroll-triggered Framer Motion animations on all sections
- [x] AI Chat: ChatButton → ChatDialog → ChatMessage + `/api/chat` route
- [x] Multi-provider AI support (OpenAI / Ollama / llama.cpp via env vars)
- [x] PDF export via html2canvas + jsPDF (A4, 15mm margins, light mode forced, multi-page)
- [x] Dark mode: system-preference default + manual toggle (persisted to localStorage)
- [x] Responsive layout (mobile → desktop)
- [x] Icons extracted to `src/components/icons/` (separate files per icon)
- [x] Tailwind colors overridden with hex values (compatible with PDF rendering)
- [x] PDF button loading indicator (spinner + "Exporting…" while generating)
- [x] PDF uses `onclone` to fix SVG alignment (`currentColor` → computed color, explicit 16x16 dimensions, `inline-block` + `vertical-align: middle`)
- [x] PDF uses `onclone` to center pill text (`display: flex; align-items: center` on rounded-md/rounded-full spans with py-0.5)
- [x] PDF excludes `.no-print` elements via `onclone` CSS + JS
- [x] `xmlns` added to all 13 SVG icon components (required for html2canvas serialization)
- [x] `leading-none` added to pill spans in Experience, Projects, Skills for consistent line-height
- [x] Contact text wrapped in `<span>` in Header for reliable DOM targeting in `onclone`
- [x] Font loading wait (`document.fonts.ready`) before canvas capture for consistent metrics
- [x] Build passes cleanly

### Build command
```bash
npm run build
```

### Dev command
```bash
npm run dev
```

### Environment setup (choose one)
```env
# OpenAI (default)
AI_MODEL=gpt-4o-mini
AI_API_KEY=sk-...

# Ollama (local)
AI_BASE_URL=http://localhost:11434/v1
AI_MODEL=llama3.2

# llama.cpp (local)
AI_BASE_URL=http://localhost:8080/v1
AI_MODEL=llama-3.2-3b-instruct
```

### Common next tasks if resuming
1. Replace `data/cv.json` with your real CV content
2. Tweak styles in components (colors, spacing, fonts)
3. Deploy to Vercel (add env vars in project settings)
5. Add more features: i18n, blog, print CSS refinements

### GitHub
- Remote: `git@github.com:rakaishy/cv-project.git`
- Default branch: `main`
- Private repository

### Notes for agents
- The main page (`src/app/page.tsx`) wraps all sections in `<div id="cv-content">`
- The ChatButton is wrapped in `<div className="no-print">` so it's hidden during PDF export
- The `/api/chat` route is dynamic (server-rendered on demand); all other routes are static
- `data/cv.json` is imported directly in `src/lib/cv.ts` — no async fetching
- PDF uses html2canvas to capture `#cv-content` as a canvas, splits it across A4 pages (15mm margins), and always renders in light mode for a professional look
- Icons are React components in `src/components/icons/` — each file returns JSX SVG, accepts `className` prop, uses `currentColor` for dark mode support
- All Tailwind colors in `@theme inline` use hex values (not oklch) to avoid html2canvas compatibility issues
- **PDF alignment fix (`src/lib/pdf.ts:onclone`)**: html2canvas 1.4.1 has poor flexbox + SVG support. The `onclone` callback patches the cloned DOM before rendering: (1) replaces `currentColor` with computed parent color on all SVGs, (2) sets explicit 16x16, `inline-block`, `vertical-align: middle` on SVGs, (3) applies `align-items: center` on `.inline-flex.items-center` containers, (4) sets `display: flex; align-items: center` on pill spans (`rounded-md`/`rounded-full` + `py-0.5`). Also waits for `document.fonts.ready` + 200ms before capture.
- **`.no-print` exclusion**: Elements with `no-print` class are hidden from PDF via both `onclone` CSS and JS. The PDF button and ThemeToggle in Header use this. ChatButton already has it.
- **SVG `xmlns`**: All 13 icon components include `xmlns="http://www.w3.org/2000/svg"` — required for html2canvas DOM serialization. Missing xmlns causes SVGs to render at wrong sizes or not at all.
- **Pill `leading-none`**: Technology tags (Experience, Projects) and level badges (Skills) use `leading-none` to normalize line-height across html2canvas's font fallback rendering.
