"use client"

import { motion } from "framer-motion"
import { getCV } from "@/lib/cv"

export default function Summary() {
  const cv = getCV()

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h2 className="mb-4 text-lg font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        About
      </h2>
      <p className="max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
        {cv.summary}
      </p>
    </motion.section>
  )
}
