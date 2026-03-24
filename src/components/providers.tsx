"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR, enUS } from "@clerk/localizations";

interface ProvidersProps {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}

export function Providers({ children, messages, locale }: ProvidersProps) {
  const localization = locale === "pt" ? ptBR : enUS;

  return (
    <ClerkProvider localization={localization} afterSignOutUrl="/">
      <ThemeProvider>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
