const locations = [
  { name: "California", users: 5000, color: "#FE915D", x: 12, y: 42 },
  { name: "Texas", users: 2000, color: "#F5C542", x: 28, y: 50 },
  { name: "Florida", users: 3000, color: "#4CAF50", x: 35, y: 55 },
];

export function CustomerMapping() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-base font-semibold text-slate-900">Customer Mapping</h3>
        <p className="text-xs text-slate-400">Last updated: July 25, 2024</p>
      </div>

      <div className="relative">
        <svg viewBox="0 0 400 180" className="w-full" preserveAspectRatio="xMidYMid meet">
          <rect width="400" height="180" fill="#FFF8F5" rx="8" />

          {/* Simplified world map shapes */}
          <ellipse cx="90" cy="80" rx="55" ry="40" fill="#F5E6DC" />
          <ellipse cx="200" cy="70" rx="70" ry="45" fill="#F0DDD4" />
          <ellipse cx="310" cy="85" rx="60" ry="38" fill="#F5E6DC" />
          <ellipse cx="160" cy="130" rx="40" ry="25" fill="#EDD5C8" />
          <ellipse cx="280" cy="125" rx="35" ry="22" fill="#EDD5C8" />

          {locations.map((loc) => (
            <g key={loc.name}>
              <circle cx={loc.x * 4} cy={loc.y * 1.8} r="6" fill={loc.color} opacity="0.9" />
              <circle cx={loc.x * 4} cy={loc.y * 1.8} r="10" fill={loc.color} opacity="0.2" />
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {locations.map((loc) => (
          <div key={loc.name} className="flex items-center gap-2 text-xs text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: loc.color }} />
            <span className="font-medium">{loc.name}</span>
            <span className="text-slate-400">({loc.users.toLocaleString()} users)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
