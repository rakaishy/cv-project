"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { getCV } from "@/lib/cv"
import { generatePDF } from "@/lib/pdf"
import { MailIcon, PhoneIcon, LocationIcon, GitHubIcon, LinkedInIcon, PrinterIcon } from "@/components/icons"
import ThemeToggle from "@/components/ui/ThemeToggle"

export default function Header() {
  const cv = getCV()
  const { name, title, contact } = cv
  const [pdfLoading, setPdfLoading] = useState(false)

  const handlePdf = async () => {
    setPdfLoading(true)
    try {
      await generatePDF()
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12 border-b border-neutral-200 pb-8 dark:border-neutral-700"
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {name}
          </h1>
          <p className="mt-1 text-xl text-neutral-500 dark:text-neutral-400">
            {title}
          </p>
        </div>
        <div className="no-print flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handlePdf}
            disabled={pdfLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-wait dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            {pdfLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
            ) : (
              <PrinterIcon className="h-4 w-4" />
            )}
            {pdfLoading ? "Exporting…" : "Save as PDF"}
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
        <span className="inline-flex items-center gap-1.5">
          <MailIcon className="h-4 w-4" />
          <span>{contact.email}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <PhoneIcon className="h-4 w-4" />
          <span>{contact.phone}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <LocationIcon className="h-4 w-4" />
          <span>{contact.location}</span>
        </span>
        {contact.github && (
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200">
            <GitHubIcon className="h-4 w-4" />
            <span>{contact.github.replace("https://", "")}</span>
          </a>
        )}
        {contact.linkedin && (
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200">
            <LinkedInIcon className="h-4 w-4" />
            <span>{contact.linkedin.replace("https://", "")}</span>
          </a>
        )}
      </div>
    </motion.header>
  )
}
