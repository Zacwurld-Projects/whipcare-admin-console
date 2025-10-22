// 'use client';

// import React from 'react';

// type RewardItem = {
//   reward: string;
//   prompt: string;
//   status: 'Auto-Apply' | 'Claim' | 'Paid Per Use' | 'Auto-Claim';
// };

// type RewardGroup = {
//   title: string;
//   description?: string;
//   items: RewardItem[];
// };

// const groups: RewardGroup[] = [
//   {
//     title: 'For Car Owners (Direct)',
//     items: [
//       { reward: '5% Discount Code', prompt: 'Complete your profile', status: 'Auto-Apply' },
//       { reward: '10% Discount Code', prompt: 'Make 5 bookings', status: 'Claim' },
//       {
//         reward: '₦2,000 Cashback Coupon',
//         prompt: 'Refer 2 people who complete bookings',
//         status: 'Claim',
//       },
//       { reward: 'Free Car Wash Coupon', prompt: 'Complete your 10th booking', status: 'Claim' },
//       { reward: 'Loyalty Package', prompt: 'Submit 10 verified reviews', status: 'Claim' },
//       { reward: 'Loyalty Package', prompt: 'Complete 20 bookings', status: 'Claim' },
//       {
//         reward: 'Free Car Repair Coupon',
//         prompt: 'Refer 10 people who complete bookings',
//         status: 'Claim',
//       },
//       {
//         reward: 'Birthday Special - Free Car Wash',
//         prompt: 'Celebrate your birthday with Whipcare',
//         status: 'Auto-Claim',
//       },
//     ],
//   },
//   {
//     title: 'For Car Owners (Influencer & Referrals)',
//     items: [
//       {
//         reward: '10% Off First Booking',
//         prompt: 'Join Whipcare via Influencer Code',
//         status: 'Auto-Apply',
//       },
//       {
//         reward: '5% Off Second Booking',
//         prompt: 'After first booking via normal referral',
//         status: 'Auto-Apply',
//       },
//     ],
//   },
//   {
//     title: 'For Service Providers (Direct)',
//     items: [
//       {
//         reward: '5% Off Commission (First 10 Jobs)',
//         prompt: 'Join Whipcare directly and get verified',
//         status: 'Auto-Apply',
//       },
//       {
//         reward: '₦2,000 Commission Cashback',
//         prompt: 'Refer 2 providers who complete a booking',
//         status: 'Claim',
//       },
//       { reward: '1-Day Premium Listing', prompt: 'Refer 3 providers', status: 'Claim' },
//       {
//         reward: '1-Week Premium Listing',
//         prompt: 'Complete 5 jobs with 4.0+ rating',
//         status: 'Claim',
//       },
//       {
//         reward: '5% Off Next Commission',
//         prompt: 'Maintain 4.5+ rating over 10 jobs',
//         status: 'Claim',
//       },
//       { reward: 'Veteran Badge', prompt: 'Complete 15 jobs in 1 month', status: 'Claim' },
//       { reward: 'Loyalty Kit', prompt: 'Complete 25 jobs in 1 month', status: 'Claim' },
//       {
//         reward: '1-Month Premium Listing',
//         prompt: 'Get 5 stars from 5 different clients',
//         status: 'Claim',
//       },
//       {
//         reward: '1-Week Free Listing',
//         prompt: '10 bookings in a row without complaints',
//         status: 'Claim',
//       },
//       {
//         reward: 'Exclusive Partner Offers',
//         prompt: 'Maintain 4.7+ stars over 3 months',
//         status: 'Auto-Apply',
//       },
//       {
//         reward: 'Loyalty Kit',
//         prompt: 'Refer 5 verified and active service providers',
//         status: 'Claim',
//       },
//     ],
//   },
//   {
//     title: 'For Service Providers (Influencer & Referrals)',
//     items: [
//       {
//         reward: '5% Off First 15 Jobs',
//         prompt: 'Join Whipcare via Influencer Code',
//         status: 'Auto-Apply',
//       },
//       {
//         reward: '5% Off First 12 Jobs',
//         prompt: 'Join via normal referral link/code',
//         status: 'Auto-Apply',
//       },
//     ],
//   },
//   {
//     title: 'For Influencers',
//     items: [
//       {
//         reward: '2% Per Booking (First 2 Bookings)',
//         prompt: 'When a user uses your code',
//         status: 'Paid Per Use',
//       },
//     ],
//   },
// ];

// const statusStyle = (status: RewardItem['status']) => {
//   if (status === 'Auto-Apply' || status === 'Auto-Claim') return 'bg-[#e7f6ec] text-[#099137]';
//   if (status === 'Claim') return 'bg-[#ffece5] text-[#eb5017]';
//   return 'bg-[#eef2ff] text-[#3730a3]';
// };

// const RewardCenterHeader = () => {
//   return (
//     <section className='mb-6 rounded-lg border border-[#e0ddd9] bg-white p-4 dark:border-transparent dark:bg-dark-secondary md:p-6'>
//       <div className='mb-4 flex items-center justify-between gap-4'>
//         <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
//           Reward Center (April 2025)
//         </h2>
//         <div className='flex items-center gap-2'>
//           <span className='rounded-md bg-[#fff8f5] px-2 py-1 text-xs font-medium text-[#eb5017]'>
//             Auto-Apply
//           </span>
//           <span className='rounded-md bg-[#f5f7ff] px-2 py-1 text-xs font-medium text-[#3730a3]'>
//             Paid Per Use
//           </span>
//         </div>
//       </div>

//       <div className='mb-4 rounded-md bg-[#fff7ed] p-3 dark:bg-[#2c2c3c]'>
//         <p className='text-sm font-medium text-[#983504] dark:text-white'>
//           You're 2 referrals away from ₦2,000 Cashback!
//         </p>
//         <div className='mt-2 h-2 w-full overflow-hidden rounded bg-[#ffead5]'>
//           <div className='h-full w-2/3 rounded bg-[#fb923c]' />
//         </div>
//       </div>

//       <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
//         {groups.map((group) => (
//           <article
//             key={group.title}
//             className='rounded-lg border border-gray-200 bg-white dark:border-[#2c2c3c] dark:bg-dark-primary'
//           >
//             <header className='border-b border-gray-200 px-4 py-3 dark:border-[#2c2c3c]'>
//               <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>{group.title}</h3>
//             </header>
//             <div className='divide-y divide-gray-200 dark:divide-[#2c2c3c]'>
//               <div className='grid grid-cols-[1.2fr_1fr_auto] gap-3 px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300'>
//                 <span>Reward</span>
//                 <span>Prompt</span>
//                 <span className='text-right'>Status</span>
//               </div>
//               {group.items.map((item, index) => (
//                 <div
//                   key={index}
//                   className='grid grid-cols-[1.2fr_1fr_auto] items-center gap-3 px-4 py-2'
//                 >
//                   <p className='text-sm font-medium text-gray-900 dark:text-white'>{item.reward}</p>
//                   <p className='text-sm text-gray-700 dark:text-gray-300'>{item.prompt}</p>
//                   <div className='flex justify-end'>
//                     <span
//                       className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(item.status)}`}
//                     >
//                       {item.status}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </article>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default RewardCenterHeader;
