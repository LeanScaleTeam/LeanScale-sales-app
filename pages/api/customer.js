/**
 * API endpoint for fetching customer configuration
 * GET /api/customer
 *
 * Uses the shared getCustomerServer helper for slug resolution.
 */

import { getCustomerServer } from '../../lib/getCustomer';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const customer = await getCustomerServer({ req, query: req.query });

    if (!customer) {
      return res.status(404).json({
        error: 'Customer not found',
      });
    }

    // Check if customer has diagnostic results
    let hasDiagnosticResult = false;
    if (customer.id && !customer.isDemo) {
      const { count } = await supabaseAdmin
        .from('diagnostic_results_v3')
        .select('id', { count: 'exact', head: true })
        .eq('customer_id', customer.id);
      if (!count) {
        const { count: v2Count } = await supabaseAdmin
          .from('diagnostic_results')
          .select('id', { count: 'exact', head: true })
          .eq('customer_id', customer.id);
        hasDiagnosticResult = v2Count > 0;
      } else {
        hasDiagnosticResult = true;
      }
    }

    // Add customerType (not in shared helper transform)
    const config = {
      ...customer,
      customerType: customer.customerType || 'active',
      hasDiagnosticResult,
    };

    // No CDN caching — response varies by slug query param which Netlify
    // edge cache doesn't key on, causing cross-customer data leaks
    res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    res.setHeader('Netlify-Vary', 'query=slug');

    return res.status(200).json(config);
  } catch (err) {
    console.error('Error in /api/customer:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
