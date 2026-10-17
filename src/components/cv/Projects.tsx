"use client"

import { motion } from "framer-motion"
import { getCV } from "@/lib/cv"
import { GitHubIcon, ExternalLinkIcon } from "@/components/icons"

export default function Projects() {
  const cv = getCV()

  if (!cv.projects?.length) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <h2 className="mb-6 text-lg font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Projects
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cv.projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-neutral-600"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                {project.name}
              </h3>
              <div className="flex gap-1.5">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {project.description}
            </p>
            <ul className="mt-3 space-y-1">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium leading-none text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
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
