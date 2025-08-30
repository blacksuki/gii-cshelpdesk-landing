/**
 * Unified API Client for giiHelpdesk
 * Handles all API calls with authentication, retry logic, and error handling
 */

class ApiClient {
    constructor() {
        this.config = window.API_CONFIG.getCurrentConfig();
        this.baseURL = this.config.baseURL;
        this.token = this.getStoredToken();
        this.retryAttempts = this.config.retryAttempts;
        this.retryDelay = this.config.retryDelay;
        
        // Bind methods
        this.request = this.request.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.handleError = this.handleError.bind(this);
    }
    
    /**
     * Get stored authentication token
     */
    getStoredToken() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.token || null;
    }
    
    /**
     * Set authentication token
     */
    setToken(token) {
        this.token = token;
        if (token) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.token = token;
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }
    
    /**
     * Clear authentication token
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('user');
    }
    
    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.token;
    }
    
    /**
     * Create request timeout promise
     */
    createTimeoutPromise(timeout) {
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request timeout'));
            }, timeout);
        });
    }
    
    /**
     * Retry request with exponential backoff
     */
    async retryRequest(fn, attempt = 1) {
        try {
            return await fn();
        } catch (error) {
            if (attempt >= this.retryAttempts || error.name === 'AbortError') {
                throw error;
            }
            
            // Exponential backoff
            const delay = this.retryDelay * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            return this.retryRequest(fn, attempt + 1);
        }
    }
    
    /**
     * Make HTTP request with retry logic
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            }
        };
        
        const requestOptions = { ...defaultOptions, ...options };
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutPromise = this.createTimeoutPromise(this.config.timeout);
        
        const requestPromise = fetch(url, {
            ...requestOptions,
            signal: controller.signal
        });
        
        try {
            const response = await Promise.race([requestPromise, timeoutPromise]);
            return await this.handleResponse(response);
        } catch (error) {
            if (error.name === 'AbortError') {
                controller.abort();
            }
            throw error;
        }
    }
    
    /**
     * Handle HTTP response
     */
    async handleResponse(response) {
        // Handle 401 Unauthorized
        if (response.status === 401) {
            this.clearToken();
            // Redirect to login page
            if (window.location.pathname.includes('/account/')) {
                window.location.href = '/auth/login.html';
            }
            throw new Error('Authentication required');
        }
        
        // Handle 403 Forbidden
        if (response.status === 403) {
            throw new Error('Access denied');
        }
        
        // Handle 429 Too Many Requests
        if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        
        // Handle 5xx server errors
        if (response.status >= 500) {
            throw new Error('Server error. Please try again later.');
        }
        
        // Try to parse JSON response
        try {
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || data.message || `HTTP ${response.status}`);
            }
            
            return data;
        } catch (parseError) {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return { success: true };
        }
    }
    
    /**
     * Handle API errors
     */
    handleError(error) {
        console.error('API Error:', error);
        
        // Show user-friendly error message
        if (window.Toast) {
            window.Toast.error('API Error', error.message);
        }
        
        return {
            success: false,
            error: error.message
        };
    }
    
    // Authentication methods
    async register(userData) {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.auth.register, {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async login(credentials) {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.auth.login, {
                method: 'POST',
                body: JSON.stringify(credentials)
            });
            
            if (response.token) {
                this.setToken(response.token);
            }
            
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async forgotPassword(email) {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.auth.forgot, {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async resetPassword(token, password, confirmPassword) {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.auth.reset, {
                method: 'POST',
                body: JSON.stringify({ token, password, confirmPassword })
            });
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async checkDomain(domain) {
        try {
            const response = await this.request(`${window.API_CONFIG.endpoints.auth.checkDomain}?domain=${encodeURIComponent(domain)}`);
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    // Account methods
    async getAccountInfo() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.account.me);
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async updateProfile(profileData) {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.account.profile, {
                method: 'PATCH',
                body: JSON.stringify({ profile: profileData })
            });
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async getBillingInfo() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.account.billing);
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async getPaymentMethods() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.account.paymentMethods);
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async getBillingHistory() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.account.billingHistory);
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async getUserActivity() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.account.activity);
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    // Subscription methods
    async getSubscriptionStatus() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.subscription.status);
            return { success: true, data: response };
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    // Logout
    logout() {
        this.clearToken();
        if (window.location.pathname.includes('/account/')) {
            window.location.href = '/auth/login.html';
        }
    }
}

// Create and export singleton instance
window.apiClient = new ApiClient();
