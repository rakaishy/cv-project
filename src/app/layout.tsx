import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import cvData from "../../data/cv.json"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const { name, title } = cvData as { name: string; title: string }

export const metadata: Metadata = {
  title: `${name} — ${title}`,
  description: `${title} with experience building scalable web applications.`,
  openGraph: {
    title: `${name} — ${title}`,
    description: `${title} with experience building scalable web applications.`,
    type: "website",
  },
}

const themeScript = `
  (function() {
    var theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-[#fafafa] text-neutral-900 dark:bg-[#0a0a0a] dark:text-neutral-100">
        {children}
      </body>
    </html>
  )
}
