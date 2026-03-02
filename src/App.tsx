import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { BookOpen, GraduationCap, BrainCircuit, Loader2, Send, Settings2, AlertCircle, User, LogOut, X, Lock, LayoutDashboard, Users, Activity, BarChart3, Menu } from 'lucide-react';
import mermaid from 'mermaid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });

const ADMINS = [
  // 2 Admin Logins
  { email: 'kadamrutvik9515@gmail.com', password: '241004', role: 'admin' },
  { email: 'admin2@gmail.com', password: 'admin123', role: 'admin' },
  // 3 Analytics Logins
  { email: 'analytics1@gmail.com', password: 'analytics123', role: 'analytics' },
  { email: 'analytics2@gmail.com', password: 'analytics123', role: 'analytics' },
  { email: 'analytics3@gmail.com', password: 'analytics123', role: 'analytics' }
];

const AdminDashboard = ({ role }: { role: string }) => {
  const users = JSON.parse(localStorage.getItem('examprep_users') || '[]');
  const generations = JSON.parse(localStorage.getItem('examprep_generations') || '[]');

  const examCounts = generations.reduce((acc: any, curr: any) => {
    acc[curr.exam] = (acc[curr.exam] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.keys(examCounts).map(key => ({ name: key, count: examCounts[key] }));

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {role === 'admin' ? 'Admin Dashboard' : 'Analytics Dashboard'}
          </h2>
          <p className="text-sm text-slate-500">Overview of user activity and platform usage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Users size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><Activity size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Generations</p>
                <p className="text-2xl font-bold text-slate-900">{generations.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl text-purple-600"><BarChart3 size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Active Exams</p>
                <p className="text-2xl font-bold text-slate-900">{Object.keys(examCounts).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Generations by Exam</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Users</h3>
            <div className="overflow-y-auto flex-1 max-h-64">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.slice().reverse().map((u: any, i: number) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3 text-slate-500">{new Date(u.joinedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-8 text-center text-slate-500">No users registered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Generations</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Topic</th>
                  <th className="px-4 py-3 font-medium">Exam</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {generations.slice().reverse().slice(0, 10).map((g: any, i: number) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-medium text-slate-900">{g.email}</td>
                    <td className="px-4 py-3 text-slate-500 truncate max-w-xs">{g.topic}</td>
                    <td className="px-4 py-3 text-slate-500">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-medium">{g.exam}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{new Date(g.date).toLocaleString()}</td>
                  </tr>
                ))}
                {generations.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">No generations yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

const Mermaid = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const renderChart = async () => {
      try {
        mermaid.initialize({ startOnLoad: false, theme: 'default' });
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        // Ignore errors during streaming/partial rendering
      }
    };
    renderChart();
  }, [chart]);

  return <div ref={ref} className="flex justify-center my-6 overflow-x-auto" />;
};

const SYSTEM_PROMPT = `You are an Advanced South Asian Competitive Exam Preparation AI.

Your job is to provide:
1. Accurate conceptual explanation
2. Previous Year Questions (PYQs) related to the topic
3. Generate new exam-level questions
4. Maintain exam-specific difficulty and pattern
5. Follow official exam syllabus strictly

When a student enters a topic or question, respond in this structured format:

-----------------------------------------

📌 1. CONCEPT EXPLANATION

- Explain the topic in clear, exam-oriented language.
- If a diagram is necessary to explain the concept, use Mermaid.js syntax inside a \`\`\`mermaid code block.
- Use structured format:
   • Definition
   • Key Concepts
   • Important Formulas (if applicable)
   • Short Tricks (if applicable)
   • Common Mistakes
- Keep explanation aligned with selected exam level 
  (UPSC = analytical, JEE/NEET = conceptual + problem solving, SSC = direct fact-based).

-----------------------------------------

📚 2. PREVIOUS YEAR QUESTIONS (PYQs)

- Provide 3–5 real PYQ-style questions STRICTLY from the user's selected exam. Do NOT provide questions from other exams.
- Mention the exact exam name and year for each question.
- Provide correct answer with brief explanation.
- Maintain exact exam pattern.

-----------------------------------------

📝 3. GENERATE NEW QUESTIONS

A) 5 MCQs
- 4 options each
- Only one correct answer
- DO NOT provide the answer immediately. Wait until the Answer Key section.
- Difficulty level similar to selected exam

B) 5 Assertion-Reason Questions
- Use standard format:
  Assertion (A):
  Reason (R):
  Options:
  (a) Both A and R are true and R is correct explanation of A
  (b) Both A and R are true but R is NOT correct explanation
  (c) A is true but R is false
  (d) A is false but R is true
- DO NOT provide the answer immediately. Wait until the Answer Key section.

-----------------------------------------

🔑 4. ANSWER KEY & EXPLANATIONS

- This section MUST be at the very end of your response, after all questions are generated.
- Provide the correct option (e.g., (a), (b), (c), (d)) for each question.
- EXPLANATION RULE: Provide only the exact logic, formula, or fact needed to solve the question in the exam. Be extremely concise. Do NOT explain why other options are wrong unless it's a specific trick. Keep it strictly exam-oriented.

-----------------------------------------

IMPORTANT RULES:

- Do NOT give generic answers.
- Follow latest syllabus of selected exam.
- Avoid hallucinated facts.
- Maintain exam difficulty.
- Keep answer structured and clean.
- Use markdown formatting.
- Avoid unnecessary long stories.

If topic is unclear, ask student to specify:
   • Exam name
   • Subject
   • Difficulty level`;

export default function App() {
  const [exam, setExam] = useState('UPSC');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  
  // Auth & Limits state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [currentView, setCurrentView] = useState<'main' | 'admin'>('main');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      const adminUser = ADMINS.find(a => a.email === email && a.password === password);
      setIsAdmin(!!adminUser);
      setUserRole(adminUser?.role || '');
      setIsLoggedIn(true);
      setLoggedInUser(email);
      setShowLoginModal(false);
      
      if (!adminUser) {
        const users = JSON.parse(localStorage.getItem('examprep_users') || '[]');
        if (!users.find((u: any) => u.email === email)) {
          users.push({ 
            email, 
            name: isSignUp && name ? name : email.split('@')[0], 
            joinedAt: new Date().toISOString() 
          });
          localStorage.setItem('examprep_users', JSON.stringify(users));
        }
      }
      
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  const handleGenerate = async () => {
    if (!isLoggedIn && generationCount >= 2) {
      setShowLoginModal(true);
      return;
    }

    if (!topic.trim()) {
      setError('Please enter a topic or question.');
      return;
    }
    
    setError('');
    setLoading(true);
    setResult('');

    try {
      const prompt = `Topic/Question: ${topic}\nExam: ${exam}\nSubject: ${subject || 'Not specified'}\nDifficulty: ${difficulty}`;

      const response = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.2,
        },
      });

      let fullText = '';
      for await (const chunk of response) {
        if (chunk.text) {
          fullText += chunk.text;
          setResult(fullText);
        }
      }
      
      // Log generation
      const gens = JSON.parse(localStorage.getItem('examprep_generations') || '[]');
      gens.push({ 
        email: isLoggedIn ? loggedInUser : 'Anonymous', 
        topic, 
        exam, 
        subject: subject || 'N/A',
        date: new Date().toISOString() 
      });
      localStorage.setItem('examprep_generations', JSON.stringify(gens));

      if (!isLoggedIn) {
        setGenerationCount(prev => prev + 1);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans relative">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 p-6 flex flex-col shrink-0 h-screen overflow-y-auto transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Exam Sarthi AI</h1>
              <p className="text-xs text-slate-500 font-medium">South Asian Exams</p>
            </div>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-slate-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 flex-1">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
              <Settings2 size={16} />
              <span>Exam Settings</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Target Exam</label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <optgroup label="India - Undergrad Entrance">
                  <option value="JEE Main">JEE Main</option>
                  <option value="JEE Advanced">JEE Advanced</option>
                  <option value="NEET UG">NEET UG</option>
                  <option value="CUET UG">CUET UG</option>
                  <option value="CLAT">CLAT (Law)</option>
                  <option value="BITSAT">BITSAT</option>
                  <option value="NDA">NDA</option>
                </optgroup>
                <optgroup label="India - Postgrad Entrance">
                  <option value="GATE">GATE</option>
                  <option value="CAT">CAT</option>
                  <option value="NEET PG">NEET PG</option>
                  <option value="CUET PG">CUET PG</option>
                  <option value="XAT">XAT</option>
                  <option value="JAM">IIT JAM</option>
                </optgroup>
                <optgroup label="India - Competitive & Govt">
                  <option value="UPSC">UPSC Civil Services</option>
                  <option value="SSC CGL">SSC CGL</option>
                  <option value="Banking (IBPS/SBI PO)">Banking (IBPS/SBI PO)</option>
                  <option value="RBI Grade B">RBI Grade B</option>
                  <option value="State PSC">State PSC</option>
                  <option value="CDS/AFCAT">CDS/AFCAT</option>
                </optgroup>
                <optgroup label="Sri Lanka">
                  <option value="Sri Lanka GCE A/L">GCE A/L (Advanced Level)</option>
                  <option value="Sri Lanka Law College">Law College Entrance</option>
                  <option value="SLAS">SLAS (Administrative Service)</option>
                  <option value="SLMC ERPM">SLMC ERPM (Medical)</option>
                </optgroup>
                <optgroup label="Nepal">
                  <option value="Nepal CEE">CEE (Medical Entrance)</option>
                  <option value="Nepal IOE">IOE (Engineering Entrance)</option>
                  <option value="Nepal CMAT/KUUMAT">CMAT / KUUMAT (Management)</option>
                  <option value="Lok Sewa Aayog">Lok Sewa Aayog (Public Service)</option>
                </optgroup>
                <optgroup label="Bhutan">
                  <option value="BHSEC">BHSEC (Class 12)</option>
                  <option value="RUB Entrance">RUB Entrance (University)</option>
                  <option value="BCSE/RCSC">BCSE / RCSC (Civil Service)</option>
                </optgroup>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Subject (Optional)</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Physics, History, Quant..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Easy">Easy (Basic Concepts)</option>
                <option value="Medium">Medium (Standard Exam Level)</option>
                <option value="Hard">Hard (Advanced/Rank Deciding)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-6">
          {isLoggedIn ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                    <User size={16} />
                  </div>
                  <div className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                    {loggedInUser}
                  </div>
                </div>
                <button onClick={() => { setIsLoggedIn(false); setIsAdmin(false); setUserRole(''); setLoggedInUser(''); setCurrentView('main'); }} className="text-slate-400 hover:text-slate-600 transition-colors" title="Log out">
                  <LogOut size={18} />
                </button>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setCurrentView(currentView === 'admin' ? 'main' : 'admin')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all"
                >
                  <LayoutDashboard size={18} />
                  {currentView === 'admin' ? 'Back to App' : (userRole === 'admin' ? 'Admin Dashboard' : 'Analytics Dashboard')}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 font-medium text-center">
                Free generations left: <span className="text-indigo-600 font-bold">{Math.max(0, 2 - generationCount)}</span>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all"
              >
                <User size={18} />
                Sign in / Sign up
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <GraduationCap size={20} />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">Exam Sarthi AI</h1>
          </div>
          <button 
            className="text-slate-600 p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </header>

        {currentView === 'admin' ? (
          <AdminDashboard role={userRole} />
        ) : (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Input Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-600" />
                  What do you want to study today?
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter a topic, concept, or specific question to generate comprehensive study material.
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Rotational Mechanics, Revolt of 1857, Time and Work..."
                  className="w-full min-h-[120px] rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleGenerate();
                    }
                  }}
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    Press <kbd className="font-sans px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded-md">Cmd/Ctrl + Enter</kbd> to generate
                  </span>
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Generate Material
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Output Section */}
            {(result || loading) && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[400px]">
                {result ? (
                  <div className="prose prose-slate prose-indigo max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-indigo-600 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
                    <Markdown
                      components={{
                        code({node, inline, className, children, ...props}: any) {
                          const match = /language-(\w+)/.exec(className || '')
                          if (!inline && match && match[1] === 'mermaid') {
                            return <Mermaid chart={String(children).replace(/\n$/, '')} />
                          }
                          return <code className={className} {...props}>{children}</code>
                        }
                      }}
                    >
                      {result}
                    </Markdown>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20">
                    <Loader2 size={40} className="animate-spin text-indigo-600" />
                    <p className="text-sm font-medium animate-pulse">Analyzing syllabus and generating content...</p>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
        )}

        {/* Global Footer */}
        <footer className="py-3 px-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-slate-50 shrink-0 z-10">
          <p>Exam Sarthi AI can make mistakes. Please verify important information with official sources.</p>
          <p className="mt-0.5">Built by <span className="font-semibold text-slate-600">RUTVIK</span></p>
        </footer>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {isSignUp ? 'Create an account' : 'Sign in to Exam Sarthi AI'}
              </h3>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-6">
                {generationCount >= 2 
                  ? "You've reached your free limit of 2 generations. Please sign in or create an account to continue generating unlimited study materials."
                  : "Sign in or create an account to save your progress and get unlimited generations."}
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="John Doe"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all"
                >
                  <Lock size={16} />
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>
                
                <div className="text-center mt-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
