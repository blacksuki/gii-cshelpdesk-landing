/**
 * Response Analyzer for giiHelpdesk
 * Helps debug API responses and identify token locations
 */

class ResponseAnalyzer {
    constructor() {
        this.knownTokenFields = [
            'token',
            'accessToken',
            'access_token',
            'jwt',
            'jwtToken',
            'authToken',
            'authorization'
        ];
    }

    /**
     * Analyze login response and find token
     */
    analyzeLoginResponse(response) {
        console.log('=== RESPONSE ANALYSIS ===');
        
        const analysis = {
            response: response,
            hasResponse: !!response,
            responseType: typeof response,
            responseKeys: response ? Object.keys(response) : [],
            success: response?.success,
            hasData: !!response?.data,
            dataKeys: response?.data ? Object.keys(response.data) : [],
            tokenFound: false,
            tokenLocation: null,
            tokenValue: null,
            tokenType: null,
            issues: []
        };

        // Check if response exists
        if (!response) {
            analysis.issues.push('No response received');
            console.log('❌ No response received');
            return analysis;
        }

        // Check response structure
        if (typeof response !== 'object') {
            analysis.issues.push(`Response is not an object: ${typeof response}`);
            console.log('❌ Response is not an object:', typeof response);
            return analysis;
        }

        // Check success flag
        if (!response.success) {
            analysis.issues.push('Response success flag is false or missing');
            console.log('❌ Response success flag is false or missing');
            return analysis;
        }

        console.log('✅ Response structure valid');
        console.log('Response keys:', analysis.responseKeys);

        // Check for data object
        if (!response.data) {
            analysis.issues.push('Response missing data object');
            console.log('❌ Response missing data object');
            return analysis;
        }

        console.log('✅ Data object found');
        console.log('Data keys:', analysis.dataKeys);

        // Look for token in data object
        const tokenInfo = this.findTokenInObject(response.data, 'response.data');
        if (tokenInfo.found) {
            analysis.tokenFound = true;
            analysis.tokenLocation = tokenInfo.location;
            analysis.tokenValue = tokenInfo.value;
            analysis.tokenType = tokenInfo.type;
            
            console.log('✅ Token found!');
            console.log('Location:', analysis.tokenLocation);
            console.log('Type:', analysis.tokenType);
            console.log('Value preview:', this.getTokenPreview(analysis.tokenValue));
        } else {
            analysis.issues.push('No token found in data object');
            console.log('❌ No token found in data object');
            
            // Show what we did find
            console.log('Data contents:');
            this.logObjectContents(response.data, '  ');
            
            // Check if this matches the expected backend format
            if (response.data && typeof response.data === 'object') {
                const expectedFields = ['message', 'user', 'token', 'expiresIn'];
                const actualFields = Object.keys(response.data);
                const missingFields = expectedFields.filter(field => !actualFields.includes(field));
                
                if (missingFields.length > 0) {
                    console.log('⚠️ Missing expected fields in response.data:', missingFields);
                    console.log('Expected fields:', expectedFields);
                    console.log('Actual fields:', actualFields);
                }
            }
        }

        // Check for token in root response
        const rootTokenInfo = this.findTokenInObject(response, 'response');
        if (rootTokenInfo.found) {
            analysis.tokenFound = true;
            analysis.tokenLocation = rootTokenInfo.location;
            analysis.tokenValue = rootTokenInfo.value;
            analysis.tokenType = rootTokenInfo.type;
            
            console.log('✅ Token found in root response!');
            console.log('Location:', analysis.tokenLocation);
            console.log('Type:', analysis.tokenType);
            console.log('Value preview:', this.getTokenPreview(analysis.tokenValue));
        }

        console.log('==========================');
        return analysis;
    }

    /**
     * Find token in an object
     */
    findTokenInObject(obj, path) {
        for (const field of this.knownTokenFields) {
            if (obj.hasOwnProperty(field)) {
                const value = obj[field];
                if (this.isValidToken(value)) {
                    return {
                        found: true,
                        location: `${path}.${field}`,
                        value: value,
                        type: typeof value
                    };
                }
            }
        }

        // Check nested objects
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null) {
                const nestedResult = this.findTokenInObject(value, `${path}.${key}`);
                if (nestedResult.found) {
                    return nestedResult;
                }
            }
        }

        return { found: false };
    }

    /**
     * Check if a value looks like a valid token
     */
    isValidToken(value) {
        if (!value || typeof value !== 'string') {
            return false;
        }

        const trimmed = value.trim();
        if (trimmed === '') {
            return false;
        }

        // Check if it looks like a JWT token (3 parts separated by dots)
        if (trimmed.split('.').length === 3) {
            return true;
        }

        // Check if it's a reasonable length for a token
        if (trimmed.length >= 20 && trimmed.length <= 2000) {
            return true;
        }

        return false;
    }

    /**
     * Get a preview of the token
     */
    getTokenPreview(token) {
        if (!token || typeof token !== 'string') {
            return 'N/A';
        }
        
        const trimmed = token.trim();
        if (trimmed.length <= 30) {
            return trimmed;
        }
        
        return trimmed.substring(0, 20) + '...' + trimmed.substring(trimmed.length - 10);
    }

    /**
     * Log object contents recursively
     */
    logObjectContents(obj, indent = '') {
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                console.log(`${indent}${key}: {`);
                this.logObjectContents(value, indent + '  ');
                console.log(`${indent}}`);
            } else if (Array.isArray(value)) {
                console.log(`${indent}${key}: [${value.length} items]`);
                if (value.length > 0) {
                    console.log(`${indent}  First item:`, value[0]);
                }
            } else {
                const displayValue = typeof value === 'string' && value.length > 50 
                    ? value.substring(0, 50) + '...' 
                    : value;
                console.log(`${indent}${key}: ${displayValue} (${typeof value})`);
            }
        }
    }

    /**
     * Suggest fixes based on analysis
     */
    suggestFixes(analysis) {
        const suggestions = [];

        if (!analysis.tokenFound) {
            suggestions.push('No token found in response. Check backend implementation.');
            
            if (analysis.dataKeys.length > 0) {
                suggestions.push(`Available data fields: ${analysis.dataKeys.join(', ')}`);
            }
            
            suggestions.push('Common token field names: ' + this.knownTokenFields.join(', '));
        }

        if (analysis.tokenFound && analysis.tokenType !== 'string') {
            suggestions.push(`Token found but wrong type: ${analysis.tokenType}. Expected string.`);
        }

        if (analysis.tokenFound && !this.isValidToken(analysis.tokenValue)) {
            suggestions.push('Token found but appears invalid. Check token format.');
        }

        return suggestions;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponseAnalyzer;
} else {
    window.ResponseAnalyzer = ResponseAnalyzer;
}
