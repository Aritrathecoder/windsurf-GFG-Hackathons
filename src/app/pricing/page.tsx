'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Image as ImageIcon, HardDrive, BrainCircuit, CalendarCheck, FolderTree, Video, Code, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const [tab, setTab] = useState<'Personal' | 'Business'>('Personal');

  return (
    <main className="app-container" style={{ position: 'relative', overflowY: 'auto', display: 'block', width: '100vw' }}>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', width: '100%', position: 'relative', zIndex: 10 }}>
        {/* Navigation */}
        <div style={{ position: 'absolute', top: '24px', left: '24px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', transition: 'color 0.2s' }} className="hover:text-white">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '48px', textAlign: 'center' }}
        >
          <h1 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '24px', letterSpacing: '-0.5px' }}>
            Try Plus free for 1 month
          </h1>
          
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.1)', borderRadius: '30px', padding: '4px' }}>
            <button 
              onClick={() => setTab('Personal')}
              style={{ padding: '8px 24px', borderRadius: '30px', border: 'none', background: tab === 'Personal' ? 'rgba(255,255,255,0.1)' : 'transparent', color: tab === 'Personal' ? '#fff' : 'var(--text-secondary)', fontWeight: 500, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Personal
            </button>
            <button 
              onClick={() => setTab('Business')}
              style={{ padding: '8px 24px', borderRadius: '30px', border: 'none', background: tab === 'Business' ? 'rgba(255,255,255,0.1)' : 'transparent', color: tab === 'Business' ? '#fff' : 'var(--text-secondary)', fontWeight: 500, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Business
            </button>
          </div>
        </motion.div>

        {/* Pricing Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', justifyContent: 'center', alignItems: 'flex-start', maxWidth: '820px', margin: '0 auto' }}>
          
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="chatgpt-pricing-card"
            style={{ 
              background: 'rgba(20,20,20,0.8)', 
              borderRadius: '16px', 
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '600px'
            }}
          >
           <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>Free</h2>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
             <span style={{ fontSize: '42px', fontWeight: 600 }}>₹0</span>
             <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column' }}>
               <span>INR /</span>
               <span>month</span>
             </span>
           </div>
           <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500, marginBottom: '32px' }}>See what AI can do</p>

           <button style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '15px', cursor: 'pointer', marginBottom: '32px' }}>
             Your current plan
           </button>

           <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', padding: 0 }}>
             <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
               <Sparkles size={20} style={{ color: 'var(--text-secondary)' }} /> Get simple explanations
             </li>
             <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
               <MessageCircle size={20} style={{ color: 'var(--text-secondary)' }} /> Have short chats for common questions
             </li>
             <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
               <ImageIcon size={20} style={{ color: 'var(--text-secondary)' }} /> Try out image generation
             </li>
             <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
               <HardDrive size={20} style={{ color: 'var(--text-secondary)' }} /> Save limited memory and context
             </li>
           </ul>
          </motion.div>

          {/* Plus Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="chatgpt-pricing-card plus"
            style={{ 
              background: 'linear-gradient(180deg, #37355B 0%, #201F33 100%)', 
              borderRadius: '16px', 
              border: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '600px'
            }}
          >
            {/* Limited time banner */}
            <div style={{ background: '#6A5ACD', color: '#fff', textAlign: 'center', padding: '8px', fontSize: '13px', fontWeight: 600 }}>
              Limited time offer
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 600 }}>Plus</h2>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', display: 'flex', gap: '4px', alignItems: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  LIMITED TIME
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '32px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>₹1999</span>
                <span style={{ fontSize: '42px', fontWeight: 600 }}>₹0</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  INR for the first month
                </span>
              </div>
              <p style={{ color: '#fff', fontSize: '15px', fontWeight: 500, marginBottom: '32px' }}>More access to advanced intelligence</p>

              <button style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#6A5ACD', border: 'none', color: '#fff', fontWeight: 600, fontSize: '15px', cursor: 'pointer', marginBottom: '32px', transition: 'background 0.2s' }}>
                Claim free offer
              </button>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', padding: 0 }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
                  <BrainCircuit size={20} style={{ color: 'var(--text-secondary)' }} /> Solve complex problems
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
                  <MessageCircle size={20} style={{ color: 'var(--text-secondary)' }} /> Have long chats over multiple sessions
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
                  <ImageIcon size={20} style={{ color: 'var(--text-secondary)' }} /> Create more images, faster
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
                  <HardDrive size={20} style={{ color: 'var(--text-secondary)' }} /> Remember goals and past conversations
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
                  <CalendarCheck size={20} style={{ color: 'var(--text-secondary)' }} /> Plan travel and tasks with agent mode
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
                  <FolderTree size={20} style={{ color: 'var(--text-secondary)' }} /> Organize projects and customize GPTs
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
                  <Video size={20} style={{ color: 'var(--text-secondary)' }} /> Produce and share videos on Sora
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '14px', color: '#fff' }}>
                  <Code size={20} style={{ color: 'var(--text-secondary)' }} /> Write code and build apps with Codex
                </li>
              </ul>
            </div>
            
          </motion.div>

        </div>

        <div style={{ maxWidth: '820px', margin: '32px auto 0', color: 'var(--text-secondary)', fontSize: '11px', lineHeight: 1.5, opacity: 0.7 }}>
          <span style={{ textDecoration: 'underline' }}>Promo terms apply.</span> Promo pricing applies for 1 month. Starting Apr 20, 2026, ChatGPT Plus will continue at ₹1,999/month. Cancel anytime.
        </div>
        <div style={{ maxWidth: '820px', margin: '8px auto', color: 'var(--text-secondary)', fontSize: '11px', opacity: 0.7 }}>
          Have an existing plan? <span style={{ textDecoration: 'underline' }}>See billing help</span>
        </div>
      </div>
    </main>
  );
}
