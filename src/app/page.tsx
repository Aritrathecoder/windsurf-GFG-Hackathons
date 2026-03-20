'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, Search, Image as ImageIcon, 
  LayoutGrid, Globe, Terminal, FolderOpen, Briefcase, 
  MapPin, UserSquare, Gift, ChevronDown, Mic, AudioLines, Edit,
  EyeOff, Mail, Phone, Play, PlayCircle, Podcast, Video
} from 'lucide-react';
import Link from 'next/link';

const GREETINGS = [
  "Hey, gaurav. Ready to dive in?",
  "Welcome back, gaurav. What's on your mind?",
  "Hello, gaurav. How can I help today?",
  "Greetings, gaurav. Let's build something!",
  "Hey there, gaurav. Let's windsurf!"
];

function AuthScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-logo">
          <AudioLines size={24} /> WINDSURF
        </div>
        
        <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <div className="auth-mock-ui">
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
              <div style={{ color: '#000', fontWeight: 600, display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Mic size={16} /> Text to Speech
              </div>
              <div style={{ color: '#999', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <FolderOpen size={16} /> Upload File
              </div>
            </div>
            <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
              Unlock the power of intelligent voice technology through interactive learning projects. Learn the core AI skills behind speech recognition, natural language processing, and smart voice experiences.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#f0f4ff', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, color: '#333' }}>
                <Video size={14} color="#4a72ff" /> YouTube
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '8px 12px', fontSize: '12px', color: '#666' }}>
                <PlayCircle size={14} /> Narration
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '8px 12px', fontSize: '12px', color: '#666' }}>
                <Podcast size={14} /> Podcast
              </div>
            </div>
          </div>
        </div>

        <h1 className="auth-hero-text">
          One Click Away from<br />Studio-Grade Voice
        </h1>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">Create an Account</h2>
          <p className="auth-subtitle">You are few moments away from getting started!</p>

          <label className="auth-checkbox-group">
            <input type="checkbox" defaultChecked style={{ accentColor: '#000', width: '16px', height: '16px' }} />
            Send me tips, updates and offers
          </label>

          <div className="auth-input-group">
            <label className="auth-label">Email</label>
            <input type="email" placeholder="Enter your email" className="auth-input" />
          </div>

          <div className="auth-input-group" style={{ position: 'relative' }}>
            <label className="auth-label">Password</label>
            <input type="password" placeholder="•••••••••" className="auth-input" style={{ paddingRight: '40px' }} />
            <EyeOff size={18} color="#ccc" style={{ position: 'absolute', right: '12px', bottom: '12px', cursor: 'pointer' }} />
          </div>

          <p className="auth-disclaimer">
            By signing up, you accept Windsurf <strong>privacy policy</strong> and <strong>terms of service</strong>.
          </p>

          <button className="auth-btn" onClick={onLogin}>Sign up</button>

          <div className="auth-divider">or</div>

          <button className="auth-social-btn" onClick={onLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <button className="auth-social-btn" onClick={onLogin}>
            <Phone size={18} color="#555" />
            Continue with Phone Number
          </button>

          <p className="auth-footer-link">
            Already have an account? <a>Log In</a>
          </p>
          <p className="auth-footer-link" style={{ marginTop: '12px' }}>
            <a onClick={onLogin} style={{ color: '#666', borderBottom: '1px dashed #ccc' }}>Or open as guest mode</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChatGPTReplica() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [greeting, setGreeting] = useState("Hey, gaurav. Ready to dive in?");
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const isResizing = useRef(false);

  useEffect(() => {
    setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  }, []);

  const startResizing = useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    if (isResizing.current) {
      isResizing.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing.current) {
      const newWidth = Math.max(200, Math.min(600, e.clientX));
      setSidebarWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  if (!isAuthenticated) {
    return <AuthScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="cg-sidebar" style={{ width: `${sidebarWidth}px`, flexShrink: 0, position: 'relative' }}>
        <div className="cg-sidebar-header">
          <div className="cg-sidebar-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <svg width="18" height="18" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M 5 35 L 35 35 L 55 75 L 40 75 L 25 45 L 5 45 Z" />
                  <path d="M 40 35 L 55 35 L 75 75 L 60 75 Z" />
                  <path d="M 60 35 L 90 35 L 80 55 L 70 55 Z" />
                </svg>
              </div>
            </div>
            <div className="cg-icon-btn active" style={{ width: '24px', height: '24px' }}>
              <Edit size={14} style={{ fill: '#000', color: '#fff' }} />
            </div>
          </div>
          <div className="cg-sidebar-item"><Edit size={16} /> New chat</div>
          <div className="cg-sidebar-item"><Search size={16} /> Search chats</div>
          <div className="cg-sidebar-item"><ImageIcon size={16} /> Images</div>
          <div className="cg-sidebar-item"><LayoutGrid size={16} /> Apps</div>
          <div className="cg-sidebar-item"><Globe size={16} /> Deep research</div>
          <div className="cg-sidebar-item"><Terminal size={16} /> Codex</div>
        </div>

        <div className="cg-chat-list">
          <div className="cg-sidebar-section">Projects</div>
          <div className="cg-sidebar-item secondary"><FolderOpen size={16} /> New project</div>
          <div className="cg-sidebar-item secondary"><FolderOpen size={16} /> portfolio projects</div>
          <div className="cg-sidebar-item secondary"><Briefcase size={16} /> Business I</div>
          <div className="cg-sidebar-item secondary" style={{ color: '#dcfce7' }}><MapPin size={16} /> Travel</div>
          
          <div className="cg-sidebar-section" style={{ marginTop: '16px' }}>Group chats</div>
          <div className="cg-sidebar-item secondary" style={{ justifyContent: 'space-between' }}>
            <span>Upgrading AI models</span>
            <UserSquare size={16} style={{ opacity: 0.5 }} />
          </div>

          <div className="cg-sidebar-section" style={{ marginTop: '16px' }}>Your chats</div>
          <div className="cg-sidebar-item secondary">Hero Image Feedback</div>
          <div className="cg-sidebar-item secondary">Where to watch UCL</div>
          <div className="cg-sidebar-item secondary">Best phone upgrade options</div>
          <div className="cg-sidebar-item secondary" style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>CMF Buds 2 Plus vs OnePlus Bud...</div>
          <div className="cg-sidebar-item secondary">Boosting Social Media Reach</div>
        </div>

        <div className="cg-sidebar-footer">
          <div className="cg-profile">
            <img src="https://ui-avatars.com/api/?name=Gaurav&background=random" className="cg-avatar" alt="User Profile Avatar" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Gaurav</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Free</span>
            </div>
          </div>
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
            <button className="cg-claim-btn" style={{ marginTop: '8px', width: 'calc(100% - 24px)' }}>
              <Gift size={14} /> Claim offer
            </button>
          </Link>
        </div>

        {/* Resizer Handle */}
        <div 
          className="sidebar-resizer"
          onMouseDown={startResizing}
        />
      </aside>

      {/* Main Container */}
      <main className="cg-main">
        {/* Navbar */}
        <header className="cg-navbar">
          <div className="cg-nav-left">
            Windsurf <ChevronDown size={18} />
          </div>
          <div className="cg-nav-center">
            <Gift size={14} /> Free offer
          </div>
          <div className="cg-nav-right">
            <button className="cg-icon-btn" style={{ width: '40px', height: '40px' }}><UserSquare size={20} /></button>
            <button className="cg-icon-btn" style={{ width: '40px', height: '40px' }}><Search size={20} /></button>
          </div>
        </header>

        {/* Content */}
        <div className="cg-content">
          <h1 className="cg-greeting">{greeting}</h1>
          
          <div className="cg-input-container">
            <div className="cg-icon-btn" style={{ width: '36px', height: '36px', marginLeft: '-4px' }}>
              <Plus size={24} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <input type="text" placeholder="Ask anything" className="cg-input" />
            <div className="cg-input-actions">
              <div className="cg-icon-btn" title="Voice Input" style={{ width: '32px', height: '32px' }}>
                <Mic size={18} />
              </div>
              <div className="cg-icon-btn active" title="Advanced Search" style={{ width: '32px', height: '32px' }}>
                <AudioLines size={18} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
