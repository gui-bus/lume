"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResumeSchema } from "@/lib/validations/resume-schema";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Trash,
  User,
  Toolbox,
  Briefcase,
  GraduationCap,
  GitBranch,
  CaretRight,
  CaretLeft,
  Translate,
  Certificate,
  HandHeart,
  PlusCircle,
  DotsSixVertical,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { saveResume } from "@/app/actions/resume-actions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ResumeFormProps {
  initialData?: ResumeData;
  resumeId?: string;
  onDataChange: (data: ResumeData) => void;
  onIdGenerated?: (id: string) => void;
}

const defaultValues: ResumeData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  experiences: [],
  educations: [],
  skills: [],
  projects: [],
  languages: [],
  certifications: [],
  volunteering: [],
};

const STEPS = [
  { id: "identidade", label: "Perfil", icon: User },
  { id: "stack", label: "Stack", icon: Toolbox },
  { id: "jornada", label: "Jornada", icon: Briefcase },
  { id: "formacao", label: "Formação", icon: GraduationCap },
  { id: "projetos", label: "Projetos", icon: GitBranch },
  { id: "extra", label: "Extras", icon: PlusCircle },
];

export function ResumeForm({
  initialData,
  resumeId,
  onDataChange,
  onIdGenerated,
}: ResumeFormProps) {
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResumeData>({
    resolver: zodResolver(ResumeSchema),
    defaultValues: initialData || defaultValues,
    shouldUnregister: false,
  });

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({ control, name: "experiences" });
  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({ control, name: "educations" });
  const {
    fields: projFields,
    append: appendProj,
    remove: removeProj,
  } = useFieldArray({ control, name: "projects" });
  const {
    fields: langFields,
    append: appendLang,
    remove: removeLang,
  } = useFieldArray({ control, name: "languages" });
  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({ control, name: "certifications" });
  const {
    fields: volFields,
    append: appendVol,
    remove: removeVol,
  } = useFieldArray({ control, name: "volunteering" });

  const watchedData = watch();
  const debouncedData = useDebounce(watchedData, 1000);
  const dataString = JSON.stringify(watchedData);

  useEffect(() => {
    onDataChange(watchedData);
  }, [dataString, onDataChange]);

  useEffect(() => {
    if (debouncedData) {
      localStorage.setItem("resume-draft", JSON.stringify(debouncedData));
      const performSave = async () => {
        try {
          const result = await saveResume(resumeId, debouncedData);
          if (!resumeId && result.id) {
            localStorage.setItem("resume-id", result.id);
            onIdGenerated?.(result.id);
          }
        } catch (error) {
          console.error(error);
        }
      };
      performSave();
    }
  }, [debouncedData, resumeId, onIdGenerated]);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Premium Step Indicator */}
      <div className="px-4 pt-6 pb-4 border-b bg-muted/5 shrink-0">
        <div className="flex w-full gap-1.5 p-1.5 bg-muted/20 rounded-2xl border border-border/40">
          {STEPS.map((step, i) => {
            const isActive = activeStep === i;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={cn(
                  "relative flex-1 h-11 rounded-xl flex items-center justify-center transition-all duration-300 gap-2 overflow-hidden",
                  isActive
                    ? "bg-background text-primary shadow-sm ring-1 ring-border/50 flex-[2.5]"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40",
                )}
              >
                <step.icon
                  size={20}
                  weight={isActive ? "fill" : "duotone"}
                  className="shrink-0"
                />
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, x: -10, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: "auto" }}
                      exit={{ opacity: 0, x: -10, width: 0 }}
                      className="text-[10px] font-black uppercase tracking-widest overflow-hidden whitespace-nowrap"
                    >
                      {step.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-12 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-10"
          >
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">
                Passo {activeStep + 1}
              </div>
              <h2 className="text-4xl font-black tracking-tight">
                {STEPS[activeStep].label}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                Refine suas informações profissionais.
              </p>
            </div>

            {activeStep === 0 && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Nome Completo
                    </Label>
                    <Input
                      {...register("personalInfo.name")}
                      placeholder="Ex: Linus Torvalds"
                      className="input-glow h-12 bg-muted/20 border-border/50 font-bold"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      E-mail
                    </Label>
                    <Input
                      {...register("personalInfo.email")}
                      placeholder="linus@linux.org"
                      className="input-glow h-12 bg-muted/20 border-border/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Telefone
                    </Label>
                    <Input
                      {...register("personalInfo.phone")}
                      placeholder="(11) 99999-9999"
                      className="input-glow h-12 bg-muted/20 border-border/50"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Localização
                    </Label>
                    <Input
                      {...register("personalInfo.location")}
                      placeholder="São Paulo, SP"
                      className="input-glow h-12 bg-muted/20 border-border/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      LinkedIn
                    </Label>
                    <Input
                      {...register("personalInfo.linkedin")}
                      className="input-glow h-12 bg-muted/20 border-border/50"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Portfólio
                    </Label>
                    <Input
                      {...register("personalInfo.website")}
                      className="input-glow h-12 bg-muted/20 border-border/50"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Resumo Profissional
                  </Label>
                  <Textarea
                    {...register("personalInfo.summary")}
                    placeholder="Uma breve introdução..."
                    className="min-h-[150px] input-glow bg-muted/20 border-border/50 leading-relaxed py-4"
                  />
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Tecnologias & Expertises
                </Label>
                <Textarea
                  {...register("skills", {
                    setValueAs: (v) =>
                      typeof v === "string"
                        ? v
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s !== "")
                        : v,
                  })}
                  placeholder="React, Node.js, TypeScript, Docker, AWS..."
                  className="min-h-[350px] input-glow text-xl font-mono leading-relaxed bg-muted/20 border-border/50 p-8"
                />
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">
                  Separe cada tecnologia utilizando vírgulas
                </p>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-8">
                {expFields.map((field, i) => (
                  <Card
                    key={field.id}
                    className="border-border/50 bg-muted/10 relative overflow-hidden group shadow-none hover:bg-muted/20 transition-all duration-500"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all h-8 w-8"
                      onClick={() => removeExp(i)}
                    >
                      <Trash size={16} />
                    </Button>
                    <CardContent className="p-8 pt-12 grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                          Empresa
                        </Label>
                        <Input
                          {...register(`experiences.${i}.company`)}
                          className="h-11 bg-background/50 border-border/50 font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                          Cargo
                        </Label>
                        <Input
                          {...register(`experiences.${i}.position`)}
                          className="h-11 bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                          Início
                        </Label>
                        <Input
                          {...register(`experiences.${i}.startDate`)}
                          placeholder="Jan 2020"
                          className="h-11 bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                          Fim
                        </Label>
                        <Input
                          {...register(`experiences.${i}.endDate`)}
                          disabled={watch(`experiences.${i}.current`)}
                          className="h-11 bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-3 bg-background/30 p-3 rounded-lg border border-border/30">
                        <input
                          type="checkbox"
                          id={`exp-cur-${i}`}
                          {...register(`experiences.${i}.current`)}
                          className="w-4 h-4 rounded border-border bg-background accent-primary"
                        />
                        <Label
                          htmlFor={`exp-cur-${i}`}
                          className="text-xs font-bold text-muted-foreground uppercase tracking-widest"
                        >
                          Ainda trabalho nesta empresa
                        </Label>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                          Descrição
                        </Label>
                        <Textarea
                          {...register(`experiences.${i}.description`)}
                          className="min-h-[150px] text-sm bg-background/50 border-border/50 leading-relaxed"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  className="w-full h-20 border-dashed border-2 bg-muted/5 hover:bg-muted/20 border-border/50 rounded-2xl transition-all"
                  onClick={() =>
                    appendExp({
                      company: "",
                      position: "",
                      startDate: "",
                      endDate: "",
                      current: false,
                      description: "",
                    })
                  }
                >
                  <PlusCircle
                    size={20}
                    weight="duotone"
                    className="mr-2 text-primary"
                  />
                  <span className="font-black uppercase tracking-widest text-xs">
                    Adicionar Experiência
                  </span>
                </Button>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-8">
                {eduFields.map((field, i) => (
                  <Card
                    key={field.id}
                    className="border-border/50 bg-muted/10 relative group shadow-none hover:bg-muted/20 transition-all"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => removeEdu(i)}
                    >
                      <Trash size={16} />
                    </Button>
                    <CardContent className="p-8 pt-12 grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                          Instituição
                        </Label>
                        <Input
                          {...register(`educations.${i}.school`)}
                          className="h-11 bg-background/50 border-border/50 font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                          Grau
                        </Label>
                        <Input
                          {...register(`educations.${i}.degree`)}
                          className="h-11 bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                          Área
                        </Label>
                        <Input
                          {...register(`educations.${i}.field`)}
                          className="h-11 bg-background/50 border-border/50"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                          Data de Graduação
                        </Label>
                        <Input
                          {...register(`educations.${i}.graduationDate`)}
                          placeholder="2019"
                          className="h-11 bg-background/50 border-border/50"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  className="w-full h-20 border-dashed border-2 bg-muted/5 hover:bg-muted/20 border-border/50 rounded-2xl transition-all"
                  onClick={() =>
                    appendEdu({
                      school: "",
                      degree: "",
                      field: "",
                      graduationDate: "",
                    })
                  }
                >
                  <PlusCircle
                    size={20}
                    weight="duotone"
                    className="mr-2 text-primary"
                  />
                  <span className="font-black uppercase tracking-widest text-xs">
                    Adicionar Formação
                  </span>
                </Button>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-8">
                {projFields.map((field, i) => (
                  <Card
                    key={field.id}
                    className="border-border/50 bg-muted/10 relative group shadow-none hover:bg-muted/20 transition-all"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => removeProj(i)}
                    >
                      <Trash size={16} />
                    </Button>
                    <CardContent className="p-8 pt-12 space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                          Nome do Projeto
                        </Label>
                        <Input
                          {...register(`projects.${i}.name`)}
                          className="h-11 bg-background/50 border-border/50 font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest">
                            GitHub
                          </Label>
                          <Input
                            {...register(`projects.${i}.github`)}
                            className="h-11 bg-background/50 border-border/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest">
                            Deploy
                          </Label>
                          <Input
                            {...register(`projects.${i}.deploy`)}
                            className="h-11 bg-background/50 border-border/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">
                          Descrição
                        </Label>
                        <Textarea
                          {...register(`projects.${i}.description`)}
                          className="min-h-[120px] text-sm bg-background/50 border-border/50 leading-relaxed"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  className="w-full h-20 border-dashed border-2 bg-muted/5 hover:bg-muted/20 border-border/50 rounded-2xl transition-all"
                  onClick={() =>
                    appendProj({
                      name: "",
                      github: "",
                      deploy: "",
                      description: "",
                    })
                  }
                >
                  <PlusCircle
                    size={20}
                    weight="duotone"
                    className="mr-2 text-primary"
                  />
                  <span className="font-black uppercase tracking-widest text-xs">
                    Adicionar Projeto
                  </span>
                </Button>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-12">
                {/* Idiomas */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Translate
                      size={24}
                      weight="duotone"
                      className="text-primary"
                    />{" "}
                    <Label className="text-xl font-black uppercase tracking-tight">
                      Idiomas
                    </Label>
                  </div>
                  <div className="grid gap-4">
                    {langFields.map((field, i) => (
                      <div
                        key={field.id}
                        className="flex gap-4 items-end bg-muted/5 p-4 rounded-xl border border-border/30"
                      >
                        <div className="flex-1 space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest">
                            Idioma
                          </Label>
                          <Input
                            {...register(`languages.${i}.name`)}
                            className="h-10 bg-background/50"
                            placeholder="Ex: Inglês"
                          />
                        </div>
                        <div className="w-48 space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest">
                            Proficiência
                          </Label>
                          <select
                            {...register(`languages.${i}.level`)}
                            className="w-full h-10 rounded-lg border border-border/50 bg-background/50 px-3 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                          >
                            <option value="Básico">Básico</option>
                            <option value="Intermediário">Intermediário</option>
                            <option value="Avançado">Avançado</option>
                            <option value="Fluente">Fluente</option>
                            <option value="Nativo">Nativo</option>
                          </select>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-10 w-10"
                          onClick={() => removeLang(i)}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-fit font-bold uppercase tracking-widest text-[10px]"
                      onClick={() => appendLang({ name: "", level: "Básico" })}
                    >
                      <Plus weight="bold" className="mr-2" /> Novo Idioma
                    </Button>
                  </div>
                </div>

                {/* Certificações */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Certificate
                      size={24}
                      weight="duotone"
                      className="text-primary"
                    />{" "}
                    <Label className="text-xl font-black uppercase tracking-tight">
                      Certificações
                    </Label>
                  </div>
                  <div className="grid gap-4">
                    {certFields.map((field, i) => (
                      <div
                        key={field.id}
                        className="flex gap-4 items-end bg-muted/5 p-6 rounded-xl border border-border/30 group"
                      >
                        <div className="flex-[2] space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest">
                            Certificado
                          </Label>
                          <Input
                            {...register(`certifications.${i}.name`)}
                            className="h-10 bg-background/50"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest">
                            Emissor
                          </Label>
                          <Input
                            {...register(`certifications.${i}.issuer`)}
                            className="h-10 bg-background/50"
                          />
                        </div>
                        <div className="w-28 space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest">
                            Ano
                          </Label>
                          <Input
                            {...register(`certifications.${i}.date`)}
                            className="h-10 bg-background/50 text-center"
                            placeholder="2023"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-10 w-10"
                          onClick={() => removeCert(i)}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-fit font-bold uppercase tracking-widest text-[10px]"
                      onClick={() =>
                        appendCert({ name: "", issuer: "", date: "" })
                      }
                    >
                      <Plus weight="bold" className="mr-2" /> Nova Certificação
                    </Button>
                  </div>
                </div>

                {/* Trabalho Voluntário */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <HandHeart
                      size={24}
                      weight="duotone"
                      className="text-primary"
                    />{" "}
                    <Label className="text-xl font-black uppercase tracking-tight">
                      Voluntariado
                    </Label>
                  </div>
                  <div className="grid gap-4">
                    {volFields.map((field, i) => (
                      <Card
                        key={field.id}
                        className="border-border/50 bg-muted/10 relative overflow-hidden group shadow-none"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 h-8 w-8"
                          onClick={() => removeVol(i)}
                        >
                          <Trash size={16} />
                        </Button>
                        <CardContent className="p-6 pt-10 grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest">
                              Organização
                            </Label>
                            <Input
                              {...register(`volunteering.${i}.organization`)}
                              className="h-10 bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest">
                              Papel
                            </Label>
                            <Input
                              {...register(`volunteering.${i}.role`)}
                              className="h-10 bg-background/50"
                            />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest">
                              Sobre o trabalho
                            </Label>
                            <Textarea
                              {...register(`volunteering.${i}.description`)}
                              className="text-sm min-h-[80px] bg-background/50 leading-relaxed"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-fit font-bold uppercase tracking-widest text-[10px]"
                      onClick={() =>
                        appendVol({
                          organization: "",
                          role: "",
                          startDate: "",
                          current: false,
                          description: "",
                        })
                      }
                    >
                      <Plus weight="bold" className="mr-2" /> Novo Registro
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modern Navigation Footer */}
      <div className="px-10 py-6 border-t bg-background/80 backdrop-blur-xl shrink-0 flex justify-between items-center">
        <Button
          variant="ghost"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((s) => s - 1)}
          className="rounded-xl px-6 h-11 font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <CaretLeft weight="bold" className="mr-2" /> Anterior
        </Button>
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-500",
                activeStep === i ? "bg-primary w-6" : "bg-border/50",
              )}
            />
          ))}
        </div>
        <Button
          onClick={() =>
            activeStep < STEPS.length - 1 && setActiveStep((s) => s + 1)
          }
          disabled={activeStep === STEPS.length - 1}
          className="rounded-xl px-10 h-11 shadow-xl shadow-primary/10 transition-all hover:scale-[1.03] active:scale-95 font-black uppercase tracking-widest text-xs"
        >
          Próximo <CaretRight weight="bold" className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
