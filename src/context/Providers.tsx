import React from "react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { AuthProvider } from "context/auth";
import { ToastProvider } from "context/toast";

export const ContextProviders: React.FC = ({ children }) => (
  <AuthProvider>
    <LeafyGreenProvider baseFontSize={16}>
      <ToastProvider>{children}</ToastProvider>
    </LeafyGreenProvider>
  </AuthProvider>
);
