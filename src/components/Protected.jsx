// src/components/Protected.jsx
import React from "react";
import { useAuth } from "@site/src/auth/AuthProvider";

export default function Protected({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  return <>{children}</>;
}
