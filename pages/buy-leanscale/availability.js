import { useState } from 'react';
import Layout from '../../components/Layout';
import customerConfig from '../../data/customer-config';

export default function AvailableStartDates() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // February 2026

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDateStatus = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return customerConfig.startDates.find((d) => d.date === dateStr);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => null);

  return (
    <Layout title="Available Start Dates">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>📅</span> Available Start Dates
          </h1>
        </div>

        <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Calendar Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{ fontSize: '1.25rem' }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={prevMonth} className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--ls-light-gray)', border: 'none' }}>
                ←
              </button>
              <button onClick={nextMonth} className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--ls-light-gray)', border: 'none' }}>
                →
              </button>
              <button onClick={goToToday} className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--ls-light-gray)', border: 'none' }}>
                Today
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            background: 'var(--ls-light-gray)',
            border: '1px solid var(--ls-light-gray)',
          }}>
            {/* Day Headers */}
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <div key={day} style={{
                padding: '0.75rem',
                textAlign: 'center',
                fontWeight: 500,
                fontSize: '0.8rem',
                background: 'var(--ls-light-gray)',
              }}>
                {day}
              </div>
            ))}

            {/* Adjust blanks for Monday start */}
            {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => (
              <div key={`blank-${i}`} style={{ padding: '1rem', background: 'white' }} />
            ))}

            {/* Days */}
            {days.map((day) => {
              const status = getDateStatus(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  style={{
                    padding: '0.75rem',
                    minHeight: 80,
                    background: isToday ? '#e0e7ff' : 'white',
                  }}
                >
                  <div style={{ fontWeight: isToday ? 600 : 400 }}>{day}</div>
                  {status && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      background: status.status === 'waitlist' ? '#fef3c7' : '#dcfce7',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                    }}>
                      {currentDate.getMonth() + 1}/{day} - {status.status === 'waitlist' ? 'Waitlist Only' : `${status.spotsLeft} Spots Left`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
