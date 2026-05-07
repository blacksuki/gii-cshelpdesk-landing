/**
 * Frontend authentication utilities for giiHelpdeskAgent
 * Handles authentication state, token management, and API calls
 */

(function () {
  "use strict";

  // Authentication state
  let currentUser = null;
  let authToken = null;

  /**
   * Initialize authentication
   */
  function initAuth() {
    console.log('[auth.js initAuth] Starting...');
    // Check for existing user session
    const storedUser = localStorage.getItem("user");
    console.log('[auth.js initAuth] storedUser:', storedUser ? 'EXISTS' : 'NULL');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('[auth.js initAuth] Parsed user:', { hasToken: !!user.token, hasEmail: !!user.email });
        
        if (user.token && user.email) {
          currentUser = user;
          authToken = user.token;

          // Validate token (basic check)
          const expired = isTokenExpired(user.token);
          console.log('[auth.js initAuth] Token expired?', expired);
          
          if (expired) {
            console.error('[auth.js initAuth] ❌ TOKEN EXPIRED - Calling logout()');
            logout();
            return;
          }

          console.log('[auth.js initAuth] ✅ Token valid, updating UI');
          // Update UI for logged-in state
          updateUIForAuthState(true);
        } else {
          console.warn('[auth.js initAuth] User data incomplete');
        }
      } catch (error) {
        console.error("[auth.js initAuth] Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }

    // Update UI for current auth state
    updateUIForAuthState(!!currentUser);
    console.log('[auth.js initAuth] Complete. currentUser:', !!currentUser);
  }

  /**
   * Check if token is expired
   */
  function isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  /**
   * Update UI based on authentication state
   */
  function updateUIForAuthState(isLoggedIn) {
    // Update navigation
    const navCTA = document.querySelector(".nav__cta");
    if (navCTA) {
      const isInAccountDir = window.location.pathname.includes('/account/');
      if (isLoggedIn) {
        navCTA.textContent = "Account";
        navCTA.href = isInAccountDir ? "dashboard.html" : "account/dashboard.html";
      } else {
        navCTA.textContent = "Login";
        navCTA.href = isInAccountDir ? "../auth/login.html" : "auth/login.html";
      }
    }

    // Update page-specific elements
    const event = new CustomEvent("authStateChanged", {
      detail: { isLoggedIn },
    });
    document.dispatchEvent(event);
  }

  /**
   * User registration
   */
  async function register(userData) {
    if (!window.apiClient) {
      throw new Error("API client not available");
    }
    return await window.apiClient.register(userData);
  }

  /**
   * User login
   */
  async function login(credentials) {
    if (!window.apiClient) {
      throw new Error("API client not available");
    }

    const result = await window.apiClient.login(credentials);

    if (result.success && result.data.token) {
      // Store user data
      currentUser = result.data.user;
      authToken = result.data.token;

      // localStorage.setItem(
      //   "user",
      //   JSON.stringify({
      //     ...result.data.user,
      //     token: result.data.token,
      //   })
      // );

      // Fetch subscription status once and store
      // try {
      //   // const email = result?.data?.user?.email || credentials?.email;
      //   // const domain = result?.data?.user?.domain;
      //   // const subResp = await window.apiClient.getSubscriptionStatus(email, domain);
      // //   if (subResp && subResp.success) {
      // //     const existing = JSON.parse(localStorage.getItem("user") || "{}");
      // //     const toStore = {
      // //       ...existing,
      // //       subscription: subResp.data?.subscription || null,
      // //     };
      // //     localStorage.setItem("user", JSON.stringify(toStore));
      // //   }
      // // } catch (e) {
      // //   console.error("Failed to fetch subscription status on login", e);
      // // }

      // Update UI
      updateUIForAuthState(true);
    }

    return result;
  }

  /**
   * User logout
   */
  function logout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem("user");

    // Clear API client token
    if (window.apiClient) {
      window.apiClient.clearToken();
    }

    // Update UI
    updateUIForAuthState(false);

    // Redirect to login page if on protected page
    if (window.location.pathname.includes("/account/")) {
      window.location.href = "../auth/login.html";
    }
  }

  /**
   * Check if user is authenticated
   */
  function isAuthenticated() {
    return !!currentUser && !!authToken && !isTokenExpired(authToken);
  }

  /**
   * Get current user
   */
  function getCurrentUser() {
    return currentUser;
  }

  /**
   * Get auth token
   */
  function getAuthToken() {
    return authToken;
  }

  /**
   * Check domain availability
   */
  async function checkDomainAvailability(domain) {
    if (!window.apiClient) {
      throw new Error("API client not available");
    }

    const result = await window.apiClient.checkDomain(domain);
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || "Failed to check domain");
    }
  }

  /**
   * Request password reset
   */
  async function requestPasswordReset(email) {
    if (!window.apiClient) {
      throw new Error("API client not available");
    }
    return await window.apiClient.forgotPassword(email);
  }

  /**
   * Reset password
   */
  async function resetPassword(token, password, confirmPassword) {
    if (!window.apiClient) {
      throw new Error("API client not available");
    }
    return await window.apiClient.resetPassword(
      token,
      password,
      confirmPassword
    );
  }

  // Initialize authentication when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAuth);
  } else {
    initAuth();
  }

  // Export functions to global scope
  window.Auth = {
    initAuth,
    register,
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    getAuthToken,
    checkDomainAvailability,
    requestPasswordReset,
    resetPassword,
  };
})();
