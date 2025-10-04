import { LogLevel } from "@azure/msal-browser";

const host = "bioserob2cdev.b2clogin.com";
const tenantDomain = "bioserob2cdev.onmicrosoft.com";
const policy = "b2c_1a_signup_signin";
const clientId = "2af9b946-0d99-42e7-8a62-f3b74d1f6e53";
const authority = `https://${host}/${tenantDomain}/${policy}`;
const authorityMetadata = `${authority}/v2.0/.well-known/openid-configuration`;

export const msalConfig = {
  auth: {
    clientId,
    authority,                 // EXACTLY matches the working path (no trailing slash)
    authorityMetadata,         // Explicit metadata = no discovery surprises
    knownAuthorities: [host],  // MUST be exactly the host part above
    redirectUri: "http://localhost:3000/biosero-api-docs/auth-redirect",
    postLogoutRedirectUri: "http://localhost:3000/biosero-api-docs/",
    navigateToLoginRequestUrl: true,
  },
  cache: { cacheLocation: "localStorage", storeAuthStateInCookie: false },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        console.log(`MSAL [${level}]:`, message);
      },
      logLevel: LogLevel.Verbose, // More detailed logging for debugging
    },
  },
};

export const loginRequest = { scopes: ["openid", "profile", "offline_access"] };
