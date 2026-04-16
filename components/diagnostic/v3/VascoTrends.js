/**
 * VascoTrends — Funnel trend and stage velocity charts from Vasco snapshot data.
 * Rendered in the diagnostic results when vasco_trends is present in engagement_overrides.
 */

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STAGE_COLORS = {
  leads: '#94a3b8',
  mqls: '#a78bfa',
  sqls: '#60a5fa',
  sals: '#34d399',
  won: '#fbbf24',
  live: '#f472b6',
};

const VELOCITY_COLORS = {
  lead_to_mql: '#a78bfa',
  sql_to_sal: '#60a5fa',
  sal_to_won: '#34d399',
  won_to_live: '#fbbf24',
};

function formatMonth(m) {
  if (!m) return '';
  const [year, month] = m.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(month) - 1] || month} '${year?.slice(2)}`;
}

function formatK(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val}`;
}

export default function VascoTrends({ trends, snapshotDate }) {
  if (!trends) return null;

  const { funnelTrend = [], velocityTrend = [] } = trends;
  if (funnelTrend.length === 0) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* Funnel Volume Trend */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
            Funnel Volume Trend
          </h3>
          {snapshotDate && (
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
              Vasco snapshot: {snapshotDate}
            </span>
          )}
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={funnelTrend} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" tickFormatter={formatMonth} stroke="rgba(255,255,255,0.3)" fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
            <Tooltip
              contentStyle={{ background: '#1e1b2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
              labelFormatter={formatMonth}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="leads" fill={STAGE_COLORS.leads} name="Leads" radius={[2,2,0,0]} />
            <Bar dataKey="mqls" fill={STAGE_COLORS.mqls} name="MQLs" radius={[2,2,0,0]} />
            <Bar dataKey="sals" fill={STAGE_COLORS.sals} name="SALs" radius={[2,2,0,0]} />
            <Bar dataKey="won" fill={STAGE_COLORS.won} name="Won" radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Trend */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem 0' }}>
          Revenue Trend
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={funnelTrend} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" tickFormatter={formatMonth} stroke="rgba(255,255,255,0.3)" fontSize={11} />
            <YAxis tickFormatter={formatK} stroke="rgba(255,255,255,0.3)" fontSize={11} />
            <Tooltip
              contentStyle={{ background: '#1e1b2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
              labelFormatter={formatMonth}
              formatter={(val) => formatK(val)}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="amount_won" stroke="#fbbf24" name="Won Revenue" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="new_arr" stroke="#34d399" name="New ARR" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="net_arr" stroke="#a78bfa" name="Net ARR" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stage Velocity */}
      {velocityTrend.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '1.5rem',
        }}>
          <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: 600, margin: '0 0 1rem 0' }}>
            Stage Velocity (days)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={velocityTrend} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tickFormatter={formatMonth} stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} unit=" d" />
              <Tooltip
                contentStyle={{ background: '#1e1b2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                labelFormatter={formatMonth}
                formatter={(val) => val != null ? `${Math.round(val)} days` : 'N/A'}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="lead_to_mql" stroke={VELOCITY_COLORS.lead_to_mql} name="Lead → MQL" strokeWidth={2} connectNulls />
              <Line type="monotone" dataKey="sql_to_sal" stroke={VELOCITY_COLORS.sql_to_sal} name="SQL → SAL" strokeWidth={2} connectNulls />
              <Line type="monotone" dataKey="sal_to_won" stroke={VELOCITY_COLORS.sal_to_won} name="SAL → Won" strokeWidth={2} connectNulls />
              <Line type="monotone" dataKey="won_to_live" stroke={VELOCITY_COLORS.won_to_live} name="Won → Live" strokeWidth={2} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
