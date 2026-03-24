import { listUserResumes, deleteResume } from "@/app/actions/resume-actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import {
  Plus,
  FileText,
  Eye,
  DownloadSimple,
  DotsThreeVertical,
  ShareNetwork,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { userId } = await auth();
  const { locale } = await params;

  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  const resumes = await listUserResumes();
  const t = await getTranslations("common.dashboard");
  const commonT = await getTranslations("common");

  const dateLocale = locale === "pt" ? ptBR : enUS;

  return (
    <main className="min-h-screen bg-background selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tight text-foreground">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-2xl">
              {t("description")}
            </p>
          </div>

          <Button
            asChild
            className="rounded-full h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-primary/20 gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Link href={`/${locale}`}>
              <Plus size={20} weight="bold" />
              {t("newResume")}
            </Link>
          </Button>
        </div>

        <Separator className="bg-border/40" />

        {/* Grid de Currículos */}
        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/40">
            <div className="w-20 h-20 rounded-3xl bg-muted/20 flex items-center justify-center text-muted-foreground">
              <FileText size={40} weight="duotone" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{t("empty")}</h3>
              <p className="text-muted-foreground font-medium">
                Comece sua jornada profissional agora mesmo.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-full h-12 px-6 font-bold uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5 transition-all"
            >
              <Link href={`/${locale}`}>{t("createFirst")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((resume) => (
              <Card
                key={resume.id}
                className="group overflow-hidden rounded-[2.5rem] border-border/40 bg-card/30 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 flex flex-col"
              >
                <CardHeader className="p-8 pb-4 flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                      {resume.title}
                    </CardTitle>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      {t("lastUpdate", {
                        date: formatDistanceToNow(new Date(resume.updatedAt), {
                          addSuffix: true,
                          locale: dateLocale,
                        }),
                      })}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-10 w-10 bg-muted/20 hover:bg-muted/40"
                      >
                        <DotsThreeVertical size={20} weight="bold" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl p-2 shadow-2xl"
                    >
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer font-bold uppercase text-[10px] tracking-widest p-3"
                      >
                        <Link href={`/${locale}?id=${resume.id}`}>
                          <PencilSimple
                            size={16}
                            weight="bold"
                            className="mr-2"
                          />
                          {t("actions.edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer font-bold uppercase text-[10px] tracking-widest p-3"
                      >
                        <Link
                          href={`/${locale}/share/${resume.groupId || resume.id}`}
                          target="_blank"
                        >
                          <Eye size={16} weight="bold" className="mr-2" />
                          {commonT("preview")}
                        </Link>
                      </DropdownMenuItem>
                      <Separator className="my-1 bg-border/40" />
                      <form
                        action={async () => {
                          "use server";
                          await deleteResume(resume.id);
                        }}
                      >
                        <button className="w-full text-left rounded-xl focus:bg-destructive/10 text-destructive cursor-pointer font-bold uppercase text-[10px] tracking-widest p-3 flex items-center transition-colors hover:bg-destructive/10">
                          <Trash size={16} weight="bold" className="mr-2" />
                          {t("actions.delete")}
                        </button>
                      </form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                <CardContent className="p-8 pt-4 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/20 rounded-3xl p-5 border border-border/20 transition-all group-hover:bg-primary/5 group-hover:border-primary/10">
                      <div className="flex items-center gap-2 mb-1 text-primary">
                        <Eye size={16} weight="bold" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                          Views
                        </span>
                      </div>
                      <span className="text-3xl font-black tracking-tighter">
                        {resume.views}
                      </span>
                    </div>
                    <div className="bg-muted/20 rounded-3xl p-5 border border-border/20 transition-all group-hover:bg-emerald-500/5 group-hover:border-emerald-500/10">
                      <div className="flex items-center gap-2 mb-1 text-emerald-500">
                        <DownloadSimple size={16} weight="bold" />
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                          Downloads
                        </span>
                      </div>
                      <span className="text-3xl font-black tracking-tighter">
                        {resume.downloads}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-8 pt-0 flex gap-3">
                  <Button
                    asChild
                    variant="secondary"
                    className="flex-1 rounded-full h-12 font-black uppercase tracking-widest text-[10px] transition-all hover:bg-primary hover:text-white"
                  >
                    <Link href={`/${locale}?id=${resume.id}`}>
                      {t("actions.edit")}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full h-12 px-6 border-border/40 hover:bg-muted/40 transition-all active:scale-95"
                    title={t("actions.copyLink")}
                  >
                    <ShareNetwork size={20} weight="bold" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
