import { NextRequest } from "next/server"
import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  const { messages, systemPrompt } = await req.json()

  const baseURL = process.env.AI_BASE_URL || "https://api.openai.com/v1"
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY
  const modelName = process.env.AI_MODEL || "gpt-4o-mini"

  const provider = createOpenAI({
    ...(baseURL && { baseURL }),
    ...(apiKey && { apiKey }),
  })

  const { text } = await generateText({
    model: provider(modelName),
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  })

  return Response.json({ content: text })
}
