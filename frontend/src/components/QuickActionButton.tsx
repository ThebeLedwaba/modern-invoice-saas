interface QuickActionButtonProps {
  icon: string;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
  onClick?: () => void;
}

export default function QuickActionButton({ icon, label, color, onClick }: QuickActionButtonProps) {
  const colorClasses = {
    blue: 'hover:bg-blue-50 text-blue-700',
    green: 'hover:bg-green-50 text-green-700',
    purple: 'hover:bg-purple-50 text-purple-700',
    yellow: 'hover:bg-yellow-50 text-yellow-700'
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center space-x-3 p-4 rounded-lg transition-colors ${colorClasses[color]}`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}