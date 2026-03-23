"use client";

import { ResumeData } from "@/types/resume";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState, useMemo } from "react";

interface ResumeViewProps {
  data: ResumeData;
  colorTheme?: string;
}

export function ResumeView({ data, colorTheme = "#18181b" }: ResumeViewProps) {
  const [pages, setPages] = useState<React.ReactNode[][]>([]);
  const measureRef = useRef<HTMLDivElement>(null);

  // A4 a 96 DPI: 794px x 1123px. Margens 25mm = 94.5px.
  // Altura útil: 1123 - (94.5 * 2) = 934px. Usamos 900px por segurança.
  const SAFE_PAGE_HEIGHT = 900;

  const {
    personalInfo,
    experiences,
    educations,
    skills,
    projects,
    languages,
    certifications,
    volunteering,
  } = data;

  const contentBlocks = useMemo(() => {
    const blocks: React.ReactNode[] = [];

    const wrap = (node: React.ReactNode, key: string, padding = "pb-6") => (
      <div
        key={key}
        className={padding}
        style={{ width: "100%", boxSizing: "border-box" }}
      >
        {node}
      </div>
    );

    // 1. Cabeçalho (Design Limpo ATS)
    blocks.push(
      wrap(
        <div className="flex flex-col gap-2">
          <h1
            className="text-[28px] font-bold tracking-tight leading-tight"
            style={{ color: colorTheme }}
          >
            {personalInfo.name || "Seu Nome"}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-slate-500">
            {personalInfo.email && (
              <span className="text-slate-800">{personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <>
                <span className="text-slate-300">•</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
            {personalInfo.location && (
              <>
                <span className="text-slate-300">•</span>
                <span>{personalInfo.location}</span>
              </>
            )}
            {personalInfo.linkedin && (
              <>
                <span className="text-slate-300">•</span>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  className="text-blue-600 font-bold uppercase tracking-wider"
                >
                  LinkedIn
                </a>
              </>
            )}
            {personalInfo.website && (
              <>
                <span className="text-slate-300">•</span>
                <a
                  href={personalInfo.website}
                  target="_blank"
                  className="text-blue-600 font-bold uppercase tracking-wider"
                >
                  Portfólio
                </a>
              </>
            )}
          </div>
          {personalInfo.summary && (
            <p className="text-[12px] text-slate-600 leading-relaxed mt-2">
              {personalInfo.summary}
            </p>
          )}
        </div>,
        "header-block",
        "pb-8",
      ),
    );

    const sectionTitle = (title: string) => (
      <div className="flex items-center gap-4 mb-4">
        <h2
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: colorTheme }}
        >
          {title}
        </h2>
        <div className="flex-1 h-[0.5px] bg-slate-200" />
      </div>
    );

    // 2. Experiência
    if (experiences?.length > 0) {
      blocks.push(
        wrap(sectionTitle("Experiência Profissional"), "title-exp", "pb-0"),
      );
      experiences.forEach((exp, i) => {
        blocks.push(
          wrap(
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-[14px] text-slate-900">
                  {exp.position}
                </h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {exp.startDate} — {exp.current ? "Presente" : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-600 font-semibold text-[13px]">
                  {exp.company}
                </span>
                {exp.location && (
                  <span className="text-slate-400 text-[10px]">
                    {exp.location}
                  </span>
                )}
              </div>
              {exp.description && (
                <div className="text-[12px] text-slate-600 leading-relaxed prose prose-sm max-w-none mt-1">
                  <ReactMarkdown>{exp.description}</ReactMarkdown>
                </div>
              )}
            </div>,
            `exp-${i}`,
          ),
        );
      });
    }

    // 3. Educação
    if (educations?.length > 0) {
      blocks.push(
        wrap(sectionTitle("Formação Acadêmica"), "title-edu", "pb-0"),
      );
      educations.forEach((edu, i) => {
        blocks.push(
          wrap(
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-[13px] text-slate-900">
                  {edu.degree} em {edu.field}
                </h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {edu.graduationDate}
                </span>
              </div>
              <p className="text-slate-600 text-[12px]">{edu.school}</p>
            </div>,
            `edu-${i}`,
            "pb-4",
          ),
        );
      });
    }

    // 4. Habilidades (Coluna Única)
    if (skills?.length > 0) {
      blocks.push(wrap(sectionTitle("Habilidades"), "title-skills", "pb-0"));
      blocks.push(
        wrap(
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold rounded"
              >
                {s}
              </span>
            ))}
          </div>,
          "list-skills",
        ),
      );
    }

    // 5. Idiomas (Coluna Única)
    if (languages?.length > 0) {
      blocks.push(wrap(sectionTitle("Idiomas"), "title-langs", "pb-0"));
      blocks.push(
        wrap(
          <div className="flex flex-col gap-1.5">
            {languages.map((l, i) => (
              <div key={i} className="flex gap-2 items-center text-[11px]">
                <span className="font-bold text-slate-700">{l.name}:</span>
                <span className="text-slate-400 uppercase font-medium">
                  {l.level}
                </span>
              </div>
            ))}
          </div>,
          "list-langs",
        ),
      );
    }

    // 6. Certificações
    if (certifications?.length > 0) {
      blocks.push(wrap(sectionTitle("Certificações"), "title-certs", "pb-0"));
      certifications.forEach((c, i) => {
        blocks.push(
          wrap(
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="font-bold text-[12px] text-slate-900">
                  {c.name}
                </h3>
                <p className="text-slate-600 text-[11px]">{c.issuer}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                {c.date}
              </span>
            </div>,
            `cert-${i}`,
            "pb-3",
          ),
        );
      });
    }

    // 7. Projetos
    if (projects?.length > 0) {
      blocks.push(wrap(sectionTitle("Projetos"), "title-proj", "pb-0"));
      projects.forEach((p, i) => {
        blocks.push(
          wrap(
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[13px] text-slate-900">
                  {p.name}
                </h3>
                <div className="flex gap-3 text-[9px] font-bold uppercase">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      className="text-blue-600"
                    >
                      Repositório
                    </a>
                  )}
                  {p.deploy && (
                    <a
                      href={p.deploy}
                      target="_blank"
                      className="text-blue-600"
                    >
                      Demo
                    </a>
                  )}
                </div>
              </div>
              {p.description && (
                <p className="text-[11.5px] text-slate-600 leading-relaxed">
                  {p.description}
                </p>
              )}
            </div>,
            `proj-${i}`,
          ),
        );
      });
    }

    return blocks;
  }, [data, colorTheme]);

  useEffect(() => {
    const distribute = () => {
      if (!measureRef.current) return;
      const children = Array.from(measureRef.current.children) as HTMLElement[];
      const distributedPages: React.ReactNode[][] = [[]];
      let currentIdx = 0;
      let currentHeight = 0;

      children.forEach((child, index) => {
        const height = child.offsetHeight;
        if (
          currentHeight + height > SAFE_PAGE_HEIGHT &&
          distributedPages[currentIdx].length > 0
        ) {
          currentIdx++;
          distributedPages[currentIdx] = [];
          currentHeight = 0;
        }
        distributedPages[currentIdx].push(contentBlocks[index]);
        currentHeight += height;
      });
      setPages(distributedPages);
    };
    setTimeout(distribute, 100);
  }, [contentBlocks]);

  const pagesToRender = pages.length > 0 ? pages : [contentBlocks];

  return (
    <div className="flex flex-col items-center gap-10 no-print">
      <div
        className="absolute invisible pointer-events-none"
        style={{ width: "210mm" }}
      >
        <div
          ref={measureRef}
          className="flex flex-col"
          style={{
            padding: "25mm",
            width: "100%",
            fontFamily: "Helvetica, sans-serif",
          }}
        >
          {contentBlocks}
        </div>
      </div>

      {pagesToRender.map((pageContent, idx) => (
        <div
          key={idx}
          className="a4-page relative flex flex-col bg-white overflow-hidden shadow-2xl"
          style={{
            width: "210mm",
            height: "297mm",
            padding: "25mm",
            color: "#1e293b",
            fontFamily: "Helvetica, sans-serif",
          }}
        >
          <div className="flex flex-col relative" style={{ height: "100%" }}>
            {pageContent}
          </div>
          <div className="absolute bottom-8 right-10 text-[7px] font-bold text-slate-200 uppercase tracking-[0.3em] pointer-events-none">
            LUME / {idx + 1} DE {pagesToRender.length}
          </div>
        </div>
      ))}
    </div>
  );
}
