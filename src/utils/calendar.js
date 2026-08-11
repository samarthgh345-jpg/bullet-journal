export const getCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days = [];

  // Previous month's empty cells
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
};
