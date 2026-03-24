import { ResumeData } from "@/types/resume";

const WEAK_WORDS_MAP: Record<string, string[]> = {
  ajudei: ["Liderei", "Coordenei", "Apoiei"],
  ajudar: ["Liderar", "Coordenar", "Suportar"],
  fiz: ["Desenvolvi", "Executei", "Entreguei"],
  fazer: ["Desenvolver", "Executar", "Implementar"],
  participei: ["Contribuí", "Colaborei", "Integrei"],
  participar: ["Contribuir", "Colaborar", "Integrar"],
  "trabalhei com": ["Especializei-me em", "Utilizei", "Dominei"],
  trabalhar: ["Atuar", "Performar", "Operar"],
  responsável: ["Encarregado de", "Líder de", "Gestor de"],
  criei: ["Concebi", "Projetei", "Arquitetei"],
  criar: ["Conceber", "Projetar", "Arquitetar"],
  mexi: ["Otimizei", "Ajustei", "Configurei"],
  mexer: ["Otimizar", "Ajustar", "Configurar"],
};

const WEAK_WORDS = Object.keys(WEAK_WORDS_MAP);

export interface SpellCheckResult {
  hasIssues: boolean;
  suggestions: {
    section: string;
    fullText: string;
    found: {
      word: string;
      context: string;
      alternatives: string[];
    }[];
  }[];
}

export function checkStrongVerbs(data: ResumeData): SpellCheckResult {
  const sectionSuggestions: SpellCheckResult["suggestions"] = [];

  const checkText = (text: string | undefined, sectionName: string) => {
    if (!text) return;
    const lowerText = text.toLowerCase();
    const foundInThisSection: SpellCheckResult["suggestions"][0]["found"] = [];

    WEAK_WORDS.forEach((word) => {
      const index = lowerText.indexOf(word);
      if (index !== -1) {
        const start = Math.max(0, index - 20);
        const end = Math.min(text.length, index + word.length + 20);
        const context =
          (start > 0 ? "..." : "") +
          text.substring(start, end) +
          (end < text.length ? "..." : "");

        foundInThisSection.push({
          word,
          context,
          alternatives: WEAK_WORDS_MAP[word],
        });
      }
    });

    if (foundInThisSection.length > 0) {
      sectionSuggestions.push({
        section: sectionName,
        fullText: text,
        found: foundInThisSection,
      });
    }
  };

  checkText(data.personalInfo.summary, "Resumo Profissional");
  data.experiences?.forEach((exp, i) => {
    checkText(exp.description, `Experiência: ${exp.position}`);
  });

  return {
    hasIssues: sectionSuggestions.length > 0,
    suggestions: sectionSuggestions,
  };
}
