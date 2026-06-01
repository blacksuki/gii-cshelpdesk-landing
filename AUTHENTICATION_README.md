# giiHelpdesk Authentication System

This document describes the complete user authentication and subscription system implemented for giiHelpdesk.

## 🏗️ System Architecture

### Frontend Structure
```
/auth/                    # Authentication pages
├── register.html        # User registration
├── login.html          # User login
├── forgot.html         # Forgot password
└── reset.html          # Password reset

/account/                # User account pages
├── dashboard.html       # Main dashboard
├── profile.html         # Profile settings
└── billing.html         # Subscription & billing

/css/
├── style.css           # Main landing page styles
└── auth.css            # Authentication-specific styles

/js/
├── common.js           # Shared functionality
├── toast.js            # Toast notification system
└── auth.js             # Authentication utilities
```

### Backend API Structure
```
/api/auth/               # Authentication endpoints
├── register            # User registration
├── check-domain        # Domain availability check
├── login               # User login
├── verify              # Email verification
├── forgot              # Password reset request
└── reset               # Password reset

/api/account/            # User account endpoints
├── me                  # Get current user
├── profile             # Profile management
├── billing             # Subscription info
├── activity            # User activity
├── payment-methods     # Payment methods
└── billing-history     # Billing history

/api/webhooks/           # Webhook endpoints
└── shopify              # Shopify GDPR compliance webhooks
```

## 🔐 Authentication Flow

### 1. User Registration
1. User fills out registration form with:
   - Domain name (unique identifier)
   - Email address
   - Password (with strength validation)
   - Password confirmation
2. Frontend validates input and checks domain availability
3. Backend creates user account with:
   - Hashed password (bcrypt)
   - Email verification token
   - Free trial subscription (14 days)
   - Default profile settings
4. Verification email sent to user
5. User redirected to login with success message

### 2. Email Verification
1. User clicks verification link in email
2. Backend validates token and marks email as verified
3. User can now log in to the system

### 3. User Login
1. User enters email and password
2. Backend validates credentials
3. JWT token generated and returned
4. User redirected to dashboard
5. Token stored in localStorage for subsequent requests

### 4. Password Reset
1. User requests password reset via forgot password page
2. Reset token generated and sent via email
3. User clicks reset link and enters new password
4. Password updated and user can log in

### 5. Google OAuth Login
1. User clicks "Continue with Google"
2. Google Identity Services (GIS) library handles account selection
3. ID token received from Google and sent to backend
4. Backend verifies token and checks user existence:
   - If user exists, session token is returned
   - If user is new, account is created and `requiresDomainSetup` flag is returned
5. Frontend stores token and redirects:
   - Existing users go to dashboard
   - New users are guided to set up their Shopify domain

## 🗄️ Database Schema

### Users Collection
```javascript
{
  email: "user@domain.com",           // Document ID
  domain: "domain.com",
  passwordHash: "bcrypt_hash",
  emailVerified: false,
  verificationToken: "uuid",
  tokenExpiry: "timestamp",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  profile: {
    fullName: "User Name",
    phone: "+1234567890",
    company: "Company Name",
    timezone: "America/New_York",
    language: "en",
    avatar: "https://...",
    loginNotifications: false,
    twoFactorEnabled: false
  },
  subscription: {
    plan: "free",                     // free/trial, pro, team
    status: "active",                 // active, cancelled, expired
    startDate: "timestamp",
    endDate: "timestamp",
    shopifySubscriptionId: null,
    seats: 1,
    billingCycle: "monthly",
    monthlyPrice: 0
  },
  settings: {
    theme: "light",
    notifications: {
      email: true,
      push: false
    }
  }
}
```

### Domains Collection
```javascript
{
  domain: "domain.com",              // Document ID
  email: "user@domain.com",
  createdAt: "timestamp",
  status: "active"
}
```

### Subscriptions Collection
```javascript
{
  userEmail: "user@domain.com",      // Document ID
  domain: "domain.com",
  plan: "free",
  status: "active",
  startDate: "timestamp",
  endDate: "timestamp",
  shopifySubscriptionId: null,
  seats: 1,
  billingCycle: "monthly",
  monthlyPrice: 0,
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## 💳 Subscription Plans

| Plan | Price | Seats | Email Limit | Features |
|------|-------|-------|-------------|----------|
| Free/Trial | $0 | 1 | 50/month | 14-day free trial, basic features |
| Pro | $19/month | 1 | 1,000/month | Priority support, Shopify integration |
| Team | $49/month | 5 | 5,000/month | 24/7 support, advanced analytics |

## 🔧 Technical Implementation

### Frontend Features
- **Responsive Design**: Mobile-first approach with TailwindCSS-inspired classes
- **Form Validation**: Real-time validation with helpful error messages
- **Password Strength**: Visual indicator with requirements checking
- **Domain Availability**: Real-time domain checking with suggestions
- **Toast Notifications**: Consistent notification system across all pages
- **Loading States**: Spinner animations for better UX
- **Authentication Guards**: Protected routes with automatic redirects

### Backend Features
- **Password Security**: bcrypt hashing with salt rounds
- **JWT Tokens**: Secure authentication with configurable expiry
- **Input Validation**: Comprehensive validation on all endpoints
- **Error Handling**: Structured error responses with codes
- **Logging**: Detailed logging for debugging and monitoring
- **CORS Support**: Cross-origin request handling
- **Rate Limiting**: Protection against abuse (TODO: implement)

### Security Features
- **Password Requirements**: Minimum 8 characters, mixed case, numbers
- **Domain Validation**: Reserved word checking, format validation
- **Email Verification**: Required before account activation
- **Secure Tokens**: UUID-based verification and reset tokens
- **HTTPS Only**: All communication over secure connections
- **Input Sanitization**: Protection against injection attacks

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- Vercel CLI installed
- Firebase project with Firestore enabled
- Shopify Partner Account & API credentials

### Environment Variables
Create a `.env.local` file in the project root:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIRESTORE_DATABASE_ID=giihelpdesk01

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRY=7d

## 1. 生成 32 字节随机串，base64 编码
JWT_SECRET=$(openssl rand -base64 32)

## 2. 可选：去掉换行符（macOS 的 base64 默认不带换行，保险起见）
JWT_SECRET="${JWT_SECRET//[$'\t\r\n ']/}"

## 3. 创建 Secret（如已存在则改为添加新版本）
echo -n "$JWT_SECRET" | gcloud secrets create JWT_SECRET \
  --data-file=- \
  --replication-policy="automatic" \
  --project="$(gcloud config get-value project)"

## 若 Secret 已存在，则改为：
echo -n "$JWT_SECRET" | gcloud secrets versions add JWT_SECRET --data-file=-

## 一行复制即用（自动判断是否存在）生成并写入/轮换 JWT_SECRET
JWT_SECRET=$(openssl rand -base64 32) \
  && { gcloud secrets describe JWT_SECRET >/dev/null 2>&1 \
       && echo -n "$JWT_SECRET" | gcloud secrets versions add JWT_SECRET --data-file=- \
       || echo -n "$JWT_SECRET" | gcloud secrets create JWT_SECRET --data-file=- --replication-policy=automatic; } \
  && echo "JWT_SECRET 已保存到 Secret Manager"

# Shopify Configuration
SHOPIFY_APP_HANDLE=giihelpdeskagent
PARTNER_ACCESS_TOKEN=your-partner-access-token
PARTNER_ORG_ID=your-partner-org-id

# Frontend URL
FRONTEND_URL=https://giihelpdesk.com

# Google OAuth Configuration (Backend)
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Google OAuth Setup
To enable Google Login, you must configure the Client ID in both frontend and backend:

1. **Backend**: Set `GOOGLE_OAUTH_CLIENT_ID` in your serverless functions environment variables.
2. **Frontend**: Update `googleClientId` in [js/api-config.js](file:///Users/huoward/Project/21.CS-Agent/csai-dev/gii-cshelpdesk-landing/js/api-config.js).

### Local Development
```bash
# Install dependencies
npm install

# Start local development server
vercel dev

# Open in browser
open http://localhost:3000
```

### Deployment
```bash
# Deploy to Vercel
vercel --prod

# Or deploy specific functions
vercel deploy api/auth/register.js
```

## 🧪 Testing

### Frontend Testing
- Test all form validations
- Test responsive design on mobile devices
- Test authentication flow end-to-end
- Test error handling and user feedback

### Backend Testing
- Test all API endpoints with valid/invalid data
- Test authentication and authorization
- Test database operations
- Test error handling and logging

### Integration Testing
- Test complete user registration flow
- Test subscription management
- Test Shopify webhooks and Partner API subscription status queries
- Test email delivery (verification, reset)

## 📱 Responsive Design

The authentication system is fully responsive with:
- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: 480px, 768px, and 1024px
- **Touch Friendly**: Large touch targets and proper spacing
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🔒 Security Considerations

### Password Security
- Minimum 8 characters required
- Must include uppercase, lowercase, and numbers
- bcrypt hashing with 12 salt rounds
- No password storage in plain text

### Session Management
- JWT tokens with 7-day expiry
- Secure cookie storage (httpOnly, secure, sameSite)
- Automatic token refresh
- Session invalidation on logout

### Data Protection
- All sensitive data encrypted at rest
- HTTPS required for all communications
- Input validation and sanitization
- Rate limiting to prevent abuse

## 🚨 Error Handling

### Frontend Errors
- User-friendly error messages
- Toast notifications for feedback
- Form validation with real-time feedback
- Graceful fallbacks for network issues

### Backend Errors
- Structured error responses
- HTTP status codes
- Error logging for debugging
- Rate limiting and abuse prevention

## 📊 Monitoring & Logging

### Application Logs
- User registration attempts
- Login attempts (success/failure)
- Password reset requests
- Subscription changes
- API usage and errors

### Security Monitoring
- Failed authentication attempts
- Suspicious activity patterns
- Rate limit violations
- Unusual access patterns

## 🔄 Future Enhancements

### Planned Features
- **Two-Factor Authentication**: SMS/App-based 2FA
- **Social Login**: GitHub, Microsoft integration (Google implemented)
- **Advanced Analytics**: User behavior tracking
- **Multi-language Support**: Internationalization
- **Advanced Security**: IP whitelisting, device management

### Technical Improvements
- **Redis Caching**: Session and data caching
- **CDN Integration**: Static asset optimization
- **Database Optimization**: Indexing and query optimization
- **API Rate Limiting**: Advanced rate limiting strategies

## 📞 Support

For technical support or questions about the authentication system:

- **Email**: support@giihelpdesk.com
- **Documentation**: https://docs.giihelpdesk.com
- **GitHub Issues**: Report bugs and feature requests

## 📄 License

This authentication system is part of the giiHelpdesk project and is proprietary software. All rights reserved.

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Production Ready
