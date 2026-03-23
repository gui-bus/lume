import { ResumeData } from "@/types/resume";

const WEAK_WORDS = [
  "ajudei",
  "fiz",
  "participei",
  "trabalhei com",
  "fui responsável",
  "ajudar",
  "fazer",
  "participar",
  "trabalhar",
  "responsável",
  "criei",
  "mexi",
  "mexer",
  "criar",
];

const STRONG_ALTERNATIVES = [
  "Liderei",
  "Otimizei",
  "Desenvolvi",
  "Arquitetei",
  "Implementei",
  "Reduzi",
  "Aumentei",
  "Gerenciei",
  "Projetei",
  "Entreguei",
];

export interface SpellCheckResult {
  hasIssues: boolean;
  suggestions: {
    section: string;
    text: string;
    found: string[];
    recommendation: string;
  }[];
}

export function checkStrongVerbs(data: ResumeData): SpellCheckResult {
  const suggestions: SpellCheckResult["suggestions"] = [];

  const checkText = (text: string | undefined, sectionName: string) => {
    if (!text) return;
    const lowerText = text.toLowerCase();
    const foundWeakWords = WEAK_WORDS.filter((word) =>
      lowerText.includes(word),
    );

    if (foundWeakWords.length > 0) {
      suggestions.push({
        section: sectionName,
        text: text.substring(0, 50) + "...",
        found: foundWeakWords,
        recommendation: `Substitua termos fracos por verbos de ação fortes como: ${STRONG_ALTERNATIVES.slice(0, 3).join(", ")}.`,
      });
    }
  };

  checkText(data.personalInfo.summary, "Resumo Profissional");

  data.experiences?.forEach((exp, i) => {
    checkText(exp.description, `Experiência: ${exp.position}`);
  });

  return {
    hasIssues: suggestions.length > 0,
    suggestions,
  };
}
