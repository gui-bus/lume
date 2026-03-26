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

  if (hasSummary) {
    score += 20;
  } else {
    suggestions.push("summary");
  }

  if (hasContact) {
    score += 20;
  } else {
    suggestions.push("contact");
  }

  if (experienceCount >= 2) {
    score += 20;
  } else if (experienceCount === 1) {
    score += 10;
    suggestions.push("experience_low");
  } else {
    suggestions.push("experience_none");
  }

  if (skillsCount >= 5) {
    score += 20;
  } else {
    suggestions.push("skills");
  }

  if (wordCount > 200 && wordCount < 1000) {
    score += 20;
  } else if (wordCount <= 200) {
    suggestions.push("length_short");
  } else {
    suggestions.push("length_long");
  }

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
