/**
 * HubSpot Metadata Download
 * POST /api/hubspot/download
 *
 * Re-downloads metadata for a connected HubSpot portal.
 * Used for manual refresh after initial OAuth connection.
 */

import { getAccessToken } from '../../../lib/hubspot';
import { downloadAndStoreMetadata } from '../../../lib/hubspot-downloader';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const tokenInfo = await getAccessToken(customerId);

    if (!tokenInfo) {
      return res.status(404).json({
        error: 'No HubSpot connection found for this customer. Please connect HubSpot first.',
      });
    }

    const signals = await downloadAndStoreMetadata(
      customerId,
      tokenInfo.portalId,
      tokenInfo.accessToken
    );

    return res.status(200).json({
      success: true,
      portalId: tokenInfo.portalId,
      signalCount: Object.keys(signals).length,
      downloadedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('HubSpot download error:', err);
    return res.status(500).json({ error: 'Failed to download metadata' });
  }
}
