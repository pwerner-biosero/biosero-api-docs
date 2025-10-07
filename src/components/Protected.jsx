// src/components/Protected.jsx
import React from "react";
import { useAuth } from "@site/src/auth/AuthProvider";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function Protected({ children }) {
  const { isAuthenticated } = useAuth();
  const loginUrl = useBaseUrl("/login");

  // Temporarily disable authentication - uncomment lines below to re-enable
  // if (!isAuthenticated) {
  //   if (typeof window !== "undefined") {
  //     window.location.href = loginUrl;
  //   }
  //   return null;
  // }

  return <>{children}</>;
}
