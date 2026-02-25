/**
 * Salesforce OAuth Authorize
 * GET /api/salesforce/authorize?customerId=xxx&slug=yyy&sandbox=false
 *
 * Generates PKCE challenge, stores verifier in HTTP-only cookie,
 * and redirects the user to Salesforce consent screen.
 */

import { getAuthorizationUrl, generatePKCE } from '../../../lib/salesforce';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId, slug, sandbox } = req.query;

  if (!customerId || !slug) {
    return res.status(400).json({ error: 'customerId and slug are required' });
  }

  const isSandbox = sandbox === 'true';
  const { codeVerifier, codeChallenge } = generatePKCE();

  // Store code_verifier in HTTP-only cookie for the callback
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie',
    `sf_code_verifier=${codeVerifier}; HttpOnly; SameSite=Lax; Path=/api/salesforce/callback; Max-Age=600${secure}`
  );

  const url = getAuthorizationUrl(customerId, slug, isSandbox, codeChallenge);
  res.redirect(url);
}
