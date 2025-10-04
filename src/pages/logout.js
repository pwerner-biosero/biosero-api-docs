// src/pages/logout.js
import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function LogoutPage() {
  return (
    <BrowserOnly fallback={<p>Preparing sign-out…</p>}>
      {() => {
        const React = require("react");
        const { useEffect } = React;
        const { useAuth } = require("@site/src/auth/AuthProvider");

        function LogoutClient() {
          const { logout, ready } = useAuth();
          useEffect(() => { if (ready) logout(); }, [logout, ready]);
          return <p>Signing you out…</p>;
        }

        return <LogoutClient />;
      }}
    </BrowserOnly>
  );
}
