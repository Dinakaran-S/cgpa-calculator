import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function TargetCGPA() {
  const [form, setForm] = useState({
    currentCGPA: '',
    completedCredits: '',
    targetCGPA: '',
    nextSemesterCredits: '',
  });
  const [result, setResult] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const current = parseFloat(form.currentCGPA);
    const completed = parseInt(form.completedCredits);
    const target = parseFloat(form.targetCGPA);
    const next = parseInt(form.nextSemesterCredits);

    if (target > 10) {
      toast.error('Max CGPA is 10.');
      return;
    }
    if (target <= current) {
      setResult({ type: 'already', message: `You already have a CGPA of ${current}. Keep it up!` });
      return;
    }

    // Required: target = (completed*current + next*required) / (completed + next)
    // Solve for required SGPA
    const requiredSGPA = ((target * (completed + next)) - (current * completed)) / next;

    if (requiredSGPA > 10) {
      setResult({
        type: 'impossible',
        message: `Not achievable in one semester. You'd need ${requiredSGPA.toFixed(2)} SGPA which exceeds 10.`,
        requiredSGPA,
      });
    } else {
      setResult({
        type: 'possible',
        requiredSGPA: parseFloat(requiredSGPA.toFixed(2)),
        grade: sgpaToGrade(requiredSGPA),
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Navbar */}
      <nav className="border-b border-dark-700 bg-dark-800 px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold font-mono text-sm">C</span>
          </div>
          <span className="font-semibold text-white">CGPA Calc</span>
        </Link>
        <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition">← Dashboard</Link>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Target CGPA Calculator</h1>
          <p className="text-gray-400 text-sm">Find out what SGPA you need next semester to hit your goal</p>
        </div>

        <form onSubmit={calculate} className="bg-dark-800 border border-dark-600 rounded-2xl p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Current CGPA</label>
              <input
                type="number" step="0.01" min="0" max="10" required
                value={form.currentCGPA}
                onChange={e => setForm(p => ({ ...p, currentCGPA: e.target.value }))}
                className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                placeholder="e.g. 7.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Target CGPA</label>
              <input
                type="number" step="0.01" min="0" max="10" required
                value={form.targetCGPA}
                onChange={e => setForm(p => ({ ...p, targetCGPA: e.target.value }))}
                className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                placeholder="e.g. 8.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Credits Completed So Far</label>
              <input
                type="number" min="0" required
                value={form.completedCredits}
                onChange={e => setForm(p => ({ ...p, completedCredits: e.target.value }))}
                className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                placeholder="e.g. 120"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Next Semester Credits</label>
              <input
                type="number" min="1" required
                value={form.nextSemesterCredits}
                onChange={e => setForm(p => ({ ...p, nextSemesterCredits: e.target.value }))}
                className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                placeholder="e.g. 24"
              />
            </div>
          </div>

          <button type="submit"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl text-sm transition">
            Calculate
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className={`mt-6 rounded-2xl p-8 border text-center ${
            result.type === 'possible' ? 'bg-dark-800 border-emerald-800' :
            result.type === 'impossible' ? 'bg-dark-800 border-red-800' :
            'bg-dark-800 border-dark-600'
          }`}>
            {result.type === 'possible' && (
              <>
                <p className="text-gray-400 text-sm mb-2">You need an SGPA of</p>
                <p className="text-5xl font-bold text-emerald-400 font-mono mb-3">{result.requiredSGPA}</p>
                <p className="text-gray-400 text-sm">
                  That means averaging around <span className="text-white font-semibold">{result.grade}</span> marks across all subjects next semester.
                </p>
              </>
            )}
            {result.type === 'impossible' && (
              <>
                <p className="text-4xl mb-3">😔</p>
                <p className="text-red-400 font-semibold mb-2">Not achievable in one semester</p>
                <p className="text-gray-400 text-sm">{result.message}</p>
                <p className="text-gray-500 text-xs mt-3">Try a lower target or spread it over more semesters.</p>
              </>
            )}
            {result.type === 'already' && (
              <>
                <p className="text-4xl mb-3">🎉</p>
                <p className="text-emerald-400 font-semibold">{result.message}</p>
              </>
            )}
          </div>
        )}

        {/* Formula explanation */}
        <div className="mt-6 bg-dark-800 border border-dark-600 rounded-2xl p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Formula used</p>
          <p className="text-sm text-gray-400 font-mono">
            Required SGPA = (Target × Total Credits − Current CGPA × Completed Credits) / Next Semester Credits
          </p>
        </div>
      </div>
    </div>
  );
}

function sgpaToGrade(sgpa) {
  if (sgpa >= 9.5) return '91+ (O grade)';
  if (sgpa >= 8.5) return '81–90 (A+ grade)';
  if (sgpa >= 7.5) return '71–80 (A grade)';
  if (sgpa >= 6.5) return '61–70 (B+ grade)';
  if (sgpa >= 5.5) return '51–60 (B grade)';
  if (sgpa >= 5.0) return '45–50 (C grade)';
  return 'above 45 marks';
}
