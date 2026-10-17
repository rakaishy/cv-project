"use client"

import { motion } from "framer-motion"
import { getCV } from "@/lib/cv"

function formatDate(date: string | null) {
  if (!date) return "Present"
  const [year, month] = date.split("-")
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  return `${months[parseInt(month) - 1]} ${year}`
}

export default function Education() {
  const cv = getCV()

  if (!cv.education?.length) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h2 className="mb-6 text-lg font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Education
      </h2>
      <div className="space-y-6">
        {cv.education.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative border-l-2 border-neutral-200 pl-5 dark:border-neutral-700"
          >
            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900" />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  {edu.degree} in {edu.field}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  {edu.institution}
                </p>
              </div>
              <div className="shrink-0 text-sm text-neutral-400 dark:text-neutral-500">
                {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
              </div>
            </div>
            {edu.gpa && (
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                GPA: {edu.gpa}
              </p>
            )}
            {edu.highlights && edu.highlights.length > 0 && (
              <ul className="mt-2 space-y-1">
                {edu.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
