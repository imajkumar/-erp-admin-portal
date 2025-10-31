"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import { ReduxProvider } from "@/components/ReduxProvider";
import { SocketProvider } from "@/contexts/SocketContext";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ReduxProvider>
      <LanguageProvider>
        <SocketProvider>{children}</SocketProvider>
      </LanguageProvider>
    </ReduxProvider>
  );
}
