"use client";
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion';
import AnimatedNumber from '@/components/ui/animated-number';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';
import { Timeline } from '@/components/ui/timeline';
import { useTab } from '../context/TabContext';

const cardData = [
  { title: 'CORPORATE-FIRST', desc: 'Every module, project, and simulation comes from actual roles inside real companies.' },
  { title: 'PROOF OVER PROMISES', desc: '100+ skill and behavior metrics tracked in live work.' },
  { title: 'REACH BEYOND TIER-1', desc: 'Tap into Tier 2 and 3 campuses without sacrificing quality.' },
  { title: 'FASTER ROI', desc: 'Skip 4-month onboarding cycles and start with day-one productivity.' },
  { title: 'ZERO GUESSWORK', desc: 'Data-backed hiring decisions replace gut-feel screening every time.' },
];

// Odometer / Slot-machine spinning digit reel
function DigitReel({ targetDigit, isAnimating, delay = 0 }) {
  if (isNaN(parseInt(targetDigit, 10))) {
    return <span style={{ display: 'inline-block' }}>{targetDigit}</span>;
  }
  const digit = parseInt(targetDigit, 10);
  const cycles = 3;
  const numbers = [];
  for (let c = 0; c < cycles; c++) {
    for (let d = 0; d <= 9; d++) {
      numbers.push(d);
    }
  }
  numbers.push(digit);
  const targetIndex = numbers.length - 1;

  return (
    <span
      style={{
        display: 'inline-block',
        height: '1em',
        overflow: 'hidden',
        verticalAlign: 'top',
        lineHeight: 1,
      }}
    >
      <motion.span
        style={{ display: 'flex', flexDirection: 'column' }}
        initial={{ y: '0%' }}
        animate={{ y: isAnimating ? `-${(targetIndex / numbers.length) * 100}%` : '0%' }}
        transition={{
          duration: 1.6 + delay * 0.12,
          ease: [0.16, 1, 0.3, 1],
          delay: delay * 0.05,
        }}
      >
        {numbers.map((num, idx) => (
          <span
            key={idx}
            style={{
              height: '1em',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {num}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function RollingNumber({ value, isAnimating }) {
  const chars = String(value).split('');
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', lineHeight: 1 }}>
      {chars.map((char, i) => (
        <DigitReel key={i} targetDigit={char} isAnimating={isAnimating} delay={i} />
      ))}
    </span>
  );
}

// 3D Typographic Roller Item in "WHAT WE BRING" (Perfect focal-centered stage matching side tickers)
function BringTypographyRollerItem({ card, index, totalCards, scrollYProgress }) {
  // Signed distance from active center focal point (-4 to +4)
  const signedRel = useTransform(scrollYProgress, (progress) => {
    const current = progress * (totalCards - 1);
    return index - current;
  });

  const absRel = useTransform(signedRel, (s) => Math.abs(s));

  // Vertical position on the drum wheel: 0 when active (perfectly centered), moves up when negative, down when positive
  const itemY = useTransform(signedRel, (s) => {
    return `${s * 95}px`;
  });

  // 3D Half-roller curvature
  const rotateX = useTransform(signedRel, (s) => {
    const clamped = Math.max(-2.5, Math.min(2.5, s));
    return `${-clamped * 20}deg`;
  });

  const translateZ = useTransform(absRel, (dist) => {
    return `${Math.max(-100, 16 - dist * 40)}px`;
  });

  const textScale = useTransform(absRel, [0, 0.45, 1.2], [1.05, 0.94, 0.84]);

  // Active item 100% visible; opacity of other texts decreases rapidly on scroll to 0
  const textOpacity = useTransform(absRel, [0, 0.22, 0.55, 0.85], [1.0, 0.70, 0.08, 0]);

  // Description text smoothly reveals only when item is active
  const descOpacity = useTransform(absRel, [0, 0.28, 0.60], [1.0, 0.2, 0]);
  const descY = useTransform(absRel, [0, 0.30], [0, 8]);

  const zIndex = useTransform(absRel, (dist) => Math.round(50 - dist * 10));

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        marginTop: '-50px', // Centers the item around the stage focal center
        opacity: textOpacity,
        scale: textScale,
        y: itemY,
        rotateX: rotateX,
        z: translateZ,
        zIndex: zIndex,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        width: '100%',
        padding: '0.4rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'default',
        pointerEvents: 'none',
      }}
    >
      {/* Main Title Typography */}
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
        <span
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(0.95rem, 1.3vw, 1.3rem)',
            fontWeight: 800,
            color: 'var(--accent-purple)',
            letterSpacing: '0.04em',
          }}
        >
          0{index + 1}
        </span>
        <h3
          style={{
            margin: 0,
            color: '#ffffff',
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(1.6rem, 2.7vw, 2.4rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            textTransform: 'uppercase',
          }}
        >
          {card.title}
        </h3>
      </div>

      {/* Sub-description explanation smoothly reveals on scroll */}
      <motion.div
        style={{
          opacity: descOpacity,
          y: descY,
          maxWidth: '640px',
          marginTop: '0.55rem',
          padding: '0 1rem',
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#e2beff',
            fontSize: 'clamp(0.95rem, 1.2vw, 1.12rem)',
            lineHeight: 1.5,
            fontWeight: 500,
            fontFamily: 'Century Gothic, sans-serif',
          }}
        >
          {card.desc}
        </p>
      </motion.div>
    </motion.div>
  );
}

// Vertical ruler tick track on both left & right edges (perfectly aligned with text cards in lockstep)
function BringSideScrollTicker({ scrollYProgress, side = 'right' }) {
  const isLeft = side === 'left';
  const totalCards = cardData.length;

  // Generate ticks with 4 subdivisions per card interval, plus buffer before and after
  const ticks = [];
  for (let i = -2; i <= (totalCards - 1) * 4 + 2; i++) {
    const relValue = i * 0.25;
    const isMajor = i % 4 === 0;
    ticks.push({ relValue, isMajor, id: i });
  }

  return (
    <div
      style={{
        position: 'absolute',
        [isLeft ? 'left' : 'right']: 'clamp(1rem, 3.5vw, 4.5rem)',
        top: '50%',
        height: '320px',
        width: '45px',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {ticks.map((t) => (
        <SideTickerTick
          key={t.id}
          relValue={t.relValue}
          isMajor={t.isMajor}
          isLeft={isLeft}
          scrollYProgress={scrollYProgress}
          totalCards={totalCards}
        />
      ))}
    </div>
  );
}

function SideTickerTick({ relValue, isMajor, isLeft, scrollYProgress, totalCards }) {
  // Signed distance of this tick from the focal center line
  const signedRel = useTransform(scrollYProgress, (progress) => {
    const current = progress * (totalCards - 1);
    return relValue - current;
  });

  const absRel = useTransform(signedRel, (s) => Math.abs(s));

  // Exactly matches the 95px per card vertical step of BringTypographyRollerItem
  const y = useTransform(signedRel, (s) => `${s * 95}px`);

  const opacity = useTransform(absRel, (dist) => {
    if (dist < 0.20) return 1.0;
    if (dist < 0.60) return 0.65;
    if (dist < 1.4) return 0.35;
    if (dist < 2.2) return 0.15;
    return 0;
  });

  const width = useTransform(absRel, (dist) => {
    if (dist < 0.20) return '38px';
    if (dist < 0.55) return isMajor ? '28px' : '20px';
    return isMajor ? '22px' : '14px';
  });

  const color = useTransform(absRel, (dist) => {
    return dist < 0.20 ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.75)';
  });

  const shadow = useTransform(absRel, (dist) => {
    return dist < 0.20 ? '0 0 12px rgba(187, 98, 222, 0.95)' : 'none';
  });

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: '50%',
        [isLeft ? 'left' : 'right']: 0,
        y: y,
        height: isMajor ? '3px' : '2px',
        width: width,
        backgroundColor: color,
        boxShadow: shadow,
        opacity: opacity,
        borderRadius: '2px',
        marginTop: '-1px',
      }}
    />
  );
}

// 1. Dedicated Page: "WE BUILT ANTBOX TO END THIS GAME OF CHANCE"
function WeBuiltAntboxSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const messageScale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.94, 1, 0.94]);
  const messageY = useTransform(scrollYProgress, [0.1, 0.9], ["20px", "-20px"]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <motion.div
        style={{
          scale: messageScale,
          y: messageY,
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h3
          style={{
            fontSize: 'clamp(3.5rem, 7.8vw, 7.2rem)',
            lineHeight: 1.04,
            letterSpacing: '-0.04em',
            textAlign: 'center',
            margin: '0 auto',
            maxWidth: '1240px',
            width: '100%',
            fontFamily: 'Poppins, sans-serif',
            fontStyle: 'italic',
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        >
          <span className="msg-line" style={{ textAlign: 'center', display: 'block' }}>
            <span style={{ color: '#f7f5ee' }}>WE BUILT </span>
            <span style={{ color: 'var(--accent-purple)' }}>ANTBOX</span>
          </span>
          <span className="msg-line msg-line-straight" style={{ color: '#f7f5ee', textAlign: 'center', display: 'block', fontStyle: 'normal' }}>TO END THIS</span>
          <span className="msg-line" style={{ textAlign: 'center', display: 'block' }}>
            <span style={{ color: 'var(--accent-purple)' }}>GAME </span>
            <span style={{ color: '#f7f5ee' }}>OF </span>
            <span style={{ color: 'var(--accent-purple)' }}>CHANCE</span>
          </span>
        </h3>
      </motion.div>
    </section>
  );
}

// 2. Dedicated Page: "WHAT WE BRING" Scroll-Highlight Section matching bringcards.mp4
function WhatWeBringSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const totalCards = cardData.length;

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '210vh',
        background: 'transparent',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '2rem 1.5rem',
        }}
      >
        {/* Large Prominent Scroll Tickers on BOTH Sides */}
        <BringSideScrollTicker scrollYProgress={scrollYProgress} side="left" />
        <BringSideScrollTicker scrollYProgress={scrollYProgress} side="right" />

        <div
          style={{
            width: '100%',
            maxWidth: '1060px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <h2
            className="section-title heading-serif text-center"
            style={{
              color: '#ffffff',
              margin: '0 0 clamp(1rem, 2vh, 1.6rem)',
              fontSize: 'clamp(1.9rem, 3.4vw, 2.75rem)',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            WHAT WE <span style={{ color: 'var(--accent-purple)' }}>BRING</span>
          </h2>

          {/* 3D Half-Roller Cards Stage (Cards centered at fixed focal height) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              perspective: '1200px',
              transformStyle: 'preserve-3d',
            }}
          >
            {cardData.map((card, i) => (
              <BringTypographyRollerItem
                key={i}
                card={card}
                index={i}
                totalCards={totalCards}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 3. Dedicated Section: "Ready to build your tribes?" matching exact screenshot
function ReadyToBuildTribesSection() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'var(--black)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(5rem, 8vw, 8rem) clamp(1.5rem, 5vw, 4.5rem)',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Headlines and 3 feature blocks */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <h2
            className="heading-serif font-black"
            style={{
              color: '#ffffff',
              fontSize: 'clamp(2.75rem, 5vw, 4.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: '0 0 1.25rem',
            }}
          >
            Ready to build<br />
            your <span style={{ fontFamily: 'var(--font-times)', fontStyle: 'italic', fontWeight: 700, color: 'var(--accent-purple)' }}>tribes?</span>
          </h2>
          <p
            style={{
              color: '#9e9ea6',
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              lineHeight: 1.6,
              maxWidth: '520px',
              margin: '0 0 2.5rem',
              fontWeight: 400,
            }}
          >
            Stop sifting through CVs. Design your own career sprints, discover performance-validated talent, and build a pipeline before roles even open.
          </p>

          <div className="flex flex-col gap-6">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(187, 98, 222, 0.14)',
                  border: '1px solid rgba(187, 98, 222, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--accent-purple)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '-0.02em',
                }}
              >
                01
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
                  Disrupt entry-level hiring
                </h4>
                <p style={{ color: '#888890', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                  Replace months of screening with a 2-week sprint that shows you exactly who can do the work.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(187, 98, 222, 0.14)',
                  border: '1px solid rgba(187, 98, 222, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--accent-purple)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '-0.02em',
                }}
              >
                02
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
                  Build your own tribes
                </h4>
                <p style={{ color: '#888890', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                  Create talent communities around your culture, values, and craft, before they’re even on the market.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(187, 98, 222, 0.14)',
                  border: '1px solid rgba(187, 98, 222, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--accent-purple)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '-0.02em',
                }}
              >
                03
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>
                  Access a validated talent pool
                </h4>
                <p style={{ color: '#888890', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                  Every candidate comes with an AntBox Readiness Score, sprint history, and verified work output.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tribe Analytics Engine Card Dashboard */}
        <div className="lg:col-span-6">
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(22, 22, 28, 0.95) 0%, rgba(12, 12, 16, 0.98) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              borderRadius: '1.5rem',
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.09)',
              position: 'relative',
            }}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
              <div className="flex items-center">
                <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
                  Tribe Analytics Engine
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
            </div>

            {/* Orbit / Radar Graphic Area with Continuous Planet Revolution */}
            <div
              style={{
                position: 'relative',
                height: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '1rem 0',
              }}
            >
              {/* Outer Orbit Ring with 2 Revolving Nodes */}
              <div
                className="orbit-spin-clockwise"
                style={{
                  position: 'absolute',
                  width: '230px',
                  height: '230px',
                  borderRadius: '50%',
                  border: '1px dashed rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Planet 1 on Outer Orbit (Left) */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-17px',
                    top: 'calc(50% - 17px)',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(26, 26, 32, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.75)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                  }}
                >
                  <div
                    className="orbit-counter-rotate-outer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </div>
                </div>

                {/* Planet 2 on Outer Orbit (Right) */}
                <div
                  style={{
                    position: 'absolute',
                    right: '-17px',
                    top: 'calc(50% - 17px)',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(26, 26, 32, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.75)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                  }}
                >
                  <div
                    className="orbit-counter-rotate-outer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Inner Orbit Ring with 1 Revolving Node */}
              <div
                className="orbit-spin-counter"
                style={{
                  position: 'absolute',
                  width: '142px',
                  height: '142px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Planet on Inner Orbit (Top) */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-17px',
                    left: 'calc(50% - 17px)',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'rgba(26, 26, 32, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.75)',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                  }}
                >
                  <div
                    className="orbit-counter-rotate-inner"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Center Antbox Core without glow */}
              <div
                style={{
                  width: '78px',
                  height: '78px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #BB62DE 0%, #8E43AC 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  boxShadow: 'none',
                  zIndex: 2,
                }}
              >
                <img
                  src="/antbox-favicon.png"
                  alt="Antbox Core"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            {/* Bottom 2x2 Metric Cards Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
              <div
                style={{
                  background: 'rgba(28, 28, 34, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '0.85rem',
                  padding: '1rem 1.15rem',
                }}
              >
                <div style={{ color: '#7a7a85', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  ACTIVE CANDIDATES
                </div>
                <div style={{ color: '#ffffff', fontSize: 'clamp(1.5rem, 2.2vw, 1.85rem)', fontWeight: 800, marginTop: '0.35rem', letterSpacing: '-0.02em' }}>
                  1000+
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(28, 28, 34, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '0.85rem',
                  padding: '1rem 1.15rem',
                }}
              >
                <div style={{ color: '#7a7a85', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  AVG READINESS
                </div>
                <div style={{ color: '#ffffff', fontSize: 'clamp(1.5rem, 2.2vw, 1.85rem)', fontWeight: 800, marginTop: '0.35rem', letterSpacing: '-0.02em' }}>
                  87%
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(28, 28, 34, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '0.85rem',
                  padding: '1rem 1.15rem',
                }}
              >
                <div style={{ color: '#7a7a85', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  BOOTCAMPS
                </div>
                <div style={{ color: '#ffffff', fontSize: 'clamp(1.5rem, 2.2vw, 1.85rem)', fontWeight: 800, marginTop: '0.35rem', letterSpacing: '-0.02em' }}>
                  7+
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(28, 28, 34, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '0.85rem',
                  padding: '1rem 1.15rem',
                }}
              >
                <div style={{ color: '#7a7a85', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  UNIVERSITY PARTNERS
                </div>
                <div style={{ color: '#ffffff', fontSize: 'clamp(1.5rem, 2.2vw, 1.85rem)', fontWeight: 800, marginTop: '0.35rem', letterSpacing: '-0.02em' }}>
                  3
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CandidateCTA() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"]
  });

  const clipPercent = useTransform(scrollYProgress, [0.25, 0.80], [100, 0]);
  const clipPathValue = useMotionTemplate`inset(${clipPercent}% 0 0 0)`;

  return (
    <section
      className="cta-section cta-typographic"
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: '100dvh',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        zIndex: 10,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Base Layer: Light Cream base centered */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--cream)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
        }}
      >
        <div className="cta-type-inner" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', maxWidth: '1100px' }}>
          <h2 className="cta-type-headline" style={{ color: 'var(--black)', fontSize: 'clamp(2.75rem, 5.5vw, 5rem)', lineHeight: 1.08, margin: 0 }}>
            Ready to Take Control<br />of Your Career Path?
          </h2>
          <p className="cta-eyebrow" style={{ color: 'var(--text-secondary)', marginTop: '1.5rem', marginBottom: 0, fontSize: 'clamp(1.05rem, 1.5vw, 1.3rem)', maxWidth: '680px', lineHeight: 1.5, textTransform: 'none', letterSpacing: '0px' }}>
            Build real proof of work, work on micro-internships, and land your dream job without the guesswork.
          </p>
          <a
            href="https://theantbox.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-type-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              background: 'var(--purple)',
              color: '#fff',
              marginTop: '2.25rem',
              padding: '1.15rem 3.5rem',
              fontSize: '1.2rem',
              borderRadius: '9999px',
              cursor: 'pointer',
            }}
          >
            Get Started →
          </a>
        </div>
      </div>

      {/* Top Purple Wipe Layer */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--purple)',
          zIndex: 2,
          clipPath: clipPathValue,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
        }}
      >
        <div className="cta-type-inner" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', maxWidth: '1100px' }}>
          <h2 className="cta-type-headline" style={{ color: '#fff', fontSize: 'clamp(2.75rem, 5.5vw, 5rem)', lineHeight: 1.08, margin: 0 }}>
            Ready to Take Control<br />of Your Career Path?
          </h2>
          <p className="cta-eyebrow" style={{ color: '#f0f0f0', marginTop: '1.5rem', marginBottom: 0, fontSize: 'clamp(1.05rem, 1.5vw, 1.3rem)', maxWidth: '680px', lineHeight: 1.5, textTransform: 'none', letterSpacing: '0px' }}>
            Build real proof of work, work on micro-internships, and land your dream job without the guesswork.
          </p>
          <a
            href="https://theantbox.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-type-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              background: 'var(--black)',
              color: '#fff',
              marginTop: '2.25rem',
              padding: '1.15rem 3.5rem',
              fontSize: '1.2rem',
              borderRadius: '9999px',
              cursor: 'pointer',
            }}
          >
            Get Started →
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function CandidateFriction() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"]
  });

  const lineScaleX = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      if (latest < 0.35) setActiveStep(0);
      else if (latest < 0.55) setActiveStep(1);
      else setActiveStep(2);
    });
  }, [scrollYProgress]);

  // Flip animation on entry
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFlipped(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="problems-section candidate-friction"
      ref={sectionRef}
      style={{
        width: '100vw',
        minHeight: '100vh',
        marginLeft: 'calc(-50vw + 50%)',
        padding: 'clamp(5rem, 8vh, 7.5rem) clamp(2.5rem, 5.5vw, 6.5rem)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'var(--black)',
        position: 'relative',
        zIndex: 10,
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        {/* Big Impact Header */}
        <h2
          ref={titleRef}
          className="friction-header"
          style={{
            marginBottom: 'clamp(2.5rem, 4.5vh, 4rem)',
            textAlign: 'left',
            perspective: '800px',
            display: 'block',
          }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(3.8rem, 6.5vw, 6rem)',
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1)',
              transform: flipped ? 'rotateY(0deg)' : 'rotateY(-90deg)',
              transitionDelay: '0s',
            }}
          >THE</span>
          <span
            style={{
              display: 'block',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(3.8rem, 6.5vw, 6rem)',
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              color: 'var(--accent-purple)',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1)',
              transform: flipped ? 'rotateY(0deg)' : 'rotateY(-90deg)',
              transitionDelay: '0.15s',
            }}
          >FRICTION</span>
        </h2>

        {/* 3 Full Width Friction Cards with Connected Progress Line */}
        <div className="process-layout" style={{ width: '100%' }}>
          <div
            className="process-timeline"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(2rem, 4vw, 4rem)',
              width: '100%',
              position: 'relative',
            }}
          >
            <motion.div
              className="process-timeline-active-line"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '3px',
                background: 'linear-gradient(90deg, var(--accent-purple) 0%, #e093ff 100%)',
                zIndex: 2,
                transformOrigin: 'left',
                scaleX: lineScaleX,
                width: '100%',
              }}
            />

            {/* Step 01 */}
            <motion.div
              className={`process-step ${activeStep >= 0 ? 'active' : ''}`}
              animate={{ opacity: activeStep >= 0 ? 1 : 0.45, y: activeStep >= 0 ? 0 : 12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ position: 'relative', paddingTop: '1.5rem' }}
            >
              <div
                className="process-number"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(3.2rem, 5.5vw, 4.8rem)',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                  color: activeStep >= 0 ? 'var(--accent-purple)' : 'rgba(255,255,255,0.25)',
                  marginBottom: '1rem',
                  transition: 'all 0.4s ease',
                }}
              >
                01
              </div>
              <h3
                className="tc-heading"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(1.35rem, 1.8vw, 1.65rem)',
                  fontWeight: 800,
                  color: 'var(--cream)',
                  marginBottom: '0.75rem',
                  lineHeight: 1.25,
                }}
              >
                Outdated Campus Tech Stack
              </h3>
              <p
                className="tc-body"
                style={{
                  fontFamily: 'Century Gothic, sans-serif',
                  color: '#b0b0b8',
                  fontSize: 'clamp(1rem, 1.15vw, 1.12rem)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                AI and tech evolve every 12 months, but university courses take years to update. What you learn in class often falls short of what top companies demand on Day 1.
              </p>
            </motion.div>

            {/* Step 02 */}
            <motion.div
              className={`process-step ${activeStep >= 1 ? 'active' : ''}`}
              animate={{ opacity: activeStep >= 1 ? 1 : 0.45, y: activeStep >= 1 ? 0 : 12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ position: 'relative', paddingTop: '1.5rem' }}
            >
              <div
                className="process-number"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(3.2rem, 5.5vw, 4.8rem)',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                  color: activeStep >= 1 ? 'var(--accent-purple)' : 'rgba(255,255,255,0.25)',
                  marginBottom: '1rem',
                  transition: 'all 0.4s ease',
                }}
              >
                02
              </div>
              <h3
                className="tc-heading"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(1.35rem, 1.8vw, 1.65rem)',
                  fontWeight: 800,
                  color: 'var(--cream)',
                  marginBottom: '0.75rem',
                  lineHeight: 1.25,
                }}
              >
                Judged in Hours After 4 Years
              </h3>
              <p
                className="tc-body"
                style={{
                  fontFamily: 'Century Gothic, sans-serif',
                  color: '#b0b0b8',
                  fontSize: 'clamp(1rem, 1.15vw, 1.12rem)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Traditional hiring compresses your entire degree into a single resume screening or a 30-minute interview, leading to higher drop-offs and missed opportunities.
              </p>
            </motion.div>

            {/* Step 03 */}
            <motion.div
              className={`process-step ${activeStep >= 2 ? 'active' : ''}`}
              animate={{ opacity: activeStep >= 2 ? 1 : 0.45, y: activeStep >= 2 ? 0 : 12 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ position: 'relative', paddingTop: '1.5rem' }}
            >
              <div
                className="process-number"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(3.2rem, 5.5vw, 4.8rem)',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                  color: activeStep >= 2 ? 'var(--accent-purple)' : 'rgba(255,255,255,0.25)',
                  marginBottom: '1rem',
                  transition: 'all 0.4s ease',
                }}
              >
                03
              </div>
              <h3
                className="tc-heading"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(1.35rem, 1.8vw, 1.65rem)',
                  fontWeight: 800,
                  color: 'var(--cream)',
                  marginBottom: '0.75rem',
                  lineHeight: 1.25,
                }}
              >
                The Experience Needed Paradox
              </h3>
              <p
                className="tc-body"
                style={{
                  fontFamily: 'Century Gothic, sans-serif',
                  color: '#b0b0b8',
                  fontSize: 'clamp(1rem, 1.15vw, 1.12rem)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Companies expect prior experience for entry-level roles, but few give you the chance to gain it. Over 77% of grads end up learning everything from scratch on the job.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ROTATING_HERO_WORDS = ["TALENT", "PIPELINE", "PROOF"];

// Combined Scene: Hero ("WHERE TALENT is BUILT not found") + "What Corporates Face"
// 1. "WHERE ", "is", "BUILT", and "not found" are static.
// 2. Only the rotating word (TALENT -> SKILLS -> PIPELINE -> ...) has the letter typing animation.
// 3. Scroll: "WHERE [WORD] / is / not found" fly away smoothly.
// 4. "BUILT" stays rock-solid in place and smoothly scales up to 32x into "What Corporates Face".
function CorporateHeroAndProblems({ scrollProgress }) {
  // Rotating word typewriter state for "TALENT"
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("TALENT");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullWord = ROTATING_HERO_WORDS[wordIndex];
    let timeout;

    if (!isDeleting) {
      // Typing phase
      if (currentText.length < currentFullWord.length) {
        timeout = setTimeout(() => {
          setCurrentText(currentFullWord.slice(0, currentText.length + 1));
        }, 100);
      } else {
        // Full word typed — pause before backspacing
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      // Deleting phase
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentFullWord.slice(0, currentText.length - 1));
        }, 55);
      } else {
        // Completely deleted — move to next word
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % ROTATING_HERO_WORDS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, wordIndex]);

  // 1. "Where talent", "is", and "not found" fly completely off screen and vanish immediately (0 to 0.035)
  const leftX = useTransform(scrollProgress, [0, 0.035], ["0vw", "-120vw"]);
  const rightX = useTransform(scrollProgress, [0, 0.035], ["0vw", "120vw"]);
  const isX = useTransform(scrollProgress, [0, 0.035], ["0vw", "-80vw"]);
  const topOpacity = useTransform(scrollProgress, [0, 0.03], [1, 0]);
  const isOpacity = useTransform(scrollProgress, [0, 0.03], [1, 0]);
  const peripheralDisplay = useTransform(scrollProgress, (v) => (v >= 0.035 ? 'none' : 'block'));

  // 2. "Built" starts zooming immediately from scroll=0, smoothly expanding up to 32x
  const builtScale = useTransform(scrollProgress, [0, 0.28], [1, 32]);
  const builtOpacity = useTransform(scrollProgress, [0, 0.22, 0.28], [1, 1, 0]);

  // 3. WCF stays completely hidden until Built is huge (0 -> 0.09), then enters strictly through gap between U & I
  const wcfScale = useTransform(scrollProgress, [0, 0.09, 0.20, 0.28], [0.65, 0.65, 0.95, 1]);
  const wcfBlur = useTransform(scrollProgress, [0, 0.09, 0.18, 0.26], [24, 20, 4, 0]);
  const wcfFilter = useMotionTemplate`blur(${wcfBlur}px)`;

  const wcfOpacity = useTransform(
    scrollProgress,
    [0, 0.09, 0.14, 0.22, 0.28],
    [0, 0, 0.65, 0.95, 1]
  );

  // Hide hero overlay completely after Built passes
  const heroDisplay = useTransform(scrollProgress, (v) => (v > 0.28 ? 'none' : 'flex'));
  const heroPointerEvents = useTransform(scrollProgress, (v) => (v > 0.28 ? 'none' : 'auto'));

  // Trigger stats roll animation
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    return scrollProgress.on('change', (latest) => {
      if (latest >= 0.10) {
        setStatsVisible(true);
      } else {
        setStatsVisible(false);
      }
    });
  }, [scrollProgress]);

  // Background image parallax & fade
  const bgScale = useTransform(scrollProgress, [0, 0.28], [1, 1.15]);
  const bgOpacity = useTransform(scrollProgress, [0, 0.16, 0.26], [1, 0.8, 0]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#F7F5EE' }}>
      {/* Layer 1: "What Corporates Face" — starts diminished & blurred through gap of Built, expands to normal solid page */}
      <motion.div
        style={{
          opacity: wcfOpacity,
          filter: wcfFilter,
          scale: wcfScale,
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem 1.5rem 1rem',
          background: '#F7F5EE',
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
          <h2 className="section-title heading-serif text-center" style={{ color: 'var(--black)', marginBottom: '0.5rem' }}>
            WHAT <span style={{ color: 'var(--accent-purple)' }}>CORPORATES</span> FACE
          </h2>
          <div className="problems-intro text-center" style={{ marginBottom: '2rem' }}>
            <p className="problems-lead">One rushed interview. One resume. One gut call.</p>
          </div>
          <div className="problems-grid">
            <div className="problem-card">
              <h3 className="problem-stat">
                <RollingNumber value="70%" isAnimating={statsVisible} />
              </h3>
              <p className="problem-text">underperform or quit within a year.</p>
              <a href="#" className="arrow-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
            <div className="problem-card">
              <h3 className="problem-stat">
                <RollingNumber value="$5,475+" isAnimating={statsVisible} />
              </h3>
              <p className="problem-text">burned per wrong hire.</p>
              <a href="#" className="arrow-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
            <div className="problem-card">
              <h3 className="problem-stat">
                <RollingNumber value="4–6" isAnimating={statsVisible} />
              </h3>
              <p className="problem-text">months lost in training before productivity.</p>
              <a href="#" className="arrow-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Layer 2: Hero Section ("WHERE TALENT is BUILT not found") on top */}
      <motion.div
        className="flex flex-col items-center justify-center pointer-events-none"
        style={{
          display: heroDisplay,
          pointerEvents: heroPointerEvents,
          position: 'absolute',
          inset: 0,
          zIndex: 5,
        }}
      >
        <div className="flex flex-col items-center justify-center gap-2 md:gap-4 font-black tracking-[-0.03em] uppercase leading-[1.05] text-center w-full relative z-10" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {/* Row 1: WHERE [ROTATING WORD WITH TYPING ANIMATION] */}
          <motion.div
            style={{ x: leftX, opacity: topOpacity }}
            className="text-[clamp(36px,8vw,120px)] whitespace-nowrap block pointer-events-none"
          >
            <span style={{ color: 'var(--black)' }}>WHERE </span>
            <span style={{ color: 'var(--black)' }}>{currentText}</span>
          </motion.div>

          {/* Row 2: IS BUILT — footprint locked permanently so BUILT never shifts */}
          <div className="flex items-center justify-center gap-4 text-[clamp(36px,8vw,120px)] w-full pointer-events-none">
            <motion.div
              style={{ x: isX, opacity: isOpacity, pointerEvents: 'none', color: 'var(--black)' }}
              className="uppercase"
            >
              IS
            </motion.div>
            <motion.div
              style={{
                scale: builtScale,
                opacity: builtOpacity,
                transformOrigin: '50% 50%',
                zIndex: 50,
                color: 'var(--accent-purple)',
              }}
              className="pointer-events-none uppercase"
            >
              BUILT
            </motion.div>
          </div>

          {/* Row 3: not found */}
          <motion.div style={{ x: rightX, opacity: topOpacity }} className="pointer-events-none">
            <span
              className="block"
              style={{
                fontFamily: 'var(--font-times)',
                fontStyle: 'italic',
                fontSize: 'clamp(32px,7vw,100px)',
                lineHeight: 1,
                textTransform: 'none',
                letterSpacing: 'normal',
                fontWeight: 'normal',
                color: 'var(--accent-purple)',
              }}
            >
              not found
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function CorporateCTA() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"]
  });

  const clipPercent = useTransform(scrollYProgress, [0.3, 0.85], [100, 0]);
  const clipPathValue = useMotionTemplate`inset(${clipPercent}% 0 0 0)`;

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100dvh',
        minHeight: '100dvh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        borderRadius: 0,
        boxShadow: 'none',
      }}
    >
      {/* Base layer — light cream with bottom half race track lineart */}
      <div style={{
        position: 'absolute', inset: 0, background: 'var(--cream)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Race track pattern on base layer */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          opacity: 0.5,
        }}>
          <img
            src="/f1race-cta-cream.png"
            alt="Antbox F1 Race Track Pattern"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              display: 'block',
            }}
          />
          {/* Soft vignette to guarantee 100% crispness of CTA texts */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(247, 245, 238, 0.88) 0%, rgba(247, 245, 238, 0.5) 60%, rgba(247, 245, 238, 0.15) 100%)',
            }}
          />
        </div>

        <div className="cta-type-inner" style={{ position: 'relative', zIndex: 10 }}>
          <h2 className="cta-type-headline">
            <span className="cta-line cta-line-italic" style={{ color: '#F7F5ee' }}>The future is</span>
            <span className="cta-line cta-line-bold" style={{ color: '#F7F5ee' }}>Pre-Built</span>
            <span className="cta-line cta-line-italic" style={{ color: '#F7F5ee' }}>Talent</span>
          </h2>
          <button className="cta-type-btn" style={{ background: 'var(--purple)', color: '#fff' }}>Enter Factory →</button>
        </div>
      </div>

      {/* Top purple layer — clips in from top on scroll down, filling track in vibrant brand colors */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'var(--purple)',
          clipPath: clipPathValue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        {/* Full vibrant brand purple and black track on the purple cover layer */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        }}>
          <img
            src="/f1race-cta-purple.png"
            alt="Antbox F1 Race Track Vivid"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              display: 'block',
              opacity: 0.85,
            }}
          />
          {/* Ambient overlay keeping brand purple aesthetic & pristine text legibility */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(187, 98, 222, 0.65) 0%, rgba(43, 12, 55, 0.6) 70%, rgba(18, 6, 28, 0.75) 100%)',
            }}
          />
        </div>

        <div className="cta-type-inner" style={{ position: 'relative', zIndex: 10 }}>
          <h2 className="cta-type-headline">
            <span className="cta-line cta-line-italic" style={{ color: '#F7F5ee' }}>The future is</span>
            <span className="cta-line cta-line-bold" style={{ color: '#F7F5ee' }}>Pre-Built</span>
            <span className="cta-line cta-line-italic" style={{ color: '#F7F5ee' }}>Talent</span>
          </h2>
          <button className="cta-type-btn" style={{ background: 'var(--purple)', color: '#fff' }}>Enter Factory →</button>
        </div>
      </motion.div>
    </section>
  );
}

function CorporateView({ activeTab, setActiveTab }) {
  const containerRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="page-wrapper" style={{ position: 'relative' }}>
      {/* Scroll track container: 260vh total scroll distance */}
      <div ref={containerRef} style={{ position: 'relative', height: '260vh' }}>
        {/* Sticky viewport — stays pinned at top:0 for the ENTIRE duration of containerRef */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            zIndex: 1,
            overflow: 'hidden',
            background: '#0a0610',
          }}
        >
          <CorporateHeroAndProblems scrollProgress={heroProgress} />
        </div>
      </div>

      {/* Dark section — rolls up and hovers over the pinned "What Corporates Face" with straight normal edges and NO black shadow */}
      <div
        className="scroll-overlay-container"
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'var(--black)',
          marginTop: '-100vh',
          boxShadow: 'none',
          borderRadius: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <WeBuiltAntboxSection />
        <WhatWeBringSection />
        <ReadyToBuildTribesSection />
        <CorporateCTA />
      </div>
    </div>
  );
}

function HowItWorksCard({ step, index, totalCards, scrollYProgress }) {
  // Relative position from active focal center (-3 to +3)
  // Maps all 4 cards across [0, 0.82] so Step 04 locks in full view before unpinning
  const relPos = useTransform(scrollYProgress, (progress) => {
    const normalized = Math.min(progress / 0.82, 1.0);
    const currentPos = normalized * (totalCards - 1);
    return index - currentPos;
  });

  // Pure parametric semi-circle angle theta in radians
  const angle = useTransform(relPos, (rel) => {
    const clamped = Math.max(-2.2, Math.min(2.2, rel));
    return clamped * 0.48;
  });

  // Circle radius R = 480px
  const cardY = useTransform(angle, (th) => {
    const R = 480;
    return `${Math.sin(th) * R}px`;
  });

  // Circle x offset = R * (1 - cos(theta)) — perfectly arcs outward to right
  const cardX = useTransform(angle, (th) => {
    const R = 480;
    return `${(1 - Math.cos(th)) * R}px`;
  });

  // Smooth tangent angle along the circle arc
  const cardRotate = useTransform(angle, (th) => {
    return ((th * 180) / Math.PI) * 0.6;
  });

  const cardScale = useTransform(relPos, (rel) => {
    const dist = Math.abs(rel);
    return Math.max(0.82, 1.05 - dist * 0.15);
  });

  // Smooth opacity curve: 1 at focal center, fading cleanly to 0 at extremes
  const cardOpacity = useTransform(relPos, (rel) => {
    const dist = Math.abs(rel);
    if (dist <= 0.35) return 1;
    if (dist >= 1.4) return 0;
    return Math.max(0, 1 - (dist - 0.35) * 0.95);
  });

  const zIndex = useTransform(relPos, (rel) => {
    return Math.round(50 - Math.abs(rel) * 10);
  });

  const pointScale = useTransform(relPos, (rel) => {
    const dist = Math.abs(rel);
    return dist <= 0.35 ? 1.35 : 0.85;
  });

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: 'min(520px, 90%)',
        right: 'clamp(0.5rem, 2.5vw, 3rem)',
        borderRadius: '26px',
        x: cardX,
        y: cardY,
        rotate: cardRotate,
        opacity: cardOpacity,
        scale: cardScale,
        zIndex: zIndex,
        transformOrigin: 'left center',
        pointerEvents: 'none',
      }}
    >
      {/* Point attached to card - clean, zero shadow */}
      <motion.div
        style={{
          position: 'absolute',
          left: '-11px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'var(--accent-purple)',
          border: '3.5px solid #F7F5EE',
          boxShadow: 'none',
          scale: pointScale,
          zIndex: 10,
        }}
      />

      {/* Dominant Large Card Body - NO SHADOW */}
      <div
        style={{
          borderRadius: '26px',
          overflow: 'hidden',
          boxShadow: 'none',
          border: '1.5px solid rgba(187, 98, 222, 0.45)',
          background: '#240a2f',
          pointerEvents: 'auto',
        }}
      >
        <div style={{
          minHeight: '200px',
          background: '#240a2f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '2.1rem 2.4rem',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.9rem' }}>
            <span style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 900,
              color: 'var(--accent-purple)',
              letterSpacing: '1.2px',
            }}>{step.label}</span>
            <span style={{ width: '26px', height: '2px', background: 'rgba(187, 98, 222, 0.6)' }}></span>
          </div>

          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.2rem, 1.9vw, 1.5rem)',
            color: '#ffffff',
            lineHeight: 1.42,
            margin: 0,
            maxWidth: '440px',
          }}>{step.gap}</p>
        </div>

        <div style={{
          background: '#180620',
          padding: '0.9rem 2.4rem',
          borderTop: '2px solid var(--accent-purple)',
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--accent-purple)',
            color: '#ffffff',
            padding: '0.35rem 1.2rem',
            borderRadius: '50px',
            fontSize: '0.78rem',
            fontWeight: 900,
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}>THE GAP</span>
        </div>
      </div>
    </motion.div>
  );
}

function CandidateHowItWorks() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const steps = [
    {
      label: '01',
      gap: 'Getting rejected by automated resume scanners without getting a chance to show real skills.',
      solution: 'Discover Your Career Pathway Early',
      body: 'Participate in AntBox campus roadshows and hands-on workshops. Identify your core strengths and learn market-relevant tools long before placement season opens.',
      accent: '#BB62DE'
    },
    {
      label: '02',
      gap: 'Zero real-world project exposure before your first full-time role.',
      solution: 'Build Proof of Work, Not Just Resumes',
      body: 'Work on real-world micro-internships with actual corporate briefs. Show hiring managers proof of what you can build, rather than just listing skills on paper.',
      accent: '#e093ff'
    },
    {
      label: '03',
      gap: 'Waiting months during placement season with endless interview rounds and uncertainty.',
      solution: 'Skip the Resume Queue',
      body: 'Top companies evaluate your live performance on micro-projects instead of filtering you out with generic criteria.',
      accent: '#BB62DE'
    },
    {
      label: '04',
      gap: 'Unsure how to bridge the gap between classroom theory and industry expectations.',
      solution: 'Fast-Track Offers & Zero Retraining',
      body: 'Land job offers faster with complete confidence. Step into your role on Day 1 ready to deliver, without the fear of revoked offers or post-hiring lag.',
      accent: '#d580ff'
    },
  ];

  const totalCards = steps.length;
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const normalized = Math.min(latest / 0.82, 1.0);
      const focalIdx = Math.min(
        Math.max(0, Math.round(normalized * (totalCards - 1))),
        totalCards - 1
      );
      setActiveStep(focalIdx);
    });
  }, [scrollYProgress, totalCards]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '350vh',
        background: '#F7F5EE',
        overflow: 'visible',
      }}
    >
      {/* Sticky wrapper — stays locked, stationary and pinned for the entire duration of all 4 card animations */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',
        padding: '5.5rem clamp(2.5rem, 5.5vw, 6.5rem) 2rem',
      }}>
        {/* LEFT — Section Title at Top & Active Solution in Center */}
        <div style={{
          flex: '0 0 48%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '75vh',
          zIndex: 2,
          paddingRight: '2rem',
        }}>
          {/* Top Section Header — shifted upwards to anchor the section */}
          <div style={{ paddingTop: '0.5rem' }}>
            <h2 style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(3.5rem, 5.8vw, 5.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 0.92,
              color: 'var(--black)',
              margin: 0,
              textTransform: 'uppercase',
            }}>
              HOW <span style={{ color: 'var(--accent-purple)' }}>IT WORKS</span>
            </h2>
          </div>

          {/* Center Active Solution Container */}
          <div style={{ width: '100%', maxWidth: '620px', margin: 'auto 0' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%' }}
              >
                {/* Heading with prominent vertical accent bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.35rem', marginBottom: '1.4rem' }}>
                  <div
                    style={{
                      width: '6px',
                      height: 'clamp(2.5rem, 4vw, 3.6rem)',
                      borderRadius: '999px',
                      background: steps[activeStep].accent || 'var(--accent-purple)',
                      flexShrink: 0,
                    }}
                  />
                  <h3 style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'clamp(2.2rem, 3.4vw, 3.1rem)',
                    fontWeight: 800,
                    color: 'var(--black)',
                    lineHeight: 1.15,
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}>{steps[activeStep].solution}</h3>
                </div>

                {/* Description body underneath */}
                <p style={{
                  fontFamily: 'Century Gothic, sans-serif',
                  fontSize: 'clamp(1.2rem, 1.7vw, 1.5rem)',
                  color: '#383838',
                  lineHeight: 1.62,
                  paddingLeft: '1.75rem',
                  margin: 0,
                  fontWeight: 400,
                }}>{steps[activeStep].body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — Animated Cards moving on pure semi-circle arc with NO shadow */}
        <div style={{
          flex: '0 0 52%',
          position: 'relative',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'visible',
        }}>
          {steps.map((step, i) => (
            <HowItWorksCard
              key={i}
              step={step}
              index={i}
              totalCards={totalCards}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CandidateStorySection() {
  return (
    <section
      className="w-full relative z-10"
      style={{
        background: '#F7F5EE',
        padding: 'clamp(2rem, 4vw, 4.5rem) clamp(1.5rem, 5vw, 6.5rem)',
        borderTop: 'none',
      }}
    >
      <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left: Interactive Profile / Proof Card */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex items-center justify-start relative w-full"
        >
          {/* Main Profile Card */}
          <div
            className="relative w-full max-w-[540px] bg-white rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100"
          >
            {/* Top Right Floating Badge */}
            <div
              className="absolute -top-3.5 right-4 sm:-right-3 bg-white px-4 py-1.5 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-neutral-100 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--accent-purple)] inline-block" />
              <span className="text-xs font-bold text-neutral-800 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                PPO Received
              </span>
            </div>

            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-[#f6effb] text-[var(--accent-purple)] flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-lg sm:text-xl text-[var(--black)] leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Priya Sharma
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  Final Year · Computer Science
                </p>
              </div>
            </div>

            {/* Skills & Metrics Progress Bars */}
            <div className="space-y-5 mb-7">
              {/* Sprint Completion */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] sm:text-xs font-extrabold tracking-wider text-neutral-500 uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    SPRINT COMPLETION
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#ece7dc] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '82%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-[var(--accent-purple)]"
                  />
                </div>
              </div>

              {/* Communication Skills */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] sm:text-xs font-extrabold tracking-wider text-neutral-500 uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    COMMUNICATION SKILLS
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#ece7dc] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '66%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-[var(--accent-purple)]"
                  />
                </div>
              </div>

              {/* Problem Solving */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] sm:text-xs font-extrabold tracking-wider text-neutral-500 uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    PROBLEM SOLVING
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#ece7dc] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '52%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-[var(--accent-purple)]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Left Floating Badge */}
            <div
              className="absolute -bottom-3.5 left-6 bg-white px-4 py-1.5 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-neutral-100 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--accent-purple)] inline-block" />
              <span className="text-xs font-bold text-neutral-800 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Readiness: 88%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right: Typography & Sequentially Appearing Feature Cards */}
        <div className="lg:col-span-6 flex flex-col justify-center lg:items-end w-full">
          <div className="w-full max-w-[560px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-[var(--black)] leading-[1.06] mb-3"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Own your <br />
                <span
                  style={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontStyle: 'italic',
                    color: 'var(--accent-purple)',
                    fontWeight: 700,
                  }}
                >
                  career story.
                </span>
              </h2>
              <p
                className="text-neutral-600 text-base sm:text-lg mb-6 leading-relaxed font-normal"
                style={{ fontFamily: 'Century Gothic, sans-serif' }}
              >
                Stop waiting for opportunities. Sprints put you in the room with the companies you want to work for, before graduation.
              </p>
            </motion.div>

            {/* Vertical list of cards appearing one by one on scroll and staying permanently */}
            <div className="space-y-3.5 w-full">
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-neutral-100 transition-all hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 duration-200"
              >
                <h3 className="font-bold text-base sm:text-lg text-[var(--black)] leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Real briefs, real companies
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed font-normal" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  Work on actual projects, not case studies and build a portfolio that speaks for itself.
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-neutral-100 transition-all hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 duration-200"
              >
                <h3 className="font-bold text-base sm:text-lg text-[var(--black)] leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Fast-track to Pre-Placement Offers
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed font-normal" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  Top sprint performers get direct PPOs from participating companies. No resume round.
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-neutral-100 transition-all hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 duration-200"
              >
                <h3 className="font-bold text-base sm:text-lg text-[var(--black)] leading-snug" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  AI-validated readiness score
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed font-normal" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
                  Your profile includes an AntBox Readiness Score, trusted by 340+ enterprises.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CandidateView() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Multi-layer parallax transforms (inspired by Osmo layered depth):
  // Layer 1: Background audience & auditorium (Deepest plane, smooth pan & scale)
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.14]);

  // Layer 2: Hero Headline & Subtitle (Middle plane, glides upwards & fades with depth)
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <div className="page-wrapper candidate-view" style={{ position: 'relative' }}>
      {/* 100vh Full-screen Multi-layer Parallax Hero Section */}
      <div
        ref={heroRef}
        className="candidate-hero-bg"
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '100vh',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Parallax Layer 1: Background Audience & Stage with smooth lens blur */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            y: bgY,
            scale: bgScale,
            transformOrigin: '20% 25%',
            zIndex: 1,
          }}
        >
          <img
            src="/rohit-hero-clean.png"
            alt="Antbox Candidate Experience"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              display: 'block',
              filter: 'brightness(1.02) contrast(1.02)',
            }}
          />
        </motion.div>

        {/* Ambient Tone Overlay: Balanced contrast for text and foreground subject */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: 'linear-gradient(to right, rgba(10, 10, 14, 0.35) 0%, rgba(10, 10, 14, 0.15) 30%, rgba(10, 10, 14, 0.35) 70%, rgba(10, 10, 14, 0.70) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Parallax Layer 2: Floating Hero Typography (Middle Depth Plane) */}
        <div
          className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 py-12 relative flex items-center justify-end"
          style={{ width: '100%', height: '100%', zIndex: 5, paddingRight: 'clamp(1.5rem, 5vw, 5rem)' }}
        >
          <motion.div
            style={{
              maxWidth: '560px',
              width: '100%',
              y: textY,
              scale: textScale,
              opacity: textOpacity,
            }}
            className="flex flex-col justify-center text-left"
          >
            <h1
              className="hero-title heading-serif"
              style={{
                color: '#ffffff',
                fontSize: 'clamp(2.75rem, 5.2vw, 5.2rem)',
                textTransform: 'uppercase',
                lineHeight: 1.02,
                letterSpacing: '-0.04em',
                textShadow: '0 2px 24px rgba(0, 0, 0, 0.85), 0 4px 48px rgba(0, 0, 0, 0.7)',
              }}
            >
              <span style={{ display: 'block' }}>CAMPUS TO</span>
              <span style={{ display: 'block', color: 'var(--accent-purple)', textShadow: '0 0 30px rgba(187, 98, 222, 0.6), 0 2px 20px rgba(0,0,0,0.8)' }}>CORPORATE</span>
              <span style={{ display: 'block' }}>WITHOUT THE</span>
              <span style={{ display: 'block', color: 'var(--accent-purple)', textShadow: '0 0 30px rgba(187, 98, 222, 0.6), 0 2px 20px rgba(0,0,0,0.8)' }}>GUESSWORK</span>
            </h1>
            <p
              className="hero-subtitle"
              style={{
                color: '#ffffff',
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                marginTop: '1.75rem',
                fontWeight: 500,
                lineHeight: 1.5,
                maxWidth: '540px',
                textShadow: '0 2px 16px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 0.8)',
              }}
            >
              Stop applying blindly. Start building real proof of work.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content flow section: Starts cleanly below the hero */}
      <div
        className="candidate-content-flow scroll-overlay-container"
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'var(--black)',
          marginTop: 0,
          boxShadow: 'none',
          borderRadius: 0,
        }}
      >
        <CandidateFriction />

        <CandidateHowItWorks />
        <div style={{ position: 'relative', zIndex: 10, background: '#F7F5EE' }}>
          <CandidateStorySection />
          <CandidateCTA />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { activeTab } = useTab();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [activeTab, mounted]);

  const currentTab = mounted ? activeTab : 'corporates';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflowX: 'clip',
        background: currentTab === 'corporates' ? '#F7F5EE' : 'var(--black)',
        transition: 'background 0.45s ease',
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {currentTab === 'corporates' ? (
          <motion.div
            key="corporate"
            initial={false}
            animate={{ opacity: 1, scale: 1, borderRadius: '0px' }}
            exit={{ opacity: 0, scale: 0.92, borderRadius: '28px' }}
            transition={{
              duration: 0.48,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              width: '100%',
              transformOrigin: '50% 25vh',
              overflow: 'visible',
            }}
          >
            <CorporateView />
          </motion.div>
        ) : (
          <motion.div
            key="candidate"
            initial={false}
            animate={{ opacity: 1, scale: 1, borderRadius: '0px' }}
            exit={{ opacity: 0, scale: 0.92, borderRadius: '28px' }}
            transition={{
              duration: 0.48,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              width: '100%',
              transformOrigin: '50% 25vh',
              overflow: 'visible',
            }}
          >
            <CandidateView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
