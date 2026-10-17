import Header from "@/components/cv/Header"
import Summary from "@/components/cv/Summary"
import Experience from "@/components/cv/Experience"
import Education from "@/components/cv/Education"
import Skills from "@/components/cv/Skills"
import Projects from "@/components/cv/Projects"
import ChatButton from "@/components/ai/ChatButton"

// GitHub Pages is static-only, so the deployed build ships without the chat
// (its /api/chat handler doesn't exist there). Local dev keeps it.
const chatEnabled = process.env.NEXT_PUBLIC_CHAT_ENABLED !== "false"

export default function Home() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div id="cv-content">
          <Header />
          <Summary />
          <Experience />
          <Education />
          <Skills />
          <Projects />
        </div>
        <footer className="border-t border-neutral-200 pt-6 text-center text-xs text-neutral-400 dark:border-neutral-800">
          <p>Built with Next.js, Tailwind CSS, and Framer Motion</p>
        </footer>
      </div>
      {chatEnabled && (
        <div className="no-print">
          <ChatButton />
        </div>
      )}
    </>
  )
}
