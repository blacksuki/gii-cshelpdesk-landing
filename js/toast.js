/**
 * Toast notification library for giiHelpdeskAgent
 * Provides consistent notification system across all pages
 */

(function() {
    'use strict';

    // Toast container
    let toastContainer = null;

    /**
     * Initialize toast container
     */
    function initToastContainer() {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        return toastContainer;
    }

    /**
     * Create toast element
     */
    function createToast(type, title, message, duration = 5000) {
        const container = initToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        const icon = getToastIcon(type);
        const closeBtn = createCloseButton();
        
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        toast.appendChild(closeBtn);
        container.appendChild(toast);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(toast);
            }, duration);
        }
        
        // Close button functionality
        closeBtn.addEventListener('click', () => {
            removeToast(toast);
        });
        
        return toast;
    }

    /**
     * Get appropriate icon for toast type
     */
    function getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    /**
     * Create close button
     */
    function createCloseButton() {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '×';
        closeBtn.setAttribute('aria-label', 'Close notification');
        return closeBtn;
    }

    /**
     * Remove toast with animation
     */
    function removeToast(toast) {
        toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    /**
     * Show success toast
     */
    function success(title, message, duration) {
        return createToast('success', title, message, duration);
    }

    /**
     * Show error toast
     */
    function error(title, message, duration) {
        return createToast('error', title, message, duration);
    }

    /**
     * Show warning toast
     */
    function warning(title, message, duration) {
        return createToast('warning', title, message, duration);
    }

    /**
     * Show info toast
     */
    function info(title, message, duration) {
        return createToast('info', title, message, duration);
    }

    /**
     * Clear all toasts
     */
    function clearAll() {
        if (toastContainer) {
            toastContainer.innerHTML = '';
        }
    }

    /**
     * Show loading toast (special case)
     */
    function loading(title, message) {
        const container = initToastContainer();
        
        const toast = document.createElement('div');
        toast.className = 'toast toast--info';
        toast.id = 'loading-toast';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <div class="spinner"></div>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        container.appendChild(toast);
        return toast;
    }

    /**
     * Hide loading toast
     */
    function hideLoading() {
        const loadingToast = document.getElementById('loading-toast');
        if (loadingToast) {
            removeToast(loadingToast);
        }
    }

    // Add slideOutRight animation to CSS if not exists
    if (!document.querySelector('#toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Export to global scope
    window.Toast = {
        success,
        error,
        warning,
        info,
        loading,
        hideLoading,
        clearAll
    };

})();

