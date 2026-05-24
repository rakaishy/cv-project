import { CV } from "@/types/cv"
import cvData from "../../data/cv.json"

export function getCV(): CV {
  return cvData as CV
}
