"use client"

import { motion } from "framer-motion"
import { getCV } from "@/lib/cv"

const levelColors: Record<string, string> = {
  beginner: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  intermediate: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  advanced: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  expert: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
}

export default function Skills() {
  const cv = getCV()

  const grouped = cv.skills.reduce<Record<string, typeof cv.skills>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h2 className="mb-6 text-lg font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Skills
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(grouped).map(([category, skills]) => (
          <div key={category}>
            <h3 className="mb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {category}
            </h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.name} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-800 dark:text-neutral-200">
                    {skill.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium leading-none ${levelColors[skill.level]}`}
                  >
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
