'use client';
import { timeAgo } from '@/app/lib/accessoryFunctions';
import CarIcon from '../../assets/carIcon.svg';
import RatingStar from '../../assets/starRate.svg';
import StarIcon from '../../assets/starIcon.svg';
import ChevronRight from '../../assets/chevronRight.svg';
import { UserProfileData } from '@/app/lib/mockTypes';
import { useRef, useState } from 'react';
import DisplayInfo from '../../components/profile/DisplayInfo';
import DisplayAddress from '../../components/profile/DisplayAddress';
import dayjs from 'dayjs';

const Profile = ({ userProfile }: { userProfile: UserProfileData; isLoading?: boolean }) => {
  const [isDisplayingBookingDetails, setIsDisplayingBookingDetails] = useState(false);

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
  const [reviewsWindowHeight] = useState(0);

  // useEffect(() => {
  //   if (userProfile.reviews.length < 1) return;

  //   const reviewsContainerNode = reviewsContainer.current;

  //   const changeReviewsWindowHeight = () => {
  //     if (reviewsContainerNode) {
  //       setReviewsWindowHeight(
  //         reviewsContainerNode.getBoundingClientRect().height / userProfile.reviews.length,
  //       );
  //     }
  //   };

  //   const observer = new ResizeObserver(() => {
  //     changeReviewsWindowHeight();
  //   });

  //   if (reviewsContainerNode) {
  //     observer.observe(reviewsContainerNode);
  //   }

  //   return () => {
  //     if (reviewsContainerNode) {
  //       observer.unobserve(reviewsContainerNode);
  //     }
  //     observer.disconnect();
  //   };
  // }, [reviewsContainer, userProfile.reviews.length]);

  // if (isLoading) {
  //   return <SectionLoader height='70vh' />;
  // }

  return (
    <>
      <article className='flex w-full gap-10'>
        <div className='flex-column w-[53%] gap-4 rounded-lg bg-gray-50 px-5 py-4'>
          <div className='flex-column gap-3'>
            <p className='text-large mb-1 font-semibold text-gray-800'>User Info</p>
            <DisplayInfo
              title='Sign up date'
              value={dayjs(userProfile.signUpDate).format('DD/MM/YY')}
            />
            <DisplayInfo
              title='Last login date'
              value={dayjs(userProfile.lastLoginDate).format('DD/MM/YY')}
            />
            <DisplayInfo title='Nationality' value={userProfile.nationality} />
            <DisplayInfo title='Language' value={userProfile.language} />
          </div>
          {userProfile.address.length > 0 && (
            <div className='flex-column gap-3'>
              <p className='text-large mb-1 font-semibold text-gray-800'>User Address</p>
              {userProfile.address.map((value) => (
                <DisplayAddress
                  key={value.id}
                  title={value.type}
                  value={`${value.address} ${value.landmark && 'near ' + value.landmark}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className='flex-column flex-1 gap-6'>
          {(userProfile.cars || userProfile.reviews) && (
            <div className='flex-column gap-5 rounded-lg bg-gray-50 px-4 py-5'>
              {userProfile.cars.length > 0 && (
                <div className='flex-column gap-4'>
                  <p className='text-large mb-1 font-semibold text-gray-800'>User&apos;s Car</p>
                  {userProfile.cars.map((item) => (
                    <div
                      key={item._id}
                      className='flex w-full items-center gap-1 rounded-2xl bg-white px-5 py-4'
                    >
                      <CarIcon />
                      <p className='text-small font-medium text-[#101928]'>
                        {item.brand} {item.carModel}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div>
                {userProfile.reviews && userProfile.reviews.length > 0 && (
                  <>
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
                            <p className='text-[18px] leading-[28px] text-[#413b35]'>
                              {item.content}
                            </p>
                            <button
                              onClick={
                                () => setIsDisplayingBookingDetails(!isDisplayingBookingDetails)
                                // setIsDisplayingBookingDetails({
                                //   display: true,
                                //   booking: {
                                //     id: '12346WXYZ',
                                //     bookingDate: Date.now() - 20 * 30 * 60 * 60 * 1000,
                                //     phoneNo: '+1 356 786 3732',
                                //     location: '290 m near Grand Play Lekki Lagos',
                                //     status: 'completed',
                                //     bookingStatus: 'completed',
                                //     car: 'BMW M6',
                                //     service: 'Mechanic Service',
                                //     serviceType: 'Pick Up Service',
                                //     serviceProvider: 'James Fox',
                                //     brakeServices: '2',
                                //     total: '2.49',
                                //   },
                                // })
                              }
                              className='flex items-center gap-2 self-end'
                            >
                              <p className='text-small text-[#983504]'>Track Booking</p>
                              <ChevronRight className='*:fill-[#983504]' />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <button className='text-small w-fit self-end rounded-[32px] bg-[#983504] px-8 py-[10px] font-medium text-[#f9f8f7]'>
            Disable account
          </button>
        </div>
      </article>
      {/* {isDisplayingBookingDetails.display && (
        <BookingDetails
          type={'booking'}
          booking={isDisplayingBookingDetails.booking as Booking}
          setIsDisplayingBookingDetails={setIsDisplayingBookingDetails}
        />
      )} */}
    </>
  );
};
export default Profile;
