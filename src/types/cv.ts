export interface Contact {
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
  website?: string
}

export interface Skill {
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
  category: string
}

export interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string | null
  location: string
  description: string
  highlights: string[]
  technologies: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
  gpa?: string
  highlights?: string[]
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  url?: string
  github?: string
  highlights: string[]
}

export interface CV {
  name: string
  title: string
  summary: string
  contact: Contact
  skills: Skill[]
  experience: Experience[]
  education?: Education[]
  projects?: Project[]
}
