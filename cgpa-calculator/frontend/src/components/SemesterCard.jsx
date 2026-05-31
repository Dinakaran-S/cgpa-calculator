import { useState } from 'react';
import EditSubjectModal from './EditSubjectModal';

const GRADE_COLORS = {
  O: 'text-emerald-400', 'A+': 'text-green-400', A: 'text-lime-400',
  'B+': 'text-yellow-400', B: 'text-orange-400', C: 'text-orange-500', F: 'text-red-500',
};

export default function SemesterCard({ sem, onDelete, onRefresh }) {
  const [open, setOpen] = useState(true);
  const [editingSubject, setEditingSubject] = useState(null);

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-dark-700 transition"
      >
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white">Semester {sem.semester}</span>
          {sem.failed_count > 0 && (
            <span className="text-xs bg-red-900/50 text-red-400 border border-red-800 px-2 py-0.5 rounded-full">
              {sem.failed_count} failed
            </span>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-400">SGPA</p>
            <p className="font-bold text-white font-mono">{sem.sgpa.toFixed(2)}</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">Credits</p>
            <p className="font-semibold text-white">{sem.total_credits}</p>
          </div>
          <span className="text-gray-500 text-sm">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Subject table */}
      {open && (
        <div className="border-t border-dark-600">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-600">
                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Subject</th>
                <th className="text-center px-3 py-3 text-xs text-gray-400 font-medium">Credits</th>
                <th className="text-center px-3 py-3 text-xs text-gray-400 font-medium">Marks</th>
                <th className="text-center px-3 py-3 text-xs text-gray-400 font-medium">Grade</th>
                <th className="text-center px-3 py-3 text-xs text-gray-400 font-medium">GP</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {sem.subjects.map((sub) => (
                <tr key={sub.id} className="border-b border-dark-700 last:border-0 hover:bg-dark-700/50 transition">
                  <td className="px-6 py-3 text-white font-medium">{sub.name}</td>
                  <td className="px-3 py-3 text-center text-gray-300">{sub.credits}</td>
                  <td className="px-3 py-3 text-center text-gray-300 font-mono">{sub.marks_obtained ?? '—'}</td>
                  <td className={`px-3 py-3 text-center font-bold font-mono ${GRADE_COLORS[sub.grade] || 'text-gray-400'}`}>
                    {sub.grade ?? '—'}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-300 font-mono">{sub.grade_point ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setEditingSubject(sub)}
                        className="text-gray-500 hover:text-primary-400 transition text-xs"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(sub.id, sem.semester)}
                        className="text-gray-500 hover:text-red-400 transition text-xs"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
          onUpdated={() => { setEditingSubject(null); onRefresh(); }}
        />
      )}
    </div>
  );
}
