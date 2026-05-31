import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function EditSubjectModal({ subject, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: subject.name,
    credits: subject.credits,
    marks_obtained: subject.marks_obtained ?? '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/gpa/subject/${subject.id}`, {
        name: form.name.trim(),
        credits: parseInt(form.credits),
        marks_obtained: parseFloat(form.marks_obtained),
      });
      toast.success('Subject updated!');
      onUpdated();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Edit Subject</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Subject Name</label>
            <input
              type="text" required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Credits</label>
              <input
                type="number" min="1" max="6" required
                value={form.credits}
                onChange={e => setForm(p => ({ ...p, credits: e.target.value }))}
                className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Marks (0–100)</label>
              <input
                type="number" min="0" max="100" step="0.01" required
                value={form.marks_obtained}
                onChange={e => setForm(p => ({ ...p, marks_obtained: e.target.value }))}
                className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              />
            </div>
          </div>

          {form.marks_obtained && (
            <div className="bg-dark-700 rounded-lg px-4 py-3 text-sm">
              <span className="text-gray-400">Updated grade: </span>
              <span className="font-bold text-white font-mono">{getGrade(parseFloat(form.marks_obtained))}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-dark-600 text-gray-300 hover:text-white hover:border-gray-500 font-medium py-3 rounded-xl text-sm transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition">
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getGrade(marks) {
  if (marks >= 91) return 'O (10)';
  if (marks >= 81) return 'A+ (9)';
  if (marks >= 71) return 'A (8)';
  if (marks >= 61) return 'B+ (7)';
  if (marks >= 51) return 'B (6)';
  if (marks >= 45) return 'C (5)';
  return 'F (0)';
}
