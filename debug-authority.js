// Test script to verify B2C authority endpoint
// Run this in browser console to test the authority

const testAuthority = async () => {
  const host = "bioserob2cdev.b2clogin.com";
  const tenantDomain = "bioserob2cdev.onmicrosoft.com";
  const policy = "b2c_1a_signup_signin";
  
  // Test different authority URL formats
  const authorityFormats = [
    `https://${host}/${tenantDomain}/${policy}`,
    `https://${host}/${tenantDomain}/${policy}/v2.0`,
    `https://${tenantDomain}.b2clogin.com/${tenantDomain}/${policy}`,
    `https://${tenantDomain}.b2clogin.com/${tenantDomain}/${policy}/v2.0`
  ];
  
  for (const authority of authorityFormats) {
    const metadataUrl = `${authority}/.well-known/openid-configuration`;
    console.log(`\n🧪 Testing: ${authority}`);
    console.log(`📋 Metadata URL: ${metadataUrl}`);
    
    try {
      const response = await fetch(metadataUrl);
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ SUCCESS! Authority works:`, authority);
        console.log(`🔑 Authorization endpoint:`, data.authorization_endpoint);
        console.log(`🎫 Token endpoint:`, data.token_endpoint);
        return { authority, metadata: data };
      } else {
        console.log(`❌ HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Error:`, error.message);
    }
  }
  
  console.log(`\n🚨 None of the authority formats worked!`);
  return null;
};

// Also test the current configuration
const testCurrentConfig = async () => {
  const currentAuthority = "https://bioserob2cdev.b2clogin.com/bioserob2cdev.onmicrosoft.com/b2c_1a_signup_signin";
  const currentMetadata = `${currentAuthority}/v2.0/.well-known/openid-configuration`;
  
  console.log(`\n🔍 Testing current configuration:`);
  console.log(`Authority: ${currentAuthority}`);
  console.log(`Metadata: ${currentMetadata}`);
  
  try {
    const response = await fetch(currentMetadata);
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Current config works!`);
      return data;
    } else {
      console.log(`❌ Current config failed: HTTP ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Current config error:`, error.message);
    return null;
  }
};

console.log("🚀 Running B2C Authority Tests...");
testCurrentConfig().then(() => testAuthority());