export type ActivityRow = {
  id: number;
  user: string;
  type: string;
  description: string;
  date: string;
};

const columns = [
  { label: "User Name", className: "text-left" },
  { label: "Activity Type", className: "text-left" },
  { label: "Description", className: "text-left" },
  { label: "Date & time", className: "text-right" },
];

export function makeActivityRows(first: number, last: number): ActivityRow[] {
  return Array.from({ length: Math.max(last - first + 1, 0) }, (_, i) => ({
    id: first + i,
    user: "Isaac Zacwurld",
    type: "Booked a Service",
    description: "Booked a mechanic for car repair.",
    date: "Nov 12, 2024 . 09:32AM",
  }));
}

export function ActivitiesTable({ rows }: { rows: ActivityRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-[14px]">
        <thead>
          <tr className="bg-[#F3F4F6] text-[14px] font-semibold text-[#364153]">
            {columns.map(({ label, className }) => (
              <th key={label} className={`px-6 py-1.5 font-semibold ${className}`}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[#E5E7EB] font-medium">
              <td className="px-6 py-[13px] text-[#4A5565]">{row.user}</td>
              <td className="px-6 py-[13px] text-[#4A5565]">{row.type}</td>
              <td className="px-6 py-[13px] text-[#101828]">{row.description}</td>
              <td className="px-6 py-[13px] text-right text-[#101828]">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
