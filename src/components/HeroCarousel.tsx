'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Zap, LayoutDashboard, ArrowRight } from 'lucide-react';

const slides = [
  {
    title: "Unleash AI Intelligence",
    description: "Generate deep insights from your data using natural language queries powered by Groq Llama 3.3. Just ask and watch the magic happen.",
    icon: <Sparkles size={40} />,
    color: "#a497f6",
    gradient: "linear-gradient(135deg, rgba(164, 151, 246, 0.2) 0%, rgba(164, 151, 246, 0.05) 100%)"
  },
  {
    title: "Instant Visualization",
    description: "Automatically transform complex datasets into beautiful, interactive Area, Bar, and Line charts. Dynamic scaling and premium styling guaranteed.",
    icon: <LayoutDashboard size={40} />,
    color: "#4ade80",
    gradient: "linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(74, 222, 128, 0.05) 100%)"
  },
  {
    title: "Enterprise-Grade Analytics",
    description: "Scale your business with high-performance SQLite data processing. Monitor trends, compare regions, and track engagement effortlessly.",
    icon: <Zap size={40} />,
    color: "#f43f5e",
    gradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(244, 63, 94, 0.05) 100%)"
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1000px', 
      margin: '0 auto 60px', 
      position: 'relative',
      minHeight: '320px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '40px',
            padding: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '60px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative Gradient Background */}
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            background: slides[current].gradient, 
            zIndex: 0,
            opacity: 0.5
          }} />

          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '32px', 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: slides[current].color,
            position: 'relative',
            zIndex: 1
          }}>
            {slides[current].icon}
          </div>

          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <h2 style={{ 
              fontSize: '42px', 
              fontWeight: 800, 
              color: '#fff', 
              marginBottom: '20px',
              letterSpacing: '-1px'
            }}>
              {slides[current].title}
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: '#888', 
              lineHeight: 1.6, 
              marginBottom: '40px'
            }}>
              {slides[current].description}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <button 
                onClick={nextSlide}
                style={{
                  padding: '16px 32px',
                  borderRadius: '16px',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Next Feature <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {slides.map((_, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      width: i === current ? '32px' : '8px', 
                      height: '8px', 
                      borderRadius: '4px', 
                      background: i === current ? slides[i].color : 'rgba(255,255,255,0.1)',
                      transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)'
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroCarousel;
