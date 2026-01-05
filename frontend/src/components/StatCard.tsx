interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: 'green' | 'blue' | 'yellow' | 'purple';
}

export default function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <div className={`p-6 rounded-xl border ${colorClasses[color]} shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className={`text-sm mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}