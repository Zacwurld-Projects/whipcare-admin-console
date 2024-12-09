'use client';
import { formatDateToDDMMYY, timeAgo } from '@/app/lib/accessoryFunctions';
import LocationIcon from '../../assets/locationIcon.svg';
import CarIcon from '../../assets/carIcon.svg';
import RatingStar from '../../assets/starRate.svg';
import StarIcon from '../../assets/starIcon.svg';
import ChevronRight from '../../assets/chevronRight.svg';
import { UserProfile } from '@/app/lib/mockTypes';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const Profile = ({ userProfile }: { userProfile: UserProfile }) => {
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

  const reviewsWindow = useRef<HTMLDivElement>(null);
  const reviewsContainer = useRef<HTMLDivElement>(null);
  const [reviewsWindowHeight, setReviewsWindowHeight] = useState(0);

  useEffect(() => {
    const reviewsContainerNode = reviewsContainer.current;

    const changeReviewsWindowHeight = () => {
      if (reviewsContainerNode) {
        setReviewsWindowHeight(
          reviewsContainerNode.getBoundingClientRect().height / userProfile.reviews.length,
        );
      }
    };

    const observer = new ResizeObserver(() => {
      changeReviewsWindowHeight();
    });

    if (reviewsContainerNode) {
      observer.observe(reviewsContainerNode);
    }

    return () => {
      if (reviewsContainerNode) {
        observer.unobserve(reviewsContainerNode);
      }
      observer.disconnect();
    };
  }, [reviewsContainer]);

  return (
    <article className='flex w-full gap-10'>
      <div className='flex-column w-[53%] gap-4 rounded-lg bg-gray-50 px-5 py-4'>
        <div className='flex-column gap-3'>
          <p className='text-large mb-1 font-semibold text-gray-800'>User Info</p>
          {Object.entries(userProfile.userInfo).map(([key, value]) => (
            <div key={key} className='flex-column rounded-[5px] border border-gray-200 px-4 py-2'>
              <p className='text-xsmall font-medium text-gray-700'>{key}</p>
              <p className='text-small capitalize text-gray-700'>
                {typeof value !== 'string' ? formatDateToDDMMYY(value) : value}
              </p>
            </div>
          ))}
        </div>
        <div className='flex-column gap-3'>
          <p className='text-large mb-1 font-semibold text-gray-800'>User Address</p>
          {Object.entries(userProfile.userAddress).map(([key, value]) => (
            <div key={key} className='flex items-center gap-3 p-4'>
              <LocationIcon />
              <div className='flex-column'>
                <p className='text-small font-medium capitalize text-gray-900'>{key} address</p>
                <p className='text-[15px] text-[#868782]'>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex-column flex-1 gap-6'>
        <div className='flex-column gap-5 rounded-lg bg-gray-50 px-4 py-5'>
          <div className='flex-column gap-4'>
            <p className='text-large mb-1 font-semibold text-gray-800'>User&apos;s Car</p>
            {userProfile.cars.map((item) => (
              <div
                key={item}
                className='flex w-full items-center gap-1 rounded-2xl bg-white px-5 py-4'
              >
                <CarIcon />
                <p className='text-small font-medium text-[#101928]'>{item}</p>
              </div>
            ))}
          </div>
          <div>
            <div className='mb-5 flex items-end justify-between'>
              <p className='text-large font-semibold text-gray-800'>
                Reviews({userProfile.reviews.length})
              </p>
              <div className='flex items-center'>
                <StarIcon />
                <p className='text-small text-gray-500'>
                  {(
                    userProfile.reviews.reduce((acc, item) => {
                      acc += item.rating;
                      return acc;
                    }, 0) / userProfile.reviews.length
                  ).toPrecision(2)}{' '}
                  {'>'}
                </p>
              </div>
            </div>
            <div
              ref={reviewsWindow}
              style={{ height: reviewsWindowHeight - 4 }}
              className='snap-y snap-mandatory overflow-y-scroll pr-2 scrollbar scrollbar-track-gray-200 scrollbar-thumb-gray-800 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-w-[5px] scrollbar-h-[80px]'
            >
              <div ref={reviewsContainer} className='flex-column h-max gap-2'>
                {userProfile.reviews.map((item, index) => (
                  <div
                    key={index}
                    className='flex-column snap-start gap-3 rounded-2xl border border-primary-100 px-4 py-2'
                  >
                    <div className='flex items-center justify-between'>
                      {renderRatingStars(item.rating)}
                      <p className='text-gray-500'>{timeAgo(item.timestamp)}</p>
                    </div>
                    <p className='text-[18px] leading-[28px] text-[#413b35]'>{item.content}</p>
                    <Link href={'/booking'} className='flex items-center gap-2 self-end'>
                      <p className='text-small text-[#983504]'>Track Booking</p>
                      <ChevronRight className='*:fill-[#983504]' />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button className='text-small w-fit self-end rounded-[32px] bg-[#983504] px-8 py-[10px] font-medium text-[#f9f8f7]'>
          Disable account
        </button>
      </div>
    </article>
  );
};
export default Profile;
