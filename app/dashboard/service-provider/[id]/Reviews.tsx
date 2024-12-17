'use client';

import FilterForm from '../../components/tables/components/FilterForm';
import RatingStar from '../../assets/starRate.svg';
import dayjs from 'dayjs';
import { useState } from 'react';
import BookingDetails from '../../components/modals/BookingDetails';
import { Booking } from '@/app/lib/mockTypes';

const Reviews = ({
  reviewData,
}: {
  reviewData: {
    rating: number;
    content: string;
    user: string;
    date: number;
    booking: Booking;
  }[];
}) => {
  const [isDisplayingBookingDetails, setIsDisplayingBookingDetails] = useState<{
    display: boolean;
    booking: Booking | null;
  }>({
    display: false,
    booking: null,
  });
  const renderRatingStars = (rating: number) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);
    return (
      <div className='flex w-fit items-center gap-[1.5px]'>
        {stars.map((star) => (
          <RatingStar
            className={`${star <= rating ? '*:fill-[#f3a318]' : '*:fill-gray-200'}`}
            key={star}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <article className='flex-column w-full gap-6 bg-white p-6 pt-2'>
        <div className='flex items-center justify-between border-b border-gray-100 p-3 py-5'>
          <p className='text-large font-semibold'>All Reviews</p>
          <FilterForm />
        </div>
        <ul className='flex-column gap-3'>
          {reviewData.map((item, index) => (
            <li key={index} className='flex-column w-full gap-4 p-6'>
              <div className='flex items-center justify-between'>
                {renderRatingStars(item.rating)}
                <p>{dayjs().diff(item.date, 'day')} days ago</p>
              </div>
              <p className='text-large font-bold text-gray-600'>{item.content}</p>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-[10px]'>
                  <div className='center-grid size-[30px] rounded-full bg-primary-800 text-primary-50'>
                    <p>{item.user.slice(0, 1)}</p>
                  </div>
                  <p className='font-semibold text-gray-800'>{item.user}</p>
                </div>
                <button
                  className='text-small rounded-xl bg-primary-50 px-4 py-1 font-medium text-primary-900'
                  onClick={() =>
                    setIsDisplayingBookingDetails({
                      display: true,
                      booking: item.booking,
                    })
                  }
                >
                  Track booking
                </button>
              </div>
            </li>
          ))}
        </ul>
      </article>
      {isDisplayingBookingDetails.display && (
        <BookingDetails
          type={'booking'}
          booking={isDisplayingBookingDetails.booking as Booking}
          setIsDisplayingBookingDetails={setIsDisplayingBookingDetails}
        />
      )}
    </>
  );
};
export default Reviews;
