"use client"

import { useState } from "react"
import ChatDialog from "./ChatDialog"
import { ChatIcon } from "@/components/icons"

export default function ChatButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-all hover:scale-105 hover:bg-neutral-800 active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        aria-label="Open AI Chat"
      >
        <ChatIcon className="h-6 w-6" />
      </button>
      <ChatDialog open={open} onClose={() => setOpen(false)} />
    </>
  )
}
