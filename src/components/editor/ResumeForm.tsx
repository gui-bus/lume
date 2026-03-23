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
} from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
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
};

const STEPS = [
  { id: "identidade", label: "Identidade", icon: User },
  { id: "stack", label: "Stack", icon: Toolbox },
  { id: "jornada", label: "Jornada", icon: Briefcase },
  { id: "formacao", label: "Formação", icon: GraduationCap },
  { id: "projetos", label: "Projetos", icon: GitBranch },
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

  const watchedData = watch();
  const debouncedData = useDebounce(watchedData, 1000);

  // CRÍTICO: Usar JSON.stringify para evitar loops infinitos de referência
  const dataString = JSON.stringify(watchedData);

  useEffect(() => {
    onDataChange(watchedData);
  }, [dataString, onDataChange]); // Só dispara se os VALORES mudarem

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
          console.error("Auto-save error:", error);
        }
      };
      performSave();
    }
  }, [debouncedData, resumeId, onIdGenerated]);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Step Indicator */}
      <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b bg-muted/5 shrink-0">
        <div className="flex gap-2">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                activeStep === i
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              <step.icon
                size={18}
                weight={activeStep === i ? "fill" : "duotone"}
              />
            </button>
          ))}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Passo {activeStep + 1} de {STEPS.length}
        </span>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-10 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                {STEPS[activeStep].label}
              </h2>
              <p className="text-sm text-muted-foreground">
                Mantenha seu currículo sempre atualizado.
              </p>
            </div>

            {activeStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input
                      {...register("personalInfo.name")}
                      placeholder="Ex: Linus Torvalds"
                      className="input-glow h-11 bg-card/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input
                      {...register("personalInfo.email")}
                      placeholder="linus@linux.org"
                      className="input-glow h-11 bg-card/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      {...register("personalInfo.phone")}
                      placeholder="(11) 99999-9999"
                      className="input-glow h-11 bg-card/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Localização</Label>
                    <Input
                      {...register("personalInfo.location")}
                      placeholder="São Paulo, SP"
                      className="input-glow h-11 bg-card/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input
                      {...register("personalInfo.linkedin")}
                      placeholder="URL completa"
                      className="input-glow h-11 bg-card/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Portfólio</Label>
                    <Input
                      {...register("personalInfo.website")}
                      placeholder="URL completa"
                      className="input-glow h-11 bg-card/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Resumo Profissional</Label>
                  <Textarea
                    {...register("personalInfo.summary")}
                    placeholder="Uma breve introdução sobre sua jornada..."
                    className="min-h-[120px] input-glow bg-card/50"
                  />
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <Label className="text-base font-bold">
                  Tecnologias & Habilidades
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
                  placeholder="React, Node.js, TypeScript, Docker..."
                  className="min-h-[300px] input-glow text-lg font-mono leading-relaxed bg-card/50"
                />
                <p className="text-xs text-muted-foreground italic">
                  Dica: Separe as tecnologias utilizando vírgulas para uma
                  melhor organização.
                </p>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                {expFields.map((field, i) => (
                  <Card
                    key={field.id}
                    className="border-border/50 bg-card/30 relative overflow-hidden group"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExp(i)}
                    >
                      <Trash size={18} />
                    </Button>
                    <CardContent className="p-6 pt-10 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Empresa</Label>
                        <Input
                          {...register(`experiences.${i}.company`)}
                          className="input-glow h-10 bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo</Label>
                        <Input
                          {...register(`experiences.${i}.position`)}
                          className="input-glow h-10 bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Início</Label>
                        <Input
                          {...register(`experiences.${i}.startDate`)}
                          placeholder="Jan 2020"
                          className="input-glow h-10 bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fim</Label>
                        <Input
                          {...register(`experiences.${i}.endDate`)}
                          placeholder="Atualmente"
                          disabled={watch(`experiences.${i}.current`)}
                          className="input-glow h-10 bg-background/50"
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`exp-cur-${i}`}
                          {...register(`experiences.${i}.current`)}
                          className="rounded accent-primary"
                        />
                        <Label
                          htmlFor={`exp-cur-${i}`}
                          className="text-xs font-medium"
                        >
                          Trabalho atual
                        </Label>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Descrição (Markdown)</Label>
                        <Textarea
                          {...register(`experiences.${i}.description`)}
                          className="min-h-[120px] input-glow text-sm bg-background/50"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  className="w-full h-14 border-dashed border-2 bg-card/20 hover:bg-card/40 transition-all"
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
                  <Plus weight="bold" className="mr-2" /> Adicionar Experiência
                </Button>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                {eduFields.map((field, i) => (
                  <Card
                    key={field.id}
                    className="border-border/50 bg-card/30 relative group"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100"
                      onClick={() => removeEdu(i)}
                    >
                      <Trash size={18} />
                    </Button>
                    <CardContent className="p-6 pt-10 grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label>Instituição</Label>
                        <Input
                          {...register(`educations.${i}.school`)}
                          className="input-glow h-10 bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Grau</Label>
                        <Input
                          {...register(`educations.${i}.degree`)}
                          className="input-glow h-10 bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Área</Label>
                        <Input
                          {...register(`educations.${i}.field`)}
                          className="input-glow h-10 bg-background/50"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Data de Graduação</Label>
                        <Input
                          {...register(`educations.${i}.graduationDate`)}
                          placeholder="2019"
                          className="input-glow h-10 bg-background/50"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  className="w-full h-14 border-dashed border-2 bg-card/20 hover:bg-card/40 transition-all"
                  onClick={() =>
                    appendEdu({
                      school: "",
                      degree: "",
                      field: "",
                      graduationDate: "",
                    })
                  }
                >
                  <Plus weight="bold" className="mr-2" /> Adicionar Formação
                </Button>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-6">
                {projFields.map((field, i) => (
                  <Card
                    key={field.id}
                    className="border-border/50 bg-card/30 relative group"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100"
                      onClick={() => removeProj(i)}
                    >
                      <Trash size={18} />
                    </Button>
                    <CardContent className="p-6 pt-10 space-y-4">
                      <div className="space-y-2">
                        <Label>Nome do Projeto</Label>
                        <Input
                          {...register(`projects.${i}.name`)}
                          className="input-glow h-10 bg-background/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>GitHub</Label>
                          <Input
                            {...register(`projects.${i}.github`)}
                            className="input-glow h-10 bg-background/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Deploy</Label>
                          <Input
                            {...register(`projects.${i}.deploy`)}
                            className="input-glow h-10 bg-background/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea
                          {...register(`projects.${i}.description`)}
                          className="min-h-[100px] input-glow text-sm bg-background/50"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  className="w-full h-14 border-dashed border-2 bg-card/20 hover:bg-card/40 transition-all"
                  onClick={() =>
                    appendProj({
                      name: "",
                      github: "",
                      deploy: "",
                      description: "",
                    })
                  }
                >
                  <Plus weight="bold" className="mr-2" /> Adicionar Projeto
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 border-t bg-background/80 backdrop-blur-md shrink-0 flex justify-between items-center">
        <Button
          variant="ghost"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((s) => s - 1)}
          className="rounded-xl px-6"
        >
          <CaretLeft weight="bold" className="mr-2" /> Anterior
        </Button>
        <Button
          onClick={() =>
            activeStep < STEPS.length - 1 && setActiveStep((s) => s + 1)
          }
          disabled={activeStep === STEPS.length - 1}
          className="rounded-xl px-8 shadow-lg shadow-primary/10 transition-transform hover:scale-105 active:scale-95"
        >
          Próximo <CaretRight weight="bold" className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
