/* Common utilities: header/footer injection, active nav, mobile support */
(function () {
  "use strict";

  /**
   * Renders the site header and footer into the page.
   * Placeholders: <div id="site-header"></div> and <div id="site-footer"></div>
   */
  const renderChrome = function renderChrome() {
    const headerTarget = document.getElementById("site-header");
    const footerTarget = document.getElementById("site-footer");

    const navLinks = [
      { href: "index.html", text: "Home" },
      { href: "features.html", text: "Features" },
      { href: "pricing.html", text: "Pricing" },
      { href: "case.html", text: "Case Studies" },
      { href: "privacy.html", text: "Privacy" },
      { href: "about.html", text: "About" },
    ];

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isLoggedIn = !!user.token;

    const current = (
      location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();

    // Determine if we're in the account directory
    const isInAccountDir = location.pathname.includes('/account/');
    const isDashboardPage = current === 'dashboard.html';
    
    // Adjust navigation links based on current directory
    const adjustedNavLinks = navLinks.map(function (l) {
      var href = l.href;
      if (isInAccountDir) {
        href = '../' + href;
      }
      var cls =
        "nav__link" +
        (current === l.href.toLowerCase() ? " nav__link--active" : "");
      return (
        '<a class="' + cls + '" href="' + href + '">' + l.text + "</a>"
      );
    });

    if (headerTarget) {
      // Determine CTA button content and action
      let ctaButton;
      if (isLoggedIn) {
        if (isDashboardPage) {
          // Show Logout button on dashboard page
          ctaButton = '<button class="nav__cta nav__cta--logout" onclick="handleLogout()">Logout</button>';
        } else {
          // Show Account link on other pages
          ctaButton = '<a class="nav__cta" href="' + (isInAccountDir ? 'dashboard.html' : 'account/dashboard.html') + '">Account</a>';
        }
      } else {
        // Show Login link for non-logged in users
        ctaButton = '<a class="nav__cta" href="' + (isInAccountDir ? '../auth/login.html' : 'auth/login.html') + '">Login</a>';
      }

      headerTarget.innerHTML = [
        '<header class="site-header" role="banner">',
        '    <div class="site-header__inner">',
        '        <a class="logo" href="' + (isInAccountDir ? '../index.html' : '/index.html') + '" aria-label="giiHelpdesk home">',
        "            <span>giiHelpdesk</span>",
        "        </a>",
        '        <nav class="nav" role="navigation" aria-label="Primary">',
        adjustedNavLinks.join(""),
        ctaButton,
        "        </nav>",
        "    </div>",
        "</header>",
      ].join("");
    }

    if (footerTarget) {
      const year = new Date().getFullYear();
      footerTarget.innerHTML = [
        '<footer class="footer" role="contentinfo">',
        '    <div class="container">',
        "        <div>&copy; " +
          year +
          " giiHelpdesk. All rights reserved.</div>",
        '        <div class="muted" style="margin-top:6px;">We do not store any email content.</div>',
        "    </div>",
        "</footer>",
      ].join("");
    }
  };

  document.addEventListener("DOMContentLoaded", renderChrome);
})();

// Authentication check
function checkAuthentication() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
//   console.log("checkAuthentication: user", user);
//   console.log("checkAuthentication: user.token", user.token);
  if (!user.token) {
    Toast.error(
      "Authentication Required",
      "Please sign in to access your dashboard."
    );
    setTimeout(() => {
      //debug not redirect
      console.log("checkAuthentication: not redirect");
      // window.location.href = '../auth/login.html';
    }, 2000);
    return;
  }
}

// Handle logout functionality
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    Toast.loading('Logging out', 'Please wait...');
    
    // Clear authentication data
    if (window.apiClient) {
      window.apiClient.logout();
    } else if (window.Auth) {
      window.Auth.logout();
    } else {
      // Fallback: clear localStorage and redirect
      localStorage.removeItem('user');
      Toast.hideLoading();
      Toast.success('Logged out', 'You have been successfully logged out.');
      setTimeout(() => {
        window.location.href = '../auth/login.html';
      }, 1500);
    }
  }
}

/**
 * Convert JSON object to key-value string
 *
 * @param {*} jsonObj
 * @return {*} 
 */
function jsonToKeyValue(jsonObj, prefix = '', result = []) {
  // 遍历当前对象的所有属性
  Object.entries(jsonObj).forEach(([key, value]) => {
      // 构建带前缀的键名（处理嵌套情况）
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      // 检查值是否为对象且不为null（排除null和数组）
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // 如果是对象则递归处理
          jsonToKeyValue(value, fullKey, result);
      } else if (Array.isArray(value)) {
          // 处理数组
          value.forEach((item, index) => {
              const arrayKey = `${fullKey}[${index}]`;
              if (typeof item === 'object' && item !== null) {
                  // 数组中的对象也递归处理
                  jsonToKeyValue(item, arrayKey, result);
              } else {
                  result.push(`${arrayKey} - ${item}`);
              }
          });
      } else {
          // 基本类型直接添加
          result.push(`${fullKey} - ${value}`);
      }
  });
  
  return result.join('\n');
}