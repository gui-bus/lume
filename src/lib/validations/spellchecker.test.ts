import { ResumeData } from "@/types/resume";
import { describe, expect, it } from "vitest";
import { checkStrongVerbs } from "./spellchecker";

describe("Spellchecker (Strong Verbs)", () => {
  const mockData: ResumeData = {
    personalInfo: {
      name: "John",
      email: "john@test.com",
      summary: "Eu ajudei a equipe a fazer o projeto.",
    },
    experiences: [
      {
        company: "Test",
        position: "Dev",
        startDate: "2020",
        current: true,
        description: "Eu fiz muitas coisas e trabalhei com React.",
      },
    ],
    skills: [],
    educations: [],
    projects: [],
    languages: [],
    certifications: [],
    volunteering: [],
  };

  it("should identify weak verbs in summary and experiences", () => {
    const result = checkStrongVerbs(mockData);
    expect(result.hasIssues).toBe(true);
    expect(result.suggestions).toHaveLength(2); // Summary and 1 Experience

    const summaryIssues = result.suggestions.find(
      (s) => s.section === "Resumo Profissional",
    );
    expect(summaryIssues?.found.some((f) => f.word === "ajudei")).toBe(true);
    expect(summaryIssues?.found.some((f) => f.word === "fazer")).toBe(true);

    const expIssues = result.suggestions.find(
      (s) => s.section === "Experiência: Dev",
    );
    expect(expIssues?.found.some((f) => f.word === "fiz")).toBe(true);
    expect(expIssues?.found.some((f) => f.word === "trabalhei com")).toBe(true);
  });

  it("should return no issues for strong verbs", () => {
    const strongData: ResumeData = {
      ...mockData,
      personalInfo: {
        ...mockData.personalInfo,
        summary: "Liderei a equipe na implementação do sistema.",
      },
      experiences: [
        {
          ...mockData.experiences[0],
          description: "Desenvolvi funcionalidades complexas e dominei React.",
        },
      ],
    };
    const result = checkStrongVerbs(strongData);
    expect(result.hasIssues).toBe(false);
    expect(result.suggestions).toHaveLength(0);
  });
});
