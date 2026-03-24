"use client";

import { ResumeData } from "@/types/resume";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  GithubLogo,
  Link as LinkIcon,
  MapPin,
  Envelope,
  Phone,
} from "@phosphor-icons/react";

interface PortfolioViewProps {
  data: ResumeData;
  colorTheme?: string;
}

export function PortfolioView({
  data,
  colorTheme = "#2563eb",
}: PortfolioViewProps) {
  const { personalInfo, experiences, educations, skills, projects } = data;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-24 font-sans text-foreground">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-24"
      >
        {/* Hero Section */}
        <motion.section variants={item} className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Disponível para novas oportunidades
          </div>

          <h1
            className="text-5xl md:text-7xl font-black tracking-tighter"
            style={{ color: colorTheme }}
          >
            {personalInfo.name || "Seu Nome"}
          </h1>

          {personalInfo.summary && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {personalInfo.summary}
            </p>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <Envelope size={18} weight="duotone" /> {personalInfo.email}
              </a>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin size={18} weight="duotone" /> {personalInfo.location}
              </div>
            )}
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <LinkIcon size={18} weight="duotone" /> LinkedIn
              </a>
            )}
            {personalInfo.website && (
              <a
                href={personalInfo.website}
                target="_blank"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <LinkIcon size={18} weight="duotone" /> Portfólio
              </a>
            )}
          </div>
        </motion.section>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <motion.section variants={item} className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Habilidades & Tecnologias
            </h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-xl bg-card border shadow-sm text-sm font-semibold hover:border-primary hover:text-primary transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experiência */}
        {experiences && experiences.length > 0 && (
          <motion.section variants={item} className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Experiência Profissional
            </h2>
            <div className="space-y-12">
              {experiences.map((exp, i) => (
                <div key={i} className="relative pl-8 md:pl-0">
                  <div className="hidden md:block absolute left-0 top-2 w-2 h-2 rounded-full bg-primary/50 ring-4 ring-background" />
                  <div className="hidden md:block absolute left-[3px] top-4 bottom-[-3rem] w-px bg-border last:hidden" />

                  <div className="md:pl-8 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                      <h3 className="text-xl font-bold">{exp.position}</h3>
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        {exp.startDate} —{" "}
                        {exp.current ? "Presente" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-primary font-semibold">
                      {exp.company}
                    </div>
                    {exp.description && (
                      <div className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none pt-2">
                        <ReactMarkdown>{exp.description}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Projetos */}
        {projects && projects.length > 0 && (
          <motion.section variants={item} className="space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Projetos em Destaque
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <div
                  key={i}
                  className="group p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all hover:border-primary/50 flex flex-col h-full"
                >
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {proj.name}
                  </h3>
                  {proj.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                      {proj.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/50">
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:text-primary transition-colors"
                      >
                        <GithubLogo size={16} weight="duotone" /> Código
                      </a>
                    )}
                    {proj.deploy && (
                      <a
                        href={proj.deploy}
                        target="_blank"
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:text-primary transition-colors"
                      >
                        <LinkIcon size={16} weight="duotone" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}
