interface ClientCardProps {
  name: string;
  email: string;
  phone: string;
  balance: string;
  status: 'active' | 'pending' | 'overdue';
}

export default function ClientCard({ name, email, phone, balance, status }: ClientCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-3">
            {name.charAt(0)}
          </div>
          <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600">
          <span className="mr-3">📧</span>
          <span className="text-sm">{email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-3">📱</span>
          <span className="text-sm">{phone}</span>
        </div>
        <div className="flex items-center text-gray-800">
          <span className="mr-3">💰</span>
          <span className="font-medium">Balance: {balance}</span>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button className="flex-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors">
          View Details
        </button>
        <button className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
          Edit
        </button>
      </div>
    </div>
  );
}