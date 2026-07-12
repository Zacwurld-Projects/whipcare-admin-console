"use client";

import Link from "next/link";
import { useId, useState } from "react";
import {
  TierShield,
  MoreVerticalIcon,
  TrendUpIcon,
  TrendDownIcon,
  SearchIcon,
  CalendarIcon,
} from "./icons";

const profileTabs = ["User Information", "Bookings", "Activities"] as const;
const bookingSubTabs = ["Bookings", "Single Vehicle", "Fleets"] as const;

type BookingCategory = "Completed" | "Ongoing" | "Cancelled";

const bookings = Array.from({ length: 10 }, (_, i) => ({
  id: "123467WXYZ",
  vehicle: "BMW M6 Coupe",
  services: "Inspection +2",
  category: (["Completed", "Ongoing", "Cancelled"] as const)[i % 3] as BookingCategory,
  location: "Lekki Lagos",
  amount: "₦300,000",
  fee: "₦30,000",
  date: "17-Apr-2026",
}));

const activities = Array.from({ length: 13 }, () => ({
  type: "Accepted a Service",
  description: "Accepted a booking request For car repair",
  datetime: "Nov 12, 2024 . 09:32AM",
}));

const categoryClass: Record<BookingCategory, string> = {
  Completed: "text-emerald-600",
  Ongoing: "text-[#FE915D]",
  Cancelled: "text-red-500",
};

type StatIcon = "bookings" | "rating" | "revenue" | "whip" | "default";

const stats = [
  { title: "Total Bookings", value: "100", change: "30.2%", trend: "up" as const, icon: "bookings" as const },
  { title: "Ongoing Bookings", value: "4", change: "12.8%", trend: "down" as const, icon: "bookings" as const },
  { title: "Completed Bookings", value: "250", change: "30.2%", trend: "up" as const, icon: "bookings" as const },
  { title: "Avg Ratings", value: "4.2", change: "12.8%", trend: "down" as const, suffix: "Stars", icon: "rating" as const },
  { title: "Total Revenue", value: "₦1.3M", change: "24.8%", trend: "up" as const, icon: "revenue" as const },
  { title: "Avg ERT", value: "10", change: "12.8%", trend: "down" as const, suffix: "Hours", trendGood: true, icon: "revenue" as const },
  { title: "Total Vehicles", value: "50", change: "12.8%", trend: "down" as const, icon: "bookings" as const },
  { title: "Whip Point", value: "50", change: "12.8%", trend: "down" as const, suffix: "= ₦50k", icon: "whip" as const },
];

const services = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "Brake Installation",
}));

const carBrands = ["BMW", "Toyota", "Honda", "Benz"];

function BookingStatIcon() {
  const uid = useId().replace(/:/g, "");

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#F3F4F6" />
      <path d="M5.58716 12.3789L6.857 13.0138" stroke="#1E2939" strokeWidth="0.952381" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.6506 12.6953L16.3808 13.0128" stroke="#1E2939" strokeWidth="0.952381" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.07935 15.8725L9.23533 15.4825C9.46729 14.9026 9.58327 14.6126 9.82513 14.4489C10.067 14.2852 10.3793 14.2852 11.0039 14.2852H12.2342C12.8588 14.2852 13.1711 14.2852 13.4129 14.4489C13.6548 14.6126 13.7708 14.9026 14.0027 15.4825L14.1587 15.8725" stroke="#1E2939" strokeWidth="0.952381" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.26978 15.5547V17.3845C5.26978 17.625 5.42263 17.8448 5.66462 17.9524C5.82164 18.0222 5.97161 18.0944 6.15268 18.0944H7.24401C7.42509 18.0944 7.57506 18.0222 7.73207 17.9524C7.97406 17.8448 8.12692 17.625 8.12692 17.3845V16.1896" stroke="#1E2939" strokeWidth="0.952381" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.1111 16.1896V17.3845C15.1111 17.625 15.2639 17.8448 15.5059 17.9524C15.6629 18.0222 15.8129 18.0944 15.994 18.0944H17.0853C17.2664 18.0944 17.4164 18.0222 17.5734 17.9524C17.8154 17.8448 17.9682 17.625 17.9682 17.3845V15.5547" stroke="#1E2939" strokeWidth="0.952381" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.6982 10.1573L17.3332 9.83984" stroke="#1E2939" strokeWidth="0.952381" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.53955 10.1573L5.90463 9.83984" stroke="#1E2939" strokeWidth="0.952381" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.85718 10.4736L7.54816 8.40063C7.82754 7.56251 7.96722 7.14345 8.29978 6.90375C8.63234 6.66406 9.07406 6.66406 9.95752 6.66406H13.2806C14.1641 6.66406 14.6058 6.66406 14.9384 6.90375C15.2709 7.14345 15.4106 7.56251 15.69 8.40063L16.381 10.4736" stroke="#1E2939" strokeWidth="0.952381" strokeLinejoin="round" />
      <path d="M6.85708 10.4727H16.3809C16.9886 11.1162 17.9682 12.0123 17.9682 13.0121V15.2156C17.9682 15.5778 17.7272 15.8827 17.4075 15.925L15.4285 16.1869H7.80946L5.83051 15.925C5.51076 15.8827 5.26978 15.5778 5.26978 15.2156V13.0121C5.26978 12.0123 6.24932 11.1162 6.85708 10.4727Z" stroke="#1E2939" strokeWidth="0.952381" strokeLinejoin="round" />
      <rect x="10.0952" y="4.76172" width="9.14286" height="9.14286" rx="4.57143" fill="white" />
      <rect x="10.0952" y="4.76172" width="9.14286" height="9.14286" rx="4.57143" stroke="black" strokeWidth="0.228571" />
      <g clipPath={`url(#clip0_${uid})`}>
        <path d="M15.294 10.3397C15.1127 10.5209 14.7912 10.537 14.3125 10.5382C14.2082 10.5385 14.156 10.5386 14.1095 10.558C14.063 10.5773 14.0264 10.6139 13.9533 10.6871L12.7758 11.8647C12.5839 12.0567 12.2727 12.0567 12.0807 11.8647C11.8888 11.6728 11.8888 11.3616 12.0807 11.1697L13.2584 9.99192C13.3316 9.91874 13.3682 9.88215 13.3875 9.83566C13.4068 9.78917 13.4069 9.73703 13.4072 9.63273C13.4084 9.15434 13.4245 8.83271 13.6058 8.65146C13.8125 8.4448 13.9038 8.45317 14.8194 8.45317C14.9079 8.45279 14.9524 8.5598 14.8898 8.62236L14.4184 9.09383C14.2988 9.2135 14.2984 9.40751 14.4181 9.52717C14.5378 9.64683 14.7318 9.64684 14.8515 9.5272L15.3231 9.05585C15.3856 8.9933 15.4927 9.03782 15.4923 9.12629C15.4923 10.0417 15.5006 10.133 15.294 10.3397Z" fill="black" />
        <path fillRule="evenodd" clipRule="evenodd" d="M15.5477 7.3315C15.5539 7.33504 15.5605 7.33884 15.5677 7.34293L15.9958 7.58791C16.0036 7.59238 16.0108 7.5965 16.0175 7.60034C16.0127 7.61942 16.0071 7.64105 16.0006 7.66647C15.8403 8.28854 16.2275 8.93127 16.8387 9.09737C16.8624 9.10382 16.8827 9.10933 16.9006 9.11434C16.9006 9.12179 16.9006 9.12978 16.9006 9.13843V9.62217C16.9006 9.63082 16.9006 9.63882 16.9006 9.64627C16.8827 9.65127 16.8624 9.65679 16.8387 9.66324C16.2275 9.82938 15.8407 10.4722 16.001 11.0941C16.0075 11.1196 16.0131 11.1412 16.0178 11.1602C16.0112 11.1641 16.004 11.1682 15.9962 11.1727L15.5681 11.4176C15.5609 11.4217 15.5543 11.4255 15.5481 11.4291C15.5353 11.4164 15.5209 11.4019 15.5041 11.385C14.9754 10.8532 14.0474 10.9331 13.6413 11.6303C13.5719 11.7494 13.6115 11.9027 13.7297 11.9727C13.8479 12.0426 14 12.0027 14.0694 11.8836C14.3047 11.4795 14.8457 11.4296 15.1535 11.7392L15.1595 11.7453C15.201 11.787 15.2426 11.8289 15.2794 11.8601C15.3135 11.889 15.382 11.9438 15.4774 11.9568C15.5646 11.9687 15.6367 11.9428 15.6813 11.923C15.7216 11.9052 15.7662 11.8796 15.806 11.8569L16.2412 11.6078C16.2436 11.6064 16.2461 11.605 16.2485 11.6036C16.2891 11.5804 16.3344 11.5545 16.3706 11.5285C16.4103 11.5 16.4702 11.4504 16.5049 11.3678C16.543 11.2769 16.5299 11.1876 16.5224 11.1436C16.514 11.0949 16.4989 11.036 16.4836 10.9767L16.4814 10.9683C16.3918 10.6208 16.611 10.2434 16.9679 10.1463L16.9762 10.1441C17.0337 10.1285 17.0912 10.1128 17.1369 10.0961C17.1788 10.0808 17.2611 10.0482 17.3202 9.97044C17.3742 9.89946 17.3875 9.82285 17.3925 9.77387C17.397 9.72943 17.397 9.67721 17.397 9.63056C17.397 9.62774 17.397 9.62494 17.397 9.62217V9.13843C17.397 9.13566 17.397 9.13286 17.397 9.13005C17.397 9.08339 17.397 9.03117 17.3925 8.98673C17.3875 8.93775 17.3742 8.86113 17.3202 8.79015C17.2611 8.71242 17.1788 8.67978 17.1369 8.66446C17.0912 8.64776 17.0337 8.63215 16.9762 8.61652C16.9734 8.61577 16.9707 8.61502 16.9679 8.61428C16.6108 8.51721 16.3915 8.13966 16.481 7.79221C16.4818 7.78944 16.4825 7.78666 16.4832 7.78388C16.4985 7.72451 16.5137 7.66568 16.522 7.61696C16.5295 7.57295 16.5426 7.48364 16.5045 7.3928C16.4698 7.31014 16.4099 7.26053 16.3702 7.23204C16.334 7.20605 16.2887 7.18017 16.2481 7.15695C16.2457 7.15556 16.2432 7.15418 16.2408 7.15281L15.8128 6.90783C15.8104 6.90647 15.808 6.9051 15.8056 6.90371C15.7658 6.88094 15.7212 6.85537 15.6809 6.83753C15.6363 6.8178 15.5643 6.79193 15.4771 6.80377C15.3817 6.81672 15.3132 6.87155 15.2791 6.90045C15.2423 6.93166 15.2006 6.97354 15.1591 7.01528C15.1571 7.01729 15.1551 7.01931 15.1531 7.02132C14.8878 7.28811 14.4454 7.28811 14.1801 7.02134L14.1741 7.0153C14.1326 6.97356 14.091 6.93168 14.0541 6.90047C14.0201 6.87157 13.9516 6.81675 13.8562 6.80379C13.769 6.79195 13.6969 6.81783 13.6523 6.83756C13.612 6.85539 13.5674 6.88097 13.5276 6.90374C13.5252 6.90512 13.5228 6.90649 13.5204 6.90785L13.0924 7.15283C13.09 7.1542 13.0876 7.15558 13.0851 7.15698C13.0445 7.18019 12.9993 7.20608 12.963 7.23207C12.9233 7.26057 12.8634 7.31018 12.8287 7.39285C12.7906 7.48369 12.8037 7.573 12.8113 7.61702C12.8196 7.66574 12.8348 7.72456 12.8501 7.78393L12.8522 7.79226C12.9418 8.13978 12.7227 8.51724 12.3657 8.61428L12.3575 8.61651C12.2999 8.63215 12.2424 8.64776 12.1968 8.66446C12.1548 8.67979 12.0725 8.71244 12.0134 8.79017C11.9595 8.86114 11.9462 8.93776 11.9412 8.98673C11.9366 9.03117 11.9366 9.08339 11.9367 9.13005C11.9367 9.13286 11.9367 9.13566 11.9367 9.13843V9.62217C11.9367 9.62495 11.9367 9.62774 11.9367 9.63056C11.9366 9.67722 11.9366 9.72944 11.9412 9.77388C11.9462 9.82286 11.9595 9.89948 12.0134 9.97046C12.0725 10.0482 12.1548 10.0808 12.1967 10.0961C12.2424 10.1128 12.2999 10.1284 12.3574 10.1441L12.3656 10.1463L12.3689 10.1472C12.5011 10.1839 12.6377 10.1056 12.6741 9.97238C12.7105 9.83917 12.6328 9.70146 12.5006 9.6648L12.4949 9.66322C12.4712 9.65678 12.4509 9.65127 12.4331 9.64628C12.4331 9.63882 12.4331 9.63082 12.4331 9.62217V9.13843C12.4331 9.12978 12.4331 9.12179 12.4331 9.11433C12.4509 9.10933 12.4712 9.10381 12.495 9.09736C13.1061 8.93122 13.493 8.28844 13.3327 7.66646C13.3261 7.64105 13.3205 7.61944 13.3158 7.60036C13.3225 7.59652 13.3297 7.5924 13.3375 7.58794L13.7655 7.34296C13.7727 7.33886 13.7793 7.33506 13.7855 7.33153C13.7984 7.34423 13.8127 7.35869 13.8295 7.37557C14.2886 7.83718 15.0447 7.83716 15.5037 7.37554C15.5205 7.35866 15.5349 7.3442 15.5477 7.3315Z" fill="black" />
      </g>
      <defs>
        <clipPath id={`clip0_${uid}`}>
          <rect width="6.09524" height="6.09524" fill="white" transform="translate(11.6191 6.28516)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3.5 15.5V3.5h.2c1.4.9 3 .9 4.4 0 1.4-.9 3-.9 4.4 0V11c-1.4-.9-3-.9-4.4 0-1.4.9-3 .9-4.4 0H3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 8.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M13 6.5c0 3.5-5 8-5 8s-5-4.5-5-8a5 5 0 1 1 10 0Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3.5 11.5h11M4.5 8l1.2-3.2A1 1 0 0 1 6.6 4h4.8a1 1 0 0 1 .9.6L13.5 8M3 11.5v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-.5h6v.5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="5.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="12.5" cy="11.5" r="1" fill="currentColor" />
    </svg>
  );
}

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1.2l1.5 3.1 3.4.5-2.45 2.4.6 3.4L7 9l-3.05 1.6.6-3.4L2.1 4.8l3.4-.5L7 1.2Z"
        fill={filled ? "#F59E0B" : "none"}
        stroke={filled ? "#F59E0B" : "#D1D5DB"}
        strokeWidth="1"
      />
    </svg>
  );
}

function RatingStatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#F3F4F6" />
      <path
        d="M13.9047 7.28391C13.1934 5.57203 10.8066 5.57203 10.0953 7.28391L9.72246 8.18126C9.574 8.53856 9.25049 8.78152 8.88073 8.82339L7.84026 8.9412C6.08139 9.14035 5.37953 11.3299 6.6442 12.5526L7.52761 13.4067C7.78861 13.659 7.90596 14.0333 7.83399 14.3973L7.62069 15.4761C7.26656 17.2673 9.19667 18.6655 10.7519 17.667L11.4497 17.219C11.7864 17.0029 12.2136 17.0029 12.5503 17.219L13.2481 17.667C14.8033 18.6655 16.7334 17.2673 16.3793 15.4761L16.166 14.3973C16.094 14.0333 16.2114 13.659 16.4724 13.4067L17.3558 12.5526C18.6205 11.3299 17.9186 9.14035 16.1597 8.9412L15.1193 8.82339C14.7495 8.78152 14.426 8.53856 14.2775 8.18126L13.9047 7.28391Z"
        fill="#FFC000"
      />
    </svg>
  );
}

function RevenueStatIcon() {
  const uid = useId().replace(/:/g, "");

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#F3F4F6" />
      <g clipPath={`url(#clip0_${uid})`}>
        <path
          d="M11.9999 15.9987C11.1116 16.4136 9.94463 16.6654 8.66659 16.6654C7.95597 16.6654 7.27971 16.5875 6.66659 16.4471C6.27245 16.3568 6.07538 16.3117 5.83924 16.1248C5.70456 16.0183 5.53647 15.8073 5.46266 15.6523C5.33325 15.3804 5.33325 15.1167 5.33325 14.5894V7.40801C5.33325 6.75146 6.02661 6.30052 6.66659 6.4471C7.27971 6.58753 7.95597 6.66536 8.66659 6.66536C9.94463 6.66536 11.1116 6.41361 11.9999 5.9987C12.8883 5.58379 14.0552 5.33203 15.3333 5.33203C16.0439 5.33203 16.7201 5.40986 17.3333 5.5503C17.7274 5.64057 17.9245 5.68571 18.1606 5.87256C18.2953 5.97912 18.4634 6.19007 18.5372 6.34514C18.6666 6.61704 18.6666 6.88069 18.6666 7.40801V14.5894C18.6666 15.2459 17.9732 15.6969 17.3333 15.5503C16.7201 15.4099 16.0439 15.332 15.3333 15.332C14.0552 15.332 12.8883 15.5838 11.9999 15.9987Z"
          stroke="#1E2939"
        />
        <path
          d="M5.33325 17.9974C6.22161 18.4123 7.38854 18.6641 8.66659 18.6641C9.94463 18.6641 11.1116 18.4123 11.9999 17.9974C12.8883 17.5825 14.0552 17.3307 15.3333 17.3307C16.6113 17.3307 17.7782 17.5825 18.6666 17.9974"
          stroke="#1E2939"
          strokeLinecap="round"
        />
        <path
          d="M13.6666 10.9987C13.6666 11.9192 12.9204 12.6654 11.9999 12.6654C11.0794 12.6654 10.3333 11.9192 10.3333 10.9987C10.3333 10.0782 11.0794 9.33203 11.9999 9.33203C12.9204 9.33203 13.6666 10.0782 13.6666 10.9987Z"
          stroke="#1E2939"
        />
        <path d="M7.6665 11.6641L7.6665 11.6701" stroke="#1E2939" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.3333 10.3281L16.3333 10.3341" stroke="#1E2939" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id={`clip0_${uid}`}>
          <rect width="16" height="16" fill="white" transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function WhipPointStatIcon() {
  const uid = useId().replace(/:/g, "");

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#F3F4F6" />
      <g clipPath={`url(#clip0_${uid})`}>
        <path
          d="M6.90002 12H17.1001V16C17.1001 17.1067 16.2067 18 15.1001 18H8.90002C7.79336 18 6.90002 17.1067 6.90002 16V12Z"
          stroke="#1E2939"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.3333 9.60156H6.66667C6.29848 9.60156 6 9.90004 6 10.2682V11.3349C6 11.7031 6.29848 12.0016 6.66667 12.0016H17.3333C17.7015 12.0016 18 11.7031 18 11.3349V10.2682C18 9.90004 17.7015 9.60156 17.3333 9.60156Z"
          stroke="#1E2939"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M13.0534 12H10.9534V18H13.0534V12Z" stroke="#1E2939" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M10.5067 9.51174C11.9467 9.79174 12.3067 9.44507 12.0333 7.98507C11.7133 6.2784 10.0267 5.41841 8.99999 6.43841C7.95999 7.45841 8.81333 9.18508 10.5067 9.51174V9.51174Z"
          stroke="#1E2939"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.7267 9.51174C12.2867 9.79174 11.9267 9.44507 12.2 7.98507C12.52 6.2784 14.2067 5.41841 15.2334 6.43841C16.2734 7.45841 15.4201 9.18508 13.7267 9.51174V9.51174Z"
          stroke="#1E2939"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={`clip0_${uid}`}>
          <rect width="16" height="16" fill="white" transform="translate(4 4)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ProfileStatCard({
  title,
  value,
  change,
  trend,
  suffix,
  trendGood,
  icon = "default",
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  suffix?: string;
  trendGood?: boolean;
  icon?: StatIcon;
}) {
  const isUp = trend === "up";
  const positive = trendGood ? !isUp : isUp;

  const iconNode =
    icon === "bookings" ? (
      <BookingStatIcon />
    ) : icon === "rating" ? (
      <RatingStatIcon />
    ) : icon === "revenue" ? (
      <RevenueStatIcon />
    ) : icon === "whip" ? (
      <WhipPointStatIcon />
    ) : (
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F3F4F6]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M8.4 14.3c-.9.6-3.4 1.7-1.9 3.1.7.7 1.6 1.2 2.6 1.2h5.9c1 0 1.8-.5 2.6-1.2 1.5-1.4-1-2.5-1.9-3.1-2.2-1.3-5-1.3-7.3 0Z"
            stroke="#141B34"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path d="M15 8.3a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="#141B34" strokeWidth="1.4" />
        </svg>
      </div>
    );

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-2">
        {iconNode}
        <p className="text-xs font-semibold text-[#364153]">{title}</p>
      </div>
      <div className="mt-2 flex flex-wrap items-end gap-2">
        <span className="text-2xl font-medium text-[#1E2939]">{value}</span>
        {suffix && <span className="mb-1 text-xs text-[#6A7282]">{suffix}</span>}
        <span
          className={`mb-1 flex items-center gap-0.5 text-[11px] font-semibold ${
            positive ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {isUp ? <TrendUpIcon /> : <TrendDownIcon />}
          {change}
        </span>
      </div>
    </div>
  );
}

function MiniPager() {
  return (
    <div className="flex items-center gap-1 text-xs text-slate-400">
      {[1, 2, 3, 4].map((n) => (
        <button
          key={n}
          type="button"
          className={`flex h-6 min-w-6 items-center justify-center rounded ${
            n === 1 ? "bg-[#FE915D] text-white" : "hover:bg-slate-100"
          }`}
        >
          {n}
        </button>
      ))}
      <span>…</span>
      <button type="button" className="flex h-6 min-w-6 items-center justify-center rounded hover:bg-slate-100">
        10
      </button>
    </div>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookingsTab() {
  const [subTab, setSubTab] = useState<(typeof bookingSubTabs)[number]>("Bookings");
  const [page, setPage] = useState(1);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex gap-6">
          {bookingSubTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSubTab(tab)}
              className={`pb-1 text-sm font-medium transition-colors ${
                subTab === tab
                  ? "border-b-2 border-[#FE915D] text-[#711E00]"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search"
              className="h-9 w-44 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#FE915D]"
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
          >
            <CalendarIcon className="text-slate-400" />
            1th Jan 2026 - 31th May 2026
          </button>
        </div>
      </div>

      {subTab === "Bookings" ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-medium text-slate-500">
                  <th className="px-5 py-3">Booking ID</th>
                  <th className="px-5 py-3">Vehicle Name</th>
                  <th className="px-5 py-3">Service(s)</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Service Fee</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, i) => (
                  <tr key={`${booking.id}-${i}`} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-5 py-4 font-medium text-slate-900">{booking.id}</td>
                    <td className="px-5 py-4 text-slate-600">{booking.vehicle}</td>
                    <td className="px-5 py-4 text-slate-600">{booking.services}</td>
                    <td className={`px-5 py-4 font-medium ${categoryClass[booking.category]}`}>
                      {booking.category}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{booking.location}</td>
                    <td className="px-5 py-4 text-slate-600">{booking.amount}</td>
                    <td className="px-5 py-4 text-slate-600">{booking.fee}</td>
                    <td className="px-5 py-4 text-slate-600">{booking.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1 px-5 py-4">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              aria-label="Previous page"
            >
              <BackIcon />
            </button>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium ${
                  page === n ? "bg-[#FE915D] text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="px-1 text-sm text-slate-400">…</span>
            <button
              type="button"
              onClick={() => setPage(10)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium ${
                page === 10 ? "bg-[#FE915D] text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              10
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              aria-label="Next page"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 5L12.5 10L7.5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="px-5 py-12 text-center text-sm text-slate-500">{subTab} content coming soon</div>
      )}
    </div>
  );
}

function ActivitiesTab() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-[#1E2939]">Activities</h3>
          <button type="button" className="text-xs font-semibold text-primary underline">
            View All
          </button>
        </div>

        <div className="mt-3 flex items-center">
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <div className="mx-2.5 h-1.5 w-1.5 rounded-full bg-[#711E00]" />
          <div className="h-px flex-1 bg-[#E5E7EB]" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-medium text-slate-500">
              <th className="px-5 py-3">Activity Type</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Date &amp; time</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-4 font-medium text-slate-900">{activity.type}</td>
                <td className="px-5 py-4 text-slate-600">{activity.description}</td>
                <td className="px-5 py-4 text-slate-600">{activity.datetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <p className="text-sm text-slate-500">Showing data 1 to 13 of 800 entries</p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
            aria-label="Previous page"
          >
            <BackIcon />
          </button>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium ${
                page === n ? "bg-[#FE915D] text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {n}
            </button>
          ))}
          <span className="px-1 text-sm text-slate-400">…</span>
          <button
            type="button"
            onClick={() => setPage(10)}
            className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium ${
              page === 10 ? "bg-[#FE915D] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            10
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
            aria-label="Next page"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<(typeof profileTabs)[number]>("User Information");

  return (
    <div className="space-y-5">
      <Link
        href="/dashboard/service-providers/user-info"
        className="inline-flex items-center gap-1 text-[28px] font-normal text-[#1D2739] hover:text-[#711E00]"
      >
        <BackIcon className="text-[#1D2739]" />
        User Profile
      </Link>

      <div className="grid gap-4 xl:grid-cols-[240px_1fr]">
        <div className="relative rounded-xl border border-slate-100 bg-white p-5 text-center shadow-sm">
          <button
            type="button"
            className="absolute left-3 top-3 rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            aria-label="Flag user"
          >
            <FlagIcon />
          </button>
          <button
            type="button"
            className="absolute right-3 top-3 rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            aria-label="More actions"
          >
            <MoreVerticalIcon />
          </button>

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#F3F4F6]">
            <svg width="40" height="44" viewBox="0 0 65 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M51.8544 45.2906C52.2421 45.5214 52.721 45.7916 53.2632 46.0975C55.6393 47.438 59.231 49.4643 61.6915 51.8728C63.2304 53.3791 64.6926 55.364 64.9584 57.7958C65.2411 60.382 64.1129 62.8089 61.8495 64.9653C57.9447 68.6854 53.2587 71.6667 47.1977 71.6667H17.8035C11.7425 71.6667 7.0565 68.6854 3.15168 64.9653C0.888284 62.8089 -0.239927 60.382 0.0427611 57.7958C0.30858 55.364 1.77076 53.3791 3.30965 51.8728C5.77021 49.4643 9.36191 47.438 11.738 46.0975C12.2801 45.7916 12.7591 45.5214 13.1468 45.2906C24.9936 38.2365 40.0075 38.2365 51.8544 45.2906Z" fill="#711E00" />
              <path d="M15.0006 17.5C15.0006 7.83502 22.8356 0 32.5006 0C42.1656 0 50.0006 7.83502 50.0006 17.5C50.0006 27.165 42.1656 35 32.5006 35C22.8356 35 15.0006 27.165 15.0006 17.5Z" fill="#711E00" />
            </svg>

          </div>

          <div className="mt-3 inline-flex items-center gap-1 rounded-[18px] bg-[#F3F4F6] pr-2">
            <TierShield tier={2} />
            <span className="text-xs font-medium text-primary">Tier 2</span>
          </div>

          <h2 className="mt-3 text-base font-semibold text-[#1E2939]">Isaac Zacwurld</h2>
          <p className="mt-1 text-xs text-[#6A7282]">isaaczac@gmail.com</p>
          <p className="mt-0.5 text-xs text-[#6A7282]">+1 453 6780 690</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <ProfileStatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 pt-4">
          <div className="flex gap-6">
            {profileTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-[#FE915D] text-[#711E00]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Activities" && (
            <div className="flex flex-wrap items-center gap-3 pb-3">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search"
                  className="h-9 w-44 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#FE915D]"
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
              >
                <CalendarIcon className="text-slate-400" />
                1th Jan 2026 - 31th May 2026
              </button>
            </div>
          )}
        </div>

        {activeTab === "User Information" && (
          <div className="grid gap-5 p-5 xl:grid-cols-[1.4fr_1fr]">
            <div className="space-y-5">
              <section>
                <h3 className="mb-4 text-sm font-semibold text-[#1E2939]">Personal Information</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["Sign up date", "01/08/2024"],
                    ["Last login date", "01/08/2024"],
                    ["Nationality", "Nigeria"],
                    ["Language", "English"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-[#6A7282]">{label}</p>
                      <p className="mt-1 text-sm font-medium text-[#1E2939]">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <p className="text-xs text-[#6A7282]">Address</p>
                  <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-[#1E2939]">
                    <MapPinIcon className="mt-0.5 shrink-0 text-[#FE915D]" />
                    290 m near Grand Play Lekki Lagos
                  </p>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-[#1E2939]">Service Gallery</h3>
                <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
                  <div className="overflow-hidden rounded-xl border border-slate-100">
                    <div
                      className="h-40 bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #2d3748 0%, #4a5568 40%, #718096 100%)",
                      }}
                    />
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[#1E2939]">Brake Installation</p>
                          <p className="text-xs text-[#6A7282]">Mechanic</p>
                        </div>
                        <p className="text-sm font-semibold text-[#1E2939]">₦8,500 - 15,000</p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {carBrands.map((brand) => (
                          <span
                            key={brand}
                            className="rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-medium text-[#4B5563]"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-slate-100 p-2">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-[#1E2939] hover:bg-[#FFF1E8]"
                      >
                        <CarIcon className="text-[#6A7282]" />
                        {service.name}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded-xl border border-slate-100 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#1E2939]">Reviews (10)</h3>
                  <div className="flex items-center gap-3">
                    <MiniPager />
                    <Link href="#" className="text-xs font-semibold text-primary underline">
                      View All
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <StarIcon key={n} filled={n <= 4} />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#6A7282]">2 days ago</span>
                  </div>
                  <p className="mt-2 text-sm text-[#364153]">
                    John was fantastic! He arrived on time and fixed my AC quickly. Highly
                    recommend.
                  </p>
                  <button
                    type="button"
                    className="mt-3 text-xs font-semibold text-primary hover:underline"
                  >
                    See Bookings →
                  </button>
                </div>
              </section>

              <section className="rounded-xl border border-slate-100 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#1E2939]">Disputes (10)</h3>
                  <div className="flex items-center gap-3">
                    <MiniPager />
                    <Link href="#" className="text-xs font-semibold text-primary underline">
                      View All
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[#1E2939]">Moses Amos</p>
                      <p className="text-xs text-[#6A7282]">Vehicle Owner</p>
                    </div>
                    <span className="text-[11px] text-[#6A7282]">2 days ago</span>
                  </div>
                  <p className="mt-2 text-sm text-[#364153]">
                    Provider did not show up at the scheduled time and refused to reschedule.
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[#1E2939]">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Open chat
                    </span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      See Bookings →
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === "Bookings" && <BookingsTab />}

        {activeTab === "Activities" && <ActivitiesTab />}
      </div>
    </div>
  );
}
