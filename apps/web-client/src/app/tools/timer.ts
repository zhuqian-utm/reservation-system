export const getAvailableTime = (): string => {
  const now = new Date();
  const minutes = now.getMinutes();

  // 1. Rounding Logic: If minutes > 30, move to next hour :00. Else, move to :30.
  if (minutes >= 30) {
    now.setHours(now.getHours() + 1, 0, 0, 0);
  } else {
    now.setMinutes(30, 0, 0);
  }

  // 2. Format to HH:mm (24h format for <input type="time">)
  let hours = now.getHours();
  let mins = now.getMinutes();

  // 3. Boundary Clamping (10:00 AM - 7:00 PM)
  if (hours < 10) {
    hours = 10;
    mins = 0;
  } else if (hours >= 19) {
    // If it's already 7 PM or later, cap it at 19:00
    hours = 19;
    mins = 0;
  }

  const hh = String(hours).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');

  return `${hh}:${mm}`;
};

export const formatTimeToString = (isoString: string): string => {
  const date = new Date(isoString);

  // Extract hours and minutes
  const hours = date.getUTCHours(); // Get UTC hours
  const minutes = date.getUTCMinutes(); // Get UTC minutes

  // Format hours and minutes as "HH:mm"
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return formattedTime;
};

/**
 * Returns today's date in YYYY-MM-DD format.
 * If the current time is past 19:00 (7 PM), it returns tomorrow's date.
 */
export const getAvailableDate = (): string => {
  const now = new Date();
  const currentHour = now.getHours();

  // If it's 7:00 PM or later, move the calendar to tomorrow
  if (currentHour >= 19) {
    now.setDate(now.getDate() + 1);
  }

  // Format as YYYY-MM-DD using local time to avoid timezone shifts
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getAvailableTimeSlots = () => {
  const slots = [];
  for (let hour = 10; hour <= 19; hour++) {
    const hh = String(hour).padStart(2, '0');
    slots.push(`${hh}:00`);
    if (hour < 19) {
      slots.push(`${hh}:30`);
    }
  }
  return slots;
};

export const formatArrivalTime = (dateStr: string, timeZone = 'UTC') => {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timeZone,
  });
};
