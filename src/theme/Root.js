// src/theme/Root.js
import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { AuthProvider } from "@site/src/auth/AuthProvider";

export default function Root({ children }) {
  // AuthProvider renders on client; on server it renders nothing (safe for SSR)
  return (
    <BrowserOnly fallback={<>{children}</>}>
      {() => <AuthProvider>{children}</AuthProvider>}
    </BrowserOnly>
  );
}
