/**
 * Login Error Handler for giiHelpdeskAgent
 * Handles login failures, token issues, and provides user-friendly error messages
 */

class LoginErrorHandler {
    constructor() {
        this.maxRetries = 3;
        this.retryDelay = 2000; // 2 seconds
        this.currentRetry = 0;
    }

    /**
     * Handle login success but token missing
     */
    handleTokenMissing(response) {
        console.error('Login Error: Token missing from response', response);
        
        const errorMessage = this.analyzeTokenIssue(response);
        
        // Show user-friendly error message
        if (window.Toast) {
            window.Toast.error('Login Error', errorMessage);
        }
        
        // Log detailed error for debugging
        console.error('Token Issue Analysis:', {
            response: response,
            errorMessage: errorMessage,
            timestamp: new Date().toISOString()
        });
        
        return {
            canRetry: this.canRetry(),
            errorMessage: errorMessage,
            response: response
        };
    }

    /**
     * Analyze why token is missing
     */
    analyzeTokenIssue(response) {
        if (!response) {
            return 'No response received from server. Please check your connection.';
        }
        
        if (!response.success) {
            return 'Login failed. Please check your credentials and try again.';
        }
        
        if (response.success && response.data) {
            if (response.data.token) {
                return 'Token found in data.token but not extracted. This is a system error.';
            } else if (response.data.accessToken) {
                return 'Token found in data.accessToken but not extracted. This is a system error.';
            } else {
                return 'Login successful but authentication token is missing. Please contact support.';
            }
        }
        
        return 'Unexpected response format. Please try again or contact support.';
    }

    /**
     * Handle login failure
     */
    handleLoginFailure(result) {
        console.error('Login Failure:', result);
        
        let errorMessage = 'Login failed. Please try again.';
        
        if (result.error === 'INVALID_CREDENTIALS') {
            errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (result.error === 'EMAIL_NOT_VERIFIED') {
            errorMessage = 'Please verify your email address before signing in.';
        } else if (result.error === 'ACCOUNT_LOCKED') {
            errorMessage = 'Your account has been locked due to multiple failed login attempts.';
        } else if (result.error === 'SUBSCRIPTION_EXPIRED') {
            errorMessage = 'Your subscription has expired. Please renew to continue.';
        } else if (result.error) {
            errorMessage = `Login error: ${result.error}`;
        }
        
        // Show error message
        if (window.Toast) {
            window.Toast.error('Login Failed', errorMessage);
        }
        
        return {
            canRetry: this.canRetry(),
            errorMessage: errorMessage,
            result: result
        };
    }

    /**
     * Handle network or API errors
     */
    handleApiError(error) {
        console.error('API Error during login:', error);
        
        let errorMessage = 'An unexpected error occurred. Please try again.';
        
        if (error.name === 'AbortError') {
            errorMessage = 'Request timeout. Please check your connection and try again.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timeout. Please try again.';
        }
        
        // Show error message
        if (window.Toast) {
            window.Toast.error('Connection Error', errorMessage);
        }
        
        return {
            canRetry: this.canRetry(),
            errorMessage: errorMessage,
            error: error
        };
    }

    /**
     * Check if we can retry the login
     */
    canRetry() {
        return this.currentRetry < this.maxRetries;
    }

    /**
     * Increment retry counter
     */
    incrementRetry() {
        this.currentRetry++;
        return this.currentRetry;
    }

    /**
     * Reset retry counter
     */
    resetRetry() {
        this.currentRetry = 0;
    }

    /**
     * Get retry information
     */
    getRetryInfo() {
        return {
            current: this.currentRetry,
            max: this.maxRetries,
            canRetry: this.canRetry(),
            delay: this.retryDelay
        };
    }

    /**
     * Show retry message
     */
    showRetryMessage() {
        const retryInfo = this.getRetryInfo();
        
        if (retryInfo.canRetry) {
            const message = `Login failed. Retrying in ${retryInfo.delay / 1000} seconds... (${retryInfo.current + 1}/${retryInfo.max})`;
            
            if (window.Toast) {
                window.Toast.info('Retrying Login', message);
            }
            
            console.log('Retry attempt:', retryInfo.current + 1, 'of', retryInfo.max);
        } else {
            const message = 'Maximum retry attempts reached. Please check your credentials and try again.';
            
            if (window.Toast) {
                window.Toast.error('Max Retries Reached', message);
            }
            
            console.error('Maximum retry attempts reached');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginErrorHandler;
} else {
    window.LoginErrorHandler = LoginErrorHandler;
}
