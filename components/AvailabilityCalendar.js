import { useState, useEffect } from 'react';
import cohortDates from '../data/availability-calendar';

const statusConfig = {
  sold_out: {
    label: 'Sold Out',
    bgColor: '#fee2e2',
    textColor: '#991b1b',
    borderColor: '#fecaca',
  },
  waitlist: {
    label: 'Waitlist Only',
    bgColor: '#fef3c7',
    textColor: '#92400e',
    borderColor: '#fde68a',
  },
  limited: {
    label: 'Limited',
    bgColor: '#fef3c7',
    textColor: '#92400e',
    borderColor: '#fde68a',
    pulse: true,
  },
  available: {
    label: 'Available',
    bgColor: '#d1fae5',
    textColor: '#065f46',
    borderColor: '#a7f3d0',
  },
};

export default function AvailabilityCalendar({ onSelect, selectedDate, compact = false }) {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [viewCount, setViewCount] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLastUpdate(new Date());
    setViewCount(Math.floor(Math.random() * 8) + 3);
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setViewCount(Math.floor(Math.random() * 8) + 3);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
    });
  };

  const getTimeUntil = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const diff = date - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Started';
    if (days === 1) return 'Tomorrow';
    if (days <= 7) return `${days} days`;
    if (days <= 14) return '1 week';
    const weeks = Math.floor(days / 7);
    return `${weeks} weeks`;
  };

  const upcomingDates = cohortDates.filter(d => {
    const date = new Date(d.date + 'T00:00:00');
    return date >= new Date();
  }).slice(0, compact ? 6 : 12);

  return (
    <div>
      {mounted && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: '#ecfdf5',
              padding: '0.4rem 0.75rem',
              borderRadius: '9999px',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                background: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#065f46' }}>
                LIVE
              </span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Updated {lastUpdate?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            background: '#fef3c7',
            padding: '0.4rem 0.75rem',
            borderRadius: '9999px',
          }}>
            <span style={{ fontSize: '0.9rem' }}>👀</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#92400e' }}>
              {viewCount} viewing now
            </span>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: compact ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
        gap: '0.75rem',
      }}>
        {upcomingDates.map((cohort) => {
          const config = statusConfig[cohort.status];
          const isSelected = selectedDate === cohort.date;
          const canSelect = cohort.status !== 'sold_out';
          
          return (
            <div
              key={cohort.date}
              onClick={() => canSelect && onSelect && onSelect(cohort)}
              style={{
                padding: '1rem',
                borderRadius: '12px',
                border: isSelected ? '2px solid #7c3aed' : `1px solid ${config.borderColor}`,
                background: isSelected ? '#f5f3ff' : 'white',
                cursor: canSelect ? 'pointer' : 'not-allowed',
                opacity: cohort.status === 'sold_out' ? 0.6 : 1,
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {cohort.status === 'limited' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderBottomLeftRadius: '8px',
                }}>
                  FILLING FAST
                </div>
              )}
              
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.25rem' }}>
                Cohort #{cohort.cohortNumber}
              </div>
              
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>
                {formatDate(cohort.date)}
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  background: config.bgColor,
                  color: config.textColor,
                }}>
                  {config.label}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {getTimeUntil(cohort.date)}
                </span>
              </div>
              
              {cohort.status !== 'sold_out' && (
                <div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '0.7rem',
                    marginBottom: '0.25rem',
                  }}>
                    <span style={{ color: '#6b7280' }}>Capacity</span>
                    <span style={{ 
                      fontWeight: 600,
                      color: cohort.spotsLeft <= 2 ? '#ef4444' : '#374151',
                    }}>
                      {cohort.spotsLeft}/{cohort.totalSpots} spots
                    </span>
                  </div>
                  <div style={{ 
                    height: '4px', 
                    background: '#e5e7eb', 
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${((cohort.totalSpots - cohort.spotsLeft) / cohort.totalSpots) * 100}%`,
                      height: '100%',
                      background: cohort.spotsLeft <= 2 ? '#ef4444' : '#7c3aed',
                      transition: 'width 0.3s',
                    }} />
                  </div>
                </div>
              )}
              
              {isSelected && (
                <div style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#7c3aed',
                  fontWeight: 600,
                  textAlign: 'center',
                }}>
                  ✓ Selected
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem',
        background: '#f9fafb',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              background: config.bgColor,
              border: `1px solid ${config.borderColor}`,
            }} />
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{config.label}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
