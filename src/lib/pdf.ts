import html2canvas from "html2canvas"
import jsPDF from "jspdf"

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

  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))])
  await new Promise((r) => setTimeout(r, 200))

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    onclone: (doc) => {
      const s = doc.createElement("style")
      s.textContent = `.no-print { display: none !important; }`
      doc.head.appendChild(s)
      doc.querySelectorAll("svg").forEach((svg) => {
        if (!(svg instanceof SVGSVGElement)) return
        const p = svg.parentElement
        const color = p ? getComputedStyle(p).color : "#333333"
        svg.style.width = "16px"
        svg.style.height = "16px"
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
      doc.querySelectorAll("span, a").forEach((el) => {
        if (el instanceof HTMLElement && el.classList.contains("inline-flex") && el.classList.contains("items-center")) {
          el.style.alignItems = "center"
        }
      })
      doc.querySelectorAll("span.rounded-md, span.rounded-full").forEach((el) => {
        if (el instanceof HTMLElement && /\bpy-0\.5\b/.test(el.className)) {
          el.style.display = "flex"
          el.style.alignItems = "center"
        }
      })
    },
  })

  style.remove()
  if (wasDark) html.classList.add("dark")

  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15

  const contentWidth = pageWidth - margin * 2
  const contentHeight = (canvas.height * contentWidth) / canvas.width

  let remaining = contentHeight
  let srcY = 0

  while (remaining > 0) {
    const h = Math.min(remaining, pageHeight - margin * 2)
    const pageCanvas = document.createElement("canvas")
    pageCanvas.width = canvas.width
    pageCanvas.height = (h * canvas.width) / contentWidth
    const ctx = pageCanvas.getContext("2d")
    if (!ctx) break

    ctx.drawImage(
      canvas,
      0, (srcY * canvas.width) / contentWidth,
      canvas.width, pageCanvas.height,
      0, 0,
      pageCanvas.width, pageCanvas.height,
    )

    const pageImg = pageCanvas.toDataURL("image/png")
    if (remaining < contentHeight) pdf.addPage()
    pdf.addImage(pageImg, "PNG", margin, margin, contentWidth, h)

    srcY += h
    remaining -= h
  }

  pdf.save("cv.pdf")
  window.scrollTo(0, scrollY)
}
