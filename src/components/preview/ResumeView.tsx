"use client";

import { ResumeData } from "@/types/resume";
import ReactMarkdown from "react-markdown";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

interface ResumeViewProps {
  data: ResumeData;
  colorTheme?: string;
}

export function ResumeView({ data, colorTheme = "#18181b" }: ResumeViewProps) {
  const t = useTranslations("common.resume");
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

  const content = useMemo(() => {
    return (
      <div className="flex flex-col bg-white text-slate-900 p-[20mm] shadow-none min-h-[297mm] w-[210mm] text-left">
        {/* Header */}
        <div className="flex flex-col gap-2 pb-8">
          <h1
            className="text-[28px] font-bold tracking-tight leading-tight uppercase"
            style={{ color: colorTheme }}
          >
            {personalInfo.name || t("yourName")}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold text-slate-500">
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-lume-blue hover:underline"
              >
                {personalInfo.email}
              </a>
            )}
            {personalInfo.phone && (
              <>
                <span className="text-slate-300 font-medium">•</span>
                <a
                  href={`https://wa.me/${personalInfo.phone.replace(/\D/g, "")}?text=${encodeURIComponent(t("demo") === "Demo" ? "I saw your resume" : "Vim pelo seu currículo")}`}
                  target="_blank"
                  className="text-lume-blue hover:underline"
                >
                  {personalInfo.phone}
                </a>
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
                  className="text-lume-blue font-bold uppercase tracking-wider"
                >
                  LinkedIn
                </a>
              </>
            )}
            {personalInfo.github && (
              <>
                <span className="text-slate-300">•</span>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  className="text-lume-blue font-bold uppercase tracking-wider"
                >
                  GitHub
                </a>
              </>
            )}
            {personalInfo.website && (
              <>
                <span className="text-slate-300">•</span>
                <a
                  href={personalInfo.website}
                  target="_blank"
                  className="text-lume-blue font-bold uppercase tracking-wider"
                >
                  {t("portfolio")}
                </a>
              </>
            )}
          </div>
          {personalInfo.summary && (
            <p className="text-[12px] text-slate-600 leading-relaxed mt-2">
              {personalInfo.summary}
            </p>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {experiences?.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <h2
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: colorTheme }}
                >
                  {t("experience")}
                </h2>
                <div className="flex-1 h-[0.5px] bg-slate-200" />
              </div>
              {experiences.map((exp, i) => (
                <div key={i} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[14px] text-slate-900">
                      {exp.position}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {exp.startDate} —{" "}
                      {exp.current ? t("current") : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-600 font-semibold text-[13px]">
                      {exp.company}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-[12px] text-slate-600 leading-relaxed prose prose-sm max-w-none mt-1">
                      <ReactMarkdown>{exp.description}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {educations?.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <h2
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: colorTheme }}
                >
                  {t("education")}
                </h2>
                <div className="flex-1 h-[0.5px] bg-slate-200" />
              </div>
              {educations.map((edu, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px] text-slate-900">
                      {edu.degree} {t("at")} {edu.field}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {edu.graduationDate}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[12px]">{edu.school}</p>
                </div>
              ))}
            </section>
          )}

          {skills?.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <h2
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: colorTheme }}
                >
                  {t("skills")}
                </h2>
                <div className="flex-1 h-[0.5px] bg-slate-200" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold rounded"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {languages?.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <h2
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: colorTheme }}
                >
                  {t("languages")}
                </h2>
                <div className="flex-1 h-[0.5px] bg-slate-200" />
              </div>
              <div className="space-y-1.5">
                {languages.map((l, i) => (
                  <div key={i} className="flex gap-2 items-center text-[11px]">
                    <span className="font-bold text-slate-700">{l.name}:</span>
                    <span className="text-slate-500 uppercase text-[10px]">
                      {l.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications?.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <h2
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: colorTheme }}
                >
                  {t("certifications")}
                </h2>
                <div className="flex-1 h-[0.5px] bg-slate-200" />
              </div>
              {certifications.map((c, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[12px] text-slate-900">
                      {c.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {c.date}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{c.issuer}</p>
                </div>
              ))}
            </section>
          )}

          {projects?.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <h2
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: colorTheme }}
                >
                  {t("projects")}
                </h2>
                <div className="flex-1 h-[0.5px] bg-slate-200" />
              </div>
              {projects.map((p, i) => (
                <div key={i} className="mb-4 last:mb-0">
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
                          {t("repo")}
                        </a>
                      )}
                      {p.deploy && (
                        <a
                          href={p.deploy}
                          target="_blank"
                          className="text-blue-600"
                        >
                          {t("demo")}
                        </a>
                      )}
                    </div>
                  </div>
                  {p.description && (
                    <p className="text-[11.5px] text-slate-600 leading-relaxed">
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}

          {volunteering?.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <h2
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: colorTheme }}
                >
                  {t("volunteering")}
                </h2>
                <div className="flex-1 h-[0.5px] bg-slate-200" />
              </div>
              {volunteering.map((v, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px] text-slate-900">
                      {v.organization}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {v.role}
                    </span>
                  </div>
                  {v.description && (
                    <p className="text-[11.5px] text-slate-600 leading-relaxed mt-1">
                      {v.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    );
  }, [data, colorTheme, t]);

  return (
    <div className="flex flex-col items-center gap-10 no-print">{content}</div>
  );
}
