import { useId } from "react";

const iconProps = { width: 20, height: 20, viewBox: "0 0 20 20", fill: "none" as const };

export function OverviewIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <rect x="2.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function CarFrontIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M4 13h12l-1-4.5H5L4 13z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M6.5 8.5h7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="6.5" cy="14" r="1.25" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="13.5" cy="14" r="1.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7 6.5h6l1 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ServiceProviderIcon({
  className,
  active,
}: {
  className?: string;
  active?: boolean;
}) {
  if (active) {
    return (
      <svg
        className={className}
        width={18}
        height={18}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#service-provider-active-clip)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.4063 8.90625C13.8206 8.90625 14.1563 9.24204 14.1563 9.65625V9.95523C14.7116 10.0829 15.2136 10.3493 15.6198 10.7167L16.0008 10.4718C16.3492 10.2478 16.8132 10.3487 17.0372 10.6971C17.2612 11.0455 17.1603 11.5096 16.8119 11.7336L16.4638 11.9574C16.5882 12.2925 16.6563 12.6542 16.6563 13.0312C16.6563 13.4084 16.5882 13.7702 16.4637 14.1053L16.8116 14.3289C17.16 14.5529 17.2609 15.017 17.0369 15.3654C16.8129 15.7138 16.3489 15.8147 16.0004 15.5907L15.6196 15.3459C15.2135 15.7132 14.7116 15.9796 14.1563 16.1073V16.4062C14.1563 16.8205 13.8206 17.1562 13.4063 17.1562C12.9921 17.1562 12.6563 16.8205 12.6563 16.4062V16.1073C12.1011 15.9796 11.5992 15.7132 11.1931 15.3459L10.8122 15.5907C10.4638 15.8147 9.99978 15.7138 9.77579 15.3654C9.55179 15.017 9.65265 14.5529 10.0011 14.3289L10.349 14.1053C10.2245 13.7702 10.1563 13.4084 10.1563 13.0312C10.1563 12.6542 10.2245 12.2925 10.3489 11.9574L10.0008 11.7336C9.65234 11.5096 9.55147 11.0455 9.77547 10.6971C9.99946 10.3487 10.4635 10.2478 10.8119 10.4718L11.1929 10.7167C11.599 10.3493 12.1011 10.0829 12.6563 9.95523V9.65625C12.6563 9.24204 12.9921 8.90625 13.4063 8.90625ZM13.4063 11.3705C12.7877 11.3705 12.2524 11.6736 11.9425 12.121C11.7605 12.3837 11.6563 12.6957 11.6563 13.0312C11.6563 13.3668 11.7605 13.6789 11.9426 13.9416C12.2525 14.3889 12.7877 14.692 13.4063 14.692C14.0249 14.692 14.5602 14.3889 14.8701 13.9416C15.0521 13.6789 15.1563 13.3669 15.1563 13.0312C15.1563 12.6957 15.0522 12.3837 14.8702 12.121C14.5603 11.6736 14.025 11.3705 13.4063 11.3705Z"
            fill="#711E00"
          />
          <path
            d="M4.21901 4.78125C4.21901 2.60663 5.98189 0.84375 8.15651 0.84375C10.3311 0.84375 12.094 2.60663 12.094 4.78125C12.094 6.95587 10.3311 8.71875 8.15651 8.71875C5.98189 8.71875 4.21901 6.95587 4.21901 4.78125Z"
            fill="#711E00"
          />
          <path
            d="M8.72664 9.86262C8.13524 9.82344 7.54039 9.84528 6.95282 9.92815C5.85447 10.0831 4.78042 10.4514 3.80178 11.0341C3.71457 11.0861 3.60686 11.1468 3.48491 11.2156C2.9503 11.5172 2.14205 11.9732 1.58842 12.5151C1.24217 12.854 0.91318 13.3007 0.853371 13.8478C0.789766 14.4297 1.04361 14.9758 1.55288 15.4609C2.43146 16.298 3.4858 16.9688 4.84953 16.9688H8.68788C9.2234 16.9688 9.49116 16.9688 9.51167 16.9265C9.53219 16.8843 9.3405 16.6405 8.95713 16.1528C8.91183 16.0951 8.86922 16.0354 8.82961 15.9738C8.3875 15.2861 8.45161 14.4182 8.92683 13.8078C9.00219 13.711 9.03987 13.6626 9.05192 13.6215C9.06397 13.5804 9.05897 13.5255 9.04896 13.4158C9.03739 13.289 9.03148 13.1608 9.03148 13.0312C9.03148 12.9019 9.03738 12.7737 9.04893 12.647C9.05893 12.5373 9.06393 12.4824 9.05187 12.4413C9.03981 12.4002 9.00212 12.3518 8.92674 12.255C8.45131 11.6445 8.38711 10.7765 8.82929 10.0887C8.88761 9.99801 8.83425 9.86975 8.72664 9.86262Z"
            fill="#711E00"
          />
        </g>
        <defs>
          <clipPath id="service-provider-active-clip">
            <rect width="18" height="18" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      className={className}
      width={17}
      height={17}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.6875 9.57122C6.15253 9.49978 4.60001 9.86727 3.24568 10.6737C2.1846 11.3055 -0.597477 12.5956 1.097 14.2099C1.92473 14.9985 2.84662 15.5625 4.00565 15.5625H8.0625"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6875 3.9375C10.6875 5.80146 9.17646 7.3125 7.3125 7.3125C5.44854 7.3125 3.9375 5.80146 3.9375 3.9375C3.9375 2.07354 5.44854 0.5625 7.3125 0.5625C9.17646 0.5625 10.6875 2.07354 10.6875 3.9375Z"
        stroke="currentColor"
        strokeWidth="1.125"
      />
      <path
        d="M12.5625 14.5982V15.5625M12.5625 14.5982C11.6949 14.5982 10.9305 14.1721 10.4822 13.525M14.6429 10.8502C14.9079 11.2328 15.0625 11.6928 15.0625 12.1875C15.0625 12.6823 14.9079 13.1423 14.6428 13.525C14.1945 14.1721 13.4301 14.5982 12.5625 14.5982M12.5625 9.77679C13.4302 9.77679 14.1946 10.203 14.6429 10.8502M12.5625 9.77679C11.6948 9.77679 10.9304 10.203 10.4821 10.8502M12.5625 9.77679V8.8125M15.5625 10.2589L14.6429 10.8502M9.56282 14.1161L10.4822 13.525M9.5625 10.2589L10.4821 10.8502M15.5622 14.1161L14.6428 13.525M10.4821 10.8502C10.2171 11.2328 10.0625 11.6928 10.0625 12.1875C10.0625 12.6823 10.2171 13.1423 10.4822 13.525"
        stroke="currentColor"
        strokeWidth="1.125"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FleetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M2 14h7l-.8-3.5H2.8L2 14z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M11 14h7l-.8-3.5h-5.4L11 14z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <circle cx="4.5" cy="15" r="1" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="7.5" cy="15" r="1" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="13.5" cy="15" r="1" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="16.5" cy="15" r="1" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function BookingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <rect x="4" y="3" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M4 6h12" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function VehicleManagementIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M3 13h10l-1-4H4L3 13z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <circle cx="5.5" cy="14.5" r="1.25" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="11.5" cy="14.5" r="1.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M14.5 8.5l2 2-2 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 10.5h4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <rect x="6" y="11" width="2" height="3" rx="0.5" fill="currentColor" />
      <rect x="9" y="8" width="2" height="6" rx="0.5" fill="currentColor" />
      <rect x="12" y="6" width="2" height="8" rx="0.5" fill="currentColor" />
    </svg>
  );
}

export function FeedbackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M4 4.5h12v8.5H9l-3.5 3V4.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

export function MarketingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path d="M3 9.5l11-5.5v11L3 9.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M14 9.5v5.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M16.5 8v7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function FinancialIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <rect x="2.5" y="5" width="15" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M2.5 8.5h15" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function WebsiteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M2.5 10h15M10 2.5c2 2.5 3 4.5 3 7.5s-1 5-3 7.5M10 2.5c-2 2.5-3 4.5-3 7.5s1 5 3 7.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AdsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <rect x="4" y="3" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7 7.5h6M7 10h6M7 12.5h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3a5 5 0 00-5 5v3l-1.5 2.5h13L15 11V8a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 15.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M8.1 1.5h3.8l.35 2.1a5.5 5.5 0 011.55.9l2-.85 1.9 3.3-1.65 1.35a5.6 5.6 0 010 1.8l1.65 1.35-1.9 3.3-2-.85a5.5 5.5 0 01-1.55.9l-.35 2.1H8.1l-.35-2.1a5.5 5.5 0 01-1.55-.9l-2 .85-1.9-3.3 1.65-1.35a5.6 5.6 0 010-1.8L2.3 6.95l1.9-3.3 2 .85a5.5 5.5 0 011.55-.9L8.1 1.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M7.5 17.5H4.167A1.667 1.667 0 012.5 15.833V4.167A1.667 1.667 0 014.167 2.5H7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.333 14.167L17.5 10l-4.167-4.167M17.5 10h-10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 6h12M5 1.5V4M11 1.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 10l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 3h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrendDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 4l4 4 3-3 5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11h4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MoreVerticalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3" r="1" fill="currentColor" />
      <circle cx="8" cy="8" r="1" fill="currentColor" />
      <circle cx="8" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}

export function TierShield({ tier }: { tier: 1 | 2 | 3 }) {
  const uid = useId().replace(/:/g, "");

  if (tier === 1) {
    return (
      <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="35.9974" height="23.796" rx="11.898" fill="#E5E7EB" />
        <g filter={`url(#filter0_d_${uid})`}>
          <path d="M11.4209 8.11328L11.4209 13.069L6.9801 13.069L8.28338 10.5911L6.00034 8.11328L11.4209 8.11328Z" fill="#5A1800" />
          <path d="M24.5767 8.11328L24.5767 13.069L29.0175 13.069L27.7142 10.5911L29.9972 8.11328L24.5767 8.11328Z" fill="#5A1800" />
          <path d="M10.1333 9.04595L11.4205 8.11328V14.2274H10.1333V9.04595Z" fill="#441200" />
          <path d="M25.8638 9.04595L24.5766 8.11328V14.2274H25.8638V9.04595Z" fill="#441200" />
          <path d="M12.9331 9.04297L12.9331 14.7093L9.93067 14.7093C9.93067 14.7093 9.55511 14.7093 9.55511 11.8761C9.55511 9.04297 9.93067 9.04297 9.93067 9.04297L12.9331 9.04297Z" fill="#711E00" />
          <path d="M22.9609 9.04297L22.9609 14.7093L26.0602 14.7093C26.0602 14.7093 26.4479 14.7093 26.4479 11.8761C26.4479 9.04297 26.0602 9.04297 26.0602 9.04297L22.9609 9.04297Z" fill="#711E00" />
          <circle cx="18.0181" cy="11.898" r="5.89799" fill={`url(#paint0_linear_${uid})`} />
          <circle cx="17.9995" cy="11.9131" r="4.69823" fill={`url(#paint1_linear_${uid})`} />
          <mask id={`mask0_${uid}`} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="14" y="8" width="9" height="9">
            <circle cx="18.2071" cy="12.3233" r="4.03425" fill="#7D7D7D" />
          </mask>
          <g mask={`url(#mask0_${uid})`}>
            <circle cx="17.9913" cy="11.8936" r="4.03425" fill="#9CA1A3" />
          </g>
          <path d="M17.9976 7.48047C20.4442 7.4806 22.4312 9.44932 22.4312 11.8818C22.431 14.3143 20.4441 16.2831 17.9976 16.2832C15.5509 16.2832 13.5641 14.3143 13.564 11.8818C13.564 9.44924 15.5508 7.48047 17.9976 7.48047Z" fill="#616161" stroke="#9F9F9F" strokeWidth="0.500274" />
          <mask id={`mask1_${uid}`} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="14" y="8" width="9" height="9">
            <circle cx="18.2279" cy="12.2982" r="4.18494" fill="#C28B37" />
          </mask>
          <g mask={`url(#mask1_${uid})`}>
            <circle cx="18.0062" cy="11.8529" r="4.18494" fill={`url(#paint2_linear_${uid})`} />
            <path d="M18.6359 9.94719V14.6016H17.6519V10.8812H17.6246L16.5587 11.5494V10.6767L17.711 9.94719H18.6359Z" fill="white" />
          </g>
        </g>
        <defs>
          <filter id={`filter0_d_${uid}`} x="5.9221" y="5.92161" width="25.2509" height="13.0512" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dx="0.548749" dy="0.548749" />
            <feGaussianBlur stdDeviation="0.313571" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${uid}`} />
            <feBlend mode="normal" in="SourceGraphic" in2={`effect1_dropShadow_${uid}`} result="shape" />
          </filter>
          <linearGradient id={`paint0_linear_${uid}`} x1="18.0181" y1="6" x2="18.0181" y2="17.796" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="#B1B1B1" />
          </linearGradient>
          <linearGradient id={`paint1_linear_${uid}`} x1="17.9995" y1="7.21484" x2="17.9995" y2="16.6113" gradientUnits="userSpaceOnUse">
            <stop stopColor="#898989" />
            <stop offset="1" stopColor="#5F5F5F" />
          </linearGradient>
          <linearGradient id={`paint2_linear_${uid}`} x1="18.0062" y1="7.66797" x2="18.0062" y2="16.0378" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7D7D7D" />
            <stop offset="1" stopColor="#474747" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (tier === 2) {
    return (
      <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36.0013" height="23.796" rx="11.898" fill="#E5E7EB" />
        <g filter={`url(#filter0_d_${uid})`}>
          <path d="M11.4204 8.11328L11.4204 13.069L6.97961 13.069L8.28289 10.5911L5.99985 8.11328L11.4204 8.11328Z" fill="#5A1800" />
          <path d="M24.5796 8.11328L24.5796 13.069L29.0204 13.069L27.7171 10.5911L30.0001 8.11328L24.5796 8.11328Z" fill="#5A1800" />
          <path d="M10.1333 9.04595L11.4205 8.11328V14.2274H10.1333V9.04595Z" fill="#441200" />
          <path d="M25.8667 9.04595L24.5795 8.11328V14.2274H25.8667V9.04595Z" fill="#441200" />
          <path d="M13.083 9.04297L13.083 14.7093L9.98372 14.7093C9.98372 14.7093 9.59604 14.7093 9.59604 11.8761C9.59604 9.04297 9.98372 9.04297 9.98372 9.04297L13.083 9.04297Z" fill="#711E00" />
          <path d="M23.2168 9.04297L23.2168 14.7093L26.1224 14.7093C26.1224 14.7093 26.4858 14.7093 26.4858 11.8761C26.4858 9.04297 26.1224 9.04297 26.1224 9.04297L23.2168 9.04297Z" fill="#711E00" />
          <circle cx="18.0176" cy="11.898" r="5.89799" fill={`url(#paint0_linear_${uid})`} />
          <circle cx="17.999" cy="11.9131" r="4.69823" fill={`url(#paint1_linear_${uid})`} />
          <mask id={`mask0_${uid}`} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="14" y="8" width="9" height="9">
            <circle cx="18.2066" cy="12.3233" r="4.03425" fill="#7D7D7D" />
          </mask>
          <g mask={`url(#mask0_${uid})`}>
            <circle cx="17.9908" cy="11.8936" r="4.03425" fill="#9CA1A3" />
          </g>
          <path d="M17.9971 7.48047C20.4437 7.4806 22.4307 9.44932 22.4307 11.8818C22.4306 14.3143 20.4436 16.2831 17.9971 16.2832C15.5504 16.2832 13.5636 14.3143 13.5635 11.8818C13.5635 9.44924 15.5503 7.48047 17.9971 7.48047Z" fill="#644314" stroke="#FBBF4C" strokeWidth="0.500274" />
          <mask id={`mask1_${uid}`} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="14" y="8" width="9" height="9">
            <circle cx="18.2274" cy="12.2982" r="4.18494" fill="#C28B37" />
          </mask>
          <g mask={`url(#mask1_${uid})`}>
            <circle cx="18.0057" cy="11.8529" r="4.18494" fill={`url(#paint2_linear_${uid})`} />
            <path d="M16.3642 14V13.2909L18.0209 11.7569C18.1618 11.6205 18.28 11.4978 18.3754 11.3887C18.4724 11.2796 18.5459 11.1728 18.5959 11.0683C18.6459 10.9622 18.6709 10.8478 18.6709 10.7251C18.6709 10.5888 18.6398 10.4713 18.5777 10.3729C18.5156 10.2729 18.4307 10.1964 18.3232 10.1433C18.2156 10.0888 18.0936 10.0615 17.9573 10.0615C17.8149 10.0615 17.6906 10.0903 17.5846 10.1479C17.4785 10.2054 17.3967 10.288 17.3391 10.3956C17.2815 10.5032 17.2528 10.6312 17.2528 10.7797H16.3187C16.3187 10.4751 16.3876 10.2107 16.5255 9.98651C16.6634 9.76228 16.8566 9.5888 17.105 9.46608C17.3535 9.34336 17.6399 9.282 17.9641 9.282C18.2974 9.282 18.5876 9.34108 18.8345 9.45926C19.083 9.57592 19.2762 9.73804 19.414 9.94561C19.5519 10.1532 19.6208 10.391 19.6208 10.6592C19.6208 10.835 19.586 11.0084 19.5163 11.1797C19.4481 11.3509 19.3262 11.541 19.1504 11.7501C18.9747 11.9577 18.7269 12.2069 18.4073 12.4978L17.7277 13.1637V13.1955H19.6822V14H16.3642Z" fill="white" />
          </g>
        </g>
        <defs>
          <filter id={`filter0_d_${uid}`} x="5.92161" y="5.92161" width="25.2543" height="13.0512" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dx="0.548749" dy="0.548749" />
            <feGaussianBlur stdDeviation="0.313571" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${uid}`} />
            <feBlend mode="normal" in="SourceGraphic" in2={`effect1_dropShadow_${uid}`} result="shape" />
          </filter>
          <linearGradient id={`paint0_linear_${uid}`} x1="18.0176" y1="6" x2="18.0176" y2="17.796" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E0C04F" />
            <stop offset="1" stopColor="#B16F07" />
          </linearGradient>
          <linearGradient id={`paint1_linear_${uid}`} x1="17.999" y1="7.21484" x2="17.999" y2="16.6113" gradientUnits="userSpaceOnUse">
            <stop stopColor="#898989" />
            <stop offset="1" stopColor="#5F5F5F" />
          </linearGradient>
          <linearGradient id={`paint2_linear_${uid}`} x1="18.0057" y1="7.66797" x2="18.0057" y2="16.0378" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A36D1D" />
            <stop offset="1" stopColor="#744A0C" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg width="36" height="25" viewBox="0 0 36 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="35.9974" height="24.8582" rx="12.4291" fill="#E5E7EB" />
      <g filter={`url(#filter0_d_${uid})`}>
        <path d="M11.4204 8.44922L11.4204 13.4049L6.97961 13.4049L8.28289 10.9271L5.99985 8.44922L11.4204 8.44922Z" fill="#5A1800" />
        <path d="M24.5762 8.44922L24.5762 13.4049L29.017 13.4049L27.7137 10.9271L29.9967 8.44922L24.5762 8.44922Z" fill="#5A1800" />
        <path d="M10.1328 9.38188L11.42 8.44922V14.5634H10.1328V9.38188Z" fill="#441200" />
        <path d="M25.8633 9.38188L24.5761 8.44922V14.5634H25.8633V9.38188Z" fill="#441200" />
        <path d="M13.8765 9.37891L13.8765 15.0452L9.8812 15.0452C9.8812 15.0452 9.51776 15.0452 9.51776 12.2121C9.51776 9.37891 9.8812 9.37891 9.8812 9.37891L13.8765 9.37891Z" fill="#711E00" />
        <path d="M22.1572 9.37891L22.1572 15.0452L26.0556 15.0452C26.0556 15.0452 26.407 15.0452 26.407 12.2121C26.407 9.37891 26.0556 9.37891 26.0556 9.37891L22.1572 9.37891Z" fill="#711E00" />
        <path d="M18.215 6.29747C18.4143 6.12638 18.7086 6.12638 18.9078 6.29747L19.6654 6.94811C19.7936 7.05818 19.9664 7.10078 20.131 7.06288L21.1042 6.83884C21.3601 6.77993 21.6207 6.9167 21.7176 7.16078L22.0861 8.08897C22.1484 8.24599 22.2817 8.36404 22.445 8.40699L23.4109 8.66088C23.6649 8.72764 23.832 8.96984 23.8044 9.23099L23.6993 10.2241C23.6815 10.3921 23.7446 10.5585 23.8694 10.6725L24.6066 11.3462C24.8004 11.5233 24.8359 11.8155 24.6901 12.0339L24.1355 12.8644C24.0417 13.0049 24.0202 13.1816 24.0777 13.3404L24.4174 14.2795C24.5067 14.5265 24.4024 14.8017 24.1718 14.9273L23.2947 15.4049C23.1464 15.4857 23.0453 15.6322 23.0223 15.7996L22.8867 16.789C22.851 17.0492 22.6307 17.2443 22.3682 17.2484L21.3696 17.2637C21.2007 17.2663 21.0431 17.3491 20.945 17.4866L20.3651 18.2996C20.2126 18.5134 19.9269 18.5839 19.6925 18.4654L18.8012 18.015C18.6504 17.9388 18.4724 17.9388 18.3216 18.015L17.4303 18.4654C17.196 18.5839 16.9102 18.5134 16.7577 18.2996L16.1778 17.4866C16.0797 17.3491 15.9221 17.2663 15.7532 17.2637L14.7547 17.2484C14.4921 17.2443 14.2718 17.0492 14.2361 16.789L14.1005 15.7996C14.0776 15.6322 13.9764 15.4857 13.8281 15.4049L12.9511 14.9273C12.7205 14.8017 12.6161 14.5265 12.7054 14.2795L13.0451 13.3404C13.1026 13.1816 13.0811 13.0049 12.9873 12.8644L12.4328 12.0339C12.2869 11.8155 12.3224 11.5233 12.5163 11.3462L13.2535 10.6725C13.3782 10.5585 13.4413 10.3921 13.4235 10.2241L13.3184 9.23099C13.2908 8.96984 13.458 8.72764 13.712 8.66088L14.6778 8.40699C14.8412 8.36404 14.9744 8.24599 15.0368 8.08897L15.4052 7.16078C15.5021 6.9167 15.7627 6.77993 16.0186 6.83884L16.9918 7.06288C17.1564 7.10078 17.3293 7.05818 17.4574 6.94811L18.215 6.29747Z" fill={`url(#paint0_linear_${uid})`} />
        <circle cx="18.5046" cy="12.3737" r="4.52216" fill="#705100" />
        <mask id={`mask0_${uid}`} style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="14" y="8" width="10" height="10">
          <circle cx="18.7906" cy="12.8741" r="4.54211" fill="#C28B37" />
        </mask>
        <g mask={`url(#mask0_${uid})`}>
          <circle cx="18.5499" cy="12.3898" r="4.54211" fill={`url(#paint1_linear_${uid})`} />
        </g>
        <ellipse cx="18.6142" cy="12.428" rx="3.54145" ry="3.59593" fill="#A36D1D" />
        <ellipse opacity="0.8" cx="18.615" cy="12.4292" rx="3.32351" ry="3.26903" fill={`url(#paint2_linear_${uid})`} />
        <path d="M18.7891 13.8485C18.5346 13.8485 18.3079 13.8048 18.109 13.7173C17.9113 13.6286 17.7551 13.507 17.6403 13.3525C17.5267 13.1968 17.4681 13.0173 17.4647 12.8139H18.2079C18.2124 12.8991 18.2403 12.9741 18.2914 13.0389C18.3437 13.1025 18.413 13.1519 18.4994 13.1872C18.5857 13.2224 18.6829 13.24 18.7908 13.24C18.9033 13.24 19.0027 13.2201 19.0891 13.1803C19.1755 13.1406 19.2431 13.0855 19.2919 13.015C19.3408 12.9446 19.3652 12.8633 19.3652 12.7713C19.3652 12.6781 19.3391 12.5957 19.2868 12.5241C19.2357 12.4514 19.1618 12.3946 19.0652 12.3537C18.9698 12.3128 18.8562 12.2923 18.7243 12.2923H18.3988V11.7503H18.7243C18.8357 11.7503 18.934 11.731 19.0192 11.6923C19.1056 11.6537 19.1726 11.6003 19.2203 11.5321C19.2681 11.4628 19.2919 11.3821 19.2919 11.2901C19.2919 11.2026 19.2709 11.1259 19.2289 11.06C19.188 10.9929 19.13 10.9407 19.055 10.9032C18.9812 10.8657 18.8948 10.8469 18.7959 10.8469C18.6959 10.8469 18.6045 10.8651 18.5215 10.9015C18.4386 10.9367 18.3721 10.9873 18.3221 11.0532C18.2721 11.1191 18.2454 11.1963 18.242 11.285H17.5346C17.538 11.0838 17.5954 10.9066 17.7068 10.7532C17.8181 10.5998 17.9681 10.4799 18.1568 10.3935C18.3465 10.306 18.5607 10.2623 18.7993 10.2623C19.0402 10.2623 19.251 10.306 19.4317 10.3935C19.6124 10.481 19.7527 10.5992 19.8527 10.7481C19.9538 10.8958 20.0038 11.0617 20.0027 11.2458C20.0038 11.4412 19.9431 11.6043 19.8203 11.7349C19.6987 11.8656 19.5402 11.9486 19.3448 11.9838V12.0111C19.6016 12.044 19.797 12.1332 19.9311 12.2787C20.0663 12.423 20.1334 12.6037 20.1322 12.8207C20.1334 13.0196 20.076 13.1963 19.9601 13.3508C19.8453 13.5053 19.6868 13.6269 19.4845 13.7156C19.2823 13.8042 19.0505 13.8485 18.7891 13.8485Z" fill="white" />
      </g>
      <defs>
        <filter id={`filter0_d_${uid}`} x="5.92161" y="6.08958" width="25.2509" height="13.6098" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="0.548749" dy="0.548749" />
          <feGaussianBlur stdDeviation="0.313571" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result={`effect1_dropShadow_${uid}`} />
          <feBlend mode="normal" in="SourceGraphic" in2={`effect1_dropShadow_${uid}`} result="shape" />
        </filter>
        <linearGradient id={`paint0_linear_${uid}`} x1="18.5614" y1="6" x2="18.5614" y2="18.8582" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE178" />
          <stop offset="1" stopColor="#DD9F00" />
        </linearGradient>
        <linearGradient id={`paint1_linear_${uid}`} x1="17.2006" y1="7.85294" x2="20.4696" y2="16.5159" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E4A400" />
          <stop offset="1" stopColor="#966301" />
        </linearGradient>
        <linearGradient id={`paint2_linear_${uid}`} x1="18.615" y1="9.16016" x2="18.615" y2="15.6982" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFEC86" />
          <stop offset="1" stopColor="#FFB802" />
        </linearGradient>
      </defs>
    </svg>
  );
}
