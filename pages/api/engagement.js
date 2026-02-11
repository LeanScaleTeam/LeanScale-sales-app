import { getDiagnosticResult } from '../../lib/diagnostics';
import { listServices } from '../../lib/service-catalog';
import { computeRecommendation } from '../../lib/engagement-engine';
import { processes as staticProcesses, managedServicesHealth } from '../../data/diagnostic-data';

/**
 * Build a static fallback recommendation from demo data
 */
function buildStaticFallback() {
  return computeRecommendation(
    {
      processes: staticProcesses,
      customer_id: 'demo',
      id: 'demo',
      diagnostic_type: 'gtm',
    },
    [], // empty catalog → defaults
    managedServicesHealth
  );
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { customerId, diagnosticType = 'gtm' } = req.query;

  if (!customerId) {
    return res.status(200).json({
      success: true,
      isDemo: true,
      data: buildStaticFallback(),
    });
  }

  try {
    const diagnosticResult = await getDiagnosticResult(customerId, diagnosticType);

    if (!diagnosticResult) {
      return res.status(200).json({
        success: true,
        isDemo: true,
        data: buildStaticFallback(),
      });
    }

    const serviceCatalog = await listServices({ active: true });

    // Extract managed services from diagnostic or fall back to static
    const managedServices = diagnosticResult.processes
      ? diagnosticResult.processes.filter(p => p.serviceType === 'managed')
      : [];
    const managedData = managedServices.length > 0 ? managedServices : managedServicesHealth;

    const recommendation = computeRecommendation(
      diagnosticResult,
      serviceCatalog,
      managedData
    );

    return res.status(200).json({
      success: true,
      isDemo: false,
      data: recommendation,
    });
  } catch (err) {
    console.error('Engagement API error:', err);
    return res.status(200).json({
      success: true,
      isDemo: true,
      data: buildStaticFallback(),
    });
  }
}
