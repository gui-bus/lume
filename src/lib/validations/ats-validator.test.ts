import { ResumeData } from "@/types/resume";
import { describe, expect, it } from "vitest";
import { validateATS } from "./atsValidator";

describe("ATS Validator", () => {
  const mockData: ResumeData = {
    personalInfo: {
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      summary:
        "This is a long enough summary to pass the ATS validation check with more than 50 characters.",
    },
    experiences: [
      {
        company: "Company A",
        position: "Dev",
        startDate: "2020",
        endDate: "2021",
        current: false,
        description: "Task A",
      },
      {
        company: "Company B",
        position: "Dev",
        startDate: "2021",
        endDate: "2022",
        current: false,
        description: "Task B",
      },
    ],
    skills: ["React", "TypeScript", "Node.js", "Next.js", "Tailwind"],
    educations: [],
    projects: [],
    languages: [],
    certifications: [],
    volunteering: [],
  };

  it("should return a high score for a complete resume", () => {
    const result = validateATS(mockData);
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it("should return low score and suggestions for empty resume", () => {
    const emptyData: ResumeData = {
      personalInfo: { name: "", email: "" },
      experiences: [],
      skills: [],
      educations: [],
      projects: [],
      languages: [],
      certifications: [],
      volunteering: [],
    };
    const result = validateATS(emptyData);
    expect(result.score).toBeLessThan(50);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });
});
