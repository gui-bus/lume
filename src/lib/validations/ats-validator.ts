import { ResumeData } from "@/types/resume";

export interface ATSResult {
  score: number;
  suggestions: string[];
  details: {
    length: boolean;
    contactInfo: boolean;
    summary: boolean;
    experienceCount: number;
    skillsCount: number;
  };
}

export function validateATS(data: ResumeData): ATSResult {
  const suggestions: string[] = [];
  let score = 0;

  const hasSummary =
    !!data.personalInfo.summary && data.personalInfo.summary.length > 50;
  const hasContact = !!data.personalInfo.email && !!data.personalInfo.phone;
  const experienceCount = data.experiences?.length || 0;
  const skillsCount = data.skills?.length || 0;
  const wordCount = JSON.stringify(data).split(/\W+/).length;

  if (hasSummary) score += 20;
  else
    suggestions.push(
      "Adicione um resumo profissional com pelo menos 50 caracteres.",
    );

  if (hasContact) score += 20;
  else
    suggestions.push("Certifique-se de incluir e-mail e telefone de contato.");

  if (experienceCount >= 2) score += 20;
  else if (experienceCount === 1) score += 10;
  else suggestions.push("Adicione pelo menos duas experiências profissionais.");

  if (skillsCount >= 5) score += 20;
  else suggestions.push("Liste pelo menos 5 habilidades técnicas relevantes.");

  if (wordCount > 200 && wordCount < 1000) score += 20;
  else if (wordCount <= 200)
    suggestions.push(
      "Seu currículo parece muito curto. Adicione mais detalhes.",
    );
  else
    suggestions.push("Seu currículo está muito longo. Tente ser mais conciso.");

  return {
    score,
    suggestions,
    details: {
      length: wordCount > 200,
      contactInfo: hasContact,
      summary: hasSummary,
      experienceCount,
      skillsCount,
    },
  };
}
