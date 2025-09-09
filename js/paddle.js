/* Paddle initialization and checkout wiring (placeholder IDs) */
(function () {
    'use strict';

    // Replace with your real Vendor ID and product IDs
    var PADDLE_VENDOR_ID = '37642';
    var PRODUCT_IDS = {
        free: 'FREE_PRODUCT_ID',
        pro: 'pro_01k4kjp0jmd33g5jek3xk28esp',
        team: 'TEAM_PRODUCT_ID'
    };

    function initPaddle() {
        if (!window.Paddle) {
            console.error('Paddle script not loaded.');
            return;
        }

        Paddle.Environment.set('sandbox');
        
        if (!PADDLE_VENDOR_ID || PADDLE_VENDOR_ID === 'VENDOR_ID') {
            console.warn('Paddle Vendor ID is not set. Buttons will show a notice.');
        } else {
            try {
                // window.Paddle.Setup({ vendor: PADDLE_VENDOR_ID });
                window.Paddle.Initialize({
                    token: 'test_702fcc10e2a004641eb9f87e3f2'
                  });
            } catch (e) {
                console.error('Failed to initialize Paddle:', e);
            }
        }
    }

    function bindButtons() {
        var buttons = document.querySelectorAll('.paddle-btn[data-plan]');
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var plan = btn.getAttribute('data-plan');
                var productId = PRODUCT_IDS[plan];
                if (!PADDLE_VENDOR_ID || PADDLE_VENDOR_ID === 'VENDOR_ID' || !productId || /_PRODUCT_ID$/.test(productId)) {
                    alert('Checkout is not configured yet. Please set your Paddle Vendor ID and Product IDs.');
                    return;
                }
                try {
                    // derive user context for customData
                    var user = {};
                    try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch(_) {}
                    var userEmail = (user && user.email) || (user && user.user && user.user.email) || '';
                    var userDomain = (user && user.domain) || (user && user.user && user.user.domain) || '';
              

                    // success URL if provided on button
                    var successUrl = btn.getAttribute('data-success-url') || window.location.origin + '/account/dashboard.html';

                    window.Paddle.Checkout.open({
                        product: productId,
                        customData: {
                            userEmail: userEmail,
                            userDomain: userDomain,
                            selectedPlan: plan
                        },
                        // optional: redirect to dashboard
                        successUrl: successUrl
                    });
                } catch (e) {
                    console.error('Failed to open Paddle checkout:', e);
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initPaddle();
        bindButtons();
    });
})();


