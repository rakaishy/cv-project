"use client"

import { motion } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Props {
  message: Message
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
          AI
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  )
}
