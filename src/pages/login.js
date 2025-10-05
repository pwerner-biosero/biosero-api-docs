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
          return (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <img 
                src="/biosero-api-docs/img/redirect.png"
                alt="Redirecting to sign in" 
                style={{
                  maxWidth: '300px',
                  marginBottom: '1.5rem'
                }}
              />
              <h2>Redirecting to Sign In</h2>
              <p>Please wait while we redirect you...</p>
            </div>
          );
        }

        return <LoginClient />;
      }}
    </BrowserOnly>
  );
}
