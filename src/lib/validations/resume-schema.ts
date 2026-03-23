import { z } from "zod";

export const PersonalInfoSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  summary: z.string().optional(),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1, "Empresa é obrigatória"),
  position: z.string().min(1, "Cargo é obrigatório"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
});

export const EducationSchema = z.object({
  school: z.string().min(1, "Instituição é obrigatória"),
  degree: z.string().min(1, "Grau é obrigatório"),
  field: z.string().min(1, "Área de estudo é obrigatória"),
  graduationDate: z.string().min(1, "Data de graduação é obrigatória"),
});

export const ProjectsSchema = z.object({
  name: z.string().min(1, "Nome do projeto é obrigatório"),
  link: z.string().url("URL inválida").optional().or(z.literal("")),
  github: z.string().url("URL inválida").optional().or(z.literal("")),
  deploy: z.string().url("URL inválida").optional().or(z.literal("")),
  description: z.string().optional(),
});

export const ResumeSchema = z.object({
  personalInfo: PersonalInfoSchema,
  experiences: z.array(ExperienceSchema),
  educations: z.array(EducationSchema),
  skills: z.array(z.string()),
  projects: z.array(ProjectsSchema),
});
