import html2canvas from "html2canvas"
import jsPDF from "jspdf"

import { getCV } from "./cv"

/** A pixel counts as content when any channel is at or below this value.
 *  The light-mode page background is #fafafa (250) and the tag/badge
 *  background is #f5f5f5 (245), so 246 treats the page background as empty
 *  while keeping tags and badges intact (never sliced across pages). */
const CONTENT_MAX_CHANNEL = 246

/**
 * Find the row closest to `idealEnd` (searching upwards, never below `minEnd`)
 * that contains no content, so page breaks never slice through text lines,
 * list items or technology tags.
 *
 * Falls back to the least-inked row in the window when the page has no fully
 * empty row (e.g. the Experience timeline border runs the whole page).
 */
function findBreakRow(imageData: ImageData, width: number, idealEnd: number, minEnd: number): number {
  let best = idealEnd
  let bestInk = Infinity

  for (let y = idealEnd; y > minEnd; y--) {
    const start = y * width * 4
    const data = imageData.data
    let ink = 0
    for (let x = 0; x < width; x++) {
      const i = start + x * 4
      if (data[i] <= CONTENT_MAX_CHANNEL || data[i + 1] <= CONTENT_MAX_CHANNEL || data[i + 2] <= CONTENT_MAX_CHANNEL) {
        ink++
      }
    }
    if (ink === 0) return y
    if (ink < bestInk) {
      bestInk = ink
      best = y
    }
  }

  return best
}

/**
 * Download name derived from the CV: `cv_Alejandro_Guerrero_Sivilla.pdf`.
 *
 * The candidate's name is split on anything that is not a letter or a digit,
 * so spaces, punctuation and accents all collapse to single underscores
 * ("Sivillá" -> "Sivilla"). Falls back to `cv.pdf` when no name is set.
 */
function pdfFileName(): string {
  const slug = (getCV().name ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")

  return slug ? `cv_${slug}.pdf` : "cv.pdf"
}

export async function generatePDF(): Promise<void> {
  const element = document.getElementById("cv-content")
  if (!element) return

  const scrollY = window.scrollY
  const html = document.documentElement
  const wasDark = html.classList.contains("dark")
  if (wasDark) html.classList.remove("dark")

  const style = document.createElement("style")
  style.id = "pdf-force-visible"
  style.textContent = "#cv-content * { opacity: 1 !important; transform: none !important; }"
  document.head.appendChild(style)

  try {
    await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))])
    await new Promise((r) => setTimeout(r, 200))

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (doc) => {
        const win = doc.defaultView

        const s = doc.createElement("style")
        s.textContent = `.no-print { display: none !important; }`
        doc.head.appendChild(s)

        // html2canvas 1.4.1 cannot size or colour SVGs reliably: force an
        // explicit box, and resolve `currentColor` to a real colour.
        doc.querySelectorAll("svg").forEach((svg) => {
          if (!(svg instanceof SVGSVGElement)) return
          const color = win ? win.getComputedStyle(svg).color : "#333333"
          const rect = svg.getBoundingClientRect()
          const width = Math.round(rect.width) || 16
          const height = Math.round(rect.height) || 16
          svg.style.width = `${width}px`
          svg.style.height = `${height}px`
          svg.style.display = "inline-block"
          svg.style.verticalAlign = "middle"
          svg.style.flexShrink = "0"
          svg.querySelectorAll("[stroke=currentColor]").forEach((el) => {
            if (el instanceof SVGElement) el.setAttribute("stroke", color)
          })
          svg.querySelectorAll("[fill=currentColor]").forEach((el) => {
            if (el instanceof SVGElement) el.setAttribute("fill", color)
          })
        })

        // Icon + label rows: keep the icon vertically centred with the text.
        doc.querySelectorAll("span, a").forEach((el) => {
          if (el instanceof HTMLElement && el.classList.contains("inline-flex") && el.classList.contains("items-center")) {
            el.style.alignItems = "center"
          }
        })

        // Technology tags and skill badges use `leading-none`, which makes the
        // line box (~1em) shorter than the glyph box (~1.2em). Browsers pull
        // the baseline up with negative half-leading, html2canvas does not, so
        // the text ends up ~1px too low and swallows the bottom padding.
        // Using the font's natural line height restores symmetric padding.
        doc.querySelectorAll("span.rounded-md, span.rounded-full").forEach((el) => {
          if (el instanceof HTMLElement && /\bpy-0\.5\b/.test(el.className)) {
            el.style.lineHeight = "normal"
          }
        })
      },
    })

    const context = canvas.getContext("2d")
    const imageData = context ? context.getImageData(0, 0, canvas.width, canvas.height) : null

    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15
    const contentWidth = pageWidth - margin * 2

    // canvas pixels -> millimetres, and the page height budget in canvas pixels
    const pxPerMm = canvas.width / contentWidth
    const pageHeightPx = Math.round((pageHeight - margin * 2) * pxPerMm)
    // Never push more than this much content to the next page when hunting for
    // a clean break, otherwise a tall unbreakable block would waste a page.
    const minEndOffset = Math.round(pageHeightPx * 0.6)

    let srcY = 0
    let currentPage = 0

    while (srcY < canvas.height) {
      const idealEnd = Math.min(srcY + pageHeightPx, canvas.height)
      const minEnd = Math.min(idealEnd - 1, srcY + minEndOffset)

      const endY = idealEnd >= canvas.height || !imageData
        ? idealEnd
        : Math.max(findBreakRow(imageData, canvas.width, idealEnd, minEnd), srcY + 1)

      const sliceHeight = endY - srcY
      const sliceHeightMm = sliceHeight / pxPerMm

      const pageCanvas = document.createElement("canvas")
      pageCanvas.width = canvas.width
      pageCanvas.height = sliceHeight
      const pageContext = pageCanvas.getContext("2d")
      if (!pageContext) break

      pageContext.drawImage(canvas, 0, srcY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)

      if (currentPage > 0) pdf.addPage()
      pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", margin, margin, contentWidth, sliceHeightMm)

      currentPage++
      srcY = endY
    }

    pdf.save(pdfFileName())
  } finally {
    style.remove()
    if (wasDark) html.classList.add("dark")
    window.scrollTo(0, scrollY)
  }
}
