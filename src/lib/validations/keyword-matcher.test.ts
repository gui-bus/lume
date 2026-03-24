import { describe, it, expect } from "vitest";
import { analyzeJobMatch } from "./keyword-matcher";
import { ResumeData } from "@/types/resume";

describe("Keyword Matcher", () => {
  const mockResume: ResumeData = {
    personalInfo: { name: "John", email: "john@test.com" },
    skills: ["React", "TypeScript", "Tailwind CSS"],
    experiences: [
      {
        company: "Tech",
        position: "Frontend",
        startDate: "2020",
        current: true,
        description: "Experience with Node.js and PostgreSQL.",
      },
    ],
    educations: [],
    projects: [],
    languages: [],
    certifications: [],
    volunteering: [],
  };

  it("should return a high score when many keywords match", () => {
    const jobDescription =
      "We need a React developer with TypeScript and Node.js knowledge.";
    const result = analyzeJobMatch(mockResume, jobDescription);

    expect(result.score).toBeGreaterThan(60);
    expect(result.matchingKeywords).toContain("react");
    expect(result.matchingKeywords).toContain("typescript");
    expect(result.matchingKeywords).toContain("node.js");
  });

  it("should return 0 score when no keywords match", () => {
    const jobDescription =
      "Chef de cozinha com experiência em massas e vinhos.";
    const result = analyzeJobMatch(mockResume, jobDescription);

    expect(result.score).toBe(0);
    expect(result.matchingKeywords).toHaveLength(0);
  });

  it("should identify missing keywords", () => {
    const jobDescription =
      "Looking for a React developer with AWS and Docker skills.";
    const result = analyzeJobMatch(mockResume, jobDescription);

    expect(result.missingKeywords).toContain("aws");
    expect(result.missingKeywords).toContain("docker");
    expect(result.matchingKeywords).toContain("react");
  });
});
