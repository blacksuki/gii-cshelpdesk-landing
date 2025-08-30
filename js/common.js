/* Common utilities: header/footer injection, active nav, mobile support */
(function () {
    'use strict';

    /**
     * Renders the site header and footer into the page.
     * Placeholders: <div id="site-header"></div> and <div id="site-footer"></div>
     */
    const renderChrome = function renderChrome() {
        const headerTarget = document.getElementById('site-header');
        const footerTarget = document.getElementById('site-footer');

        const navLinks = [
            { href: 'index.html', text: 'Home' },
            { href: 'features.html', text: 'Features' },
            { href: 'pricing.html', text: 'Pricing' },
            { href: 'case.html', text: 'Case Studies' },
            { href: 'about.html', text: 'About' },
            { href: 'privacy.html', text: 'Privacy' }
        ];

        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const isLoggedIn = !!user.email;

        const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

        if (headerTarget) {
            headerTarget.innerHTML = [
                '<header class="site-header" role="banner">',
                '    <div class="site-header__inner">',
                '        <a class="logo" href="index.html" aria-label="giiHelpdesk home">',
                '            <span>giiHelpdesk</span>',
                '        </a>',
                '        <nav class="nav" role="navigation" aria-label="Primary">',
                navLinks.map(function (l) {
                    var cls = 'nav__link' + (current === l.href.toLowerCase() ? ' nav__link--active' : '');
                    return '<a class="' + cls + '" href="' + l.href + '">' + l.text + '</a>';
                }).join(''),
                (isLoggedIn ? 
                    '<a class="nav__cta" href="account/dashboard.html">Account</a>' : 
                    '<a class="nav__cta" href="pricing.html#free">Start free trial</a>'
                ),
                '        </nav>',
                '    </div>',
                '</header>'
            ].join('');
        }

        if (footerTarget) {
            const year = new Date().getFullYear();
            footerTarget.innerHTML = [
                '<footer class="footer" role="contentinfo">',
                '    <div class="container">',
                '        <div>&copy; ' + year + ' giiHelpdesk. All rights reserved.</div>',
                '        <div class="muted" style="margin-top:6px;">We do not store any email content.</div>',
                '    </div>',
                '</footer>'
            ].join('');
        }
    };

    document.addEventListener('DOMContentLoaded', renderChrome);
})();


