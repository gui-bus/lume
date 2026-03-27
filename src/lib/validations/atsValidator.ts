import { ResumeData } from "@/types/resume";

export interface ATSCheck {
  id: string;
  status: "success" | "error" | "warning";
  value?: string | number;
}

export interface ATSResult {
  score: number;
  checks: ATSCheck[];
  suggestions: string[];
}

export function validateATS(data: ResumeData): ATSResult {
  const checks: ATSCheck[] = [];
  let score = 0;

  const summaryLength = data.personalInfo.summary?.length || 0;
  if (summaryLength > 50) {
    score += 20;
    checks.push({ id: "summary", status: "success" });
  } else {
    checks.push({ id: "summary", status: "error" });
  }

  const hasContact = !!(data.personalInfo.email && data.personalInfo.phone);
  if (hasContact) {
    score += 20;
    checks.push({ id: "contact", status: "success" });
  } else {
    checks.push({ id: "contact", status: "error" });
  }

  const experienceCount = data.experiences?.length || 0;
  if (experienceCount >= 2) {
    score += 20;
    checks.push({
      id: "experience",
      status: "success",
      value: experienceCount,
    });
  } else if (experienceCount === 1) {
    score += 10;
    checks.push({
      id: "experience",
      status: "warning",
      value: experienceCount,
    });
  } else {
    checks.push({ id: "experience", status: "error", value: experienceCount });
  }

  const skillsCount = data.skills?.length || 0;
  if (skillsCount >= 5) {
    score += 20;
    checks.push({ id: "skills", status: "success", value: skillsCount });
  } else {
    checks.push({ id: "skills", status: "error", value: skillsCount });
  }

  const wordCount = JSON.stringify(data).split(/\W+/).length;
  if (wordCount > 200 && wordCount < 1000) {
    score += 20;
    checks.push({ id: "length", status: "success" });
  } else if (wordCount <= 200) {
    checks.push({ id: "length", status: "error", value: "short" });
  } else {
    checks.push({ id: "length", status: "warning", value: "long" });
  }

  const suggestions = checks
    .filter((check) => check.status !== "success")
    .map((check) => check.id);

  return {
    score,
    checks,
    suggestions,
  };
}
