"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  LayoutDashboard, 
  Clock, 
  Download, 
  Zap, 
  ArrowUpRight, 
  MessageSquare,
  Mic,
  AlertCircle,
  Briefcase,
  User,
  LogOut,
  ChevronRight,
  Plus
} from 'lucide-react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  ResponsiveContainer, 
  LineChart, Line,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import WindsurfLogo from '@/components/WindsurfLogo';
import { auth, googleProvider } from '@/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';

const BUILDING_MESSAGES = [
  "Scoping Content Performance...",
  "Analyzing Video Categories...",
  "Calculating Engagement Rates...",
  "Visualizing Audience Trends...",
  "Almost Ready..."
];

const GREETINGS = [
  "Welcome back, Captain",
  "Ready to surf your data?",
  "Analyze performance in real-time",
  "Insights are waiting for you"
];

function LogoutConfirmationModal({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001, backdropFilter: 'blur(8px)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: '400px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '32px', color: '#fff', textAlign: 'center' }}
      >
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#ef4444' }}>
          <LogOut size={28} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Are you sure?</h2>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px', lineHeight: 1.5 }}>You will need to sign in again to access your account.</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '12px', borderRadius: '14px', background: '#ef4444', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Logout</button>
        </div>
      </motion.div>
    </div>
  );
}

function AutoLogoutWarningModal({ onStay, onLogout, countdown }: { onStay: () => void, onLogout: () => void, countdown: number }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001, backdropFilter: 'blur(8px)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '420px', background: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px', color: '#fff', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
      >
        <div style={{ background: 'rgba(255, 165, 0, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#ffa500' }}>
          <Clock size={36} className="animate-pulse" />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>Session Expiring</h2>
        <p style={{ fontSize: '15px', color: '#b4b4b4', marginBottom: '8px', lineHeight: 1.6 }}>
          Your session is about to expire due to inactivity.
        </p>
        <p style={{ fontSize: '15px', color: '#fff', fontWeight: 600, marginBottom: '32px' }}>
          You will be logged out in <span style={{ color: '#ffa500', fontSize: '18px' }}>{countdown}</span> seconds.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={onStay} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#fff', border: 'none', color: '#000', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s' }}>Stay Signed In</button>
          <button onClick={onLogout} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#b4b4b4', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Logout Now</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function WindsurfApp() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const router = useRouter();
  
  // Sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const isResizing = useRef(false);

  // App States
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [showBuildPrompt, setShowBuildPrompt] = useState(false);
  const [resultDashboard, setResultDashboard] = useState<string | null>(null);
  const [dynamicDashboard, setDynamicDashboard] = useState<any>(null);
  const [isLightMode, setIsLightMode] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [buildStep, setBuildStep] = useState(0);
  const [greeting, setGreeting] = useState("");

  // Logout States
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAutoLogoutWarning, setShowAutoLogoutWarning] = useState(false);
  const [autoLogoutCountdown, setAutoLogoutCountdown] = useState(30);
  
  const INACTIVITY_LIMIT = 5 * 60 * 1000;
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthenticated(!!user);
      setIsAuthChecking(false);
    });

    // Check for guest mode
    if (typeof window !== 'undefined') {
      const guest = localStorage.getItem('windsurf_guest_mode') === 'true';
      setIsGuest(guest);
    }

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBuilding) {
      interval = setInterval(() => {
        setBuildStep(prev => (prev + 1) % BUILDING_MESSAGES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isBuilding]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    // Check auth or guest
    if (!isAuthenticated && !isGuest) {
      router.push('/auth');
      return;
    }

    setIsAnalyzing(true);
    setResultDashboard(null);
    setDynamicDashboard(null);
    setError(false);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/dashboard', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ query, checkOnly: true })
      });
      const apiInfo = await response.json();
      setIsAnalyzing(false);
      if (response.ok) setShowBuildPrompt(true);
      else {
        setError(true);
        setErrorMessage(apiInfo.error || "I'm not sure how to build a dashboard for that query.");
      }
    } catch (err) {
      setIsAnalyzing(false);
      setError(true);
      setErrorMessage("Service is temporarily unreachable.");
    }
  };

  const handleProceedBuilding = async () => {
    setShowBuildPrompt(false);
    setIsBuilding(true);
    try {
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const apiInfo = await response.json();
      if (!response.ok) {
        setIsBuilding(false);
        setError(true);
        setErrorMessage(apiInfo.error || "Failed to generate dashboard.");
        return;
      }
      setDynamicDashboard(apiInfo);
      setIsBuilding(false);
      setResultDashboard("dynamic");
      setIsLightMode(true); // Switch to the premium light dashboard
    } catch (err) {
      setIsBuilding(false);
      setError(true);
      setErrorMessage("Critial error while building dashboard.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setIsGuest(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('windsurf_guest_mode');
    }
    setShowLogoutConfirm(false);
    setShowAutoLogoutWarning(false);
    setResultDashboard(null);
  };

  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  useEffect(() => {
    if (resultDashboard) {
      setLastRefreshed(new Date().toLocaleTimeString());
    }
  }, [resultDashboard]);

  const downloadChartData = (chart: any) => {
    const headers = Object.keys(chart.data[0] || {}).join(',');
    const rows = (chart.data || []).map((row: any) => Object.values(row).join(',')).join('\n');
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chart.title.replace(/\s+/g, '_')}.csv`;
    a.click();
  };
  const triggerManualLogout = () => setShowLogoutConfirm(true);

  const resetInactivity = useCallback(() => {
    lastActivity.current = Date.now();
    if (showAutoLogoutWarning) {
      setShowAutoLogoutWarning(false);
      setAutoLogoutCountdown(30);
    }
  }, [showAutoLogoutWarning]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetInactivity));
    return () => events.forEach(event => window.removeEventListener(event, resetInactivity));
  }, [isAuthenticated, resetInactivity]);

  const startResizing = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX;
    if (newWidth > 180 && newWidth < 480) setSidebarWidth(newWidth);
  };
  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
  };

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "User";

  return (
    <div className="app-container" style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex' }}>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '72px', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <WindsurfLogo size={28} />
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px' }}>Windsurf</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {isAuthenticated || isGuest ? (
            <div onClick={triggerManualLogout} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #a497f6 0%, #7669d0 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(164,151,246,0.3)' }}>
              {isGuest ? 'G' : currentUser?.email?.[0].toUpperCase()}
            </div>
          ) : (
            <button 
              onClick={() => router.push('/auth')}
              style={{ padding: '8px 20px', borderRadius: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {isAuthenticated && resultDashboard && resultDashboard !== "dynamic" && (
        <aside className="cg-sidebar" style={{ width: `${sidebarWidth}px`, flexShrink: 0, position: 'relative', marginTop: '72px' }}>
          <div className="cg-sidebar-header">
            <div className="cg-sidebar-section">NAVIGATION</div>
            <div className="cg-sidebar-item active"><LayoutDashboard size={18} /><span>Current Analysis</span></div>
            <div className="cg-sidebar-item"><Clock size={18} /><span>History</span></div>
          </div>
          <div className="cg-chat-list">
             <div className="cg-sidebar-section">PROJECTS</div>
             <div className="cg-sidebar-item secondary"><Briefcase size={16} /><span>Windsurf Master</span></div>
          </div>
          <div className="cg-sidebar-footer">
            <div className="cg-profile" onClick={triggerManualLogout}>
              <div className="cg-avatar">{currentUser?.email?.[0].toUpperCase()}</div>
              <div><div style={{ fontSize: '13px', fontWeight: 600 }}>{displayName}</div><div style={{ fontSize: '11px', color: '#888' }}>Plus Member</div></div>
            </div>
          </div>
          <div className="sidebar-resizer" onMouseDown={startResizing} />
        </aside>
      )}

      <main className="cg-main" style={{ flex: 1, paddingTop: '72px', overflowY: 'auto' }}>
        <div className="cg-content" style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* 1. HERO SECTION */}
          {!isAnalyzing && !isBuilding && !resultDashboard && !showBuildPrompt && (
            <motion.div key="landing-hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} style={{ textAlign: 'center', marginBottom: '60px', marginTop: '40px' }}>
              <h1 style={{ fontSize: '72px', fontWeight: 800, letterSpacing: '-3px', marginBottom: '24px', lineHeight: '1.05', maxWidth: '900px', margin: '0 auto 24px', background: 'linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Ask business questions. Get instant dashboards.
              </h1>
              <p style={{ fontSize: '24px', color: '#888', marginBottom: '0', maxWidth: '600px', margin: '0 auto', fontWeight: 400, lineHeight: '1.5' }}>Built for non-technical leaders.</p>
            </motion.div>
          )}

          {/* 2. SEARCH BAR */}
          <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto 60px', transition: 'all 0.5s ease' }}>
            <div className="cg-input-container" style={{ position: 'relative', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', alignItems: 'center', display: 'flex' }}>
              <textarea 
                placeholder='Ask business questions...' className="cg-input" value={query}
                onChange={(e) => { setQuery(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSearch(); } }}
                rows={1} style={{ resize: 'none', background: 'transparent', border: 'none', flex: 1, color: '#fff', fontSize: '18px', outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: '16px' }}>
                <Mic size={22} style={{ color: '#888', cursor: 'pointer' }} />
                <button onClick={() => handleSearch()} style={{ background: query ? '#fff' : 'rgba(255,255,255,0.05)', color: query ? '#000' : '#444', border: 'none', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <ArrowUpRight size={24} />
                </button>
              </div>
            </div>

            {/* 3. PROMPT CHIPS */}
            {!resultDashboard && !isAnalyzing && !isBuilding && !showBuildPrompt && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '24px' }}>
                {[
                  "Which category has the highest views?",
                  "Compare likes vs views by language",
                  "Views trend for the last 12 months",
                  "Engagement score by region",
                  "Top 5 most shared videos"
                ].map((s, i) => (
                  <button key={i} onClick={() => { setQuery(s); handleSearch(); }} className="cg-suggestion-chip" style={{ fontSize: '12.5px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: '100px', color: '#888', cursor: 'pointer' }}>{s}</button>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px' }}>
                <div className="animate-spin" style={{ width: '48px', height: '48px', border: '3px solid rgba(164, 151, 246, 0.1)', borderTopColor: '#a497f6', borderRadius: '50%', margin: '0 auto 24px' }} />
                <p style={{ color: '#a497f6', fontWeight: 600, letterSpacing: '0.1em', fontSize: '14px' }}>PARSING REQUEST & ANALYZING SCHEMA...</p>
              </motion.div>
            )}

            {showBuildPrompt && (
              <motion.div key="prompt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '64px', background: 'rgba(164, 151, 246, 0.02)', border: '1px solid rgba(164, 151, 246, 0.1)', borderRadius: '40px', maxWidth: '640px', margin: '0 auto 60px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(164, 151, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a497f6', margin: '0 auto 32px' }}><LayoutDashboard size={40} /></div>
                <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Dashboard Ready to Build</h3>
                <p style={{ color: '#888', marginBottom: '40px', fontSize: '18px', lineHeight: '1.6' }}>I've processed the logic for your query. Ready to generate visualizations?</p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                  <button onClick={handleProceedBuilding} style={{ padding: '16px 48px', borderRadius: '18px', background: '#fff', color: '#000', border: 'none', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>Build Dashboard</button>
                  <button onClick={() => setShowBuildPrompt(false)} style={{ padding: '16px 32px', borderRadius: '18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>Wait</button>
                </div>
              </motion.div>
            )}

            {isBuilding && (
              <motion.div key="building" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '100px 0' }}>
                 <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 40px' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(164, 151, 246, 0.05)', borderTopColor: '#a497f6' }} className="animate-spin" />
                    <div style={{ position: 'absolute', inset: '15px', borderRadius: '50%', border: '4px solid rgba(255, 255, 255, 0.03)', borderBottomColor: '#fff', animationDuration: '2.5s' }} className="animate-spin" />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a497f6' }}><Sparkles size={32} /></div>
                 </div>
                 <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>{BUILDING_MESSAGES[buildStep]}</h2>
              </motion.div>
            )}

            {resultDashboard === "dynamic" && dynamicDashboard && (
              <motion.div 
                key="result" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.3 }}
                style={{ 
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: '#f4f6fa', 
                  padding: '30px 50px', 
                  color: '#1a1a2e',
                  zIndex: 9999,
                  overflowY: 'auto',
                  fontFamily: "'Inter', sans-serif"
                }}>

                {/* ── HEADER ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{dynamicDashboard.title}</h2>
                    <p style={{ color: '#8e8ea0', fontSize: '13px', margin: '4px 0 0' }}>Windsurf AI • {lastRefreshed}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setIsLightMode(false); setDynamicDashboard(null); setResultDashboard(null); }} style={{ padding: '8px 18px', borderRadius: '10px', background: '#fff', border: '1px solid #e0e0e0', color: '#333', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>✕ Close</button>
                    <button onClick={() => window.print()} style={{ padding: '8px 18px', borderRadius: '10px', background: '#4318ff', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={14} /> Export</button>
                  </div>
                </div>

                {/* ── SUMMARY ── */}
                <div style={{ background: '#fff', borderRadius: '14px', padding: '20px 24px', marginBottom: '20px', border: '1px solid #eee' }}>
                  <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.6, margin: 0 }}><strong style={{ color: '#4318ff' }}>Summary:</strong> {dynamicDashboard.summary}</p>
                </div>

                {/* ── METRICS ── */}
                {dynamicDashboard.metrics && dynamicDashboard.metrics.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(dynamicDashboard.metrics.length, 4)}, 1fr)`, gap: '16px', marginBottom: '24px' }}>
                    {dynamicDashboard.metrics.map((m: any, idx: number) => (
                      <div key={idx} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #eee' }}>
                        <p style={{ color: '#8e8ea0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>{m.label}</p>
                        <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>{m.value}</h3>
                        {m.change && (
                          <span style={{ fontSize: '12px', fontWeight: 600, color: m.trend === 'up' ? '#22c55e' : '#ef4444', marginTop: '6px', display: 'inline-block' }}>
                            {m.trend === 'up' ? '↑' : '↓'} {m.change}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* ── AI INSIGHTS ── */}
                {dynamicDashboard.insights && dynamicDashboard.insights.length > 0 && (
                  <div style={{ background: '#fff', borderRadius: '14px', padding: '20px 24px', marginBottom: '24px', border: '1px solid #eee' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#4318ff', textTransform: 'uppercase', margin: '0 0 14px', letterSpacing: '0.04em' }}>AI Insights</h4>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {dynamicDashboard.insights.map((insight: string, idx: number) => (
                        <li key={idx} style={{ fontSize: '13px', color: '#444', lineHeight: 1.5, paddingLeft: '16px', borderLeft: '3px solid #4318ff' }}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ── CHARTS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: dynamicDashboard.charts?.length === 1 ? '1fr' : 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
                  {dynamicDashboard.charts?.map((chart: any, i: number) => {
                    // Normalize data: convert string numbers to real numbers
                    const normalizedData = (chart.data || []).map((row: any) => {
                      const newRow: any = {};
                      for (const [key, val] of Object.entries(row)) {
                        const num = Number(val);
                        newRow[key] = val !== '' && val !== null && !isNaN(num) && typeof val !== 'boolean' ? num : val;
                      }
                      return newRow;
                    });
                    const isSingleRow = normalizedData.length === 1;
                    const effectiveType = isSingleRow ? 'bar' : chart.chartType;
                    // Find the right data key: prefer yAxisKey, then find any numeric column
                    const getDataKey = () => {
                      if (chart.yAxisKey && normalizedData[0] && chart.yAxisKey in normalizedData[0]) return chart.yAxisKey;
                      if (!normalizedData[0]) return '';
                      return Object.keys(normalizedData[0]).find(k => k !== chart.xAxisKey && typeof normalizedData[0][k] === 'number') || Object.keys(normalizedData[0]).find(k => k !== chart.xAxisKey) || '';
                    };

                    return (
                      <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #eee', position: 'relative' }}>
                        <button onClick={() => downloadChartData(chart)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }} title="Download CSV"><Download size={16} /></button>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' }}>{chart.title}</h4>
                        <p style={{ fontSize: '12px', color: '#8e8ea0', margin: '0 0 20px' }}>{chart.description}</p>
                        <div style={{ height: '300px', width: '100%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            {effectiveType === 'pie' || effectiveType === 'donut' ? (
                              <PieChart>
                                <Pie data={normalizedData} innerRadius={effectiveType === 'donut' ? 50 : 0} outerRadius={90} paddingAngle={4} dataKey={getDataKey()} nameKey={chart.xAxisKey}>
                                  {normalizedData.map((_: any, index: number) => (
                                    <Cell key={index} fill={['#4318ff','#22c55e','#f59e0b','#ef4444','#6ad2ff','#8b5cf6'][index % 6]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            ) : effectiveType === 'bar' ? (
                              <BarChart data={normalizedData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey={chart.xAxisKey} stroke="#999" fontSize={11} tickLine={false} />
                                <YAxis stroke="#999" fontSize={11} />
                                <Tooltip />
                                <Bar dataKey={getDataKey()} fill="#4318ff" radius={[6, 6, 0, 0]} />
                              </BarChart>
                            ) : (
                              <LineChart data={normalizedData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey={chart.xAxisKey} stroke="#999" fontSize={11} tickLine={false} />
                                <YAxis stroke="#999" fontSize={11} />
                                <Tooltip />
                                <Line type="monotone" dataKey={getDataKey()} stroke="#4318ff" strokeWidth={2} dot={{ r: 3 }} />
                              </LineChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── SQL ── */}
                <details style={{ marginBottom: '40px' }}>
                  <summary style={{ fontSize: '12px', fontWeight: 600, color: '#999', cursor: 'pointer' }}>Show SQL Query</summary>
                  <pre style={{ fontSize: '11px', color: '#555', background: '#fff', padding: '16px', borderRadius: '10px', marginTop: '10px', border: '1px solid #eee', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{dynamicDashboard.sql}</pre>
                </details>

              </motion.div>
            )}

            {error && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '32px', maxWidth: '600px', margin: '0 auto 60px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#ef4444' }}><AlertCircle size={32} /></div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>Analysis Interrupted</h3>
                <p style={{ color: '#888', fontSize: '16px', marginBottom: '32px' }}>{errorMessage || "Error processing request."}</p>
                <button onClick={() => setError(false)} style={{ padding: '12px 32px', borderRadius: '14px', background: '#fff', color: '#000', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Try Again</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. WORKFLOW STRIP */}
          {!resultDashboard && !isAnalyzing && !isBuilding && !showBuildPrompt && (
            <div style={{ width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginTop: '100px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '80px' }}>
              {[
                { icon: <MessageSquare size={24} />, title: "Ask", desc: "Type in plain English" },
                { icon: <Zap size={24} />, title: "Analyze", desc: "AI builds logic instantly" },
                { icon: <LayoutDashboard size={24} />, title: "Visualize", desc: "Interactive dashboards" }
              ].map((step, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(164, 151, 246, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a497f6', margin: '0 auto 24px' }}>{step.icon}</div>
                  <h4 style={{ fontWeight: 700, fontSize: '18px', color: '#fff', marginBottom: '8px' }}>{step.title}</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* 5b. HACKATHON ROADMAP */}
          {!resultDashboard && !isAnalyzing && !isBuilding && !showBuildPrompt && (
            <div style={{ width: '100%', maxWidth: '1000px', marginTop: '140px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(164, 151, 246, 0.1)', border: '1px solid rgba(164, 151, 246, 0.2)', borderRadius: '100px', color: '#a497f6', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>
                <Clock size={14} /> Hackathon Journey
              </div>
              <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '60px' }}>Building the future of Data.</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {[
                  { phase: "PHASE 01", title: "Foundation", items: ["Groq Llama-3.3 Core", "YouTube 80MB Dataset", "Metric Scorecards"], status: "DONE" },
                  { phase: "PHASE 02", title: "Scale", items: ["Live Data Webhooks", "Team Collaboration", "Multi-Account Sync"], status: "UPCOMING" },
                  { phase: "PHASE 03", title: "Intelligence", items: ["Predictive Forecasting", "AI Voice Commands", "Global Region Auto-Detect"], status: "UPCOMING" }
                ].map((p, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px', padding: '40px', textAlign: 'left', position: 'relative' }}>
                    <div style={{ fontSize: '12px', color: p.status === 'DONE' ? '#4ade80' : '#888', fontWeight: 800, marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{p.phase}</span>
                      <span style={{ fontSize: '10px', background: p.status === 'DONE' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{p.status}</span>
                    </div>
                    <h4 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>{p.title}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       {p.items.map((it, j) => (
                         <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', fontSize: '14px' }}>
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: p.status === 'DONE' ? '#a497f6' : '#222' }} />
                            {it}
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. BIG FOOTER */}
          {!resultDashboard && !isAnalyzing && !isBuilding && !showBuildPrompt && (
            <footer style={{ 
              width: '100vw', 
              marginLeft: 'calc(-50vw + 50%)', 
              background: '#000', 
              minHeight: '100vh', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderTop: '1px solid rgba(255,255,255,0.05)' 
            }}>
              <div style={{ maxWidth: '1200px', width: '100%', textAlign: 'center' }}>
                 <p style={{ color: '#a497f6', fontSize: '14px', letterSpacing: '0.6em', textTransform: 'uppercase', fontWeight: 900, marginBottom: '32px', opacity: 0.8 }}>Surf your data in seconds</p>
                 <h1 style={{ fontSize: '240px', fontWeight: 900, color: '#fff', margin: '0 0 60px 0', opacity: 1, textTransform: 'uppercase', letterSpacing: '-15px', lineHeight: 0.8 }}>Windsurf</h1>
                 <p style={{ color: '#444', letterSpacing: '0.5em', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase' }}>
                    © All rights researv at 2026 • Windsurf AI
                 </p>
              </div>
            </footer>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showLogoutConfirm && <LogoutConfirmationModal onConfirm={handleLogout} onCancel={() => setShowLogoutConfirm(false)} />}
        {showAutoLogoutWarning && <AutoLogoutWarningModal onStay={resetInactivity} onLogout={handleLogout} countdown={autoLogoutCountdown} />}
      </AnimatePresence>
    </div>
  );
}
