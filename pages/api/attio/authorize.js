/**
 * Attio OAuth Authorize
 * GET /api/attio/authorize?customerId=xxx&slug=yyy
 *
 * Generates Attio OAuth URL and redirects the user to Attio consent screen.
 */

import { getAuthorizationUrl } from '../../../lib/attio';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId, slug } = req.query;

  if (!customerId || !slug) {
    return res.status(400).json({ error: 'customerId and slug are required' });
  }

  const url = getAuthorizationUrl(customerId, slug);
  return res.redirect(url);
}
