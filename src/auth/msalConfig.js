import { LogLevel } from "@azure/msal-browser";

const host = "bioserob2cdev.b2clogin.com";
const tenantDomain = "bioserob2cdev.onmicrosoft.com";
const policy = "b2c_1a_signup_signin";
const clientId = "2af9b946-0d99-42e7-8a62-f3b74d1f6e53";
const authority = `https://${host}/${tenantDomain}/${policy}`;
const authorityMetadata = `${authority}/v2.0/.well-known/openid-configuration`;

// Dynamic redirect URIs based on environment
const getRedirectUri = () => {
  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;
    const baseUrl = "/biosero-api-docs";
    
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}//${hostname}:${port}${baseUrl}/auth-redirect`;
    } else {
      // Production (GitHub Pages)
      return `${protocol}//${hostname}${baseUrl}/auth-redirect`;
    }
  }
  // Fallback for SSR
  return "https://pwerner-biosero.github.io/biosero-api-docs/auth-redirect";
};

const getPostLogoutRedirectUri = () => {
  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;
    const baseUrl = "/biosero-api-docs";
    
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return `${protocol}//${hostname}:${port}${baseUrl}/`;
    } else {
      // Production (GitHub Pages)
      return `${protocol}//${hostname}${baseUrl}/`;
    }
  }
  // Fallback for SSR
  return "https://pwerner-biosero.github.io/biosero-api-docs/";
};

export const msalConfig = {
  auth: {
    clientId,
    authority,                 // EXACTLY matches the working path (no trailing slash)
    authorityMetadata,         // Explicit metadata = no discovery surprises
    knownAuthorities: [host],  // MUST be exactly the host part above
    redirectUri: getRedirectUri(),
    postLogoutRedirectUri: getPostLogoutRedirectUri(),
    navigateToLoginRequestUrl: true,
  },
  cache: { cacheLocation: "localStorage", storeAuthStateInCookie: false },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        console.log(`MSAL [${level}]:`, message);
        // Log the redirect URIs being used
        if (message.includes("redirect")) {
          console.log("Current redirect URI:", getRedirectUri());
          console.log("Current post-logout URI:", getPostLogoutRedirectUri());
        }
      },
      logLevel: LogLevel.Verbose, // More detailed logging for debugging
    },
  },
};

export const loginRequest = { scopes: ["openid", "profile", "offline_access"] };
