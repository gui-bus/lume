export interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

export interface Experience {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface Project {
  name: string;
  link?: string;
  github?: string;
  deploy?: string;
  description?: string;
}

export interface Language {
  name: string;
  conversation: "Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo";
  writing: "Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo";
  reading: "Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo";
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Volunteer {
  organization: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Course {
  name: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: string[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
  volunteering: Volunteer[];
  courses: Course[];
}
