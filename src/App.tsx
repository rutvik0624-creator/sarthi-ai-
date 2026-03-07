import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import Markdown from 'react-markdown';
import { BookOpen, GraduationCap, BrainCircuit, Loader2, Send, Settings2, AlertCircle, User, LogOut, X, Lock, LayoutDashboard, Users, Activity, BarChart3, Menu, FileText, Target, AlertTriangle, CheckCircle, XCircle, Trash2, Calendar, Sparkles, Layers, Newspaper, MessageCircle, ListChecks, Image as ImageIcon, ChevronRight, ChevronLeft, RotateCcw, Copy, Timer } from 'lucide-react';
import mermaid from 'mermaid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

const ADMINS = [
  // 2 Admin Logins
  { email: 'kadamrutvik9515@gmail.com', password: '241004', role: 'admin' },
  { email: 'admin2@gmail.com', password: 'admin123', role: 'admin' },
  // 3 Analytics Logins
  { email: 'analytics1@gmail.com', password: 'analytics123', role: 'analytics' },
  { email: 'analytics2@gmail.com', password: 'analytics123', role: 'analytics' },
  { email: 'analytics3@gmail.com', password: 'analytics123', role: 'analytics' }
];

const getSafeJSON = (key: string, defaultValue: any) => {
  try {
    const val = localStorage.getItem(key);
    if (!val || val === 'undefined') return defaultValue;
    return JSON.parse(val);
  } catch (e) {
    return defaultValue;
  }
};

const AdminDashboard = ({ role }: { role: string }) => {
  const users = getSafeJSON('examprep_users', []);
  const generations = getSafeJSON('examprep_generations', []);

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
  const [error, setError] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        setError(false);
        mermaid.initialize({ 
          startOnLoad: false, 
          theme: 'default',
          suppressErrorRendering: true 
        });
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        
        // Check if chart is empty or just whitespace
        if (!chart || !chart.trim()) return;

        // Validate syntax before rendering to prevent error SVGs
        try {
          await mermaid.parse(chart);
        } catch (parseError) {
          throw new Error("Invalid Mermaid syntax");
        }

        const { svg } = await mermaid.render(id, chart);
        if (isMounted && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        if (isMounted) {
          setError(true);
        }
        // Clean up any error SVGs mermaid might have appended to the body
        const errorElement = document.querySelector(`[id^="dmermaid-"]`);
        if (errorElement) {
          errorElement.remove();
        }
      }
    };
    renderChart();
    
    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 my-6 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500">
        <AlertCircle size={16} className="mr-2 text-slate-400" />
        Diagram could not be rendered (invalid syntax)
      </div>
    );
  }

  return <div ref={ref} className="flex justify-center my-6 overflow-x-auto" />;
};

const getSystemPrompt = (mode: 'full' | 'pyq' | 'practice' | 'pyq_practice') => {
  let prompt = `You are an expert, highly experienced human teacher for competitive exams. You are strict, no-nonsense, and deeply care about your students' success. Speak directly to the student as a human mentor would.

`;

  if (mode === 'full') {
    prompt += `Your job is to provide:
1. Accurate conceptual explanation
2. Previous Year Questions (PYQs) related to the topic
3. Generate new exam-level questions
4. Maintain exam-specific difficulty and pattern
5. Follow official exam syllabus strictly

When a student enters a topic or question, respond in this structured format:

-----------------------------------------

📌 1. CONCEPT EXPLANATION (ULTIMATE MASTER NOTES)

- Explain the topic EXACTLY as an examiner expects to see it written in an exam sheet, or the exact logic needed to solve the MCQ.
- CRITICAL RULE: This explanation MUST be so comprehensive and detailed that it covers ALL concepts asked in Previous Year Questions (PYQs). If a student reads this explanation, they should NOT need to read NCERT or any other textbook.
- Include all exceptions, special cases, and hidden textbook points that are frequently asked in exams.
- DO NOT use conversational AI language (e.g., "As an AI", "I am an AI"). Speak as a human teacher.
- Be direct, concise, and purely academic.
- If a diagram is necessary to explain the concept, use Mermaid.js syntax inside a \`\`\`mermaid code block.
- Use structured format:
   • Definition (Exact textbook/official definition)
   • Key Concepts (Bullet points only, covering every single PYQ angle)
   • Important Formulas (if applicable)
   • Short Tricks (if applicable)
   • Common Mistakes (What examiners look for to deduct marks)
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
`;
  } else if (mode === 'pyq') {
    prompt += `Your job is to provide ONLY Previous Year Questions (PYQs) related to the topic. Do not provide concept explanations or new practice questions.

When a student enters a topic or question, respond in this structured format:

-----------------------------------------

📚 PREVIOUS YEAR QUESTIONS (PYQs)

- Provide 5-10 real PYQ-style questions STRICTLY from the user's selected exam. Do NOT provide questions from other exams.
- Mention the exact exam name and year for each question.
- Maintain exact exam pattern.
- DO NOT provide the answer immediately. Wait until the Answer Key section.

-----------------------------------------

🔑 ANSWER KEY & EXPLANATIONS

- This section MUST be at the very end of your response, after all questions are generated.
- Provide the correct option for each question.
- EXPLANATION RULE: Provide only the exact logic, formula, or fact needed to solve the question in the exam. Be extremely concise. Keep it strictly exam-oriented.
`;
  } else if (mode === 'practice') {
    prompt += `Your job is to provide ONLY new Practice Questions related to the topic. Do not provide concept explanations or PYQs.

When a student enters a topic or question, respond in this structured format:

-----------------------------------------

📝 PRACTICE QUESTIONS

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

🔑 ANSWER KEY & EXPLANATIONS

- This section MUST be at the very end of your response, after all questions are generated.
- Provide the correct option for each question.
- EXPLANATION RULE: Provide only the exact logic, formula, or fact needed to solve the question in the exam. Be extremely concise. Keep it strictly exam-oriented.
`;
  } else if (mode === 'pyq_practice') {
    prompt += `Your job is to provide Previous Year Questions (PYQs) and new Practice Questions related to the topic. Do not provide concept explanations.

When a student enters a topic or question, respond in this structured format:

-----------------------------------------

📚 1. PREVIOUS YEAR QUESTIONS (PYQs)

- Provide 3-5 real PYQ-style questions STRICTLY from the user's selected exam. Do NOT provide questions from other exams.
- Mention the exact exam name and year for each question.
- Maintain exact exam pattern.
- DO NOT provide the answer immediately. Wait until the Answer Key section.

-----------------------------------------

📝 2. PRACTICE QUESTIONS

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

🔑 3. ANSWER KEY & EXPLANATIONS

- This section MUST be at the very end of your response, after all questions are generated.
- Provide the correct option for each question.
- EXPLANATION RULE: Provide only the exact logic, formula, or fact needed to solve the question in the exam. Be extremely concise. Keep it strictly exam-oriented.
`;
  }

  prompt += `
-----------------------------------------

IMPORTANT RULES:

- ACT LIKE A STRICT HUMAN TEACHER. No fluff, no conversational filler, no emojis in the text (except the section headers).
- Just give the facts, formulas, and exact logic required to score marks.
- NEVER use $ or $$ signs for math equations or variables. Use plain text (e.g., x^2, a+b) or standard unicode characters. The $ sign causes formatting errors and confusion.
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

  return prompt;
};

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
  const [currentView, setCurrentView] = useState<'main' | 'admin' | 'test' | 'mistakes' | 'planner' | 'quiz' | 'syllabus' | 'doubts' | 'focus'>('main');

  // Test & Mistakes state
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState('');
  const [mistakesList, setMistakesList] = useState<any[]>([]);

  // Planner state
  const [plannerLoading, setPlannerLoading] = useState(false);
  const [plannerResult, setPlannerResult] = useState('');
  const [plannerDays, setPlannerDays] = useState('30');
  const [plannerHours, setPlannerHours] = useState('6');

  // Quiz state
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // ELI5 state
  const [eli5Loading, setEli5Loading] = useState(false);
  const [isEli5Mode, setIsEli5Mode] = useState(false);
  const [eli5Result, setEli5Result] = useState('');

  // Flashcards state
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Syllabus state
  const [syllabusLoading, setSyllabusLoading] = useState(false);
  const [syllabusData, setSyllabusData] = useState<any[]>([]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  // Doubt Solver state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatImage, setChatImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Focus Mode state
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [focusTimeElapsed, setFocusTimeElapsed] = useState(0); // in seconds
  const [dailyFocusStats, setDailyFocusStats] = useState<Record<string, number>>({});
  const focusTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentView === 'mistakes') {
      setMistakesList(getSafeJSON('examprep_mistakes', []));
    }
  }, [currentView]);
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
        const users = getSafeJSON('examprep_users', []);
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

  const handleGenerate = async (mode: 'full' | 'pyq' | 'practice' | 'pyq_practice' = 'full') => {
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
      let prompt = `Topic/Question: ${topic}\nExam: ${exam}\nSubject: ${subject || 'Not specified'}\nDifficulty: ${difficulty}`;
      
      if (mode === 'pyq') {
        prompt += `\n\nProvide ONLY Previous Year Questions (PYQs) for this topic. Include the year and exam name if possible. Provide detailed solutions.`;
      } else if (mode === 'practice') {
        prompt += `\n\nProvide ONLY Practice Questions for this topic. Provide detailed solutions.`;
      } else if (mode === 'pyq_practice') {
        prompt += `\n\nProvide a mix of Previous Year Questions (PYQs) and Practice Questions for this topic. Provide detailed solutions.`;
      }

      const response = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: getSystemPrompt(mode),
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
      const gens = getSafeJSON('examprep_generations', []);
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

  const handleGenerateTest = async () => {
    if (!isLoggedIn && generationCount >= 2) {
      setShowLoginModal(true);
      return;
    }

    if (!topic.trim()) {
      setTestError('Please enter a topic to generate a test.');
      return;
    }
    
    setTestError('');
    setTestLoading(true);
    setTestQuestions([]);
    setUserAnswers({});
    setTestSubmitted(false);

    try {
      if (!ai) throw new Error("AI not initialized");
      const prompt = `Generate ALL available Previous Year Questions (PYQs) for the topic "${topic}" in the ${exam} exam. 
      Subject: ${subject || 'Not specified'}. Difficulty: ${difficulty}.
      Do not limit to 5 questions. Provide as many real PYQs as you can find for this topic (aim for 10-25 questions if available).
      NEVER use $ or $$ signs for math equations or variables. Use plain text (e.g., x^2, a+b) or standard unicode characters.
      Return ONLY a valid JSON array of objects. Each object must have: 'question' (string), 'options' (array of 4 strings), 'correctOptionIndex' (number 0-3), 'explanation' (string), 'year' (string - e.g. "JEE 2019").`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctOptionIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                year: { type: Type.STRING }
              },
              required: ['question', 'options', 'correctOptionIndex', 'explanation', 'year']
            }
          }
        },
      });

      const data = JSON.parse(response.text || '[]');
      setTestQuestions(data);
      
      // Log generation
      const gens = getSafeJSON('examprep_generations', []);
      gens.push({ 
        email: isLoggedIn ? loggedInUser : 'Anonymous', 
        topic: `Test: ${topic}`, 
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
      setTestError(err.message || 'An error occurred while generating the test.');
    } finally {
      setTestLoading(false);
    }
  };

  const submitTest = () => {
    setTestSubmitted(true);
    
    // Log mistakes
    const mistakes = getSafeJSON('examprep_mistakes', []);
    testQuestions.forEach((q, index) => {
      if (userAnswers[index] !== q.correctOptionIndex) {
        mistakes.push({
          id: Date.now() + index,
          question: q.question,
          options: q.options,
          userAnswer: userAnswers[index] !== undefined ? q.options[userAnswers[index]] : 'Not Attempted',
          correctAnswer: q.options[q.correctOptionIndex],
          explanation: q.explanation,
          exam,
          subject: subject || 'N/A',
          topic,
          date: new Date().toISOString()
        });
      }
    });
    localStorage.setItem('examprep_mistakes', JSON.stringify(mistakes));
  };

  const deleteMistake = (id: number) => {
    const mistakes = getSafeJSON('examprep_mistakes', []);
    const updated = mistakes.filter((m: any) => m.id !== id);
    localStorage.setItem('examprep_mistakes', JSON.stringify(updated));
    setMistakesList(updated);
  };

  const handleGeneratePlanner = async () => {
    if (!isLoggedIn && generationCount >= 2) {
      setShowLoginModal(true);
      return;
    }

    if (!topic.trim()) {
      setError('Please enter subjects or topics to plan.');
      return;
    }
    
    setError('');
    setPlannerLoading(true);
    setPlannerResult('');

    try {
      if (!ai) throw new Error("AI not initialized");
      const prompt = `Create a detailed, realistic ${plannerDays}-day study timetable for ${exam}. 
      Subjects/Topics to cover: ${topic}. 
      Daily study hours available: ${plannerHours} hours.
      
      Format the output as a clean Markdown table with columns: Day, Subject, Topic, Hours, and Revision Strategy.
      Include a brief summary of the strategy at the end.`;

      const response = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are an expert, highly experienced human teacher and exam strategist. Provide realistic, actionable, and highly structured study plans. Speak directly to the student as a human mentor would. NEVER use $ or $$ signs.",
          temperature: 0.3,
        },
      });

      let fullText = '';
      for await (const chunk of response) {
        if (chunk.text) {
          fullText += chunk.text;
          setPlannerResult(fullText);
        }
      }
      
      if (!isLoggedIn) {
        setGenerationCount(prev => prev + 1);
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating the planner.');
    } finally {
      setPlannerLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setTestError('');
    setQuizLoading(true);
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizSubmitted(false);

    try {
      if (!ai) throw new Error("AI not initialized");
      const prompt = `Generate 5 Daily Current Affairs Multiple Choice Questions relevant for ${exam}. 
      Focus on the most important news from the last 30 days.
      NEVER use $ or $$ signs for math equations or variables. Use plain text (e.g., x^2, a+b) or standard unicode characters.
      Return ONLY a valid JSON array of objects. Each object must have: 'question' (string), 'options' (array of 4 strings), 'correctOptionIndex' (number 0-3), 'explanation' (string), 'year' (string - use "Current Affairs").`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctOptionIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                year: { type: Type.STRING }
              },
              required: ['question', 'options', 'correctOptionIndex', 'explanation', 'year']
            }
          }
        },
      });

      const data = JSON.parse(response.text || '[]');
      setQuizQuestions(data);
      
    } catch (err: any) {
      console.error(err);
      setTestError(err.message || 'An error occurred while generating the quiz.');
    } finally {
      setQuizLoading(false);
    }
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
  };

  const handleELI5 = async () => {
    if (isEli5Mode) {
      setIsEli5Mode(false);
      return;
    }

    if (eli5Result) {
      setIsEli5Mode(true);
      return;
    }

    setEli5Loading(true);
    setEli5Result('');

    try {
      if (!ai) throw new Error("AI not initialized");
      const prompt = `Simplify the following study material so a 5-year-old can understand it. Use real-world, everyday analogies. Keep it engaging and easy to digest.\n\nOriginal Material:\n${result}`;

      const response = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are a friendly, enthusiastic human teacher who explains complex concepts using simple, everyday analogies. Speak directly to the student as a human mentor would. NEVER use $ or $$ signs.",
          temperature: 0.7,
        },
      });

      let fullText = '';
      for await (const chunk of response) {
        if (chunk.text) {
          fullText += chunk.text;
          setEli5Result(fullText);
        }
      }
      setIsEli5Mode(true);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while generating ELI5 explanation.');
    } finally {
      setEli5Loading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    setFlashcardsLoading(true);
    try {
      if (!ai) throw new Error("AI not initialized");
      const prompt = `Extract the most important key concepts, formulas, and facts from the following study material and convert them into flashcards.
      Return ONLY a valid JSON array of objects. Each object must have: 'front' (the question, concept name, or formula name) and 'back' (the answer, definition, or formula).
      Limit to the 15 most important flashcards.
      NEVER use $ or $$ signs for math equations or variables. Use plain text (e.g., x^2, a+b) or standard unicode characters.
      
      Material:
      ${result}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING },
                back: { type: Type.STRING }
              },
              required: ['front', 'back']
            }
          }
        },
      });

      const data = JSON.parse(response.text || '[]');
      setFlashcards(data);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setShowFlashcards(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate flashcards.');
    } finally {
      setFlashcardsLoading(false);
    }
  };

  const handleGenerateSyllabus = async () => {
    setSyllabusLoading(true);
    try {
      if (!ai) throw new Error("AI not initialized");
      const prompt = `Generate the official, detailed syllabus for the ${exam} exam.
      Return ONLY a valid JSON array of objects representing the main subjects. 
      Each subject object must have: 'subject' (string) and 'topics' (array of strings).
      NEVER use $ or $$ signs.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                topics: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['subject', 'topics']
            }
          }
        },
      });

      const data = JSON.parse(response.text || '[]');
      setSyllabusData(data);
      localStorage.setItem(`examprep_syllabus_${exam}`, JSON.stringify(data));
    } catch (err: any) {
      console.error(err);
    } finally {
      setSyllabusLoading(false);
    }
  };

  const toggleTopicCompletion = (topicName: string) => {
    setCompletedTopics(prev => {
      const updated = prev.includes(topicName) 
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName];
      localStorage.setItem('examprep_completed_topics', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (currentView === 'syllabus') {
      const savedSyllabus = getSafeJSON(`examprep_syllabus_${exam}`, []);
      setSyllabusData(savedSyllabus);
      const savedCompleted = getSafeJSON('examprep_completed_topics', []);
      setCompletedTopics(savedCompleted);
    }
  }, [currentView, exam]);

  useEffect(() => {
    if (currentView === 'focus') {
      const savedStats = getSafeJSON('examprep_focus_stats', {});
      setDailyFocusStats(savedStats);
    }
  }, [currentView]);

  const toggleFocusMode = () => {
    if (isFocusActive) {
      // Stop focus mode
      setIsFocusActive(false);
      if (focusTimerRef.current) clearInterval(focusTimerRef.current);
      
      // Save stats
      const today = new Date().toISOString().split('T')[0];
      setDailyFocusStats(prev => {
        const updated = { ...prev };
        updated[today] = (updated[today] || 0) + focusTimeElapsed;
        localStorage.setItem('examprep_focus_stats', JSON.stringify(updated));
        return updated;
      });
      setFocusTimeElapsed(0);
      
      // Exit full screen if possible
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
    } else {
      // Start focus mode
      setIsFocusActive(true);
      setFocusTimeElapsed(0);
      focusTimerRef.current = setInterval(() => {
        setFocusTimeElapsed(prev => prev + 1);
      }, 1000);
      
      // Request full screen
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (focusTimerRef.current) clearInterval(focusTimerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChatImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() && !chatImage) return;
    
    const newUserMsg = { role: 'user', text: chatInput, image: chatImage };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setChatImage(null);
    setChatLoading(true);

    try {
      if (!ai) throw new Error("AI not initialized");
      
      const parts: any[] = [];
      if (chatImage) {
        const base64Data = chatImage.split(',')[1];
        const mimeType = chatImage.split(';')[0].split(':')[1];
        parts.push({ inlineData: { data: base64Data, mimeType } });
      }
      if (chatInput.trim()) {
        parts.push({ text: chatInput });
      }

      const contextText = chatMessages.map(m => `${m.role}: ${m.text}`).join('\n');
      parts.push({ text: `\n\nPrevious context:\n${contextText}\n\nYou are an expert, highly experienced human teacher for competitive exams. Answer the student's doubt clearly and concisely. Speak directly to the student as a human mentor would. DO NOT use conversational AI language (e.g., "As an AI", "I am an AI"). NEVER use $ or $$ signs for math equations or variables. Use plain text (e.g., x^2, a+b) or standard unicode characters. The $ sign causes formatting errors.` });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
      });

      setChatMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error processing your doubt.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#F8FAFC] text-slate-900 flex overflow-hidden font-sans relative selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-80 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 p-6 flex flex-col shrink-0 h-screen overflow-y-auto transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <GraduationCap size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">Exam Sarthi AI</h1>
              <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase mt-0.5">South Asian Exams</p>
            </div>
          </div>
          <button 
            className="md:hidden text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 flex-1">
          <div className="space-y-2 mb-6">
            <button 
              onClick={() => setCurrentView('main')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'main' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <BookOpen size={18} />
              Study Material
            </button>
            <button 
              onClick={() => setCurrentView('test')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'test' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Target size={18} />
              PYQ Test
            </button>
            <button 
              onClick={() => setCurrentView('mistakes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'mistakes' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <AlertTriangle size={18} />
              Mistake Tracker
            </button>
            <button 
              onClick={() => setCurrentView('planner')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'planner' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Calendar size={18} />
              Study Planner
            </button>
            <button 
              onClick={() => setCurrentView('quiz')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'quiz' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Newspaper size={18} />
              Daily Quiz
            </button>
            <button 
              onClick={() => setCurrentView('syllabus')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'syllabus' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <ListChecks size={18} />
              Syllabus Tracker
            </button>
            <button 
              onClick={() => setCurrentView('doubts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'doubts' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <MessageCircle size={18} />
              Doubt Solver
            </button>
            <button 
              onClick={() => setCurrentView('focus')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${currentView === 'focus' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Timer size={18} />
              Focus Timer
            </button>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Settings2 size={14} />
              <span>Exam Settings</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Target Exam</label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all hover:border-indigo-300 cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
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

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Subject (Optional)</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Physics, History, Quant..."
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all hover:border-indigo-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all hover:border-indigo-300 cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
              >
                <option value="Easy">Easy (Basic Concepts)</option>
                <option value="Medium">Medium (Standard Exam Level)</option>
                <option value="Hard">Hard (Advanced/Rank Deciding)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-6 relative z-10">
          {isLoggedIn ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                    <User size={18} />
                  </div>
                  <div className="text-sm font-bold text-slate-700 truncate max-w-[120px]">
                    {loggedInUser}
                  </div>
                </div>
                <button onClick={() => { setIsLoggedIn(false); setIsAdmin(false); setUserRole(''); setLoggedInUser(''); setCurrentView('main'); }} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Log out">
                  <LogOut size={18} />
                </button>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setCurrentView(currentView === 'admin' ? 'main' : 'admin')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <LayoutDashboard size={18} />
                  {currentView === 'admin' ? 'Back to App' : (userRole === 'admin' ? 'Admin Dashboard' : 'Analytics Dashboard')}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 font-semibold text-center bg-slate-50 py-2 rounded-lg border border-slate-100">
                Free generations left: <span className="text-indigo-600 font-extrabold text-sm ml-1">{Math.max(0, 2 - generationCount)}</span>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:from-slate-700 hover:to-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <User size={18} />
                Sign in / Sign up
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-1.5 rounded-lg text-white shadow-md shadow-indigo-500/20">
              <GraduationCap size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900">Exam Sarthi AI</h1>
          </div>
          <button 
            className="text-slate-600 p-2 -mr-2 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </header>

        {currentView === 'admin' ? (
          <AdminDashboard role={userRole} />
        ) : currentView === 'test' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                    <div className="bg-indigo-50 p-2 rounded-xl">
                      <Target size={24} className="text-indigo-600" />
                    </div>
                    Generate PYQ Test
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 font-medium ml-11">
                    Enter a topic to generate a 5-question test based strictly on Previous Year Questions.
                  </p>
                </div>

                <div className="space-y-5">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Thermodynamics, Indian Polity..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-[15px] font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGenerateTest();
                    }}
                  />
                  
                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleGenerateTest}
                      disabled={testLoading || !topic.trim()}
                      className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {testLoading ? (
                        <><Loader2 size={20} className="animate-spin" /> Generating Test...</>
                      ) : (
                        <><FileText size={20} /> Start Test</>
                      )}
                    </button>
                  </div>
                </div>
                
                {testError && (
                  <div className="mt-5 p-4 bg-red-50/80 backdrop-blur border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm font-medium shadow-sm">
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                    <p>{testError}</p>
                  </div>
                )}
              </div>

              {testQuestions.length > 0 && (
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500"></div>
                  
                  <div className="space-y-8">
                    {testQuestions.map((q, qIndex) => (
                      <div key={qIndex} className="space-y-4">
                        <div className="flex gap-3">
                          <span className="font-bold text-indigo-600 shrink-0">Q{qIndex + 1}.</span>
                          <h3 className="font-bold text-slate-800 text-lg">{q.question}</h3>
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-8 bg-slate-50 inline-block px-2 py-1 rounded-md border border-slate-100">
                          {q.year}
                        </div>
                        
                        <div className="space-y-3 ml-8">
                          {q.options.map((opt: string, oIndex: number) => {
                            const isSelected = userAnswers[qIndex] === oIndex;
                            const isCorrect = q.correctOptionIndex === oIndex;
                            const showCorrect = testSubmitted && isCorrect;
                            const showWrong = testSubmitted && isSelected && !isCorrect;
                            
                            let btnClass = "w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium text-[15px] flex items-center justify-between ";
                            if (showCorrect) {
                              btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                            } else if (showWrong) {
                              btnClass += "border-red-500 bg-red-50 text-red-800";
                            } else if (isSelected) {
                              btnClass += "border-indigo-500 bg-indigo-50 text-indigo-800";
                            } else {
                              btnClass += "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50";
                            }

                            return (
                              <button
                                key={oIndex}
                                disabled={testSubmitted}
                                onClick={() => setUserAnswers({...userAnswers, [qIndex]: oIndex})}
                                className={btnClass}
                              >
                                <span>{opt}</span>
                                {showCorrect && <CheckCircle size={20} className="text-emerald-500 shrink-0" />}
                                {showWrong && <XCircle size={20} className="text-red-500 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                        
                        {testSubmitted && (
                          <div className="ml-8 mt-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                            <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                              <BookOpen size={16} /> Explanation
                            </h4>
                            <p className="text-indigo-800/80 text-sm leading-relaxed">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!testSubmitted && (
                    <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={submitTest}
                        disabled={Object.keys(userAnswers).length !== testQuestions.length}
                        className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Submit Test
                      </button>
                    </div>
                  )}
                  
                  {testSubmitted && (
                    <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-lg font-bold text-slate-800">
                        Score: <span className="text-indigo-600">{Object.keys(userAnswers).filter(k => userAnswers[parseInt(k)] === testQuestions[parseInt(k)].correctOptionIndex).length}</span> / {testQuestions.length}
                      </div>
                      <button
                        onClick={() => {
                          setTestQuestions([]);
                          setUserAnswers({});
                          setTestSubmitted(false);
                          setTopic('');
                        }}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        Take Another Test
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : currentView === 'mistakes' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                    <div className="bg-red-50 p-2 rounded-xl">
                      <AlertTriangle size={24} className="text-red-600" />
                    </div>
                    Mistake Tracker
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 font-medium ml-11">
                    Review the questions you got wrong in your PYQ tests.
                  </p>
                </div>

                {mistakesList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No mistakes yet!</h3>
                    <p className="text-slate-500 mt-2">Take a PYQ test and any questions you get wrong will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mistakesList.map((mistake, idx) => (
                      <div key={mistake.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group">
                        <button 
                          onClick={() => deleteMistake(mistake.id)}
                          className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove from tracker"
                        >
                          <Trash2 size={18} />
                        </button>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{mistake.exam}</span>
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{mistake.subject}</span>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{mistake.topic}</span>
                        </div>
                        
                        <h3 className="font-bold text-slate-800 text-lg mb-4">{mistake.question}</h3>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                            <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Your Answer</div>
                            <div className="text-red-900 font-medium">{mistake.userAnswer}</div>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Correct Answer</div>
                            <div className="text-emerald-900 font-medium">{mistake.correctAnswer}</div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Explanation</div>
                          <p className="text-slate-700 text-sm leading-relaxed">{mistake.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : currentView === 'planner' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-xl">
                      <Calendar size={24} className="text-blue-600" />
                    </div>
                    Study Planner
                  </h2>
                  <p className="text-sm text-slate-500 mt-2 font-medium ml-11">
                    Generate a realistic, day-by-day study timetable.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Duration (Days)</label>
                    <input
                      type="number"
                      value={plannerDays}
                      onChange={(e) => setPlannerDays(e.target.value)}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Daily Study Hours</label>
                    <input
                      type="number"
                      value={plannerHours}
                      onChange={(e) => setPlannerHours(e.target.value)}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-sm font-semibold text-slate-700">Subjects or Topics to Cover</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Complete Physics syllabus, Modern History, Quantitative Aptitude..."
                    className="w-full min-h-[100px] rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-[15px] leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-y"
                  />
                </div>

                <button
                  onClick={handleGeneratePlanner}
                  disabled={plannerLoading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  {plannerLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Calendar size={18} />
                      Generate Timetable
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                    <AlertCircle size={18} className="shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
              </div>

              {plannerResult && (
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"></div>
                  <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-indigo-600 prose-strong:text-slate-900 prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-slate-400 prose-table:w-full prose-th:bg-slate-50 prose-th:p-3 prose-th:text-left prose-th:font-bold prose-th:text-slate-700 prose-td:p-3 prose-td:border-t prose-td:border-slate-200">
                    <Markdown>{plannerResult}</Markdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : currentView === 'quiz' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 md:p-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                      <div className="bg-emerald-50 p-2 rounded-xl">
                        <Newspaper size={24} className="text-emerald-600" />
                      </div>
                      Daily Current Affairs Quiz
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium ml-11">
                      Test your knowledge of recent events relevant to {exam}.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={quizLoading}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    {quizLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Generate New Quiz
                      </>
                    )}
                  </button>
                </div>

                {testError && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
                    <AlertCircle size={18} className="shrink-0" />
                    <p>{testError}</p>
                  </div>
                )}

                {quizQuestions.length > 0 && (
                  <div className="space-y-8 mt-8">
                    {quizQuestions.map((q, qIndex) => (
                      <div key={qIndex} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-slate-800">
                            <span className="text-emerald-600 mr-2">Q{qIndex + 1}.</span>
                            {q.question}
                          </h3>
                        </div>
                        
                        <div className="space-y-3">
                          {q.options.map((opt: string, oIndex: number) => {
                            const isSelected = quizAnswers[qIndex] === oIndex;
                            const isCorrect = q.correctOptionIndex === oIndex;
                            const showCorrect = quizSubmitted && isCorrect;
                            const showWrong = quizSubmitted && isSelected && !isCorrect;
                            
                            let btnClass = "w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium flex items-center justify-between ";
                            
                            if (showCorrect) {
                              btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                            } else if (showWrong) {
                              btnClass += "border-red-500 bg-red-50 text-red-800";
                            } else if (isSelected) {
                              btnClass += "border-emerald-500 bg-white text-emerald-700 shadow-sm";
                            } else {
                              btnClass += "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/30";
                            }

                            return (
                              <button
                                key={oIndex}
                                onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                                disabled={quizSubmitted}
                                className={btnClass}
                              >
                                <span>{String.fromCharCode(65 + oIndex)}. {opt}</span>
                                {showCorrect && <CheckCircle size={20} className="text-emerald-500" />}
                                {showWrong && <XCircle size={20} className="text-red-500" />}
                              </button>
                            );
                          })}
                        </div>
                        
                        {quizSubmitted && (
                          <div className="mt-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">
                              <BookOpen size={16} />
                              Explanation
                            </div>
                            <p className="text-slate-700 leading-relaxed text-sm">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {!quizSubmitted && Object.keys(quizAnswers).length === quizQuestions.length && (
                      <div className="flex justify-center pt-4">
                        <button
                          onClick={submitQuiz}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                        >
                          <Target size={20} />
                          Submit Quiz
                        </button>
                      </div>
                    )}
                    
                    {quizSubmitted && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                        <h3 className="text-2xl font-black text-emerald-800 mb-2">Quiz Completed!</h3>
                        <p className="text-emerald-600 font-medium mb-6">
                          You scored {quizQuestions.filter((q, i) => quizAnswers[i] === q.correctOptionIndex).length} out of {quizQuestions.length}
                        </p>
                        <button
                          onClick={handleGenerateQuiz}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md"
                        >
                          Try Another Quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : currentView === 'syllabus' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-8 pb-12">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 md:p-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                      <div className="bg-purple-50 p-2 rounded-xl">
                        <ListChecks size={24} className="text-purple-600" />
                      </div>
                      Syllabus Tracker
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium ml-11">
                      Track your progress for the {exam} exam.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleGenerateSyllabus}
                    disabled={syllabusLoading}
                    className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    {syllabusLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        {syllabusData.length > 0 ? 'Regenerate Syllabus' : 'Generate Syllabus'}
                      </>
                    )}
                  </button>
                </div>

                {syllabusData.length > 0 ? (
                  <div className="space-y-6 mt-8">
                    {syllabusData.map((subjectData, sIndex) => {
                      const subjectTopics = subjectData.topics || [];
                      const completedCount = subjectTopics.filter((t: string) => completedTopics.includes(`${subjectData.subject}-${t}`)).length;
                      const progress = subjectTopics.length > 0 ? Math.round((completedCount / subjectTopics.length) * 100) : 0;

                      return (
                        <div key={sIndex} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                          <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 text-lg">{subjectData.subject}</h3>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-slate-500">{progress}%</span>
                              <div className="w-24 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="p-5">
                            <ul className="space-y-3">
                              {subjectTopics.map((topicName: string, tIndex: number) => {
                                const topicId = `${subjectData.subject}-${topicName}`;
                                const isCompleted = completedTopics.includes(topicId);
                                return (
                                  <li key={tIndex} className="flex items-start gap-3">
                                    <button
                                      onClick={() => toggleTopicCompletion(topicId)}
                                      className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${isCompleted ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-300 hover:border-purple-400'}`}
                                    >
                                      {isCompleted && <CheckCircle size={14} />}
                                    </button>
                                    <span className={`text-sm ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                                      {topicName}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  !syllabusLoading && (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 mt-6">
                      <ListChecks size={48} className="mx-auto text-slate-300 mb-4" />
                      <h3 className="text-lg font-bold text-slate-700">No Syllabus Generated</h3>
                      <p className="text-slate-500 mt-2 max-w-md mx-auto">Click the button above to generate a detailed syllabus checklist for {exam}.</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ) : currentView === 'doubts' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth flex flex-col h-full">
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-white/50">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                  <div className="bg-orange-50 p-2 rounded-xl">
                    <MessageCircle size={24} className="text-orange-600" />
                  </div>
                  Doubt Solver
                </h2>
                <p className="text-sm text-slate-500 mt-2 font-medium ml-11">
                  Ask questions or upload a photo of a problem you're stuck on.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                    <MessageCircle size={48} className="text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">How can I help you today?</p>
                    <p className="text-sm text-slate-400 mt-1">Upload a photo or type your question below.</p>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'}`}>
                        {msg.role === 'user' ? <User size={16} /> : <BrainCircuit size={16} />}
                      </div>
                      <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                        {msg.image && (
                          <img src={msg.image} alt="Uploaded doubt" className="max-w-full rounded-lg mb-3 border border-slate-200/50" />
                        )}
                        {msg.text && (
                          <div className={msg.role === 'model' ? 'prose prose-sm max-w-none prose-p:leading-relaxed' : 'whitespace-pre-wrap'}>
                            {msg.role === 'model' ? <Markdown>{msg.text}</Markdown> : msg.text}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {chatLoading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <BrainCircuit size={16} />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-orange-500" />
                      <span className="text-sm text-slate-500 font-medium">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                {chatImage && (
                  <div className="mb-3 relative inline-block">
                    <img src={chatImage} alt="Preview" className="h-20 rounded-lg border border-slate-200" />
                    <button 
                      onClick={() => setChatImage(null)}
                      className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <div className="flex items-end gap-2 relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0"
                    title="Upload Image"
                  >
                    <ImageIcon size={20} />
                  </button>
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your doubt here..."
                    className="w-full max-h-32 min-h-[52px] rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-y"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={chatLoading || (!chatInput.trim() && !chatImage)}
                    className="p-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === 'focus' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth flex flex-col items-center justify-center">
            <div className="max-w-xl w-full space-y-8 pb-12 text-center">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-10 md:p-16 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-2 transition-all duration-1000 ${isFocusActive ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                
                <div className="mb-8">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${isFocusActive ? 'bg-emerald-100 text-emerald-600 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'bg-slate-100 text-slate-400'}`}>
                    <Timer size={48} className={isFocusActive ? 'animate-pulse' : ''} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                    {isFocusActive ? 'Focus Mode Active' : 'Ready to Focus?'}
                  </h2>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">
                    {isFocusActive 
                      ? "You are in full-screen focus mode. Stay concentrated on your studies." 
                      : "Start the timer to enter full-screen mode and track your study session."}
                  </p>
                </div>

                <div className="text-7xl font-black text-slate-800 tracking-tighter tabular-nums mb-10">
                  {formatTime(focusTimeElapsed)}
                </div>

                <button
                  onClick={toggleFocusMode}
                  className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 ${isFocusActive ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'}`}
                >
                  {isFocusActive ? (
                    <>Stop Session & Save</>
                  ) : (
                    <>Start Focus Session</>
                  )}
                </button>
                
                {!isFocusActive && (
                  <p className="text-xs text-slate-400 mt-6 font-medium">
                    Note: For technical reasons, we cannot block other apps on your device. This mode will enter full-screen to minimize distractions and track your study time.
                  </p>
                )}
              </div>

              {!isFocusActive && Object.keys(dailyFocusStats).length > 0 && (
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 text-left">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-indigo-500" />
                    Your Focus History
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(dailyFocusStats).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7).map(([date, seconds]) => (
                      <div key={date} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="font-semibold text-slate-700">
                          {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                          {formatTime(seconds)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8 pb-12">
            
            {/* Input Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 md:p-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="mb-6">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded-xl">
                    <BookOpen size={24} className="text-indigo-600" />
                  </div>
                  What do you want to study today?
                </h2>
                <p className="text-sm text-slate-500 mt-2 font-medium ml-11">
                  Enter a topic, concept, or specific question to generate comprehensive study material.
                </p>
              </div>

              <div className="space-y-5">
                <div className="relative group">
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Rotational Mechanics, Revolt of 1857, Time and Work..."
                    className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-[15px] leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-y transition-all group-hover:border-indigo-200"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleGenerate('full');
                      }
                    }}
                  />
                  <div className="absolute bottom-4 right-4 text-xs font-semibold text-slate-400 bg-white/80 backdrop-blur px-2 py-1 rounded-md border border-slate-100 pointer-events-none hidden sm:block">
                    Cmd/Ctrl + Enter
                  </div>
                </div>
                
                <div className="flex items-center justify-start sm:justify-end gap-2 overflow-x-auto pb-2 w-full snap-x">
                  <button
                    onClick={() => handleGenerate('full')}
                    disabled={loading || !topic.trim()}
                    className="shrink-0 snap-start inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Full Material
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleGenerate('pyq')}
                    disabled={loading || !topic.trim()}
                    className="shrink-0 snap-start inline-flex items-center justify-center gap-2.5 rounded-xl bg-white border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    PYQ
                  </button>
                  <button
                    onClick={() => handleGenerate('practice')}
                    disabled={loading || !topic.trim()}
                    className="shrink-0 snap-start inline-flex items-center justify-center gap-2.5 rounded-xl bg-white border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Practice Qs
                  </button>
                  <button
                    onClick={() => handleGenerate('pyq_practice')}
                    disabled={loading || !topic.trim()}
                    className="shrink-0 snap-start inline-flex items-center justify-center gap-2.5 rounded-xl bg-white border border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    PYQ + Practice
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="mt-5 p-4 bg-red-50/80 backdrop-blur border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm font-medium shadow-sm">
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Output Section */}
            {(result || loading) && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 md:p-10 min-h-[400px] relative overflow-hidden">
                {/* Decorative top gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500"></div>
                
                {result && !loading && (
                  <div className="flex flex-wrap justify-end gap-3 mb-6">
                    <button
                      onClick={handleGenerateFlashcards}
                      disabled={flashcardsLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    >
                      {flashcardsLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Layers size={16} className="text-indigo-500" />
                          Generate Flashcards
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleELI5}
                      disabled={eli5Loading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isEli5Mode ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {eli5Loading ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Simplifying...
                        </>
                      ) : isEli5Mode ? (
                        <>
                          <BookOpen size={16} />
                          Show Original
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} className="text-amber-500" />
                          Explain Like I'm 5
                        </>
                      )}
                    </button>
                  </div>
                )}

                {result ? (
                  <div className={`prose max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h1:tracking-tight prose-h2:text-2xl prose-h2:tracking-tight prose-h3:text-xl prose-a:font-semibold prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-semibold prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900 prose-pre:shadow-lg prose-pre:rounded-2xl ${isEli5Mode ? 'prose-amber prose-a:text-amber-600 prose-code:text-amber-700 prose-code:bg-amber-50/80 prose-li:marker:text-amber-500' : 'prose-slate prose-indigo prose-a:text-indigo-600 prose-code:text-indigo-700 prose-code:bg-indigo-50/80 prose-li:marker:text-indigo-500'}`}>
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
                      {isEli5Mode ? eli5Result : result}
                    </Markdown>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-5 py-24">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
                      <Loader2 size={48} className="animate-spin text-indigo-600 relative z-10" />
                    </div>
                    <p className="text-sm font-bold tracking-wide text-slate-500 animate-pulse">Analyzing syllabus and generating content...</p>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
        )}

        {/* Flashcards Modal */}
        {showFlashcards && flashcards.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Layers className="text-indigo-600" size={24} />
                  Study Flashcards
                </h3>
                <button 
                  onClick={() => setShowFlashcards(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-50/50 overflow-y-auto">
                <div 
                  className="w-full max-w-lg aspect-[3/2] perspective-1000 cursor-pointer group"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-2xl shadow-md border border-slate-200 p-8 flex flex-col items-center justify-center text-center group-hover:shadow-lg transition-shadow">
                      <div className="absolute top-4 left-4 text-xs font-bold text-indigo-400 uppercase tracking-widest">Front</div>
                      <h4 className="text-2xl font-bold text-slate-800 leading-tight">
                        {flashcards[currentCardIndex]?.front}
                      </h4>
                      <div className="absolute bottom-4 text-xs font-medium text-slate-400 flex items-center gap-1">
                        <RotateCcw size={14} /> Click to flip
                      </div>
                    </div>
                    
                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden bg-indigo-600 rounded-2xl shadow-md border border-indigo-500 p-8 flex flex-col items-center justify-center text-center rotate-y-180">
                      <div className="absolute top-4 left-4 text-xs font-bold text-indigo-300 uppercase tracking-widest">Back</div>
                      <p className="text-xl font-medium text-white leading-relaxed">
                        {flashcards[currentCardIndex]?.back}
                      </p>
                      <div className="absolute bottom-4 text-xs font-medium text-indigo-300 flex items-center gap-1">
                        <RotateCcw size={14} /> Click to flip
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full max-w-lg mt-8">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsFlipped(false); setCurrentCardIndex(prev => Math.max(0, prev - 1)); }}
                    disabled={currentCardIndex === 0}
                    className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  
                  <div className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    {currentCardIndex + 1} / {flashcards.length}
                  </div>
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsFlipped(false); setCurrentCardIndex(prev => Math.min(flashcards.length - 1, prev + 1)); }}
                    disabled={currentCardIndex === flashcards.length - 1}
                    className="p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Footer */}
        <footer className="py-4 px-6 text-center text-xs font-medium text-slate-400 border-t border-slate-200/60 bg-white/50 backdrop-blur shrink-0 z-10">
          <p>Exam Sarthi AI can make mistakes. Please verify important information with official sources.</p>
          <p className="mt-1">Built by <span className="font-bold text-slate-700">RUTVIK</span></p>
        </footer>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {isSignUp ? 'Create an account' : 'Sign in to Exam Sarthi AI'}
              </h3>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-700 bg-white p-2 rounded-full shadow-sm border border-slate-100 transition-all hover:scale-105">
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <p className="text-sm text-slate-500 mb-6">
                {generationCount >= 2 
                  ? "You've reached your free limit of 2 generations. Please sign in or create an account to continue generating unlimited study materials."
                  : "Sign in or create an account to save your progress and get unlimited generations."}
              </p>
              <form onSubmit={handleLogin} className="space-y-5">
                {isSignUp && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-violet-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Lock size={18} />
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>
                
                <div className="text-center mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
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
