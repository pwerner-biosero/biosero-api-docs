import React, {
  createContext, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import { msalConfig, loginRequest } from "./msalConfig";

const AuthContext = createContext({
  isAuthenticated: false,
  account: null,
  login: async () => {},
  logout: () => {},
  getAccessToken: async () => null,
  ready: false,
});

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [ready, setReady] = useState(false);
  const pcaRef = useRef(null); // { pca, InteractionRequiredAuthError }
  const isAuthenticated = !!account;

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!ExecutionEnvironment.canUseDOM) return;

      try {
        const {
          PublicClientApplication,
          InteractionRequiredAuthError,
        } = await import("@azure/msal-browser");

        const pca = new PublicClientApplication(msalConfig);
        pcaRef.current = { pca, InteractionRequiredAuthError };

        const result = await pca.handleRedirectPromise();
        if (cancelled) return;

        if (result?.account) {
          pca.setActiveAccount(result.account);
          setAccount(result.account);
        } else {
          const active = pca.getActiveAccount() || pca.getAllAccounts()[0] || null;
          if (active) {
            pca.setActiveAccount(active);
            setAccount(active);
          }
        }
      } catch (e) {
        console.error("MSAL initialization error:", e);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const login = async () => {
    if (!ExecutionEnvironment.canUseDOM || !pcaRef.current) return;

    // Save current path (respect baseUrl)
    try {
      const currentPath = window.location.pathname + window.location.search + window.location.hash;
      sessionStorage.setItem("returnTo", currentPath || "/biosero-api-docs/");
    } catch {}

    await pcaRef.current.pca.loginRedirect(loginRequest);
  };

  const logout = () => {
    if (!ExecutionEnvironment.canUseDOM || !pcaRef.current) return;
    const { pca } = pcaRef.current;
    const active = pca.getActiveAccount();
    pca.logoutRedirect({
      account: active || undefined,
      postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
    });
  };

  const getAccessToken = async (scopes = loginRequest.scopes) => {
    if (!ExecutionEnvironment.canUseDOM || !pcaRef.current) return null;

    const { pca, InteractionRequiredAuthError } = pcaRef.current;
    const active = pca.getActiveAccount();
    if (!active) {
      await pca.loginRedirect(loginRequest);
      return null;
    }

    try {
      const result = await pca.acquireTokenSilent({ account: active, scopes });
      return result?.accessToken ?? null;
    } catch (e) {
      const needsInteraction =
        e?.name === "InteractionRequiredAuthError" ||
        (typeof InteractionRequiredAuthError !== "undefined" && e instanceof InteractionRequiredAuthError);
      if (needsInteraction) {
        await pca.acquireTokenRedirect({ scopes });
        return null;
      }
      console.error("Token acquisition error:", e);
      return null;
    }
  };

  const value = useMemo(
    () => ({ isAuthenticated, account, login, logout, getAccessToken, ready }),
    [isAuthenticated, account, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
