// Debug utility for token issues
(function () {
  console.log("🔍 Token Debug Utility Loaded");

  // Check current token state
  function checkTokens() {
    const lmsToken = localStorage.getItem("lms_auth_token");
    const legacyToken = localStorage.getItem("token");
    console.log("Current token state:");
    console.log(`- lms_auth_token: ${lmsToken ? "Present ✓" : "Missing ❌"}`);
    console.log(`- legacy token: ${legacyToken ? "Present ✓" : "Missing ❌"}`);

    if (lmsToken) {
      try {
        // Provide basic JWT structure info (without revealing private data)
        const parts = lmsToken.split(".");
        if (parts.length === 3) {
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          console.log("Token structure looks valid (3-part JWT)");
          console.log("Header alg:", header.alg);
          console.log("Payload exp:", new Date(payload.exp * 1000));
          console.log(
            "Token expires:",
            new Date(payload.exp * 1000) > new Date() ? "Valid ✓" : "Expired ❌"
          );
        } else {
          console.warn("Token doesn't appear to be a valid JWT");
        }
      } catch (e) {
        console.warn("Could not parse token structure:", e.message);
      }
    }

    return { lmsToken, legacyToken };
  }

  // Set a test token manually
  function setTestToken(value = "test_token_value") {
    localStorage.removeItem("token"); // Clear legacy token
    localStorage.setItem("lms_auth_token", value);
    console.log(`✅ Test token set as "lms_auth_token"`);
    return checkTokens();
  }

  // Sync tokens - make sure both keys have the same value
  function syncTokens() {
    const lmsToken = localStorage.getItem("lms_auth_token");
    const legacyToken = localStorage.getItem("token");

    if (lmsToken && !legacyToken) {
      localStorage.setItem("token", lmsToken);
      console.log("✓ Copied lms_auth_token to token");
    } else if (!lmsToken && legacyToken) {
      localStorage.setItem("lms_auth_token", legacyToken);
      console.log("✓ Copied token to lms_auth_token");
    } else if (lmsToken && legacyToken && lmsToken !== legacyToken) {
      localStorage.setItem("token", lmsToken);
      console.log(
        "⚠️ Tokens were different! Synchronized to lms_auth_token value"
      );
    } else if (!lmsToken && !legacyToken) {
      console.log("❌ No tokens to synchronize");
    } else {
      console.log("✓ Tokens already in sync");
    }

    return checkTokens();
  }

  // Clear all tokens
  function clearAllTokens() {
    localStorage.removeItem("lms_auth_token");
    localStorage.removeItem("token");
    console.log("🧹 All tokens cleared");
    return checkTokens();
  }

  // Test reload with a forced refresh of auth state
  function reloadWithAuth() {
    // Set a flag to force auth check on reload
    sessionStorage.setItem("force_auth_check", "true");
    window.location.reload();
  }

  // Expose utilities to browser console
  window.tokenDebug = {
    check: checkTokens,
    setTest: setTestToken,
    sync: syncTokens,
    clear: clearAllTokens,
    reload: reloadWithAuth,
  };

  // Run initial check
  checkTokens();

  console.log("ℹ️ Use these commands to debug tokens:");
  console.log("- tokenDebug.check() - Check current token state");
  console.log("- tokenDebug.setTest() - Set a test token");
  console.log("- tokenDebug.clear() - Clear all tokens");
})();
