/* Paddle initialization and checkout wiring (placeholder IDs) */
(function () {
    'use strict';

    // Replace with your real Vendor ID and product IDs
    var PADDLE_VENDOR_ID = 'VENDOR_ID';
    var PRODUCT_IDS = {
        free: 'FREE_PRODUCT_ID',
        pro: 'PRO_PRODUCT_ID',
        team: 'TEAM_PRODUCT_ID'
    };

    function initPaddle() {
        if (!window.Paddle) {
            console.error('Paddle script not loaded.');
            return;
        }

        if (!PADDLE_VENDOR_ID || PADDLE_VENDOR_ID === 'VENDOR_ID') {
            console.warn('Paddle Vendor ID is not set. Buttons will show a notice.');
        } else {
            try {
                window.Paddle.Setup({ vendor: PADDLE_VENDOR_ID });
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
                    window.Paddle.Checkout.open({ product: productId });
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


