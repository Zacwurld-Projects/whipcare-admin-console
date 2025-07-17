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
  if (!status) return 'pending';
  const normalized = status.toLowerCase();
  if (normalized === 'cancelled') return 'cancelled';
  if (normalized === 'delivered') return 'completed';
  if (normalized === 'payment') return 'pending';
  if (normalized === 'completed') return 'completed';
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

// In src/app/lib/accessoryFunctions.ts (or a new utility file)
export const getKycStatusStyles = (status: string | undefined) => {
  if (!status) return 'bg-gray-100 text-gray-600';
  const normalized = status.trim().toLowerCase();
  const statusStyles: Record<string, string> = {
    'not verified': 'bg-gray-200 text-gray-800',
    verified: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    'resubmit required': 'bg-orange-100 text-orange-800',
  };
  return statusStyles[normalized] || 'bg-gray-100 text-gray-600';
};

export const getOrdersStatusStyles = (status: string | undefined) => {
  if (!status) return 'bg-gray-100 text-gray-600';
  const normalized = status.trim().toLowerCase();
  const statusStyles: Record<string, string> = {
    payment: 'bg-primary-50 text-[#ff915b]',
    delivered: 'bg-[#e7f6ec] text-[#40b869]',
    cancelled: 'bg-[#fbeae9] text-[#dd524d]',
    'on going': 'bg-[#e7f6ec] text-[#40b869]',
  };
  return statusStyles[normalized] || 'bg-gray-100 text-gray-600';
};

export const fetchUserDetails = async () => {
  const session = await getSession();
  if (session) {
    const { id, role, name, email, image, privileges } = session.user;
    return { id, role, name, email, image, privileges };
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
