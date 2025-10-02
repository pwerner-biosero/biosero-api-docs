// src/auth/msalConfig.js
import { LogLevel } from "@azure/msal-browser";

// ⬇️ Replace values in {BRACES}
export const msalConfig = {
  auth: {
    clientId: "{B2C_APP_CLIENT_ID}", // e.g. "00000000-0000-0000-0000-000000000000"
    authority:
      "https://{B2C_TENANT}.b2clogin.com/{B2C_TENANT}.onmicrosoft.com/{SIGNIN_SIGNUP_POLICY}",
    knownAuthorities: ["{B2C_TENANT}.b2clogin.com"],
    redirectUri: "/",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "localStorage", // or "sessionStorage"
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        if (level === LogLevel.Error) console.error(message);
        if (level === LogLevel.Warning) console.warn(message);
        if (level === LogLevel.Info) console.info(message);
        if (level === LogLevel.Verbose) console.debug(message);
      },
      logLevel: LogLevel.Info,
    },
  },
};

// Basic OpenID scopes; add your API scopes if needed
export const loginRequest = {
  scopes: ["openid", "profile", "offline_access"],
};
