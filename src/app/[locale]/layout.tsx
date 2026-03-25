import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lume.guibus.dev";

  return {
    title: {
      template: `%s | ${t("title")}`,
      default: t("seo.ogTitle"),
    },
    description: t("description"),
    keywords: t("seo.keywords"),
    authors: [{ name: "Lume" }],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        pt: "/pt",
        en: "/en",
      },
    },
    openGraph: {
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
      url: `/${locale}`,
      siteName: t("title"),
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("seo.ogTitle"),
      description: t("seo.ogDescription"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        manrope.variable,
      )}
    >
      <body className="min-h-full flex flex-col transition-colors duration-500 ease-in-out w-full max-w-440 mx-auto">
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
