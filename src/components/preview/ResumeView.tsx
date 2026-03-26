"use client";

import { ResumeData } from "@/types/resume";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";

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
    courses,
  } = data;

  const content = useMemo(() => {
    return (
      <div className="a4-page flex flex-col shadow-none text-left">
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
                    <h3 className="font-bold text-[14px] text-slate-900 uppercase">
                      {exp.company} —{" "}
                      <span className="font-semibold normal-case text-slate-600">
                        {exp.position}
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {exp.startDate} —{" "}
                      {exp.current ? t("current") : exp.endDate}
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
                    <h3 className="font-bold text-[13px] text-slate-900 uppercase">
                      {edu.school}{" "}
                      <span className="font-semibold normal-case text-slate-600">
                        | {edu.degree} — {edu.field}
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {edu.graduationDate}
                    </span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {courses?.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <h2
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: colorTheme }}
                >
                  {t("courses")}
                </h2>
                <div className="flex-1 h-[0.5px] bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {courses.map((c, i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[12px] text-slate-900 truncate pr-2">
                      {c.name}
                    </h3>
                    <span className="text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">
                      {c.startDate && `${c.startDate} — `}
                      {c.current ? t("current") : c.endDate}
                    </span>
                  </div>
                ))}
              </div>
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
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                {languages.map((l, i) => {
                  const getLevelDots = (level: string) => {
                    const levels = [
                      "Básico",
                      "Intermediário",
                      "Avançado",
                      "Fluente",
                      "Nativo",
                    ];
                    const index = levels.indexOf(level) + 1;
                    return (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div
                            key={dot}
                            className={`w-1.5 h-1.5 rounded-full ${
                              dot <= index ? "bg-slate-400" : "bg-slate-100"
                            }`}
                          />
                        ))}
                      </div>
                    );
                  };

                  return (
                    <div key={i} className="space-y-2">
                      <span className="font-black text-[11px] text-slate-800 uppercase tracking-wider block mb-1">
                        {l.name}
                      </span>
                      <div className="grid grid-cols-1 gap-1">
                        <div className="flex items-center justify-between group">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                            Conversação
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-slate-600 uppercase">
                              {l.conversation}
                            </span>
                            {getLevelDots(l.conversation)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between group">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                            Escrita
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-slate-600 uppercase">
                              {l.writing}
                            </span>
                            {getLevelDots(l.writing)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between group">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                            Leitura
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-slate-600 uppercase">
                              {l.reading}
                            </span>
                            {getLevelDots(l.reading)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

  return content;
}
