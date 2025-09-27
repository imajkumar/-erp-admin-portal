"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { ReduxProvider } from "@/components/ReduxProvider";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ReduxProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ReduxProvider>
  );
}
