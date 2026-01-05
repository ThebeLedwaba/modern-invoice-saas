interface InvoiceRowProps {
  client: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

export default function InvoiceRow({ client, amount, status, dueDate }: InvoiceRowProps) {
  const statusColors = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800'
  };

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-4">
        <div className="font-medium text-gray-800">{client}</div>
      </td>
      <td className="py-4 font-semibold text-gray-800">{amount}</td>
      <td className="py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="py-4 text-gray-600">{dueDate}</td>
    </tr>
  );
}