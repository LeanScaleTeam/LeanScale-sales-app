/**
 * Customer Lookup by Slug
 * GET /api/customers/lookup?slug=scandit
 *
 * Resolves a customer slug to their record.
 */

import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug } = req.query || {};

    if (!slug) {
      return res.status(400).json({ error: 'slug is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('id, name, slug')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Customer lookup error:', err);
    return res.status(500).json({ error: err.message || 'Lookup failed' });
  }
}
