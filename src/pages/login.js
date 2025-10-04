// src/pages/login.js
import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function LoginPage() {
  return (
    <BrowserOnly fallback={<p>Preparing sign-in…</p>}>
      {() => {
        const React = require("react");
        const { useEffect } = React;
        const { useAuth } = require("@site/src/auth/AuthProvider");

        function LoginClient() {
          const { isAuthenticated, login, ready } = useAuth();
          useEffect(() => {
            if (!ready) return;
            if (!isAuthenticated) login();
            else {
              const returnTo = sessionStorage.getItem("returnTo") || "/biosero-api-docs/";
              sessionStorage.removeItem("returnTo");
              window.location.replace(returnTo);
            }
          }, [isAuthenticated, login, ready]);
          return <p>Redirecting to sign in…</p>;
        }

        return <LoginClient />;
      }}
    </BrowserOnly>
  );
}
