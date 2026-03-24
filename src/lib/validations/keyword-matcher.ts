import { ResumeData } from "@/types/resume";

const SKILL_DICTIONARY = [
  "react",
  "next.js",
  "nextjs",
  "typescript",
  "javascript",
  "node.js",
  "nodejs",
  "tailwind",
  "css",
  "html",
  "sass",
  "styled-components",
  "redux",
  "zustand",
  "react-query",
  "tanstack",
  "prisma",
  "postgresql",
  "mysql",
  "mongodb",
  "docker",
  "aws",
  "azure",
  "git",
  "github",
  "gitlab",
  "scrum",
  "agile",
  "kanban",
  "figma",
  "ui",
  "ux",
  "design",
  "backend",
  "frontend",
  "fullstack",
  "mobile",
  "react native",
  "flutter",
  "dart",
  "go",
  "python",
  "django",
  "flask",
  "java",
  "spring",
  "c#",
  "dotnet",
  "asp.net",
  "php",
  "laravel",
  "vue",
  "angular",
  "cypress",
  "jest",
  "testing",
  "qa",
  "devops",
  "kubernetes",
  "rest",
  "graphql",
  "api",
  "microservices",
  "inglês",
  "english",
  "espanhol",
  "spanish",
  "liderança",
  "gestão",
  "comunicação",
  "resolução de problemas",
  "foco",
  "autonomia",
  "mentoria",
  "code review",
];

export interface MatchResult {
  score: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  jobKeywordsFound: string[];
}

export function analyzeJobMatch(
  resumeData: ResumeData,
  jobDescription: string,
): MatchResult {
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s.#]/g, " ");

  const jobNormalized = normalize(jobDescription);
  const resumeNormalized = normalize(JSON.stringify(resumeData));

  const jobKeywordsFound = SKILL_DICTIONARY.filter((skill) => {
    const regex = new RegExp(`\\b${skill.replace(".", "\\.")}\\b`, "gi");
    return regex.test(jobNormalized);
  });

  if (jobKeywordsFound.length === 0) {
    return {
      score: 0,
      matchingKeywords: [],
      missingKeywords: [],
      jobKeywordsFound: [],
    };
  }

  const matchingKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jobKeywordsFound.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword.replace(".", "\\.")}\\b`, "gi");
    if (regex.test(resumeNormalized)) {
      matchingKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const score = Math.round(
    (matchingKeywords.length / jobKeywordsFound.length) * 100,
  );

  return {
    score,
    matchingKeywords,
    missingKeywords,
    jobKeywordsFound,
  };
}
