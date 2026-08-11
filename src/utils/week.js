import { getDateKey } from "./date";

export const getWeekDates = (date = new Date()) => {
  const current = new Date(date);
  const day = current.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  current.setDate(current.getDate() + mondayOffset);

  const dates = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(current);
    d.setDate(current.getDate() + i);

    dates.push({
      key: getDateKey(d),
      date: d,
      label: d.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      number: d.getDate(),
    });
  }

  return dates;
};
