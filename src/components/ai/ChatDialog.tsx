"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ChatMessage from "./ChatMessage"
import { getCV } from "@/lib/cv"
import { CloseIcon, SendIcon } from "@/components/icons"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Props {
  open: boolean
  onClose: () => void
}

function buildSystemPrompt(): string {
  const cv = getCV()
  return `You are a helpful AI assistant helping visitors learn about Alex Chen's professional background. You have access to their full CV data below. Answer questions concisely and accurately based only on this information. If you don't know something, say so.

CV Data:
${JSON.stringify(cv, null, 2)}`
}

export default function ChatDialog({ open, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm an AI assistant here to help you learn about Alex Chen's background, skills, and experience. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt: buildSystemPrompt(),
        }),
      })

      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white dark:bg-white dark:text-neutral-900">
                  AI
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  Ask about Alex
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                    AI
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-none bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-neutral-200 p-4 dark:border-neutral-700">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about their experience..."
                  className="min-w-0 flex-1 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-neutral-500 focus:bg-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 dark:focus:border-neutral-400 dark:focus:bg-neutral-800"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex items-center justify-center rounded-xl bg-neutral-900 px-4 text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  <SendIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
