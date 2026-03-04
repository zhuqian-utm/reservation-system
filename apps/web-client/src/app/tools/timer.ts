export const getNextTime = () => {
  const now = new Date();

  // Get the current minutes
  const minutes = now.getMinutes();

  // Round up to the next 30-minute mark
  const next30Minutes = minutes < 30 ? 30 : 0;
  const nextHour = minutes >= 30 ? now.getHours() + 1 : now.getHours();

  // Create a new Date object for the next 30 minutes
  now.setHours(nextHour, next30Minutes, 0, 0);

  // Format the next 30-minute time
  const nextTime = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return nextTime;
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
