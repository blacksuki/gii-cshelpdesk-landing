# Agent Context: giiHelpdeskAgent Landing Page

This document provides context for AI agents working on the `gii-cshelpdesk-landing` project.

## Project Overview
`giiHelpdeskAgent` is a landing page for an AI-powered Gmail Add-on designed for Shopify merchants. It aims to automate customer support by providing AI-generated response drafts based on Shopify order data, directly within Gmail.

## Tech Stack
- **Frontend**: Pure HTML, CSS (Vanilla), and JavaScript.
- **Components**: Client-side injection for Header/Footer using `js/common.js`.
- **Payment**: Shopify App Pricing (managed subscriptions via Shopify checkout redirect).
- **Deployment**: Vercel.
- **Auth**: Custom logic in `js/auth.js` and `js/common.js` using localStorage.

## Key Directories and Files
- `/index.html`: Main landing page with hero, features, and use cases.
- `/features.html`: Product features and comparisons.
- `/pricing.html`: Subscription plans and Shopify hosted billing redirection.
- `/case.html`: Merchant case studies with infinite scroll.
- `/about.html`: Team and product info.
- `/privacy.html`: Legal and privacy policy.
- `/css/style.css`: Main stylesheet using BEM naming convention.
- `/js/common.js`: Global utilities, header/footer rendering, and auth checks.
- `/js/auth.js`: Authentication logic and API interaction.
- `/vercel.json`: Vercel configuration for clean URLs and redirects.

## Development Guidelines
1. **Maintain Pure JS/CSS**: Avoid adding frameworks unless explicitly requested.
2. **BEM Convention**: Follow the BEM (Block__Element--Modifier) pattern for CSS classes.
3. **Component Injection**: Use `js/common.js` to modify header/footer content across pages.
4. **Responsive Design**: Ensure all changes are mobile-friendly (breakpoint: 768px).
5. **Privacy**: Maintain the "zero email content storage" promise in UI and logic.

## Current Project State
- The landing page is aligned for a Shopify launch unlisted/public app state.
- Authentication system is in place, connecting to a backend (Google Cloud Functions).
- Subscription plans are locked on $19/mo Pro and $49/mo Team tiers.
- Infinite scroll is implemented in `case.html`.

## Useful Commands
- **Local Server**: `npx serve . -l 3456`
- **Deploy**: `vercel --prod`
