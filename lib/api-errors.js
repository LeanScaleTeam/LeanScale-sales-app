/**
 * Standardized API error handling for LeanScale Sales App
 */

import { randomBytes } from 'crypto';

export class AppError extends Error {
  constructor(code, message, statusCode = 500, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Error code catalog
export const ErrorCodes = {
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', statusCode: 400 },
  NOT_FOUND: { code: 'NOT_FOUND', statusCode: 404 },
  METHOD_NOT_ALLOWED: { code: 'METHOD_NOT_ALLOWED', statusCode: 405 },
  AUTH_REQUIRED: { code: 'AUTH_REQUIRED', statusCode: 401 },
  UNAUTHORIZED: { code: 'UNAUTHORIZED', statusCode: 401 },
  FORBIDDEN: { code: 'FORBIDDEN', statusCode: 403 },
  RATE_LIMITED: { code: 'RATE_LIMITED', statusCode: 429 },
  CONFLICT: { code: 'CONFLICT', statusCode: 409 },
  PDF_GENERATION_FAILED: { code: 'PDF_GENERATION_FAILED', statusCode: 500 },
  EXTERNAL_SERVICE_ERROR: { code: 'EXTERNAL_SERVICE_ERROR', statusCode: 502 },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', statusCode: 500 },
};

// Convenience constructors
export const Errors = {
  notFound: (resource = 'Resource') =>
    new AppError('NOT_FOUND', `${resource} not found`, 404),
  validation: (message = 'Invalid request', details = null) =>
    new AppError('VALIDATION_ERROR', message, 400, details),
  unauthorized: (message = 'Authentication required') =>
    new AppError('AUTH_REQUIRED', message, 401),
  forbidden: (message = 'Access denied') =>
    new AppError('FORBIDDEN', message, 403),
  methodNotAllowed: (method) =>
    new AppError('METHOD_NOT_ALLOWED', `Method ${method} not allowed`, 405),
  conflict: (message) =>
    new AppError('CONFLICT', message, 409),
  pdfFailed: (message = 'PDF generation failed') =>
    new AppError('PDF_GENERATION_FAILED', message, 500),
  external: (service) =>
    new AppError('EXTERNAL_SERVICE_ERROR', `${service} request failed`, 502),
  internal: (message = 'An unexpected error occurred') =>
    new AppError('INTERNAL_ERROR', message, 500),
};

/**
 * Send a standardized error response
 */
export function sendError(res, error) {
  const requestId = `req_${randomBytes(6).toString('hex')}`;

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details || undefined,
        requestId,
      },
    });
  }

  // Unhandled error — log full stack, return generic
  console.error(`[${requestId}]`, error);
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      requestId,
    },
  });
}

/**
 * Higher-order function that wraps a handler with error catching
 */
export function withErrorHandler(handler) {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      return sendError(res, error);
    }
  };
}
