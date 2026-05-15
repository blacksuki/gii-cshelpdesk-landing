# giiHelpdesk Landing Website

> **Marketing & User Portal for CS-AI Agent System**  
> **Target Market**: North America Shopify Small Business Market  
> **Version**: 1.0  
> **Last Updated**: 2026-04-16

---

## 📋 **Project Overview**

The giiHelpdesk Landing Website is a comprehensive marketing and user portal for the CS-AI Agent System. It provides product information, user authentication, account management, and subscription handling for Shopify merchants.

### **Key Features**
- 🎨 **Modern Responsive Design**: Mobile-first approach with clean, professional UI
- 🔐 **Complete Authentication System**: Registration, login, password reset, email verification
- 👤 **User Account Management**: Dashboard, profile settings, billing management
- 💳 **Paddle Integration**: Subscription management and payment processing
- 🔗 **Shopify Integration**: Domain validation and OAuth flow
- 🌐 **Google OAuth**: One-click sign-in with Google accounts
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices

---

## 🏗️ **Project Structure**

```
gii-cshelpdesk-landing/
├── index.html              # Homepage with product features
├── features.html           # Feature comparison (vs competitors)
├── pricing.html            # Subscription plans and pricing
├── case.html              # Customer success stories
├── about.html             # About us and team
├── contact.html           # Contact form
├── privacy.html           # Privacy policy
├── terms.html             # Terms of service
├── refund.html            # Refund policy
│
├── auth/                  # Authentication pages
│   ├── register.html      # User registration
│   ├── login.html         # User login
│   ├── forgot.html        # Forgot password
│   └── reset.html         # Password reset
│
├── account/               # User account pages
│   ├── dashboard.html     # Main dashboard
│   ├── profile.html       # Profile settings
│   └── billing.html       # Subscription & billing
│
├── css/
│   ├── style.css          # Main landing page styles
│   └── auth.css           # Authentication & account styles
│
├── js/
│   ├── common.js          # Shared utilities (header/footer injection)
│   ├── toast.js           # Toast notification system
│   ├── auth.js            # Authentication utilities
│   ├── api-config.js      # API configuration (unified router endpoints)
│   ├── api-client.js      # Unified API client with retry logic
│   ├── paddle.js          # Paddle payment integration
│   └── cases.js           # Customer case studies loader
│
├── images/                # Logo and assets
├── public/                # Public assets (Shopify OAuth success/error pages)
├── package.json           # Dependencies (resend for emails)
└── vercel.json            # Vercel deployment configuration
```

---

## 🎯 **Core Features**

### **1. Marketing Pages**

#### Homepage (`index.html`)
- Hero section with value proposition
- Quick start guide (3-step process)
- Feature highlights
- Social proof and testimonials
- CTA buttons for trial signup

#### Features Page (`features.html`)
- Detailed feature descriptions
- Comparison with competitors (Zendesk, Gorgias)
- Use case scenarios
- Integration capabilities

#### Pricing Page (`pricing.html`)
- Three subscription tiers:
  - **Free Trial**: 14 days, 1 seat, 50 emails/month
  - **Pro**: $79/month, 1 seat, 1,000 emails/month
  - **Team**: $199/month, unlimited seats, 5,000 emails/month
- Paddle Checkout integration
- Feature comparison table

#### Case Studies (`case.html`)
- Customer success stories
- Infinite scroll loading (3 items at a time)
- Metrics: GMV, cost savings, efficiency gains

### **2. Authentication System**

#### User Registration (`auth/register.html`)
- **Domain-based registration**: Shopify domain as unique identifier
- **Email verification**: Verification email sent on signup
- **14-day free trial**: Automatic trial subscription creation
- **Password strength validation**: Real-time strength indicator
- **Domain availability check**: Real-time domain validation
- **Google OAuth**: One-click registration with Google

#### User Login (`auth/login.html`)
- **Email/password authentication**: Traditional login
- **Google OAuth**: One-click sign-in
- **JWT token management**: Secure session handling
- **Remember me**: Optional persistent login
- **Redirect handling**: Return to intended page after login

#### Password Management
- **Forgot Password** (`auth/forgot.html`): Email-based reset link
- **Reset Password** (`auth/reset.html`): Token-validated password reset
- **Password requirements**: Minimum 8 characters, mixed case, numbers

### **3. Account Management**

#### Dashboard (`account/dashboard.html`)
- **Subscription status**: Current plan, expiry date, usage
- **Quick actions**: Upgrade plan, manage Shopify connection
- **Usage statistics**: Email count, API calls, seat usage
- **Recent activity**: Login history, actions log

#### Profile Settings (`account/profile.html`)
- **Personal information**: Name, email, phone, company
- **Shopify domain**: Domain validation and OAuth connection
- **Preferences**: Timezone, language, notifications
- **Security**: Password change, 2FA settings (planned)

#### Billing Management (`account/billing.html`)
- **Current subscription**: Plan details, next billing date
- **Payment methods**: Card management via Paddle
- **Billing history**: Invoice downloads, payment records
- **Plan upgrades**: Seamless plan changes

### **4. API Integration**

#### Unified Router Architecture
All API calls use the unified router pattern:
- **API Router**: `/apiRouter?route=module/action`
- **Handler Router**: `/handleRouter?route=handler/action`

#### API Endpoints (via `api-config.js`)
```javascript
// Authentication
/apiRouter?route=auth/register
/apiRouter?route=auth/login
/apiRouter?route=auth/forgot
/apiRouter?route=auth/reset
/apiRouter?route=auth/verify
/apiRouter?route=auth/check-domain
/apiRouter?route=auth/google-oauth

// Account Management
/apiRouter?route=account/me
/apiRouter?route=account/profile
/apiRouter?route=account/billing
/apiRouter?route=account/activity
/apiRouter?route=account/shopify-domain
/apiRouter?route=account/shopify-domain/verify
/apiRouter?route=account/service-policy

// Subscription
/apiRouter?route=subscription/upgrade
/apiRouter?route=subscription/cancel
/getSubscriptionStatus
```

#### API Client Features (`api-client.js`)
- **Automatic retry**: 3 attempts with exponential backoff
- **Token management**: Automatic token injection in headers
- **Error handling**: Structured error responses
- **Timeout handling**: Configurable request timeouts
- **Environment detection**: Auto-switch between dev/staging/production

---

## 🔐 **Authentication Flow**

### **Registration Flow**
1. User enters Shopify domain, email, and password
2. Frontend validates domain availability (real-time check)
3. Backend creates user account with hashed password
4. Backend creates domain-keyed subscription (14-day trial)
5. Verification email sent to user
6. User redirected to login with success message

### **Login Flow**
1. User enters email and password (or uses Google OAuth)
2. Backend validates credentials
3. JWT token generated and returned
4. Token stored in localStorage
5. User redirected to dashboard
6. Token automatically included in subsequent API calls

### **Google OAuth Flow**
1. User clicks "Continue with Google"
2. Google Identity Services handles account selection
3. ID token sent to backend for verification
4. Backend checks if user exists:
   - Existing user: Returns session token
   - New user: Creates account, returns token + `requiresDomainSetup` flag
5. Frontend redirects accordingly:
   - Existing users → Dashboard
   - New users → Domain setup flow

### **Password Reset Flow**
1. User requests password reset via email
2. Reset token generated and emailed
3. User clicks reset link with token
4. User enters new password
5. Password updated, user can log in

---

## 💳 **Subscription Management**

### **Subscription Model**
- **Domain-based**: Each Shopify domain has one subscription
- **14-day free trial**: Automatically created on registration
- **Paddle integration**: Payment processing via Paddle
- **Webhook handling**: Real-time subscription updates

### **Subscription Plans**

| Plan | Price | Seats | Email Limit | Features |
|------|-------|-------|-------------|----------|
| **Free Trial** | $0 | 1 | 50/month | 14-day trial, basic features |
| **Pro** | $79/month | 1 | 1,000/month | Priority support, Shopify integration |
| **Team** | $199/month | Unlimited | 5,000/month | 24/7 support, advanced analytics |

### **Paddle Integration**
- **Checkout**: Embedded Paddle checkout for seamless payments
- **Webhooks**: Automatic subscription status updates
- **Invoice management**: Downloadable invoices and receipts
- **Payment methods**: Credit card, PayPal support

---

## 🛠️ **Technical Stack**

### **Frontend**
- **HTML5**: Semantic markup
- **CSS3**: Custom styles with CSS variables
- **Vanilla JavaScript**: No framework dependencies
- **Responsive Design**: Mobile-first approach
- **BEM Methodology**: Block-Element-Modifier naming

### **Backend Integration**
- **Google Cloud Functions**: Serverless backend
- **Firestore**: NoSQL database
- **Secret Manager**: Secure credential storage
- **Paddle API**: Payment processing
- **Resend API**: Transactional emails

### **Third-Party Services**
- **Paddle**: Subscription billing
- **Google OAuth**: Social authentication
- **Shopify API**: Store integration
- **Resend**: Email delivery

---

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js 20.x or higher
- Vercel CLI (for deployment)
- Google Cloud Project (for backend)
- Paddle account (for payments)

### **Local Development**

#### 1. Clone Repository
```bash
git clone https://github.com/your-org/cs-ai-agent-system.git
cd cs-ai-agent-system/gii-cshelpdesk-landing
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure API Endpoints
Edit `js/api-config.js`:
```javascript
const API_CONFIG = {
    development: {
        baseURL: 'http://localhost:8088',  // Local backend
        timeout: 30000
    },
    production: {
        baseURL: 'https://us-central1-YOUR_PROJECT.cloudfunctions.net',
        timeout: 30000
    }
};
```

#### 4. Configure Google OAuth
Update `js/api-config.js`:
```javascript
googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
```

#### 5. Start Local Server
```bash
# Option 1: Using npx
npx http-server . -p 5173

# Option 2: Using Python
python3 -m http.server 5173

# Option 3: Using live-server
live-server .
```

#### 6. Open in Browser
```
http://localhost:5173
```

### **Backend Setup**

Ensure the backend Cloud Functions are deployed:
```bash
cd ../gii-cshelpdesk-agent/serverless-functions
./scripts/deploy_functions.sh
```

---

## 🚀 **Deployment**

### **Deploy to Vercel**

#### 1. Install Vercel CLI
```bash
npm i -g vercel
vercel login
```

#### 2. Configure Environment
Create `.env.local` (not committed):
```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://us-central1-YOUR_PROJECT.cloudfunctions.net

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com

# Paddle
NEXT_PUBLIC_PADDLE_VENDOR_ID=YOUR_VENDOR_ID
```

#### 3. Deploy
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

#### 4. Configure Custom Domain
```bash
vercel domains add giihelpdesk.com
```

### **Vercel Configuration**

The `vercel.json` file includes:
- Clean URLs (no `.html` extensions)
- Security headers (CSP, X-Frame-Options, etc.)
- Redirect rules
- 404 handling

---

## 🎨 **Design System**

### **Color Palette**
```css
:root {
    --primary: #0A75FF;        /* Brand blue */
    --primary-dark: #0056CC;   /* Hover state */
    --success: #10B981;        /* Success green */
    --warning: #F59E0B;        /* Warning orange */
    --error: #EF4444;          /* Error red */
    --text: #1F2937;           /* Primary text */
    --text-light: #6B7280;     /* Secondary text */
    --bg: #FFFFFF;             /* Background */
    --bg-gray: #F9FAFB;        /* Light gray bg */
}
```

### **Typography**
- **Font Family**: System fonts (San Francisco, Segoe UI, Roboto)
- **Headings**: Bold, larger sizes
- **Body**: Regular weight, 16px base size
- **Code**: Monospace font for technical content

### **Spacing**
- **Base unit**: 8px
- **Consistent spacing**: Multiples of 8px (8, 16, 24, 32, 48, 64)

### **Responsive Breakpoints**
```css
/* Mobile: < 768px */
/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */
```

---

## 🧪 **Testing**

### **Manual Testing Checklist**

#### Authentication
- [ ] User registration with domain validation
- [ ] Email verification flow
- [ ] Login with email/password
- [ ] Google OAuth login
- [ ] Password reset flow
- [ ] Token expiration handling

#### Account Management
- [ ] Dashboard loads correctly
- [ ] Profile updates save
- [ ] Shopify domain connection
- [ ] Subscription status display
- [ ] Billing history access

#### Responsive Design
- [ ] Mobile layout (< 768px)
- [ ] Tablet layout (768px - 1024px)
- [ ] Desktop layout (> 1024px)
- [ ] Touch interactions work
- [ ] Forms are usable on mobile

#### Cross-Browser
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile browsers

---

## 🔒 **Security Features**

### **Authentication Security**
- **Password hashing**: bcrypt with 12 salt rounds
- **JWT tokens**: Secure, expiring tokens
- **HTTPS only**: All communications encrypted
- **Input validation**: Client and server-side validation
- **CORS protection**: Restricted origins

### **Data Protection**
- **No email storage**: Email content never persisted
- **Minimal data collection**: Only essential user data
- **Secure token storage**: localStorage with expiration
- **Domain validation**: Prevent unauthorized access

### **Compliance**
- **GDPR compliant**: Privacy policy, data rights
- **CCPA compliant**: California privacy requirements
- **OAuth scopes**: Minimal Gmail permissions
- **DPA**: Data Processing Agreement via Paddle

---

## 📊 **Analytics & Monitoring**

### **User Analytics** (Planned)
- Page views and navigation
- Conversion funnel tracking
- User engagement metrics
- A/B testing capabilities

### **Error Monitoring**
- Client-side error tracking
- API error logging
- Performance monitoring
- User feedback collection

---

## 🔄 **Future Enhancements**

### **Planned Features**
- [ ] Two-factor authentication (2FA)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Mobile app (React Native)
- [ ] Advanced reporting
- [ ] Team collaboration features
- [ ] API rate limiting dashboard

### **Technical Improvements**
- [ ] Progressive Web App (PWA)
- [ ] Service worker for offline support
- [ ] Image optimization and lazy loading
- [ ] Code splitting for faster loads
- [ ] CDN integration
- [ ] Redis caching layer

---

## 📞 **Support**

### **Documentation**
- [Authentication System](./AUTHENTICATION_README.md)
- [Backend API Documentation](../gii-cshelpdesk-agent/README.md)
- [Deployment Guide](../gii-cshelpdesk-agent/docs/deployment-guide_v3.1.md)

### **Contact**
- **Email**: support@giihelpdesk.com
- **Website**: https://giihelpdesk.com
- **GitHub Issues**: Report bugs and feature requests

---

## 📄 **License**

This project is proprietary software. All rights reserved.

---

## 🏆 **Credits**

Built with ❤️ by the giiHelpdesk team

**Technologies Used**:
- Google Cloud Platform
- Vercel
- Paddle
- Resend
- Shopify API
- OpenAI GPT-4

---

*Last Updated: 2026-04-16*  
*Version: 1.0*  
*Status: Production Ready*