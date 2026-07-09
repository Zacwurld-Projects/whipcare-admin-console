import { WhipcareLogo } from "@/app/components/auth/WhipcareLogo";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { DashboardHeader } from "@/app/components/dashboard/DashboardHeader";

const SIDEBAR_WIDTH = 248;
const HEADER_HEIGHT = 72;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <header
        className="fixed inset-x-0 top-0 z-40 flex border-b border-[#F3F4F6] bg-white"
        style={{ height: HEADER_HEIGHT }}
      >
        <div
          className="flex shrink-0 items-center border-r border-[#F3F4F6] px-5"
          style={{ width: SIDEBAR_WIDTH }}
        >
          <div className="origin-left scale-[0.85]">
            <WhipcareLogo />
          </div>
        </div>

        <DashboardHeader />
      </header>

      <Sidebar headerHeight={HEADER_HEIGHT} sidebarWidth={SIDEBAR_WIDTH} />

      <div style={{ paddingLeft: SIDEBAR_WIDTH, paddingTop: HEADER_HEIGHT }}>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
