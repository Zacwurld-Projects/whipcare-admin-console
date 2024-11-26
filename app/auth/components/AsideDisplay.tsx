'use client';
import Image from 'next/image';
import authImage1 from '../assets/authImage1.png';
import authImage2 from '../assets/authImage2.png';
import authImage3 from '../assets/authImage3.png';
import authImage4 from '../assets/authImage4.png';
import { useCallback, useEffect, useRef, useState } from 'react';

const slidesData = [
  {
    id: 1,
    image: authImage1,
    heading: 'Welcome to Whipcare Allow your car experience soft life',
    text: "Connecting you with trusted car services near you. Let's get your car the care it deserves!",
  },
  {
    id: 2,
    image: authImage2,
    heading: 'Effortless Booking',
    text: 'Find and book top-rated car mechanics, detailers, haulers, and car washes instantly.',
  },
  {
    id: 3,
    image: authImage3,
    heading: 'Quality Services',
    text: "Browse verified reviews and ratings to choose the best service providers for your car's needs.",
  },
  {
    id: 4,
    image: authImage4,
    heading: 'Location-Based Convenience',
    text: 'Discover car services around your location, ensuring quick and convenient appointments.',
  },
];

const AsideDisplay = () => {
  const [displayedSlide, setDisplayedSlide] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const slidesWindowRef = useRef<HTMLDivElement>(null);
  const slidesContainer = useRef<HTMLDivElement>(null);
  const slideTimoutRef = useRef<NodeJS.Timeout | null>(null);
  const slidesButtonContainerRef = useRef<HTMLDivElement>(null);

  const totalSlides = slidesData.length;

  const clearSliderTimeout = useCallback(() => {
    if (slideTimoutRef.current) {
      clearTimeout(slideTimoutRef.current);
      slideTimoutRef.current = null;
    }
  }, []);

  const startAutoSlide = useCallback(() => {
    clearSliderTimeout(); // ensure no duplicate timers
    slideTimoutRef.current = setTimeout(() => {
      setDisplayedSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
    }, 10000);
  }, [clearSliderTimeout, totalSlides]);

  // listen for page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // pause the carousel when the page is hidden
        clearSliderTimeout();
      } else {
        // resume the carousel when the page is visible
        startAutoSlide();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clearSliderTimeout, startAutoSlide]);

  useEffect(() => {
    const changeContainerWidth = () => {
      if (slidesContainer.current) {
        setContainerWidth(slidesContainer.current.getBoundingClientRect().width);
      }
    };

    const observer = new ResizeObserver(() => {
      changeContainerWidth();
    });

    if (slidesContainer.current) {
      observer.observe(slidesContainer.current);
    }

    // cleanup function
    return () => {
      if (slidesContainer.current) {
        observer.unobserve(slidesContainer.current);
      }
      observer.disconnect();
    };
  }, [slidesContainer]);

  useEffect(() => {
    const container = slidesContainer.current;

    if (container) {
      //   remove sliding animation when going back to first slide
      if (displayedSlide > 0) container.style.transition = 'transform ease-in-out 1s';
      else container.style.transition = '';

      //   move slide
      container.style.transform = `translateX(-${
        (containerWidth / totalSlides) * displayedSlide
      }px)`;
    }
  }, [displayedSlide, totalSlides, containerWidth]);

  //   pause slides when you hover on the buttonns
  useEffect(() => {
    const slidesButtonContainer = slidesButtonContainerRef.current;
    if (!slidesButtonContainer) return;

    const pauseSlide = () => clearSliderTimeout();
    const resumeSlide = () => startAutoSlide();

    slidesButtonContainer.addEventListener('mouseenter', pauseSlide);
    slidesButtonContainer.addEventListener('mouseleave', resumeSlide);

    return () => {
      slidesButtonContainer.removeEventListener('mouseenter', pauseSlide);
      slidesButtonContainer.removeEventListener('mouseleave', resumeSlide);
    };
  }, [startAutoSlide, clearSliderTimeout]);

  useEffect(() => {
    // start the auto-slide timer
    startAutoSlide();

    return () => clearSliderTimeout(); // cleanup on unmount
  });

  return (
    <section className='center-grid overflow-hidden bg-primary-800 text-white'>
      <div className='flex flex-col items-center gap-[1.2rem] min-[1440px]:gap-[1.5rem]'>
        <div className='center-grid'>
          <Image
            alt='whipcare logo'
            className='size-[80px] object-contain min-[1440px]:size-[110px]'
            src={'/images/png/logo.png'}
            width={110}
            height={110}
          />
        </div>
        <div
          className='max-h-[700px] w-[280px] overflow-hidden min-[1200px]:w-[300px] min-[1440px]:w-[350px]'
          ref={slidesWindowRef}
        >
          <div className='flex w-max' ref={slidesContainer}>
            {slidesData.map((item, index) => (
              <div
                key={item.id}
                className={`flex w-[280px] flex-col gap-8 transition-all duration-[1s] ease-in min-[1200px]:w-[300px] min-[1440px]:w-[350px] ${
                  index < 1 ? 'scale-100 opacity-30' : 'scale-90 opacity-20'
                } ${displayedSlide === index ? '!scale-100 !opacity-100' : ''} `}
              >
                <div className='relative aspect-square w-full rounded-2xl bg-gray-50'>
                  <Image
                    src={item.image}
                    alt={item.heading + ' image'}
                    width={280}
                    height={356}
                    className='absolute bottom-0 left-1/2 w-[77%] -translate-x-1/2'
                  />
                </div>
                <div className='flex w-full flex-col gap-[14px] text-center'>
                  <h5 className='min-[1440px]:heading-h5 heading-h6 font-semibold'>
                    {item.heading}
                  </h5>
                  <p className='min-[1440px]:text-medium text-small text-primary-50'>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div
            className='mt-4 flex items-center justify-center gap-[2px] min-[1440px]:mt-6'
            ref={slidesButtonContainerRef}
          >
            {slidesData.map((item, index) => (
              <button
                key={item.id}
                className={`size-[6px] rounded-full bg-primary-50 transition-all duration-[1s] ${
                  displayedSlide === index ? 'h-[6px] w-[32px]' : ''
                }`}
                data-slideid={index}
                type='button'
                onClick={() => setDisplayedSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default AsideDisplay;
