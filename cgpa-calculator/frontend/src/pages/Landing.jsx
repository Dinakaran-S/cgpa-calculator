import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🎓', title: 'Amrita Official Rules', desc: 'Grading scheme pulled directly from B.Tech 2023 regulations. O=10, A+=9, and so on.' },
  { icon: '📊', title: 'Semester-wise Tracking', desc: 'Add subjects per semester. Get SGPA for each, CGPA across all — updated instantly.' },
  { icon: '🎯', title: 'Target CGPA Calculator', desc: 'Find out exactly what marks you need next semester to hit your target CGPA.' },
  { icon: '📄', title: 'PDF Transcript', desc: 'Download a clean transcript of all your semesters and grades in one click.' },
  { icon: '🔐', title: 'Secure & Personal', desc: 'Your data is saved to your account with JWT authentication and encrypted passwords.' },
  { icon: '📱', title: 'Works Everywhere', desc: 'Fully responsive. Works on your phone, tablet, or laptop.' },
];

const steps = [
  { step: '01', title: 'Create your account', desc: 'Sign up with your Amrita email in under 30 seconds.' },
  { step: '02', title: 'Add your subjects', desc: 'Enter subject name, credits, and marks. Grade is auto-calculated.' },
  { step: '03', title: 'Track your CGPA', desc: 'See your SGPA per semester and cumulative CGPA instantly.' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-dark-700 bg-dark-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold font-mono text-sm">C</span>
          </div>
          <span className="font-semibold text-white">CGPA Calc</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white text-sm transition">Sign in</Link>
              <Link to="/register" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-dark-800 border border-dark-600 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Built for Amrita Vishwa Vidyapeetham Chennai
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
            Track your CGPA
            <span className="block text-primary-500">the smart way</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Add your marks, get your grade automatically. See your SGPA per semester 
            and cumulative CGPA — all based on Amrita's official 2023 regulations.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register"
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition shadow-lg shadow-primary-500/20">
              Start tracking free →
            </Link>
            <Link to="/login"
              className="border border-dark-600 hover:border-gray-500 text-gray-300 hover:text-white font-medium px-8 py-3.5 rounded-xl text-sm transition">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-dark-700 bg-dark-800/50 py-8 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: '8', label: 'Semesters tracked' },
            { value: '100%', label: 'Amrita accurate' },
            { value: 'Free', label: 'Always' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <p className="text-xs font-semibold text-primary-500 uppercase tracking-widest text-center mb-3">How it works</p>
        <h2 className="text-3xl font-bold text-center mb-14">Three steps to clarity</h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="bg-dark-800 border border-dark-600 rounded-2xl p-6 relative overflow-hidden">
              <span className="text-6xl font-bold text-dark-700 absolute top-4 right-4 leading-none font-mono select-none">
                {s.step}
              </span>
              <h3 className="font-semibold text-white mb-2 relative">{s.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed relative">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-widest text-center mb-3">Features</p>
          <h2 className="text-3xl font-bold text-center mb-14">Everything you need</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-dark-800 border border-dark-600 hover:border-primary-500/40 rounded-2xl p-6 transition group">
                <span className="text-2xl mb-4 block">{f.icon}</span>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grading table */}
      <section className="px-6 py-20 max-w-2xl mx-auto">
        <p className="text-xs font-semibold text-primary-500 uppercase tracking-widest text-center mb-3">Reference</p>
        <h2 className="text-3xl font-bold text-center mb-10">Amrita Grading Scheme</h2>
        <p className="text-center text-gray-400 text-sm mb-8">B.Tech Regulations 2023 — used automatically in all calculations</p>

        <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-600">
                <th className="text-left px-6 py-3 text-xs text-gray-400 font-medium">Marks</th>
                <th className="text-center px-6 py-3 text-xs text-gray-400 font-medium">Grade</th>
                <th className="text-center px-6 py-3 text-xs text-gray-400 font-medium">Grade Points</th>
              </tr>
            </thead>
            <tbody>
              {[
                { marks: '91–100', grade: 'O', gp: 10, color: 'text-emerald-400' },
                { marks: '81–90', grade: 'A+', gp: 9, color: 'text-green-400' },
                { marks: '71–80', grade: 'A', gp: 8, color: 'text-lime-400' },
                { marks: '61–70', grade: 'B+', gp: 7, color: 'text-yellow-400' },
                { marks: '51–60', grade: 'B', gp: 6, color: 'text-orange-400' },
                { marks: '45–50', grade: 'C', gp: 5, color: 'text-orange-500' },
                { marks: '0–44', grade: 'F', gp: 0, color: 'text-red-500' },
              ].map((r) => (
                <tr key={r.grade} className="border-b border-dark-700 last:border-0">
                  <td className="px-6 py-3 text-gray-300 font-mono">{r.marks}</td>
                  <td className={`px-6 py-3 text-center font-bold font-mono ${r.color}`}>{r.grade}</td>
                  <td className="px-6 py-3 text-center text-gray-300 font-mono">{r.gp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-xl mx-auto bg-dark-800 border border-dark-600 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary-500/5 pointer-events-none" />
          <h2 className="text-3xl font-bold mb-4 relative">Ready to track your CGPA?</h2>
          <p className="text-gray-400 mb-8 relative">Free forever. No ads. Just your grades.</p>
          <Link to="/register"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold px-10 py-4 rounded-xl text-sm transition shadow-lg shadow-primary-500/20 relative">
            Create your account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700 px-6 py-8 text-center text-xs text-gray-500">
        Built by Dinakaran S — B.Tech CSE, Amrita Vishwa Vidyapeetham Chennai
        <span className="mx-3">·</span>
        <a href="https://github.com/Dinakaran-S/cgpa-calculator" target="_blank" rel="noreferrer" className="hover:text-gray-300 transition">
          GitHub
        </a>
      </footer>
    </div>
  );
}
