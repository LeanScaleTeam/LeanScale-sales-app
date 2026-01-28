const generateCohortDates = () => {
  const dates = [];
  const startYear = 2026;
  
  let currentDate = new Date(startYear, 0, 5);
  
  while (currentDate.getDay() !== 1) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  for (let i = 0; i < 26; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    let status, spotsLeft;
    const weekIndex = i;
    
    if (weekIndex < 2) {
      status = 'sold_out';
      spotsLeft = 0;
    } else if (weekIndex < 4) {
      status = 'waitlist';
      spotsLeft = 0;
    } else if (weekIndex < 6) {
      status = 'limited';
      spotsLeft = Math.floor(Math.random() * 2) + 1;
    } else if (weekIndex < 10) {
      status = 'available';
      spotsLeft = Math.floor(Math.random() * 3) + 2;
    } else {
      status = 'available';
      spotsLeft = Math.floor(Math.random() * 4) + 3;
    }
    
    dates.push({
      date: dateStr,
      cohortNumber: i + 1,
      status,
      spotsLeft,
      totalSpots: 5,
    });
    
    currentDate.setDate(currentDate.getDate() + 14);
  }
  
  return dates;
};

const cohortDates = [
  { date: '2026-01-05', cohortNumber: 1, status: 'sold_out', spotsLeft: 0, totalSpots: 5 },
  { date: '2026-01-19', cohortNumber: 2, status: 'sold_out', spotsLeft: 0, totalSpots: 5 },
  { date: '2026-02-02', cohortNumber: 3, status: 'waitlist', spotsLeft: 0, totalSpots: 5 },
  { date: '2026-02-16', cohortNumber: 4, status: 'waitlist', spotsLeft: 0, totalSpots: 5 },
  { date: '2026-03-02', cohortNumber: 5, status: 'limited', spotsLeft: 1, totalSpots: 5 },
  { date: '2026-03-16', cohortNumber: 6, status: 'limited', spotsLeft: 2, totalSpots: 5 },
  { date: '2026-03-30', cohortNumber: 7, status: 'available', spotsLeft: 3, totalSpots: 5 },
  { date: '2026-04-13', cohortNumber: 8, status: 'available', spotsLeft: 4, totalSpots: 5 },
  { date: '2026-04-27', cohortNumber: 9, status: 'available', spotsLeft: 4, totalSpots: 5 },
  { date: '2026-05-11', cohortNumber: 10, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-05-25', cohortNumber: 11, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-06-08', cohortNumber: 12, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-06-22', cohortNumber: 13, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-07-06', cohortNumber: 14, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-07-20', cohortNumber: 15, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-08-03', cohortNumber: 16, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-08-17', cohortNumber: 17, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-08-31', cohortNumber: 18, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-09-14', cohortNumber: 19, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-09-28', cohortNumber: 20, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-10-12', cohortNumber: 21, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-10-26', cohortNumber: 22, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-11-09', cohortNumber: 23, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-11-23', cohortNumber: 24, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-12-07', cohortNumber: 25, status: 'available', spotsLeft: 5, totalSpots: 5 },
  { date: '2026-12-21', cohortNumber: 26, status: 'available', spotsLeft: 5, totalSpots: 5 },
];

export default cohortDates;
