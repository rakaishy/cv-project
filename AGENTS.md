## Project: cv-project — Interactive CV with AI Chat

### Tech Stack
- Next.js 16.2 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Framer Motion 12
- Vercel AI SDK v6 + `@ai-sdk/openai` v3 (works with OpenAI, Ollama, and llama.cpp)
- html2canvas 1.4.1 + jsPDF for PDF export (pixel-perfect, preserves all styles)

### Project Structure

```
cv-project/
├── data/cv.json                         # CV content (edit this)
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout, fonts, metadata, inline theme script
│   │   ├── page.tsx                     # Main page composing all CV sections
│   │   ├── globals.css                  # Tailwind base + @media print styles
│   │   └── api/chat/route.ts            # AI provider-agnostic chat endpoint (dynamic)
│   ├── components/
│   │   ├── icons/                       # Self-contained SVG icon components (12 total)
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
│   │   │   ├── SendIcon.tsx             # Send arrow (chat dialog)
│   │   │   ├── SunIcon.tsx              # Light mode (ThemeToggle)
│   │   │   └── MoonIcon.tsx             # Dark mode (ThemeToggle)
│   │   ├── ui/
│   │   │   └── ThemeToggle.tsx          # Dark mode toggle (hidden from PDF via no-print)
│   │   ├── cv/
│   │   │   ├── Header.tsx              # Name, title, contact links, Save as PDF + ThemeToggle
│   │   │   ├── Summary.tsx             # Professional summary
│   │   │   ├── Experience.tsx          # Timeline with highlights + tech tags
│   │   │   ├── Education.tsx           # Degree details (renders only if cv.education has entries)
│   │   │   ├── Skills.tsx              # Grouped by category, color-coded by level
│   │   │   └── Projects.tsx            # Project cards with links (renders only if cv.projects has entries)
│   │   └── ai/
│   │       ├── ChatButton.tsx          # Floating FAB (fixed bottom-right)
│   │       ├── ChatDialog.tsx          # Slide-in panel with message history
│   │       └── ChatMessage.tsx         # Single message bubble
│   ├── lib/
│   │   ├── cv.ts                       # Loads cv.json, exposes getCV()
│   │   └── pdf.ts                      # html2canvas + jsPDF multi-page export
│   └── types/
│       └── cv.ts                       # TypeScript interfaces (Contact, Experience, etc.)
├── AGENTS.md
└── README.md
```

### Current State (all completed)
- [x] Project scaffolded, dependencies installed
- [x] CV types (`src/types/cv.ts`) and real CV content (`data/cv.json`)
- [x] All 6 CV section components (Header, Summary, Experience, Education, Skills, Projects)
- [x] `education` and `projects` are optional in `CV`; Education/Projects early-return `null` when absent or empty
- [x] Scroll-triggered Framer Motion animations on all sections
- [x] AI Chat: ChatButton → ChatDialog → ChatMessage + `/api/chat` route
- [x] Chat copy derives the candidate's name from `getCV()` (no hardcoded names)
- [x] `/api/chat` hardening: request validation, message count/length caps, per-IP rate limiting, server-side system prompt, JSON error responses (400/429/502/503)
- [x] Multi-provider AI support (OpenAI / Ollama / llama.cpp via env vars)
- [x] PDF export via html2canvas + jsPDF (A4, 15mm margins, light mode forced, multi-page)
- [x] Dark mode: system-preference default + manual toggle (persisted to localStorage)
- [x] Responsive layout (mobile → desktop)
- [x] Icons extracted to `src/components/icons/` (separate files per icon)
- [x] Tailwind colors overridden with hex values (compatible with PDF rendering)
- [x] PDF button loading indicator (spinner + "Exporting…" while generating)
- [x] PDF uses `onclone` to fix SVG alignment (`currentColor` → computed color, explicit box from `getBoundingClientRect`, `inline-block` + `vertical-align: middle`)
- [x] PDF gives pill spans their natural line height in `onclone` so tag text keeps symmetric padding
- [x] PDF page breaks snap to content-free rows, so text lines and tags are never sliced in half
- [x] PDF excludes `.no-print` elements via `onclone` CSS + JS
- [x] `xmlns` added to all 12 SVG icon components (required for html2canvas serialization)
- [x] `leading-none` added to pill spans in Experience, Projects, Skills for on-screen line-height (the PDF clone replaces it with `normal`)
- [x] Contact text wrapped in `<span>` in Header for reliable DOM targeting in `onclone`
- [x] Font loading wait (`document.fonts.ready`) before canvas capture for consistent metrics
- [x] `npm run lint` clean and `npm run build` passes

### Build command
```bash
npm run build
```

### Dev command
```bash
npm run dev
```

### Lint command
```bash
npm run lint
```

### Environment setup
Create `.env.local` (git-ignored) with one of the following. The chat route reads these at request time
and returns `503` when no API key is present:

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

> Note: `.env.example` is referenced by the README but is **not** committed (`.gitignore` ignores `.env*`).

### Common next tasks if resuming
1. Proofread `data/cv.json` — the pre-2020 role month boundaries (Jan/Jul splits) were estimated from
   year-only information, and the older tech tags/highlights were inferred
2. Tweak styles in components (colors, spacing, fonts)
3. Deploy to Vercel (add env vars in project settings)
4. Re-add Education / Projects content when available (the data model already supports both)
5. Add more features: i18n, blog, print CSS refinements

### GitHub
- Remote: `git@github.com:rakaishy/cv-project.git`
- Default branch: `main`
- Private repository
- Git identity is configured **repo-locally** (`rakaishy <alexhander2002@gmail.com>`), not globally

### Notes for agents
- The main page (`src/app/page.tsx`) wraps all sections in `<div id="cv-content">`
- The ChatButton is wrapped in `<div className="no-print">` so it's hidden during PDF export
- The `/api/chat` route is dynamic (server-rendered on demand); all other routes are static
- `data/cv.json` is imported directly in `src/lib/cv.ts` — no async fetching
- Dates in `data/cv.json` are `"YYYY-MM"` strings; `Experience.formatDate` renders them as `Mon YYYY`,
  and `endDate: null` renders as "Present"
- **Chat endpoint contract** (`src/app/api/chat/route.ts`): the client sends only `{ messages }`.
  The system prompt is built **server-side** from `getCV()` — never hardcode the candidate's name in
  UI copy; read it from `getCV()` instead. Limits: max 40 messages, 2000 chars per message, and a
  per-IP rate limit of 10 requests/minute (in-memory `Map`, so it is per server instance and resets on
  redeploy). Errors are returned as JSON `{ error }` with 400 (bad body), 429 (rate limit),
  502 (provider failure) or 503 (no API key), and `ChatDialog` surfaces that `error` text to the visitor
- PDF uses html2canvas to capture `#cv-content` as a canvas, then slices it across A4 pages (15mm margins),
  and always renders in light mode; `pdf.ts` removes the `dark` class and restores it afterwards.
  Page breaks are **content-aware**: before cutting, `findBreakRow` scans the captured pixels upwards
  from the ideal page end for a row with no content (`rgb <= 246` counts as content — the page
  background is `#fafafa`/250 and tag backgrounds are `#f5f5f5`/245), so text lines and tags are never
  sliced. If the page has no empty row (the Experience timeline border is continuous) it falls back to
  the least-inked row. Search back stops at 60% of a page so unbreakable blocks cannot waste a page.
  The inner loop `break`s when a 2D context cannot be obtained (guards against an infinite loop)
- Icons are React components in `src/components/icons/` — each file returns JSX SVG, accepts `className`,
  and uses `currentColor` for dark mode support
- `ThemeToggle` reads the `dark` class from `<html>` via `useSyncExternalStore` + `MutationObserver`
  (no `setState` in an effect — this keeps the `react-hooks/set-state-in-effect` rule happy). The toggle
  button itself is `.no-print`, so the temporary class removal during PDF export is invisible
- All Tailwind colors in `@theme inline` use hex values (not oklch) to avoid html2canvas compatibility issues
- **PDF alignment fix (`src/lib/pdf.ts:onclone`)**: html2canvas 1.4.1 has poor flexbox + SVG support. The
  `onclone` callback patches the cloned DOM before rendering: (1) replaces `currentColor` with the SVG's
  own computed color, (2) pins each SVG to its `getBoundingClientRect` box with `inline-block` +
  `vertical-align: middle`, (3) applies `align-items: center` on `.inline-flex.items-center` containers,
  (4) sets `line-height: normal` on pill spans (`rounded-md`/`rounded-full` + `py-0.5`).
  Also waits for `document.fonts.ready` + 200ms before capture
- **Why pills need `line-height: normal`**: html2canvas positions glyphs at `Range.getClientRects()`
  line-box top + font ascent, while browsers apply half-leading. With `leading-none` the line box (~1em)
  is shorter than the glyph box (~1.2em), so the browser lifts the baseline but html2canvas does not —
  the PDF text sits ~1px too low and eats the tag's bottom padding. The clone therefore uses the font's
  natural line height, which makes both agree and restores symmetric padding
- **`@media print` in `globals.css` is for browser printing only** (Ctrl+P), not for the Save-as-PDF
  button: html2canvas renders the clone in screen media. It forces `font-size: 10pt`, makes tag/card
  backgrounds transparent and disables rounded corners, and adds `break-inside: avoid` rules
- **`.no-print` exclusion**: Elements with `no-print` class are hidden from PDF via both `onclone` CSS
  and JS. The PDF button and ThemeToggle in Header use this. ChatButton already has it
- **SVG `xmlns`**: All 12 icon components include `xmlns="http://www.w3.org/2000/svg"` — required for
  html2canvas DOM serialization. Missing xmlns causes SVGs to render at wrong sizes or not at all
- **Pill `leading-none`**: Technology tags (Experience, Projects) and level badges (Skills) use
  `leading-none` to normalize line-height across html2canvas's font fallback rendering
