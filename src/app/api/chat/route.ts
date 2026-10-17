import { NextRequest } from "next/server"
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"
import { getCV } from "@/lib/cv"

const MAX_MESSAGES = 40
const MAX_CONTENT_LENGTH = 2000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_TRACK_MAX = 1000

// Simple in-memory per-IP rate limiter (resets per server instance).
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  if (hits.size > RATE_LIMIT_TRACK_MAX) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(key)
    }
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  const limited = recent.length >= RATE_LIMIT_MAX
  if (!limited) recent.push(now)
  hits.set(ip, recent)
  return limited
}

function buildSystemPrompt(): string {
  const cv = getCV()
  return `You are a helpful AI assistant helping visitors learn about ${cv.name}'s professional background. You have access to their full CV data below. Answer questions concisely and accurately based only on this information. If you don't know something, say so.

CV Data:
${JSON.stringify(cv, null, 2)}`
}

interface SanitizedMessage {
  role: "user" | "assistant"
  content: string
}

function sanitizeMessages(raw: unknown): SanitizedMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null

  const messages: SanitizedMessage[] = []
  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null
    const { role, content } = item as { role?: unknown; content?: unknown }
    if (role !== "user" && role !== "assistant") return null
    if (typeof content !== "string" || !content.trim() || content.length > MAX_CONTENT_LENGTH) return null
    messages.push({ role, content })
  }
  return messages
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const messages = sanitizeMessages((body as { messages?: unknown })?.messages)
  if (!messages) {
    return Response.json(
      { error: `Invalid "messages": expected 1-${MAX_MESSAGES} messages with a role of "user" or "assistant".` },
      { status: 400 },
    )
  }

  const baseURL = process.env.AI_BASE_URL || "https://api.openai.com/v1"
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY
  const modelName = process.env.AI_MODEL || "gpt-4o-mini"

  if (!apiKey) {
    console.error("AI provider is not configured: set AI_API_KEY or OPENAI_API_KEY.")
    return Response.json({ error: "AI provider is not configured." }, { status: 503 })
  }

  try {
    const provider = createOpenAI({ baseURL, apiKey })

    const { text } = await generateText({
      model: provider(modelName),
      system: buildSystemPrompt(),
      messages,
    })

    return Response.json({ content: text })
  } catch (err) {
    console.error("AI provider request failed:", err)
    return Response.json({ error: "The AI provider request failed. Please try again." }, { status: 502 })
  }
}
