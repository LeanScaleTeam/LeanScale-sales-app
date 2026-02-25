/**
 * Salesforce OAuth Authorize
 * GET /api/salesforce/authorize?customerId=xxx&slug=yyy&sandbox=false
 *
 * Generates Salesforce OAuth URL and redirects the user to Salesforce consent screen.
 */

import { getAuthorizationUrl } from '../../../lib/salesforce';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId, slug, sandbox } = req.query;

  if (!customerId || !slug) {
    return res.status(400).json({ error: 'customerId and slug are required' });
  }

  const isSandbox = sandbox === 'true';
  const url = getAuthorizationUrl(customerId, slug, isSandbox);
  res.redirect(url);
}
