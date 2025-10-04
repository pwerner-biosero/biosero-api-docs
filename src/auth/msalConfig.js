import { LogLevel } from "@azure/msal-browser";

const host = "bioserob2cdev.b2clogin.com";
const tenantDomain = "bioserob2cdev.onmicrosoft.com";
const policy = "b2c_1a_signup_signin";
const clientId = "2af9b946-0d99-42e7-8a62-f3b74d1f6e53";

// Try alternative authority format - sometimes B2C is picky about the format
const authority = `https://${tenantDomain}.b2clogin.com/${tenantDomain}/${policy}`;
// Backup: const authority = `https://${host}/${tenantDomain}/${policy}`;

const authorityMetadata = `${authority}/v2.0/.well-known/openid-configuration`;

// Dynamic redirect URIs based on environment
const getRedirectUri = () => {
  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;
    const baseUrl = "/biosero-api-docs";
    
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      const uri = `${protocol}//${hostname}:${port}${baseUrl}/auth-redirect`;
      console.log("🔧 Local redirect URI:", uri);
      return uri;
    } else {
      // Production (GitHub Pages)
      const uri = `${protocol}//${hostname}${baseUrl}/auth-redirect`;
      console.log("🌐 Production redirect URI:", uri);
      return uri;
    }
  }
  // Fallback for SSR
  const fallback = "https://pwerner-biosero.github.io/biosero-api-docs/auth-redirect";
  console.log("📦 SSR fallback redirect URI:", fallback);
  return fallback;
};

const getPostLogoutRedirectUri = () => {
  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;
    const baseUrl = "/biosero-api-docs";
    
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      const uri = `${protocol}//${hostname}:${port}${baseUrl}/`;
      console.log("🔧 Local post-logout URI:", uri);
      return uri;
    } else {
      // Production (GitHub Pages)
      const uri = `${protocol}//${hostname}${baseUrl}/`;
      console.log("🌐 Production post-logout URI:", uri);
      return uri;
    }
  }
  // Fallback for SSR
  const fallback = "https://pwerner-biosero.github.io/biosero-api-docs/";
  console.log("📦 SSR fallback post-logout URI:", fallback);
  return fallback;
};

// Debug the authority configuration
console.log("🔍 MSAL Authority Debug Info:");
console.log("Host:", host);
console.log("Tenant Domain:", tenantDomain);
console.log("Policy:", policy);
console.log("Authority URL:", authority);
console.log("Authority Metadata URL:", authorityMetadata);

export const msalConfig = {
  auth: {
    clientId,
    authority,                 // Let MSAL auto-discover the metadata
    // authorityMetadata,      // Comment out explicit metadata for now
    knownAuthorities: [`${tenantDomain}.b2clogin.com`],  // Match the authority format
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
