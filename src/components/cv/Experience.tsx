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

export default function Experience() {
  const cv = getCV()

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h2 className="mb-6 text-lg font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Experience
      </h2>
      <div className="space-y-8">
        {cv.experience.map((exp, index) => (
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
                  {exp.position}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  {exp.company}
                </p>
              </div>
              <div className="shrink-0 text-sm text-neutral-400 dark:text-neutral-500">
                {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
              </div>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              {exp.description}
            </p>
            <ul className="mt-3 space-y-1">
              {exp.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {exp.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium leading-none text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
