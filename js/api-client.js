/**
 * Unified API Client for giiHelpdesk
 * Handles all API calls with authentication, retry logic, and error handling
 */

class ApiClient {
    constructor() {
        this.config = window.API_CONFIG.getCurrentConfig();
        this.baseURL = this.config.baseURL;
        this.retryAttempts = this.config.retryAttempts;
        this.retryDelay = this.config.retryDelay;
        
        // Initialize token from localStorage
        this.token = this.getStoredToken();
        
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
        const token = user.token || null;
        
        if (token) {
            console.log('✅ Token found, length:', token.length);
        } else {
            console.log('❌ No token found in localStorage');
        }
        
        return token;
    }
    
    /**
     * Set authentication token
     */
    setToken(token) {
        // 验证 token
        if (!token || typeof token !== 'string' || token.trim() === '') {
            console.error('❌ Invalid token provided:', {
                type: typeof token,
                isEmpty: token === '',
                isWhitespace: token && token.trim() === ''
            });
            return false;
        }
        
        console.log('✅ Setting token, length:', token.length);
        
        this.token = token;
        
        // 最简结构：仅保存 token / email / domain 与时间戳（如有）
        const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
        const user = {
            token: token,
            email: existingUser.email,
            domain: existingUser.domain,
            createdAt: existingUser.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            subscription: existingUser.subscription || null
        };
        
        // 存储到 localStorage
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ Token stored successfully');
        
        return true;
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
       
        console.log('request: requestOptions', requestOptions);
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
            
            // Debug logging
            console.log('register API response:', response);
            
            // Return the API response directly to maintain consistency
            return response;
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
            
            // 直接匹配后端响应格式：{ success: true, data: { token: { accessToken: "..." }, user: {...} } }
            if (response && response.success && response.data) {
                let token = response.data.token;
                const returnedUser = response.data.user || {};
                
                // 先检查 token 的类型和值，避免调用不存在的方法
                console.log('Token check:', {
                    exists: !!token,
                    type: typeof token,
                    value: token,
                    isString: typeof token === 'string',
                    isObject: typeof token === 'object',
                    isNull: token === null,
                    isUndefined: token === undefined
                });
                
                // 如果 token 是对象，尝试提取实际的 token 字符串
                if (token && typeof token === 'object' && token !== null) {
                    console.log('Token object keys:', Object.keys(token));
                    
                    // 尝试从常见的字段名中提取 token
                    if (token.accessToken) {
                        token = token.accessToken;
                        console.log('✅ Extracted token from token.accessToken');
                    } else if (token.token) {
                        token = token.token;
                        console.log('✅ Extracted token from token.token');
                    } else if (token.jwt) {
                        token = token.jwt;
                        console.log('✅ Extracted token from token.jwt');
                    } else {
                        console.log('⚠️ Token object structure:', token);
                    }
                }
                
                if (token && typeof token === 'string' && token.trim() !== '') {
                    console.log('✅ Login successful, token found and extracted');
                    console.log('Token length:', token.length);
                    console.log('Token preview:', token.substring(0, 20) + '...');
                    
                    // 设置 token
                    const tokenSetSuccess = this.setToken(token);
                    
                    if (tokenSetSuccess) {
                        // 按最简结构持久化 email 与 domain（覆盖写入）
                        const minimalUser = {
                            token: token,
                            email: returnedUser.email || credentials?.email || undefined,
                            domain: returnedUser.domain || undefined,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            subscription: returnedUser.subscription || null
                        };
                        localStorage.setItem('user', JSON.stringify(minimalUser));
                        console.log('✅ Stored {token,email,domain} to localStorage');
                        // 验证 token 是否设置成功
                        setTimeout(() => {
                            console.log('=== TOKEN VERIFICATION ===');
                            console.log('Instance token:', this.token);
                            console.log('Stored token:', this.getStoredToken());
                            console.log('Is authenticated:', this.isAuthenticated());
                            console.log('==========================');
                        }, 50);
                    } else {
                        console.error('❌ Failed to set token');
                    }
                } else {
                    console.error('❌ Login successful but token is invalid or missing');
                    console.error('Token details:', {
                        exists: !!token,
                        type: typeof token,
                        value: token,
                        isEmpty: token === '',
                        isWhitespace: token && typeof token === 'string' ? token.trim() === '' : false
                    });
                    
                    // 显示完整的响应数据结构以便调试
                    console.log('Full response.data:', response.data);
                    console.log('Available fields in response.data:', Object.keys(response.data));
                    
                    if (response.data.token && typeof response.data.token === 'object') {
                        console.log('Token object structure:', response.data.token);
                        console.log('Token object keys:', Object.keys(response.data.token));
                    }
                }
            } else {
                console.error('❌ Invalid login response format');
                console.error('Response structure:', {
                    hasResponse: !!response,
                    hasSuccess: !!response?.success,
                    hasData: !!response?.data,
                    successValue: response?.success,
                    dataKeys: response?.data ? Object.keys(response.data) : []
                });
            }
            
            // Return the API response directly to maintain consistency
            return response;
        } catch (error) {
            console.error('❌ Login error:', error);
            return this.handleError(error);
        }
    }
    
    async forgotPassword(email) {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.auth.forgot, {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            
            // Debug logging
            console.log('forgotPassword API response:', response);
            
            // Return the API response directly to maintain consistency
            return response;
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
            
            // Debug logging
            console.log('resetPassword API response:', response);
            
            // Return the API response directly to maintain consistency
            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async checkDomain(domain) {
        try {
            const response = await this.request(`${window.API_CONFIG.endpoints.auth.checkDomain}?domain=${encodeURIComponent(domain)}`);
            
            // Debug logging
            console.log('checkDomain API response:', response);
            
            // The API returns { success: true, data: { available: true, ... } }
            // We should return the same structure to maintain consistency
            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    // Account methods
    async getAccountInfo() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.account.me);
            
            // Debug logging
            console.log('getAccountInfo API response:', response);
            
            // Return the API response directly to maintain consistency
            return response;
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
            
            // Debug logging
            console.log('updateProfile API response:', response);
            
            // Return the API response directly to maintain consistency
            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async getBillingInfo() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.account.billing);
            
            // Debug logging
            console.log('getBillingInfo API response:', response);
            
            // Return the API response directly to maintain consistency
            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async getPaymentMethods() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.account.paymentMethods);
            
            // Debug logging
            console.log('getPaymentMethods API response:', response);
            
            // Return the API response directly to maintain consistency
            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async getBillingHistory() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.account.billingHistory);
            
            // Debug logging
            console.log('getBillingHistory API response:', response);
            
            // Return the API response directly to maintain consistency
            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    async getUserActivity() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.account.activity);
            
            // Debug logging
            console.log('getUserActivity API response:', response);
            
            // Return the API response directly to maintain consistency
            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Service Policy methods
    async getServicePolicy(shopDomain) {
        try {
            const domain = shopDomain || (JSON.parse(localStorage.getItem('user') || '{}').domain);
            const endpoint = `${window.API_CONFIG.endpoints.account.servicePolicyGet}?shopDomain=${encodeURIComponent(domain || '')}`;
            const response = await this.request(endpoint);
            console.log('getServicePolicy response:', response);
            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async uploadServicePolicy({ shopDomain, policyType, content }) {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const subscription = user.subscription || null;
            // Client-side gate: Pro/Team only
            const plan = (subscription && subscription.plan || '').toLowerCase();
            if (plan !== 'pro' && plan !== 'team') {
                throw new Error('Service policy is available for Pro/Team plans only');
            }
            const response = await this.request(window.API_CONFIG.endpoints.account.servicePolicyUpload, {
                method: 'POST',
                body: JSON.stringify({
                    shopDomain: shopDomain || user.domain,
                    policyType,
                    content: content,
                    userSubscription: subscription
                })
            });
            console.log('uploadServicePolicy response:', response);
            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    // Subscription methods
    async getSubscriptionStatus(userEmail, shopDomain) {
        try {
            // Derive from localStorage if not provided
            if (!userEmail || !shopDomain) {
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                userEmail = userEmail || storedUser.email;
                shopDomain = shopDomain || storedUser.domain;
            }

            const response = await this.request(
                window.API_CONFIG.endpoints.subscription.status,
                {
                    method: 'POST',
                    body: JSON.stringify({ userEmail, shopDomain })
                }
            );
            
            // Debug logging
            console.log('getSubscriptionStatus API response:', response);
            
            // Return the API response directly to maintain consistency
            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async upgradeSubscription(plan, seats) {
        try {
            const response = await this.request('/upgradeSubscription', {
                method: 'POST',
                body: JSON.stringify({ plan, seats })
            });
            console.log('upgradeSubscription API response:', response);
            return response;
        } catch (error) {
            return this.handleError(error);
        }
    }

    async cancelSubscription() {
        try {
            const response = await this.request(window.API_CONFIG.endpoints.subscription.cancel, {
                method: 'POST'
            });
            console.log('cancelSubscription API response:', response);
            return response;
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
