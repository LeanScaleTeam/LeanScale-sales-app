/**
 * PerformanceToPlan — Power10 metrics table with radar chart
 *
 * Shows targets vs actuals with gap indicators (red/yellow/green)
 * and a radar chart visualization of metric health.
 */

import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { staggerContainer, fadeUpItem } from '../../../lib/animations';
import { statusColors, statusLabels } from '../../../data/power10-metrics';

const STATUS_TO_NUMERIC = {
  healthy: 4,
  careful: 3,
  warning: 2,
  unable: 1,
};

const SHORT_NAMES = {
  'ARR': 'ARR',
  'Bookings': 'Bookings',
  'Gross churn': 'Churn',
  'Gross retention': 'GRR',
  'MQL -> Opportunity conversion rate': 'MQL→Opp',
  'MQL production': 'MQL Prod',
  'Net retention': 'NRR',
  'Opportunity/Deal - CW cycle time': 'Cycle Time',
  'Opportunity/Deal -> CW conversion rate': 'Opp→CW',
  'Pipeline production': 'Pipeline',
};

function StatusDot({ status }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: statusColors[status] || '#6b7280',
        marginRight: 8,
      }}
    />
  );
}

export default function PerformanceToPlan({ metrics }) {
  if (!metrics || metrics.length === 0) return null;

  const radarData = metrics.map((m) => ({
    metric: SHORT_NAMES[m.name] || m.name,
    reporting: STATUS_TO_NUMERIC[m.ableToReport] || 0,
    performance: STATUS_TO_NUMERIC[m.statusAgainstPlan] || 0,
  }));

  return (
    <motion.div
      variants={fadeUpItem}
      initial="hidden"
      animate="show"
      style={styles.container}
    >
      <h3 style={styles.title}>Performance to Plan</h3>
      <p style={styles.subtitle}>Power10 metric health across your GTM organization</p>

      <div style={styles.grid}>
        {/* Table */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          style={styles.tableWrap}
        >
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Metric</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Able to Report</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>Status vs Plan</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => (
                <motion.tr key={m.name} variants={fadeUpItem} style={styles.tr}>
                  <td style={styles.td}>{m.name}</td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <StatusDot status={m.ableToReport} />
                    <span style={{ color: statusColors[m.ableToReport] }}>
                      {statusLabels[m.ableToReport]}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <StatusDot status={m.statusAgainstPlan} />
                    <span style={{ color: statusColors[m.statusAgainstPlan] }}>
                      {statusLabels[m.statusAgainstPlan]}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Radar Chart */}
        <div style={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
              />
              <Radar
                name="Reporting Ability"
                dataKey="reporting"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.2}
              />
              <Radar
                name="Status vs Plan"
                dataKey="performance"
                stroke="#a3e635"
                fill="#a3e635"
                fillOpacity={0.15}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 15, 30, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
          <div style={styles.legend}>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: '#7c3aed' }} />
              Reporting Ability
            </span>
            <span style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: '#a3e635' }} />
              Status vs Plan
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const styles = {
  container: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: '1.75rem',
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.9)',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  subtitle: {
    fontSize: '0.82rem',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: '0.3rem 0 1.5rem 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    alignItems: 'start',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'var(--text-sm, 0.875rem)',
  },
  th: {
    padding: '0.65rem 0.85rem',
    textAlign: 'left',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  td: {
    padding: '0.7rem 0.85rem',
    color: 'rgba(255, 255, 255, 0.8)',
    whiteSpace: 'nowrap',
    fontSize: '0.85rem',
  },
  chartWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  legend: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '0.5rem',
    fontSize: 'var(--text-xs, 0.75rem)',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  legendDot: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
};
