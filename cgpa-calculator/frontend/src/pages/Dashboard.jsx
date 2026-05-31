import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [exporting, setExporting] = useState(false);

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

  const handleDelete = async (subjectId) => {
    try {
      await api.delete(`/gpa/subject/${subjectId}`);
      toast.success('Subject removed.');
      fetchReport();
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const exportPDF = async () => {
    if (!report) return;
    setExporting(true);
    try {
      // Dynamically import jsPDF
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      const pageW = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('CGPA Transcript', pageW / 2, y, { align: 'center' });
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120);
      doc.text('Amrita Vishwa Vidyapeetham Chennai', pageW / 2, y, { align: 'center' });
      y += 5;
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageW / 2, y, { align: 'center' });
      y += 5;
      doc.text(`Student: ${user?.name}`, pageW / 2, y, { align: 'center' });
      y += 10;

      doc.setTextColor(0);

      // CGPA summary
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`Overall CGPA: ${report.cgpa.toFixed(2)}  |  ${report.classification}`, pageW / 2, y, { align: 'center' });
      y += 10;

      // Each semester
      for (const sem of report.semesters) {
        if (y > 250) { doc.addPage(); y = 20; }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text(`Semester ${sem.semester}  —  SGPA: ${sem.sgpa.toFixed(2)}  |  Credits: ${sem.total_credits}`, 14, y);
        y += 6;

        // Table header
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80);
        doc.text('Subject', 14, y);
        doc.text('Credits', 110, y);
        doc.text('Marks', 135, y);
        doc.text('Grade', 158, y);
        doc.text('GP', 180, y);
        y += 4;

        doc.setDrawColor(200);
        doc.line(14, y, 196, y);
        y += 4;

        // Table rows
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0);
        for (const sub of sem.subjects) {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(sub.name.substring(0, 40), 14, y);
          doc.text(String(sub.credits), 110, y);
          doc.text(String(sub.marks_obtained ?? '—'), 135, y);
          doc.text(sub.grade ?? '—', 158, y);
          doc.text(String(sub.grade_point ?? '—'), 180, y);
          y += 6;
        }
        y += 4;
      }

      doc.save(`cgpa-transcript-${user?.name?.replace(/\s/g, '-')}.pdf`);
      toast.success('Transcript downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('PDF export failed. Try again.');
    } finally {
      setExporting(false);
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
          <Link to="/target" className="text-sm text-gray-400 hover:text-white transition hidden sm:block">
            🎯 Target CGPA
          </Link>
          <button onClick={exportPDF} disabled={exporting || !report?.semesters?.length}
            className="text-sm text-gray-400 hover:text-white transition disabled:opacity-40">
            {exporting ? 'Exporting…' : '📄 Export PDF'}
          </button>
          <span className="text-sm text-gray-400 hidden sm:block">{user?.name}</span>
          <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition">Sign out</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Hi, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-gray-400 text-sm mt-0.5">Track your academic performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/target"
              className="border border-dark-600 hover:border-primary-500 text-gray-300 hover:text-white font-medium px-4 py-2.5 rounded-xl text-sm transition sm:hidden">
              🎯 Target
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Add Subject
            </button>
          </div>
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

            {/* Target CGPA promo card */}
            {report?.semesters?.length > 0 && (
              <Link to="/target" className="block mb-6">
                <div className="bg-dark-800 border border-primary-500/30 hover:border-primary-500/60 rounded-2xl p-5 flex items-center justify-between transition group">
                  <div>
                    <p className="font-semibold text-white">🎯 Target CGPA Calculator</p>
                    <p className="text-sm text-gray-400 mt-0.5">Find out what you need to score next semester</p>
                  </div>
                  <span className="text-primary-500 text-sm group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
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
