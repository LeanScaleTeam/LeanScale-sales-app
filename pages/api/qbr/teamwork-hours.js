/**
 * /api/qbr/teamwork-hours — Fetch time entries from Teamwork and return totals
 *
 * POST body: { apiToken, siteUrl, projectIds, fromDate, toDate }
 *   - apiToken:   Teamwork personal API token
 *   - siteUrl:    e.g. "leanscale3.teamwork.com" (https:// optional)
 *   - projectIds: comma-separated project IDs e.g. "1453303,1527918"
 *   - fromDate:   YYYYMMDD
 *   - toDate:     YYYYMMDD
 *
 * Returns: { totalHours, hoursByMonth, hoursByProject }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { apiToken, siteUrl, projectIds, fromDate, toDate } = req.body || {};

  if (!apiToken || !projectIds || !fromDate || !toDate) {
    return res.status(400).json({ error: 'apiToken, projectIds, fromDate, and toDate are required' });
  }

  const site = (siteUrl || 'leanscale3.teamwork.com').trim().replace(/^https?:\/\//, '');
  const url = `https://${site}/time_entries.json?fromDate=${fromDate}&toDate=${toDate}&projectIds=${projectIds}&pageSize=500`;

  let twRes;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    twRes = await fetch(url, {
      signal: controller.signal,
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiToken}:x`).toString('base64')}`,
        Accept: 'application/json',
      },
    });
    clearTimeout(timeout);
  } catch (e) {
    if (e.name === 'AbortError') {
      return res.status(504).json({ error: 'Teamwork request timed out after 15 seconds' });
    }
    return res.status(502).json({ error: `Could not reach Teamwork: ${e.message}` });
  }

  if (!twRes.ok) {
    return res.status(twRes.status).json({ error: `Teamwork returned ${twRes.status}` });
  }

  const data = await twRes.json();
  const entries = data['time-entries'] || [];

  const monthMap = {};
  const projectMap = {};

  for (const entry of entries) {
    const h = (parseInt(entry.hours, 10) || 0) + ((parseInt(entry.minutes, 10) || 0) / 60);
    const month = entry.date?.slice(0, 7);
    const project = entry['project-name'] || 'Unknown';

    if (month) monthMap[month] = (monthMap[month] || 0) + h;
    projectMap[project] = (projectMap[project] || 0) + h;
  }

  const round2 = n => Math.round(n * 100) / 100;

  const hoursByMonth = Object.entries(monthMap)
    .map(([month, hours]) => ({ month, hours: round2(hours) }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const hoursByProject = Object.entries(projectMap)
    .map(([project, hours]) => ({ project, hours: round2(hours) }))
    .sort((a, b) => b.hours - a.hours);

  const totalHours = round2(hoursByMonth.reduce((s, m) => s + m.hours, 0));

  return res.status(200).json({ totalHours, hoursByMonth, hoursByProject });
}
