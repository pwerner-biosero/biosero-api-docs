// Debug version of MSAL config - use this temporarily to test
import { LogLevel } from "@azure/msal-browser";

export const msalConfigDebug = {
  auth: {
    clientId: "2af9b946-0d99-42e7-8a62-f3b74d1f6e53",
    authority: "https://bioserob2cdev.b2clogin.com/bioserob2cdev.onmicrosoft.com/b2c_1a_signup_signin",
    knownAuthorities: ["bioserob2cdev.b2clogin.com"],
    redirectUri: "http://localhost:3000/biosero-api-docs/auth-redirect",
    postLogoutRedirectUri: "http://localhost:3000/biosero-api-docs/",
    navigateToLoginRequestUrl: true,
    // Remove explicit authorityMetadata to let MSAL discover it
  },
  cache: { 
    cacheLocation: "localStorage", 
    storeAuthStateInCookie: false 
  },
  system: {
    allowNativeBroker: false, // Disable native broker for web
    loggerOptions: {
      loggerCallback: (level, message) => {
        console.log(`MSAL DEBUG [${level}]:`, message);
      },
      logLevel: LogLevel.Verbose,
    },
  },
};

export const loginRequest = { 
  scopes: ["openid", "profile", "offline_access"],
  prompt: "select_account" // Force account selection for debugging
};