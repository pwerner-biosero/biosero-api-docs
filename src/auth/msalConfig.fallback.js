// Fallback MSAL configuration - use this if the main config still fails
import { LogLevel } from "@azure/msal-browser";

const clientId = "2af9b946-0d99-42e7-8a62-f3b74d1f6e53";

// Simplest possible B2C configuration
export const msalConfigFallback = {
  auth: {
    clientId,
    authority: "https://bioserob2cdev.b2clogin.com/bioserob2cdev.onmicrosoft.com/b2c_1a_signup_signin",
    knownAuthorities: ["bioserob2cdev.b2clogin.com"],
    redirectUri: window.location.origin + "/biosero-api-docs/auth-redirect",
  },
  cache: {
    cacheLocation: "localStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        console.log(`FALLBACK MSAL [${level}]:`, message);
      },
      logLevel: LogLevel.Verbose,
    },
  },
};

export const loginRequestFallback = {
  scopes: ["openid", "profile"],
};