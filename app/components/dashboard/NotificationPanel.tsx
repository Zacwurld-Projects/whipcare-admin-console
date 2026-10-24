/* eslint-disable @next/next/no-img-element */
type Notification = {
  id: number;
  title: string;
  description: string;
  time: string;
};

const notifications: Notification[] = Array.from({ length: 5 }, (_, id) => ({
  id,
  title: "Brake Service Order Cancelled",
  description: "Some important information will appear here",
  time: "13 days ago",
}));

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-label="Notifications"
      className="flex max-h-[min(805px,calc(100vh-128px))] w-[404px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl bg-white pb-6 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.16)]"
    >
      <div className="relative flex h-[65px] shrink-0 items-center justify-center">
        <h2 className="text-[18px] font-medium leading-[1.4] text-[#101828]">Notification</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className="absolute right-6 top-6 flex size-6 items-center justify-center"
        >
          <img src="/icons/notification/close.svg" alt="" className="size-[15.5px]" />
        </button>
      </div>

      <ul className="notification-scroll mx-6 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-[7px]">
        {notifications.map(({ id, title, description, time }) => (
          <li key={id} className="flex shrink-0 flex-col items-end gap-2 rounded-2xl bg-[#F9FAFB] p-4">
            <p className="text-[12px] leading-[1.5] text-[#A0A0A0]">{time}</p>
            <div className="flex w-full gap-3 px-[3px]">
              <img src="/icons/notification/caution.svg" alt="" className="size-6 shrink-0" />
              <div className="flex flex-col gap-1 font-medium leading-[1.4]">
                <p className="text-[16px] text-[#333]">{title}</p>
                <p className="text-[14px] text-[#6A7282]">{description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
