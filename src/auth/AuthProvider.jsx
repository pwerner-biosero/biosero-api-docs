// src/auth/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./msalConfig";

const AuthContext = createContext({
  isAuthenticated: false,
  account: null,
  login: async () => {},
  logout: () => {},
  getAccessToken: async () => null,
});

const pca = new PublicClientApplication(msalConfig);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const isAuthenticated = !!account;

  useEffect(() => {
    // MSAL redirect handler (required for redirect flow)
    pca
      .handleRedirectPromise()
      .then((result) => {
        if (result && result.account) {
          pca.setActiveAccount(result.account);
          setAccount(result.account);
        } else {
          const active = pca.getActiveAccount() || pca.getAllAccounts()[0] || null;
          if (active) {
            pca.setActiveAccount(active);
            setAccount(active);
          }
        }
      })
      .catch((e) => {
        console.error("MSAL redirect error:", e);
      });
  }, []);

  const login = async () => {
    await pca.loginRedirect(loginRequest);
  };

  const logout = () => {
    const active = pca.getActiveAccount();
    pca.logoutRedirect({
      account: active || undefined,
      postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
    });
  };

  const getAccessToken = async (scopes = loginRequest.scopes) => {
    const active = pca.getActiveAccount();
    if (!active) {
      await pca.loginRedirect(loginRequest);
      return null;
    }

    try {
      const result = await pca.acquireTokenSilent({ account: active, scopes });
      return result.accessToken || null;
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        await pca.acquireTokenRedirect({ scopes });
        return null;
      }
      console.error("Token acquisition error:", e);
      return null;
    }
  };

  const value = useMemo(
    () => ({ isAuthenticated, account, login, logout, getAccessToken }),
    [isAuthenticated, account]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
