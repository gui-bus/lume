"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
}

export function Providers({ children, messages, locale }: ProvidersProps) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
        <Toaster />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
