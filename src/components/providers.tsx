"use client";

import { Toaster } from "@/components/ui/sonner";
import { enUS, ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import * as React from "react";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}

export function Providers({ children, messages, locale }: ProvidersProps) {
  const localization = locale === "pt" ? ptBR : enUS;

  return (
    <ClerkProvider localization={localization}>
      <ThemeProvider>
        <NextIntlClientProvider
          messages={messages}
          locale={locale}
          timeZone="America/Sao_Paulo"
        >
          {children}
          <Toaster />
        </NextIntlClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
