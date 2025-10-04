// src/pages/auth-redirect.js
import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function AuthRedirectPage() {
  return (
    <BrowserOnly fallback={<p>Finishing sign-in…</p>}>
      {() => {
        const React = require("react");
        const { useEffect } = React;
        const { useAuth } = require("@site/src/auth/AuthProvider");

        function AuthRedirectClient() {
          const { ready } = useAuth();
          useEffect(() => {
            if (!ready) return;
            const returnTo = sessionStorage.getItem("returnTo") || "/biosero-api-docs/";
            sessionStorage.removeItem("returnTo");
            window.location.replace(returnTo);
          }, [ready]);
          return <p>Finishing sign-in…</p>;
        }

        return <AuthRedirectClient />;
      }}
    </BrowserOnly>
  );
}
