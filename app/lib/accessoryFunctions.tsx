import { getSession } from 'next-auth/react';
import RatingStar from '../dashboard/assets/starRate.svg';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

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

export const convertBookingAndOrderStatus = (status: string) => {
  if (status === 'completed' || status === 'cancelled') return status;
  return 'pending';
};

export const reflectStatusStyle = (status: string) => {
  switch (true) {
    case status === 'cancelled':
      return `bg-[#fbeae9] text-[#dd524d]`;
    case status === 'pending':
      return `bg-primary-50 text-[#ff915b]`;
    case status === 'completed' || status === 'on going':
      return `bg-[#e7f6ec] text-[#40b869]`;
    default:
      return '';
  }
};

export const fetchUserDetails = async () => {
  const session = await getSession();
  if (session) {
    const { id, role, name, email, image } = session.user;
    return { id, role, name, email, image };
  }
  throw new Error('Failed to retrieve user session.');
};

export const renderRatingStars = (rating: number) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className='flex w-fit items-center gap-[1.5px]'>
      {stars.map((star) => (
        <RatingStar
          className={`${star <= rating ? '*:fill-[#f3a318]' : '*:fill-gray-200 dark:*:fill-white'}`}
          key={star}
        />
      ))}
    </div>
  );
};
