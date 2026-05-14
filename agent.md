# Agent Context: giiHelpdeskAgent Landing Page

This document provides context for AI agents working on the `gii-cshelpdesk-landing` project.

## Project Overview
`giiHelpdeskAgent` is a landing page for an AI-powered Gmail Add-on designed for Shopify merchants. It aims to automate customer support by providing AI-generated response drafts based on Shopify order data, directly within Gmail.

## Tech Stack
- **Frontend**: Pure HTML, CSS (Vanilla), and JavaScript.
- **Components**: Client-side injection for Header/Footer using `js/common.js`.
- **Payment**: Paddle integration for subscriptions.
- **Deployment**: Vercel.
- **Auth**: Custom logic in `js/auth.js` and `js/common.js` using localStorage.

## Key Directories and Files
- `/index.html`: Main landing page with hero, features, and use cases.
- `/features.html`: Product features and comparisons.
- `/pricing.html`: Subscription plans and Paddle checkout.
- `/case.html`: Merchant case studies with infinite scroll.
- `/about.html`: Team and product info.
- `/privacy.html`: Legal and privacy policy.
- `/css/style.css`: Main stylesheet using BEM naming convention.
- `/js/common.js`: Global utilities, header/footer rendering, and auth checks.
- `/js/auth.js`: Authentication logic and API interaction.
- `/js/paddle.js`: Paddle payment initialization.
- `/vercel.json`: Vercel configuration for clean URLs and redirects.

## Development Guidelines
1. **Maintain Pure JS/CSS**: Avoid adding frameworks unless explicitly requested.
2. **BEM Convention**: Follow the BEM (Block__Element--Modifier) pattern for CSS classes.
3. **Component Injection**: Use `js/common.js` to modify header/footer content across pages.
4. **Responsive Design**: Ensure all changes are mobile-friendly (breakpoint: 768px).
5. **Privacy**: Maintain the "zero email content storage" promise in UI and logic.

## Current Project State
- The landing page is functional with a promotional "Free in 2026" banner.
- Authentication system is in place, connecting to a backend (likely Cloud Functions as per README).
- Paddle integration is prepared with placeholders for Vendor/Product IDs.
- Infinite scroll is implemented in `case.html`.

## Useful Commands
- **Local Server**: `npx http-server . -p 5173` or `live-server .`
- **Deploy**: `vercel --prod`
