export function timeAgo(timestamp: string | number) {
  const now = new Date();

  const createdAt = new Date(timestamp);

  const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;

  if (diffInSeconds < secondsInMinute) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < secondsInDay * 2) {
    return 'yesterday';
  } else {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return createdAt.toLocaleDateString(undefined, options as object);
  }
}

export const formatDateToDDMMYY = (date: Date | number): string => {
  const timestamp = typeof date === 'number' ? new Date(date) : date;

  const day = String(timestamp.getDate()).padStart(2, '0');
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  const year = String(timestamp.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};
