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
    <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.9019 0C12.1813 0.031863 12.4753 0.10547 12.7495 0.302734C13.0237 0.500097 13.1867 0.755422 13.3052 1.00977C13.4116 1.23825 13.9478 2.83887 13.9478 2.83887C14.043 3.07821 14.2102 3.28175 14.4253 3.42285C15.0135 3.80857 15.5358 3.70344 15.5513 3.7002C15.8812 3.60685 17.4324 3.17117 17.6987 3.12891C17.9942 3.08216 18.3177 3.07554 18.6519 3.21094C18.986 3.34639 19.2141 3.57556 19.3931 3.81445C19.3931 3.81445 20.7296 6.06275 20.8316 6.29688C20.9442 6.55603 21.0273 6.84911 20.9917 7.18652C20.9561 7.52402 20.8132 7.79326 20.6489 8.02344C20.5009 8.23065 19.0488 9.84567 19.0435 9.85156C19.0435 9.85156 18.7837 10.1652 18.7837 10.75C18.7838 11.2494 19.0435 11.6484 19.0435 11.6484C19.2587 11.8869 20.501 13.2694 20.6489 13.4766C20.8132 13.7067 20.9561 13.976 20.9917 14.3135C21.0272 14.6506 20.944 14.9431 20.8316 15.2021L19.3931 17.6846C19.2141 17.9235 18.9861 18.1526 18.6519 18.2881C18.3176 18.4236 17.9943 18.4179 17.6987 18.3711C17.4323 18.3288 15.5513 17.7998 15.5513 17.7998C15.2736 17.7398 14.8475 17.7993 14.4253 18.0762C14.2102 18.2173 13.9478 18.6611 13.9478 18.6611C13.9438 18.673 13.4112 20.2626 13.3052 20.4902C13.1867 20.7446 13.0237 20.9999 12.7495 21.1973C12.4753 21.3945 12.1813 21.4681 11.9019 21.5H9.09719C8.81773 21.4681 8.52376 21.3946 8.24953 21.1973C7.9753 20.9999 7.81236 20.7446 7.69387 20.4902C7.58756 20.262 7.05263 18.6651 7.05129 18.6611C7.05129 18.6611 6.78889 18.2173 6.57375 18.0762C6.15149 17.7994 5.72542 17.7398 5.44777 17.7998C5.44777 17.7998 3.56603 18.329 3.30031 18.3711C3.00479 18.4179 2.68149 18.4236 2.34719 18.2881C2.0131 18.1526 1.78595 17.9234 1.60695 17.6846L0.168475 15.2021C0.0559312 14.943 -0.0272082 14.6508 0.00831918 14.3135C0.0438938 13.976 0.185874 13.7067 0.350116 13.4766C0.497761 13.2697 1.74011 11.8872 1.95558 11.6484C1.95558 11.6484 2.21529 11.2494 2.21535 10.75C2.21535 10.1652 1.95558 9.85156 1.95558 9.85156C1.94151 9.8359 0.497349 8.22962 0.350116 8.02344C0.185874 7.79326 0.0438937 7.52402 0.00831918 7.18652C-0.0272381 6.84908 0.0558726 6.55605 0.168475 6.29688C0.271403 6.06122 1.60695 3.81445 1.60695 3.81445C1.78594 3.57569 2.01321 3.34632 2.34719 3.21094C2.68144 3.07547 3.00483 3.08215 3.30031 3.12891C3.56614 3.17099 5.11781 3.60683 5.44777 3.7002C5.45836 3.70243 5.98269 3.81046 6.57375 3.42285C6.78889 3.28176 6.95599 3.07823 7.05129 2.83887C7.05129 2.83887 7.58743 1.23825 7.69387 1.00977C7.81236 0.755397 7.9753 0.500117 8.24953 0.302734C8.52376 0.105442 8.81773 0.0318794 9.09719 0H11.9019ZM10.5191 7.25C8.58611 7.25005 7.01906 8.81704 7.01906 10.75C7.01906 12.683 8.58611 14.2499 10.5191 14.25C12.4521 14.25 14.0191 12.683 14.0191 10.75C14.0191 8.817 12.4521 7.25 10.5191 7.25Z" fill="#6A7282" />
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
  const colors = {
    1: { fill: "#FE915D", stroke: "#D45E24" },
    2: { fill: "#4A90D9", stroke: "#2B6CB0" },
    3: { fill: "#9B59B6", stroke: "#7D3C98" },
  };
  const { fill, stroke } = colors[tier];

  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
      <path
        d="M10 1L2 4.5v6.5c0 4.5 3.5 7.5 8 9.5 4.5-2 8-5 8-9.5V4.5L10 1z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
      />
      <text x="10" y="13" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
        {tier}
      </text>
    </svg>
  );
}
