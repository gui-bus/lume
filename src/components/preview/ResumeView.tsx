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

  const SAFE_PAGE_HEIGHT = 880;

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
      <div key={key} className={padding}>
        {node}
      </div>
    );

    // Cabeçalho
    blocks.push(
      wrap(
        <header
          className="flex flex-col gap-3 border-b-2 pb-6"
          style={{ borderColor: colorTheme }}
        >
          <h1
            className="text-4xl font-black uppercase tracking-tighter leading-none"
            style={{ color: colorTheme }}
          >
            {personalInfo.name || "Seu Nome"}
          </h1>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            {personalInfo.email && (
              <span className="lowercase">{personalInfo.email}</span>
            )}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                LINKEDIN
              </a>
            )}
            {personalInfo.website && (
              <a
                href={personalInfo.website}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                PORTFOLIO
              </a>
            )}
          </div>
          {personalInfo.summary && (
            <p className="text-[13px] text-slate-700 leading-relaxed font-medium mt-2">
              {personalInfo.summary}
            </p>
          )}
        </header>,
        "header-block",
      ),
    );

    // Experiência
    if (experiences?.length > 0) {
      blocks.push(
        wrap(
          <div
            className="border-b pb-1"
            style={{ borderColor: `${colorTheme}30` }}
          >
            <h2
              className="text-sm font-black uppercase tracking-[0.15em]"
              style={{ color: colorTheme }}
            >
              Experiência Profissional
            </h2>
          </div>,
          "exp-title-block",
          "pb-4",
        ),
      );
      experiences.forEach((exp, i) => {
        blocks.push(
          wrap(
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-[15px] text-slate-900">
                  {exp.position}
                </h3>
                <span className="text-[10px] text-slate-500 font-black uppercase whitespace-nowrap ml-4">
                  {exp.startDate} — {exp.current ? "Presente" : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-700 font-bold text-sm">
                  {exp.company}
                </span>
                {exp.location && (
                  <span className="text-slate-400 text-[11px] italic font-medium">
                    {exp.location}
                  </span>
                )}
              </div>
              {exp.description && (
                <div className="text-[12.5px] text-slate-600 leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      ul: (props) => (
                        <ul
                          className="list-disc ml-4 space-y-1 mt-1"
                          {...props}
                        />
                      ),
                      li: (props) => <li className="pl-1" {...props} />,
                      p: (props) => <p className="mb-1" {...props} />,
                    }}
                  >
                    {exp.description}
                  </ReactMarkdown>
                </div>
              )}
            </div>,
            `exp-${i}`,
          ),
        );
      });
    }

    // Educação
    if (educations?.length > 0) {
      blocks.push(
        wrap(
          <div
            className="border-b pb-1 mt-2"
            style={{ borderColor: `${colorTheme}30` }}
          >
            <h2
              className="text-sm font-black uppercase tracking-[0.15em]"
              style={{ color: colorTheme }}
            >
              Formação Acadêmica
            </h2>
          </div>,
          "edu-title-block",
          "pb-4",
        ),
      );
      educations.forEach((edu, i) => {
        blocks.push(
          wrap(
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {edu.degree} em {edu.field}
                </h3>
                <p className="text-slate-600 text-[13px] font-medium">
                  {edu.school}
                </p>
              </div>
              <span className="text-[10px] text-slate-500 font-black uppercase whitespace-nowrap ml-4">
                {edu.graduationDate}
              </span>
            </div>,
            `edu-${i}`,
            "pb-4",
          ),
        );
      });
    }

    // Skills (Design Original Restaurado)
    if (skills?.length > 0) {
      blocks.push(
        wrap(
          <div
            className="border-b pb-1 mt-2"
            style={{ borderColor: `${colorTheme}30` }}
          >
            <h2
              className="text-sm font-black uppercase tracking-[0.15em]"
              style={{ color: colorTheme }}
            >
              Habilidades Técnicas
            </h2>
          </div>,
          "skills-title-block",
          "pb-4",
        ),
      );
      blocks.push(
        wrap(
          <div className="flex flex-wrap gap-x-2 gap-y-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold rounded uppercase tracking-tighter"
              >
                {skill}
              </span>
            ))}
          </div>,
          "skills-list-block",
        ),
      );
    }

    // Idiomas (Design Original Restaurado)
    if (languages?.length > 0) {
      blocks.push(
        wrap(
          <div
            className="border-b pb-1 mt-2"
            style={{ borderColor: `${colorTheme}30` }}
          >
            <h2
              className="text-sm font-black uppercase tracking-[0.15em]"
              style={{ color: colorTheme }}
            >
              Idiomas
            </h2>
          </div>,
          "lang-title-block",
          "pb-4",
        ),
      );
      blocks.push(
        wrap(
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {languages.map((lang, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">
                  {lang.name}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-black">
                  {lang.level}
                </span>
              </div>
            ))}
          </div>,
          "lang-list-block",
        ),
      );
    }

    // Certificações (Design Original Restaurado)
    if (certifications?.length > 0) {
      blocks.push(
        wrap(
          <div
            className="border-b pb-1 mt-2"
            style={{ borderColor: `${colorTheme}30` }}
          >
            <h2
              className="text-sm font-black uppercase tracking-[0.15em]"
              style={{ color: colorTheme }}
            >
              Certificações
            </h2>
          </div>,
          "cert-title-block",
          "pb-4",
        ),
      );
      certifications.forEach((cert, i) => {
        blocks.push(
          wrap(
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {cert.name}
                </h3>
                <p className="text-slate-600 text-[12px]">{cert.issuer}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-black uppercase">
                {cert.date}
              </span>
            </div>,
            `cert-${i}`,
            "pb-3",
          ),
        );
      });
    }

    // Voluntariado (Design Original Restaurado)
    if (volunteering?.length > 0) {
      blocks.push(
        wrap(
          <div
            className="border-b pb-1 mt-2"
            style={{ borderColor: `${colorTheme}30` }}
          >
            <h2
              className="text-sm font-black uppercase tracking-[0.15em]"
              style={{ color: colorTheme }}
            >
              Voluntariado
            </h2>
          </div>,
          "vol-title-block",
          "pb-4",
        ),
      );
      volunteering.forEach((vol, i) => {
        blocks.push(
          wrap(
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-slate-900 text-sm">
                  {vol.organization}
                </h3>
                <span className="text-sm text-slate-700 font-medium">
                  {vol.role}
                </span>
              </div>
              {vol.description && (
                <p className="text-[12px] text-slate-600">{vol.description}</p>
              )}
            </div>,
            `vol-${i}`,
          ),
        );
      });
    }

    // Projetos
    if (projects?.length > 0) {
      blocks.push(
        wrap(
          <div
            className="border-b pb-1 mt-2"
            style={{ borderColor: `${colorTheme}30` }}
          >
            <h2
              className="text-sm font-black uppercase tracking-[0.15em]"
              style={{ color: colorTheme }}
            >
              Projetos
            </h2>
          </div>,
          "proj-title-block",
          "pb-4",
        ),
      );
      projects.forEach((proj, i) => {
        blocks.push(
          wrap(
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">
                  {proj.name}
                </h3>
                <div className="flex gap-3 text-[10px] font-bold uppercase tracking-tighter">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      REPO
                    </a>
                  )}
                  {proj.deploy && (
                    <a
                      href={proj.deploy}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      LIVE
                    </a>
                  )}
                </div>
              </div>
              {proj.description && (
                <p className="text-[12.5px] text-slate-600 leading-relaxed font-medium">
                  {proj.description}
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

    const timeout = setTimeout(distribute, 100);
    return () => clearTimeout(timeout);
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
            fontFamily: "Inter, sans-serif",
          }}
        >
          {contentBlocks}
        </div>
      </div>

      {pagesToRender.map((pageContent, idx) => (
        <div
          key={idx}
          className="a4-page relative flex flex-col bg-white overflow-hidden shadow-2xl transition-all"
          style={{
            width: "210mm",
            height: "297mm",
            padding: "25mm",
            color: "#1e293b",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div
            className="flex flex-col relative"
            style={{ height: `${SAFE_PAGE_HEIGHT}px` }}
          >
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
