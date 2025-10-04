import { LogLevel } from "@azure/msal-browser";

const host = "bioserob2cdev.b2clogin.com";
const tenantDomain = "bioserob2cdev.onmicrosoft.com";
const policy = "b2c_1a_signup_signin";
const clientId = "2af9b946-0d99-42e7-8a62-f3b74d1f6e53";

// Use the WORKING authority format from the test
const authority = `https://${host}/${tenantDomain}/${policy}`;
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

// Test the metadata URL manually before MSAL uses it
console.log("🧪 Testing metadata URL manually...");
if (typeof fetch !== 'undefined') {
  fetch(authorityMetadata)
    .then(response => {
      console.log("✅ Metadata URL response status:", response.status);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    })
    .then(data => {
      console.log("✅ Metadata fetched successfully:", {
        issuer: data.issuer,
        authorization_endpoint: data.authorization_endpoint,
        token_endpoint: data.token_endpoint
      });
    })
    .catch(error => {
      console.log("❌ Metadata URL test failed:", error);
    });
}

export const msalConfig = {
  auth: {
    clientId,
    authority,                 // Using the WORKING authority format
    knownAuthorities: [host],  // Use the original host format
    redirectUri: getRedirectUri(),
    postLogoutRedirectUri: getPostLogoutRedirectUri(),
    // Remove optional parameters that might be causing issues
    // navigateToLoginRequestUrl: true,
  },
  cache: { 
    cacheLocation: "localStorage", 
    storeAuthStateInCookie: false 
  },
  system: {
    allowNativeBroker: false, // Disable native broker for web apps
    windowHashTimeout: 60000, // Increase timeout for slower networks
    loadFrameTimeout: 6000,   // Increase iframe timeout
    loggerOptions: {
      loggerCallback: (level, message) => {
        console.log(`MSAL [${level}]:`, message);
        // Log the redirect URIs being used
        if (message.includes("redirect")) {
          console.log("Current redirect URI:", getRedirectUri());
          console.log("Current post-logout URI:", getPostLogoutRedirectUri());
        }
        // Log any fetch-related errors
        if (message.includes("fetch") || message.includes("endpoint") || message.includes("metadata")) {
          console.log("🔍 MSAL Network Debug:", message);
        }
      },
      logLevel: LogLevel.Verbose, // More detailed logging for debugging
    },
  },
};

export const loginRequest = { scopes: ["openid", "profile", "offline_access"] };
