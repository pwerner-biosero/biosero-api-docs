// src/pages/login.js
import React, { useEffect } from "react";
import { useAuth } from "@site/src/auth/AuthProvider";

export default function LoginPage() {
  const { isAuthenticated, login, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      login();
    } else if (typeof window !== "undefined") {
      window.location.replace("/");
    }
  }, [isAuthenticated, login, ready]);

  return <p>Redirecting to sign in…</p>;
}
