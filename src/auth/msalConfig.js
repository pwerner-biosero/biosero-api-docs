// src/auth/msalConfig.js
import { LogLevel } from "@azure/msal-browser";

// Build redirect URIs that work on GitHub Pages (baseUrl = /biosero-api-docs/)
function getRedirect(path = "/biosero-api-docs/auth-redirect") {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  // Fallback used during SSR; B2C will use the configured absolute URL anyway
  return path;
}

export const msalConfig = {
  auth: {
    clientId: "2af9b946-0d99-42e7-8a62-f3b74d1f6e53",
    authority:
      "https://bioserob2cdev.b2clogin.com/bioserob2cdev.onmicrosoft.com/B2C_1_signupsignin",
    knownAuthorities: ["bioserob2cdev.b2clogin.com"], // or your custom B2C domain
    redirectUri: getRedirect(),              // e.g. https://.../biosero-api-docs/auth-redirect
    postLogoutRedirectUri: getRedirect("/biosero-api-docs/auth-redirect"),
    navigateToLoginRequestUrl: true,         // return to the original page after auth
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        if (level >= LogLevel.Warning) console.warn(message);
      },
      logLevel: LogLevel.Info,
    },
  },
};

// Baseline OpenID scopes; add your API scopes if you need tokens to call an API
export const loginRequest = {
  scopes: ["openid", "profile", "offline_access"],
};
