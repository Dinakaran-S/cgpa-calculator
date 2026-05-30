import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import AddSubjectModal from '../components/AddSubjectModal';
import SemesterCard from '../components/SemesterCard';
import CGPAChart from '../components/CGPAChart';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchReport = async () => {
    try {
      const res = await api.get('/gpa/report');
      setReport(res.data);
    } catch (err) {
      toast.error('Failed to load report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReport(); }, []);

  const handleDelete = async (subjectId, semester) => {
    try {
      await api.delete(`/gpa/subject/${subjectId}`);
      toast.success('Subject removed.');
      fetchReport();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const cgpa = report?.cgpa ?? 0;
  const classification = report?.classification ?? '—';
  const totalSemesters = report?.semesters?.length ?? 0;
  const totalSubjects = report?.semesters?.reduce((acc, s) => acc + s.subjects.length, 0) ?? 0;

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Navbar */}
      <nav className="border-b border-dark-700 bg-dark-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold font-mono text-sm">C</span>
          </div>
          <span className="font-semibold text-white">CGPA Calculator</span>
          <span className="text-xs text-gray-500 hidden sm:block">· Amrita Vishwa Vidyapeetham</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:block">{user?.name}</span>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Hi, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-gray-400 text-sm mt-0.5">Track your academic performance</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Add Subject
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading your data…</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatCard label="CGPA" value={cgpa.toFixed(2)} highlight />
              <StatCard label="Classification" value={classification} small />
              <StatCard label="Semesters" value={totalSemesters} />
              <StatCard label="Subjects" value={totalSubjects} />
            </div>

            {/* Chart */}
            {report?.semesters?.length > 0 && (
              <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 mb-8">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  SGPA per Semester
                </h2>
                <CGPAChart semesters={report.semesters} />
              </div>
            )}

            {/* Semester Cards */}
            {report?.semesters?.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-5xl mb-4">📚</p>
                <p className="text-lg font-medium">No subjects yet</p>
                <p className="text-sm mt-1">Click "Add Subject" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {report.semesters.map((sem) => (
                  <SemesterCard
                    key={sem.semester}
                    sem={sem}
                    onDelete={handleDelete}
                    onRefresh={fetchReport}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <AddSubjectModal
          onClose={() => setShowModal(false)}
          onAdded={() => { setShowModal(false); fetchReport(); }}
        />
      )}
    </div>
  );
}
