"use client";

import { ResumeData } from "@/types/resume";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState, useMemo } from "react";

interface ResumeViewProps {
  data: ResumeData;
  colorTheme?: string;
}

export function ResumeView({ data, colorTheme = "#000000" }: ResumeViewProps) {
  const [pages, setPages] = useState<React.ReactNode[][]>([[]]);
  const measureRef = useRef<HTMLDivElement>(null);

  const A4_HEIGHT_PX = 1122;
  const PAGE_MARGIN_TOTAL_PX = 150;

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

    // Header
    blocks.push(
      <header
        key="header"
        className="flex flex-col gap-3 border-b-2 pb-6 mb-6"
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
    );

    // Experiência
    if (experiences?.length > 0) {
      blocks.push(
        <div
          key="exp-title"
          className="border-b pb-1 mb-4"
          style={{ borderColor: `${colorTheme}30` }}
        >
          <h2
            className="text-sm font-black uppercase tracking-[0.15em]"
            style={{ color: colorTheme }}
          >
            Experiência Profissional
          </h2>
        </div>,
      );
      experiences.forEach((exp, i) => {
        blocks.push(
          <div key={`exp-${i}`} className="flex flex-col gap-1.5 mb-6">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-[15px] text-slate-900">
                {exp.position}
              </h3>
              <span className="text-[10px] text-slate-500 font-black uppercase">
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
        );
      });
    }

    // Educação
    if (educations?.length > 0) {
      blocks.push(
        <div
          key="edu-title"
          className="border-b pb-1 mb-4 mt-2"
          style={{ borderColor: `${colorTheme}30` }}
        >
          <h2
            className="text-sm font-black uppercase tracking-[0.15em]"
            style={{ color: colorTheme }}
          >
            Formação Acadêmica
          </h2>
        </div>,
      );
      educations.forEach((edu, i) => {
        blocks.push(
          <div
            key={`edu-${i}`}
            className="flex justify-between items-baseline mb-4"
          >
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {edu.degree} em {edu.field}
              </h3>
              <p className="text-slate-600 text-[13px] font-medium">
                {edu.school}
              </p>
            </div>
            <span className="text-[10px] text-slate-500 font-black uppercase">
              {edu.graduationDate}
            </span>
          </div>,
        );
      });
    }

    // Skills
    if (skills?.length > 0) {
      blocks.push(
        <div
          key="skills-title"
          className="border-b pb-1 mb-4 mt-2"
          style={{ borderColor: `${colorTheme}30` }}
        >
          <h2
            className="text-sm font-black uppercase tracking-[0.15em]"
            style={{ color: colorTheme }}
          >
            Habilidades Técnicas
          </h2>
        </div>,
      );
      blocks.push(
        <div key="skills-list" className="flex flex-wrap gap-x-2 gap-y-2 mb-6">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold rounded uppercase tracking-tighter"
            >
              {skill}
            </span>
          ))}
        </div>,
      );
    }

    // Idiomas
    if (languages?.length > 0) {
      blocks.push(
        <div
          key="lang-title"
          className="border-b pb-1 mb-4 mt-2"
          style={{ borderColor: `${colorTheme}30` }}
        >
          <h2
            className="text-sm font-black uppercase tracking-[0.15em]"
            style={{ color: colorTheme }}
          >
            Idiomas
          </h2>
        </div>,
      );
      blocks.push(
        <div key="lang-list" className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
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
      );
    }

    // Certificações
    if (certifications?.length > 0) {
      blocks.push(
        <div
          key="cert-title"
          className="border-b pb-1 mb-4 mt-2"
          style={{ borderColor: `${colorTheme}30` }}
        >
          <h2
            className="text-sm font-black uppercase tracking-[0.15em]"
            style={{ color: colorTheme }}
          >
            Certificações
          </h2>
        </div>,
      );
      certifications.forEach((cert, i) => {
        blocks.push(
          <div
            key={`cert-${i}`}
            className="flex justify-between items-baseline mb-3"
          >
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{cert.name}</h3>
              <p className="text-slate-600 text-[12px]">{cert.issuer}</p>
            </div>
            <span className="text-[10px] text-slate-500 font-black uppercase">
              {cert.date}
            </span>
          </div>,
        );
      });
    }

    // Voluntariado
    if (volunteering?.length > 0) {
      blocks.push(
        <div
          key="vol-title"
          className="border-b pb-1 mb-4 mt-2"
          style={{ borderColor: `${colorTheme}30` }}
        >
          <h2
            className="text-sm font-black uppercase tracking-[0.15em]"
            style={{ color: colorTheme }}
          >
            Voluntariado
          </h2>
        </div>,
      );
      volunteering.forEach((vol, i) => {
        blocks.push(
          <div key={`vol-${i}`} className="flex flex-col gap-1 mb-4">
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
        );
      });
    }

    // Projetos
    if (projects?.length > 0) {
      blocks.push(
        <div
          key="proj-title"
          className="border-b pb-1 mb-4 mt-2"
          style={{ borderColor: `${colorTheme}30` }}
        >
          <h2
            className="text-sm font-black uppercase tracking-[0.15em]"
            style={{ color: colorTheme }}
          >
            Projetos
          </h2>
        </div>,
      );
      projects.forEach((proj, i) => {
        blocks.push(
          <div key={`proj-${i}`} className="flex flex-col gap-1 mb-5">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">{proj.name}</h3>
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
        );
      });
    }

    return blocks;
  }, [data, colorTheme]);

  useEffect(() => {
    const measureAndDistribute = () => {
      if (!measureRef.current) return;
      const children = Array.from(measureRef.current.children) as HTMLElement[];
      const distributedPages: React.ReactNode[][] = [[]];
      let currentIdx = 0;
      let currentHeight = 0;
      const MAX_HEIGHT = A4_HEIGHT_PX - PAGE_MARGIN_TOTAL_PX;

      children.forEach((child, index) => {
        const height = child.getBoundingClientRect().height;
        if (
          currentHeight + height > MAX_HEIGHT &&
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
    const timeout = setTimeout(measureAndDistribute, 100);
    return () => clearTimeout(timeout);
  }, [contentBlocks]);

  return (
    <div className="flex flex-col items-center gap-10">
      <div
        ref={measureRef}
        className="absolute invisible pointer-events-none flex flex-col"
        style={{ width: "170mm" }}
      >
        {contentBlocks}
      </div>
      {pages.map((pageContent, idx) => (
        <div
          key={idx}
          className="a4-page relative flex flex-col bg-white"
          style={{
            width: "210mm",
            height: "297mm",
            padding: "20mm",
            boxShadow: "0 10px 50px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div className="absolute top-4 right-8 text-[9px] font-black text-slate-300 uppercase tracking-widest no-print">
            PÁGINA {idx + 1}
          </div>
          <div className="flex flex-col">{pageContent}</div>
        </div>
      ))}
    </div>
  );
}
