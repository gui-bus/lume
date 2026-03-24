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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { saveResume } from "@/app/actions/resume-actions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";

interface ResumeFormProps {
  initialData: ResumeData;
  resumeId?: string;
  groupId?: string;
  onDataChange: (data: ResumeData) => void;
  onIdGenerated: (id: string, groupId: string) => void;
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

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  onRemove: () => void;
}

function SortableItem({ id, children, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "z-50 shadow-2xl scale-[1.02] cursor-grabbing",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-4 left-3 z-10 p-1.5 rounded-lg hover:bg-background/50 text-muted-foreground/30 hover:text-primary transition-all cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100"
      >
        <DotsSixVertical size={18} weight="bold" />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 h-8 w-8 z-10 transition-all"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <Trash size={16} />
      </Button>
      {children}
    </div>
  );
}

export function ResumeForm({
  initialData,
  resumeId,
  groupId,
  onDataChange,
  onIdGenerated,
}: ResumeFormProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [activeStep, setActiveStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { register, control, watch, reset } = useForm<ResumeData>({
    resolver: zodResolver(ResumeSchema),
    defaultValues: initialData || defaultValues,
  });

  const watchedData = watch();
  const debouncedData = useDebounce(watchedData, 500);

  const lastEmittedRef = useRef<string>(JSON.stringify(initialData));
  const latestDataRef = useRef<ResumeData>(watchedData);

  // Mantém apenas o ref interno atualizado
  useEffect(() => {
    latestDataRef.current = watchedData;
  }, [watchedData]);

  // Gatilho único para Preview e Banco (Debounced)
  useEffect(() => {
    const currentStr = JSON.stringify(debouncedData);
    if (currentStr === lastEmittedRef.current) return;

    // 1. Atualiza o Preview
    onDataChange(debouncedData);
    lastEmittedRef.current = currentStr;

    // 2. Salva no Banco
    const performSave = async () => {
      setIsSaving(true);
      try {
        const result = await saveResume(
          resumeId,
          debouncedData,
          debouncedData.personalInfo.name || t("myResume"),
          false,
          locale,
          groupId,
        );
        if (result.id !== resumeId || result.groupId !== groupId) {
          onIdGenerated(result.id, result.groupId);
        }
      } catch (error) {
        console.error("Save error:", error);
      } finally {
        setIsSaving(false);
      }
    };

    performSave();
  }, [
    debouncedData,
    resumeId,
    groupId,
    locale,
    onIdGenerated,
    onDataChange,
    t,
  ]);

  // Salvamento de segurança ao sair
  useEffect(() => {
    return () => {
      const currentStr = JSON.stringify(latestDataRef.current);
      if (currentStr !== lastEmittedRef.current) {
        saveResume(
          resumeId,
          latestDataRef.current,
          latestDataRef.current.personalInfo.name || "Resume",
          false,
          locale,
          groupId,
        );
      }
    };
  }, [resumeId, groupId, locale]);

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
    move: moveExp,
  } = useFieldArray({ control, name: "experiences" });
  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
    move: moveEdu,
  } = useFieldArray({ control, name: "educations" });
  const {
    fields: projFields,
    append: appendProj,
    remove: removeProj,
    move: moveProj,
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

  const handleDragEnd = useCallback(
    (
      event: DragEndEvent,
      fields: any[],
      move: (f: number, t: number) => void,
    ) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = fields.findIndex((f) => f.id === active.id);
        const newIndex = fields.findIndex((f) => f.id === over.id);
        move(oldIndex, newIndex);
      }
    },
    [],
  );

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative text-left">
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-6 z-[60] flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">
              Salvando...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 pt-6 pb-4 border-b bg-muted/5 shrink-0">
        <div className="flex w-full gap-1.5 p-1.5 bg-muted/20 rounded-2xl border border-border/40 text-left">
          {[
            { id: "identidade", label: t("editor.steps.profile"), icon: User },
            { id: "stack", label: t("editor.steps.stack"), icon: Toolbox },
            {
              id: "jornada",
              label: t("editor.steps.journey"),
              icon: Briefcase,
            },
            {
              id: "formacao",
              label: t("editor.steps.education"),
              icon: GraduationCap,
            },
            {
              id: "projetos",
              label: t("editor.steps.projects"),
              icon: GitBranch,
            },
            { id: "extra", label: t("editor.steps.extras"), icon: PlusCircle },
          ].map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              className={cn(
                "relative flex-1 h-11 rounded-xl flex items-center justify-center transition-all duration-300 gap-2 overflow-hidden",
                activeStep === i
                  ? "bg-background text-primary shadow-sm ring-1 ring-border/50 flex-[2.5]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40",
              )}
            >
              <step.icon
                size={20}
                weight={activeStep === i ? "fill" : "duotone"}
                className="shrink-0"
              />
              {activeStep === i && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] font-black uppercase tracking-widest overflow-hidden whitespace-nowrap"
                >
                  {step.label}
                </motion.span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-12 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-10 text-left"
          >
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">
                {t("step", { number: activeStep + 1 })}
              </div>
              <h2 className="text-4xl font-black tracking-tight">
                {t(
                  "editor.steps." +
                    [
                      "profile",
                      "stack",
                      "journey",
                      "education",
                      "projects",
                      "extras",
                    ][activeStep],
                )}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                {t("editor.subtitle")}
              </p>
            </div>

            {activeStep === 0 && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("editor.personalInfo.fullName")}
                    </Label>
                    <Input
                      {...register("personalInfo.name")}
                      placeholder={t("editor.personalInfo.fullNamePlaceholder")}
                      className="input-glow h-12 bg-muted/20 border-border/50 font-bold"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("editor.personalInfo.email")}
                    </Label>
                    <Input
                      {...register("personalInfo.email")}
                      placeholder={t("editor.personalInfo.emailPlaceholder")}
                      className="input-glow h-12 bg-muted/20 border-border/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("editor.personalInfo.phone")}
                    </Label>
                    <Input
                      {...register("personalInfo.phone")}
                      placeholder={t("editor.personalInfo.phonePlaceholder")}
                      className="input-glow h-12 bg-muted/20 border-border/50"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("editor.personalInfo.location")}
                    </Label>
                    <Input
                      {...register("personalInfo.location")}
                      placeholder={t("editor.personalInfo.locationPlaceholder")}
                      className="input-glow h-12 bg-muted/20 border-border/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("editor.personalInfo.linkedin")}
                    </Label>
                    <Input
                      {...register("personalInfo.linkedin")}
                      className="input-glow h-12 bg-muted/20 border-border/50"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("editor.personalInfo.portfolio")}
                    </Label>
                    <Input
                      {...register("personalInfo.website")}
                      className="input-glow h-12 bg-muted/20 border-border/50"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("editor.personalInfo.summary")}
                  </Label>
                  <Textarea
                    {...register("personalInfo.summary")}
                    placeholder={t("editor.personalInfo.summaryPlaceholder")}
                    className="min-h-[150px] input-glow bg-muted/20 border-border/50 leading-relaxed py-4"
                  />
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  {t("editor.stack.title")}
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
                  placeholder={t("editor.stack.placeholder")}
                  className="min-h-[350px] input-glow text-xl font-mono leading-relaxed bg-muted/20 border-border/50 p-8"
                />
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">
                  {t("editor.stack.hint")}
                </p>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-8">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleDragEnd(e, expFields, moveExp)}
                >
                  <SortableContext
                    items={expFields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {expFields.map((field, i) => (
                      <SortableItem
                        key={field.id}
                        id={field.id}
                        onRemove={() => removeExp(i)}
                      >
                        <Card className="border-border/50 bg-muted/10 relative overflow-hidden group shadow-none hover:bg-muted/20 transition-all duration-500">
                          <CardContent className="p-8 pt-12 grid grid-cols-2 gap-6 text-left">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.experience.company")}
                              </Label>
                              <Input
                                {...register(`experiences.${i}.company`)}
                                className="h-11 bg-background/50 border-border/50 font-bold"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.experience.position")}
                              </Label>
                              <Input
                                {...register(`experiences.${i}.position`)}
                                className="h-11 bg-background/50 border-border/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.experience.startDate")}
                              </Label>
                              <Input
                                {...register(`experiences.${i}.startDate`)}
                                placeholder={t(
                                  "editor.experience.placeholder.startDate",
                                )}
                                className="h-11 bg-background/50 border-border/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.experience.endDate")}
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
                                {t("editor.experience.current")}
                              </Label>
                            </div>
                            <div className="col-span-2 space-y-2 text-left">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.experience.description")}
                              </Label>
                              <Textarea
                                {...register(`experiences.${i}.description`)}
                                className="min-h-[150px] text-sm bg-background/50 border-border/50 leading-relaxed text-left"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
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
                    {t("editor.experience.add")}
                  </span>
                </Button>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-8">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleDragEnd(e, eduFields, moveEdu)}
                >
                  <SortableContext
                    items={eduFields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {eduFields.map((field, i) => (
                      <SortableItem
                        key={field.id}
                        id={field.id}
                        onRemove={() => removeEdu(i)}
                      >
                        <Card className="border-border/50 bg-muted/10 relative overflow-hidden group shadow-none hover:bg-muted/20 transition-all duration-500">
                          <CardContent className="p-8 pt-12 grid grid-cols-2 gap-6 text-left">
                            <div className="space-y-2 col-span-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.education.school")}
                              </Label>
                              <Input
                                {...register(`educations.${i}.school`)}
                                className="h-11 bg-background/50 border-border/50 font-bold"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.education.degree")}
                              </Label>
                              <Input
                                {...register(`educations.${i}.degree`)}
                                className="h-11 bg-background/50 border-border/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.education.field")}
                              </Label>
                              <Input
                                {...register(`educations.${i}.field`)}
                                className="h-11 bg-background/50 border-border/50"
                              />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.education.graduationDate")}
                              </Label>
                              <Input
                                {...register(`educations.${i}.graduationDate`)}
                                placeholder={t(
                                  "editor.education.placeholder.graduationDate",
                                )}
                                className="h-11 bg-background/50 border-border/50"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
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
                    {t("editor.education.add")}
                  </span>
                </Button>
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-8">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleDragEnd(e, projFields, moveProj)}
                >
                  <SortableContext
                    items={projFields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {projFields.map((field, i) => (
                      <SortableItem
                        key={field.id}
                        id={field.id}
                        onRemove={() => removeProj(i)}
                      >
                        <Card className="border-border/50 bg-muted/10 relative overflow-hidden group shadow-none hover:bg-muted/20 transition-all duration-500">
                          <CardContent className="p-8 pt-12 grid grid-cols-2 gap-6 text-left">
                            <div className="space-y-2 col-span-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.projects.name")}
                              </Label>
                              <Input
                                {...register(`projects.${i}.name`)}
                                className="h-11 bg-background/50 border-border/50 font-bold"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.projects.github")}
                              </Label>
                              <Input
                                {...register(`projects.${i}.github`)}
                                className="h-11 bg-background/50 border-border/50 font-mono text-xs"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.projects.deploy")}
                              </Label>
                              <Input
                                {...register(`projects.${i}.deploy`)}
                                className="h-11 bg-background/50 border-border/50 font-mono text-xs"
                              />
                            </div>
                            <div className="col-span-2 space-y-2 text-left">
                              <Label className="text-[10px] font-black uppercase tracking-widest">
                                {t("editor.projects.description")}
                              </Label>
                              <Textarea
                                {...register(`projects.${i}.description`)}
                                className="min-h-[120px] text-sm bg-background/50 border-border/50 leading-relaxed text-left"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                <Button
                  variant="outline"
                  className="w-full h-20 border-dashed border-2 bg-muted/5 hover:bg-muted/20 border-border/50 rounded-2xl transition-all"
                  onClick={() =>
                    appendProj({
                      name: "",
                      description: "",
                      github: "",
                      deploy: "",
                    })
                  }
                >
                  <PlusCircle
                    size={20}
                    weight="duotone"
                    className="mr-2 text-primary"
                  />
                  <span className="font-black uppercase tracking-widest text-xs">
                    {t("editor.projects.add")}
                  </span>
                </Button>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Translate
                      size={24}
                      weight="duotone"
                      className="text-primary"
                    />
                    <h3 className="text-sm font-black uppercase tracking-widest">
                      {t("editor.extras.languages.title")}
                    </h3>
                  </div>
                  <div className="grid gap-4">
                    {langFields.map((field, i) => (
                      <div key={field.id} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest">
                            {t("editor.extras.languages.label")}
                          </Label>
                          <Input
                            {...register(`languages.${i}.name`)}
                            className="h-11 bg-muted/20 border-border/50"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest">
                            {t("editor.extras.languages.proficiency")}
                          </Label>
                          <select
                            {...register(`languages.${i}.level`)}
                            className="w-full h-11 px-3 rounded-md bg-muted/20 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="Básico">
                              {t("editor.extras.languages.levels.basico")}
                            </option>
                            <option value="Intermediário">
                              {t(
                                "editor.extras.languages.levels.intermediario",
                              )}
                            </option>
                            <option value="Avançado">
                              {t("editor.extras.languages.levels.avancado")}
                            </option>
                            <option value="Fluente">
                              {t("editor.extras.languages.levels.fluente")}
                            </option>
                            <option value="Nativo">
                              {t("editor.extras.languages.levels.nativo")}
                            </option>
                          </select>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLang(i)}
                          className="h-11 w-11 text-muted-foreground hover:text-destructive"
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={() => appendLang({ name: "", level: "Básico" })}
                    >
                      <Plus size={16} className="mr-2" />{" "}
                      {t("editor.extras.languages.add")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Certificate
                      size={24}
                      weight="duotone"
                      className="text-primary"
                    />
                    <h3 className="text-sm font-black uppercase tracking-widest">
                      {t("editor.extras.certifications.title")}
                    </h3>
                  </div>
                  <div className="grid gap-4">
                    {certFields.map((field, i) => (
                      <div
                        key={field.id}
                        className="p-4 rounded-xl bg-muted/20 border border-border/50 relative group"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCert(i)}
                          className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                        >
                          <Trash size={16} />
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest">
                              {t("editor.extras.certifications.name")}
                            </Label>
                            <Input
                              {...register(`certifications.${i}.name`)}
                              className="h-10 bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest">
                              {t("editor.extras.certifications.issuer")}
                            </Label>
                            <Input
                              {...register(`certifications.${i}.issuer`)}
                              className="h-10 bg-background/50"
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest">
                              {t("editor.extras.certifications.date")}
                            </Label>
                            <Input
                              {...register(`certifications.${i}.date`)}
                              placeholder={t(
                                "editor.extras.certifications.datePlaceholder",
                              )}
                              className="h-10 bg-background/50"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={() =>
                        appendCert({ name: "", issuer: "", date: "" })
                      }
                    >
                      <Plus size={16} className="mr-2" />{" "}
                      {t("editor.extras.certifications.add")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <HandHeart
                      size={24}
                      weight="duotone"
                      className="text-primary"
                    />
                    <h3 className="text-sm font-black uppercase tracking-widest">
                      {t("editor.extras.volunteering.title")}
                    </h3>
                  </div>
                  <div className="grid gap-4">
                    {volFields.map((field, i) => (
                      <div
                        key={field.id}
                        className="p-4 rounded-xl bg-muted/20 border border-border/50 relative group"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVol(i)}
                          className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                        >
                          <Trash size={16} />
                        </Button>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest">
                              {t("editor.extras.volunteering.organization")}
                            </Label>
                            <Input
                              {...register(`volunteering.${i}.organization`)}
                              className="h-10 bg-background/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest">
                              {t("editor.extras.volunteering.role")}
                            </Label>
                            <Input
                              {...register(`volunteering.${i}.role`)}
                              className="h-10 bg-background/50"
                            />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest">
                              {t("editor.extras.volunteering.description")}
                            </Label>
                            <Textarea
                              {...register(`volunteering.${i}.description`)}
                              className="min-h-[100px] bg-background/50"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit"
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
                      <Plus size={16} className="mr-2" />{" "}
                      {t("editor.extras.volunteering.add")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-10 py-6 border-t bg-background/80 backdrop-blur-xl shrink-0 flex justify-between items-center">
        <Button
          variant="ghost"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((s) => s - 1)}
          className="rounded-xl px-6 h-11 font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <CaretLeft weight="bold" className="mr-2" /> {t("previous")}
        </Button>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
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
          onClick={() => activeStep < 5 && setActiveStep((s) => s + 1)}
          disabled={activeStep === 5}
          className="rounded-xl px-10 h-11 shadow-xl shadow-primary/10 transition-all hover:scale-[1.03] active:scale-95 font-black uppercase tracking-widest text-xs"
        >
          {t("next")} <CaretRight weight="bold" className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
