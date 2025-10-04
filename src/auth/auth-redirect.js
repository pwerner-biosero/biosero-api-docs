import React, { useEffect } from "react";
import { useAuth } from "@site/src/auth/AuthProvider";

export default function AuthRedirectPage() {
  const { isAuthenticated, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    // After MSAL finishes processing the URL, go home (or restore last page if you store it)
    if (typeof window !== "undefined") {
      // Optionally restore last page from sessionStorage:
      const returnTo = sessionStorage.getItem("returnTo") || "/biosero-api-docs/";
      sessionStorage.removeItem("returnTo");
      window.location.replace(returnTo);
    }
  }, [isAuthenticated, ready]);

  return <p>Finishing sign-in…</p>;
}
