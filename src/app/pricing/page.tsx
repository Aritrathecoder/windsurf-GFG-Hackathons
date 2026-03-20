'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Image as ImageIcon, HardDrive, BrainCircuit, CalendarCheck, FolderTree, Video, Code, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Basic Plan',
      price: '₹11,200',
      features: ['Limited features', 'Basic support', 'No customization'],
      limits: ['Limited usage', 'Limited storage'],
      services: 'No additional services included'
    },
    {
      name: 'Standard Plan',
      price: '₹14,500',
      features: ['More features', 'Standard support', 'Some customization'],
      limits: ['Increased usage', 'More storage'],
      services: 'Optional add-ons available for purchase'
    },
    {
      name: 'Premium Plan',
      price: '₹18,200',
      features: ['Full features', 'Priority support', 'Full customization'],
      limits: ['Unlimited usage', 'Unlimited storage'],
      services: 'Premium support and consulting included'
    }
  ];

  return (
    <main className="app-container" style={{ position: 'relative', overflowY: 'auto', display: 'block', width: '100vw', minHeight: '100vh', background: '#000' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', width: '100%', position: 'relative', zIndex: 10 }}>
        {/* Navigation */}
        <div style={{ marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', transition: 'color 0.2s' }}>
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>

        <h1 style={{ textAlign: 'center', fontSize: '48px', fontWeight: 800, color: '#fff', marginBottom: '60px', letterSpacing: '2px', textTransform: 'uppercase' }}>REVENUE MODEL</h1>

        {/* Pricing Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) repeat(3, 2fr)', gap: '10px' }}>
          
          {/* Row Labels */}
          <div style={{ display: 'contents' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E5E5E5', borderRadius: '4px', padding: '20px', color: '#000', fontWeight: 700, fontSize: '20px' }}>Pricing</div>
            {plans.map((plan, i) => (
               <div key={`p-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '10px' }}>
                  <div style={{ background: '#FFD700', color: '#000', padding: '12px 40px', borderRadius: '40px', fontWeight: 700, fontSize: '24px', marginBottom: '20px', width: '80%', textAlign: 'center' }}>{plan.name}</div>
                  <div style={{ color: '#fff', fontSize: '28px', fontWeight: 700 }}>{plan.price}/ month</div>
               </div>
            ))}
          </div>

          <div style={{ display: 'contents' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E5E5E5', borderRadius: '4px', padding: '20px', color: '#000', fontWeight: 700, fontSize: '20px' }}>Features</div>
            {plans.map((plan, i) => (
               <div key={`f-${i}`} style={{ border: '2px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '20px', color: '#fff' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {plan.features.map((f, j) => <li key={j} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '16px' }}>• {f}</li>)}
                  </ul>
               </div>
            ))}
          </div>

          <div style={{ display: 'contents' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E5E5E5', borderRadius: '4px', padding: '20px', color: '#000', fontWeight: 700, fontSize: '20px', textAlign: 'center' }}>Usage Limits</div>
            {plans.map((plan, i) => (
               <div key={`l-${i}`} style={{ border: '2px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '20px', color: '#fff' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {plan.limits.map((l, j) => <li key={j} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '16px' }}>• {l}</li>)}
                  </ul>
               </div>
            ))}
          </div>

          <div style={{ display: 'contents' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E5E5E5', borderRadius: '4px', padding: '20px', color: '#000', fontWeight: 700, fontSize: '20px', textAlign: 'center' }}>Additional Services</div>
            {plans.map((plan, i) => (
               <div key={`s-${i}`} style={{ border: '2px solid rgba(255,255,255,0.2)', borderRadius: '4px', padding: '20px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: '16px' }}>
                  {plan.services}
               </div>
            ))}
          </div>

        </div>

        {/* Target Persona Section */}
        <div style={{ marginTop: '100px', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
           <h2 style={{ color: '#FFD700', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>Target Persona</h2>
           <div style={{ color: '#fff' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>The Non-Technical Executive (CXO)</h3>
              <p style={{ fontSize: '18px', lineHeight: 1.6, opacity: 0.8 }}>
                They know what business questions they want to ask but do not know how to write database queries or configure BI visualization settings.
              </p>
           </div>
        </div>

      </div>
    </main>
  );
}
