/**
 * Zod validation schemas for all API endpoints
 */

import { z } from 'zod';

// ============================================
// Shared primitives
// ============================================
const uuid = z.string().uuid();
const diagnosticType = z.enum(['gtm', 'clay', 'cpq']);
const sowType = z.enum(['clay', 'q2c', 'embedded', 'custom']);
const sowStatus = z.enum(['draft', 'review', 'sent', 'accepted', 'declined']);
const processStatus = z.enum(['healthy', 'careful', 'warning', 'unable']);

// ============================================
// Diagnostic schemas
// ============================================
export const diagnosticProcess = z.object({
  name: z.string().min(1).max(200),
  status: processStatus,
  addToEngagement: z.boolean().optional().default(false),
  function: z.string().optional(),
  outcome: z.string().optional(),
  metric: z.string().optional(),
  serviceId: z.string().optional(),
  serviceType: z.enum(['strategic', 'managed']).optional(),
});

export const diagnosticGetQuery = z.object({
  type: diagnosticType,
  customerId: uuid,
});

export const diagnosticPutBody = z.object({
  customerId: uuid,
  processes: z.array(diagnosticProcess).min(1).max(200),
  tools: z.array(z.object({
    name: z.string(),
    category: z.string().optional(),
    status: z.string().optional(),
  })).optional(),
  createdBy: z.string().optional(),
});

// ============================================
// SOW schemas
// ============================================
export const sowFromDiagnosticBody = z.object({
  customerId: uuid,
  diagnosticResultId: uuid,
  diagnosticType: diagnosticType.optional().default('gtm'),
  customerName: z.string().max(200).optional(),
  sowType: sowType,
  createdBy: z.string().max(100).optional(),
});

export const sowCreateBody = z.object({
  customerId: uuid.optional(),
  title: z.string().min(1).max(500),
  sowType: sowType,
  intakeSubmissionId: uuid.optional(),
  transcriptText: z.string().optional(),
  diagnosticSnapshot: z.record(z.unknown()).optional(),
  content: z.record(z.unknown()).optional().default({}),
  createdBy: z.string().max(100).optional(),
});

export const sowUpdateBody = z.object({
  title: z.string().min(1).max(500).optional(),
  status: sowStatus.optional(),
  content: z.record(z.unknown()).optional(),
  total_hours: z.number().nonnegative().optional(),
  total_investment: z.number().nonnegative().optional(),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
});

// ============================================
// SOW Section schemas
// ============================================
export const sectionCreateBody = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  deliverables: z.array(z.object({
    text: z.string(),
    completed: z.boolean().optional(),
  })).optional().default([]),
  hours: z.number().nonnegative().optional(),
  catalogHours: z.number().nonnegative().optional(), // Original catalog suggestion
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  diagnosticItems: z.array(z.string()).optional().default([]),
  sortOrder: z.number().int().nonnegative().optional(),
  service_catalog_id: uuid.optional().nullable(),
});

export const sectionReorderBody = z.object({
  ordering: z.array(z.object({
    id: uuid,
    sortOrder: z.number().int().nonnegative(),
  })).min(1),
});

// ============================================
// SOW Export schemas
// ============================================
export const sowExportBody = z.object({
  exportedBy: z.string().max(100).optional(),
  customerName: z.string().max(200).optional(),
});

// ============================================
// Service Catalog schemas
// ============================================
export const serviceCatalogCreateBody = z.object({
  name: z.string().min(1).max(300),
  category: z.string().max(100).optional(),
  subcategory: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
  deliverables: z.array(z.string()).optional().default([]),
  hours_low: z.number().nonnegative().optional(),
  hours_high: z.number().nonnegative().optional(),
  // NOTE: No rate field. Pricing is retainer-based (tier model), not rate × hours.
  active: z.boolean().optional().default(true),
});

export const serviceCatalogQuery = z.object({
  category: z.string().optional(),
  active: z.enum(['true', 'false']).optional(),
  search: z.string().max(200).optional(),
});

// ============================================
// Validation helper
// ============================================

/**
 * Validate data against a Zod schema.
 * Returns clean parsed data on success, throws AppError on failure.
 */
export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const { AppError } = require('./api-errors');
    throw new AppError(
      'VALIDATION_ERROR',
      'Invalid request',
      400,
      result.error.issues.map(i => ({
        path: i.path.join('.'),
        message: i.message,
      }))
    );
  }
  return result.data;
}

/**
 * Non-throwing version — returns { success, data, error }
 */
export function validateSafe(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues.map(i => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    };
  }
  return { success: true, data: result.data };
}
