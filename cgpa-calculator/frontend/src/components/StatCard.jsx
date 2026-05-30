export default function StatCard({ label, value, highlight, small }) {
  return (
    <div className={`rounded-2xl p-5 border ${highlight ? 'bg-primary-500 border-primary-500' : 'bg-dark-800 border-dark-600'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${highlight ? 'text-primary-100' : 'text-gray-400'}`}>
        {label}
      </p>
      <p className={`font-bold ${small ? 'text-base leading-tight mt-1' : 'text-3xl'} ${highlight ? 'text-white' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}
