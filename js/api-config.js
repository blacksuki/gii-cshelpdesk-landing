/**
 * API Configuration for giiHelpdeskAgent
 * Centralized configuration for different environments
 */

const API_CONFIG = {
    // Development environment (local testing)
    development: {
        baseURL: 'http://localhost:8088',
        // baseURL: 'https://us-central1-giicsagent.cloudfunctions.net',
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 2000
    },
    
    // Staging environment
    staging: {
        // baseURL: 'https://us-central1-giicsagent-staging.cloudfunctions.net',
        baseURL: 'http://localhost:8088',
        timeout: 15000,
        retryAttempts: 3,
        retryDelay: 1000
    },
    
    // Production environment
    production: {
        baseURL: 'https://us-central1-giicsagent.cloudfunctions.net',
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 2000
    }
};

/**
 * API endpoint definitions
 * first is the path in frontend, second is the function name in serverless-functions/api
 * @type {Object}
 */
const API_ENDPOINTS = {
    // Authentication endpoints - now using unified apiRouter
    auth: {
        register: '/apiRouter?route=auth/register',
        login: '/apiRouter?route=auth/login',
        forgot: '/apiRouter?route=auth/forgot',
        reset: '/apiRouter?route=auth/reset',
        verify: '/apiRouter?route=auth/verify',
        checkDomain: '/apiRouter?route=auth/check-domain',
        googleOAuth: '/apiRouter?route=auth/google-oauth'
    },
    
    // Account management endpoints - now using unified apiRouter
    account: {
        me: '/apiRouter?route=account/me',
        profile: '/apiRouter?route=account/profile',
        activity: '/apiRouter?route=account/activity',
        billing: '/apiRouter?route=account/billing',
        paymentMethods: '/apiRouter?route=account/payment-methods',
        billingHistory: '/apiRouter?route=account/billing-history',
        servicePolicyGet: '/apiRouter?route=account/service-policy',
        servicePolicyUpload: '/apiRouter?route=account/service-policy/upload',
        shopPolicies: '/apiRouter?route=account/shop-policies',
        shopifyDomain: '/apiRouter?route=account/shopify-domain',
        shopifyDomainVerify: '/apiRouter?route=account/shopify-domain/verify',
        shopifyDomainCheck: '/apiRouter?route=account/shopify-domain/check',
        apiKey: '/apiRouter?route=account/api-key'  // POST: save, GET: status, DELETE: delete
    },
    
    // Subscription endpoints - mixed routing (status uses handleRouter, others use apiRouter)
    subscription: {
        status: '/handleRouter?route=getSubscriptionStatus',  // Handler endpoint (used by Gmail add-on)
        plans: '/subscription-plans',
        upgrade: '/apiRouter?route=subscription/upgrade',
        cancel: '/apiRouter?route=subscription/cancel'
    },
    
    // Shopify integration endpoints - now using unified handleRouter
    shopify: {
        auth: '/handleRouter?route=shopifyAuthCallback',
        initiate: '/handleRouter?route=initiateShopifyAuth',
        orders: '/handleRouter?route=callShopifyGraphQL'
    }
};

/**
 * Get current environment configuration
 * @returns {Object} Current environment config
 */
function getCurrentConfig() {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return API_CONFIG.development;
    }
    
    // Staging environment (if you have one)
    if (hostname.includes('staging') || hostname.includes('dev')) {
        return API_CONFIG.staging;
    }
    
    // Production environment
    return API_CONFIG.production;
}

/**
 * Get full API URL for an endpoint
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full API URL
 */
function getApiUrl(endpoint) {
    const config = getCurrentConfig();
    return `${config.baseURL}${endpoint}`;
}

/**
 * Get environment name
 * @returns {string} Current environment name
 */
function getEnvironment() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'development';
    }
    
    if (hostname.includes('staging') || hostname.includes('dev')) {
        return 'staging';
    }
    
    return 'production';
}

// Export configuration
window.API_CONFIG = {
    getCurrentConfig,
    getApiUrl,
    getEnvironment,
    endpoints: API_ENDPOINTS,
    config: API_CONFIG,
    // Google OAuth Client ID - Replace with your actual client ID from Google Cloud Console
    googleClientId: '225456207726-9eqlvbeolroqurk3u3dmlmvialt7ocpk.apps.googleusercontent.com'
};
