/**
 * HubSpot OAuth Authorize
 * GET /api/hubspot/authorize?customerId=xxx&slug=yyy
 *
 * Generates HubSpot OAuth URL and redirects the user to HubSpot consent screen.
 */

import { getAuthorizationUrl } from '../../../lib/hubspot';

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
