/**
 * Reusable authentication middleware for LeanScale Sales App
 *
 * withAuth(handler, { level: 'public' | 'customer' | 'admin' })
 */

import { getCustomerServer } from './getCustomer';
import { AppError } from './api-errors';

/**
 * Higher-order function that wraps a Next.js API handler with auth checks.
 *
 * @param {Function} handler - The API handler function
 * @param {Object} options
 * @param {'public'|'customer'|'admin'} options.level - Auth level required
 * @returns {Function} Wrapped handler
 */
export function withAuth(handler, { level = 'admin' } = {}) {
  return async (req, res) => {
    // Public level — no auth required
    if (level === 'public') {
      return handler(req, res);
    }

    // Customer level — validate customer session from cookie/header
    if (level === 'customer') {
      try {
        const customer = await getCustomerServer({ req, query: req.query });
        if (!customer) {
          return res.status(401).json({
            success: false,
            error: {
              code: 'AUTH_REQUIRED',
              message: 'Customer session required',
            },
          });
        }
        req.customer = customer;
        return handler(req, res);
      } catch (err) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_FAILED',
            message: 'Invalid customer session',
          },
        });
      }
    }

    // Admin level — validate ADMIN_API_KEY or Bearer token
    const apiKey =
      req.headers['x-api-key'] ||
      req.headers.authorization?.replace('Bearer ', '');

    if (apiKey && apiKey === process.env.ADMIN_API_KEY) {
      req.isAdmin = true;
      return handler(req, res);
    }

    // Check referer for admin paths (backward compat)
    const referer = req.headers.referer || '';
    if (referer.includes('/admin/')) {
      req.isAdmin = true;
      return handler(req, res);
    }

    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Admin access required',
      },
    });
  };
}
