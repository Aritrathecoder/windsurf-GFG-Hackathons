"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Sparkles, 
  ArrowRight, 
  Github, 
  ShieldCheck, 
  Zap,
  Globe
} from 'lucide-react';
import { auth, googleProvider } from '@/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import WindsurfLogo from '@/components/WindsurfLogo';

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error: any) {
      console.error("Auth error:", error);
      setAuthError(error.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    // Set a guest flag in localStorage to allow bypass
    if (typeof window !== 'undefined') {
      localStorage.setItem('windsurf_guest_mode', 'true');
      router.push('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(164, 151, 246, 0.08) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)', filter: 'blur(100px)' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '440px', padding: '48px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '32px', backdropFilter: 'blur(20px)', textAlign: 'center', zIndex: 10, position: 'relative' }}
      >
        {/* Logo Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <WindsurfLogo size={42} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '8px' }}>Log in to Windsurf</h1>
          <p style={{ color: '#666', fontSize: '15px' }}>The future of business intelligence is here.</p>
        </div>

        {/* Buttons Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '14px', borderRadius: '16px', background: '#fff', color: '#000', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 10px 20px rgba(255,255,255,0.1)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {isLoading ? (
              <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: '#000', borderRadius: '50%' }} />
            ) : (
              <Globe size={18} />
            )}
            Sign in with Google
          </button>

          <button 
            onClick={handleGuestAccess}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
          >
            <User size={18} />
            Continue as Guest
          </button>
        </div>

        {/* Error State */}
        <AnimatePresence>
          {authError && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ color: '#ef4444', fontSize: '13px', marginBottom: '24px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '10px' }}
            >
              {authError}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Trust Badge */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          {[
            { icon: <ShieldCheck size={14} />, text: "Secure" },
            { icon: <Zap size={14} />, text: "Instant" },
            { icon: <Sparkles size={14} />, text: "Premium" }
          ].map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#444', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span style={{ color: '#666' }}>{feat.icon}</span>
              {feat.text}
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Decorative Branding */}
      <h2 style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', letterSpacing: '0.4em', color: '#222', textTransform: 'uppercase', fontWeight: 800 }}>WINDSURF INTELLIGENCE SYSTEM</h2>
    </div>
  );
}
