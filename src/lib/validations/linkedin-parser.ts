import { ResumeData } from "@/types/resume";

export async function parseLinkedInPDF(
  file: File,
): Promise<Partial<ResumeData>> {
  const pdfjsLib = await import("pdfjs-dist");

  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join("\n");
    fullText += pageText + "\n";
  }

  const lines = fullText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const parsedData: Partial<ResumeData> = {
    personalInfo: {
      name: lines[0] || "",
      email: "",
      phone: "",
      location: lines[1] || "",
      linkedin: "",
      website: "",
      summary: "",
    },
    experiences: [],
    educations: [],
    skills: [],
  };

  const emailLine = lines.find((l) => l.includes("@"));
  if (emailLine) parsedData.personalInfo!.email = emailLine.split(" ")[0];

  let currentSection = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === "Summary" || line === "Resumo") {
      currentSection = "summary";
      continue;
    } else if (line === "Experience" || line === "Experiência") {
      currentSection = "experience";
      continue;
    } else if (line === "Education" || line === "Formação acadêmica") {
      currentSection = "education";
      continue;
    }

    if (currentSection === "summary" && line.length > 20) {
      parsedData.personalInfo!.summary += line + " ";
    }
  }

  return parsedData;
}
