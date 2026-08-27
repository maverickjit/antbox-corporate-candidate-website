"use client";
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion';
import AnimatedNumber from '@/components/ui/animated-number';
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

// 3D Typographic Roller Item in "WHAT WE BRING" (Pure text roller matching bringcards.mp4)
function BringTypographyRollerItem({ card, index, totalCards, scrollYProgress }) {
  // Signed distance from active center focal point
  const signedRel = useTransform(scrollYProgress, (progress) => {
    const current = progress * (totalCards - 1);
    return index - current;
  });

  const absRel = useTransform(signedRel, (s) => Math.abs(s));

  // 3D Half-roller curvature (curves back into screen above and below center)
  const rotateX = useTransform(signedRel, (s) => {
    const clamped = Math.max(-2.5, Math.min(2.5, s));
    return `${-clamped * 18}deg`;
  });

  const translateZ = useTransform(absRel, (dist) => {
    return `${Math.max(-70, 16 - dist * 38)}px`;
  });

  const textScale = useTransform(absRel, [0, 0.45, 1.2], [1.04, 0.94, 0.88]);
  // Active item 100% visible; inactive items are faint ghost text (rarely visible)
  const textOpacity = useTransform(absRel, [0, 0.35, 0.8], [1.0, 0.16, 0.06]);

  // Smoothly reveal full explanation text when item is active on scroll
  const descOpacity = useTransform(absRel, [0, 0.38, 0.7], [1.0, 0.25, 0]);
  const descY = useTransform(absRel, [0, 0.38], [0, 6]);

  const zIndex = useTransform(absRel, (dist) => Math.round(50 - dist * 10));

  return (
    <motion.div
      style={{
        opacity: textOpacity,
        scale: textScale,
        rotateX: rotateX,
        z: translateZ,
        zIndex: zIndex,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        width: '100%',
        padding: '0.65rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'default',
      }}
    >
      {/* Main Title Typography */}
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
        <span
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(0.9rem, 1.2vw, 1.2rem)',
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
            fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
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
          maxWidth: '620px',
          marginTop: '0.45rem',
          padding: '0 1rem',
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#e2beff',
            fontSize: 'clamp(0.92rem, 1.15vw, 1.06rem)',
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

// Vertical ruler tick track on the right edge matching bringcards.mp4 (elongated across all text items)
function BringSideScrollTicker({ scrollYProgress }) {
  const totalTicks = 38;

  return (
    <div
      style={{
        position: 'absolute',
        right: 'clamp(0.75rem, 2.5vw, 3rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        height: 'clamp(360px, 46vh, 440px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {Array.from({ length: totalTicks }).map((_, i) => {
        const tickPos = i / (totalTicks - 1);
        return (
          <TickerLine
            key={i}
            tickPos={tickPos}
            scrollYProgress={scrollYProgress}
            isMajor={i % 5 === 0}
          />
        );
      })}
    </div>
  );
}

function TickerLine({ tickPos, scrollYProgress, isMajor }) {
  const opacity = useTransform(scrollYProgress, (p) => {
    const dist = Math.abs(p - tickPos);
    if (dist < 0.04) return 1.0;
    if (dist < 0.12) return 0.55;
    return isMajor ? 0.30 : 0.15;
  });

  const width = useTransform(scrollYProgress, (p) => {
    const dist = Math.abs(p - tickPos);
    if (dist < 0.04) return '18px';
    if (dist < 0.10) return isMajor ? '13px' : '9px';
    return isMajor ? '9px' : '5px';
  });

  const color = useTransform(scrollYProgress, (p) => {
    const dist = Math.abs(p - tickPos);
    return dist < 0.04 ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.7)';
  });

  return (
    <motion.div
      style={{
        height: '1.5px',
        width: width,
        backgroundColor: color,
        opacity: opacity,
        borderRadius: '1px',
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

  // Dynamic vertical drum centering so active card is always vertically centered within viewport safe area
  const drumY = useTransform(scrollYProgress, (progress) => {
    const current = progress * (totalCards - 1);
    return `${(2 - current) * 36}px`;
  });

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '260vh',
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
          justifyContent: 'flex-start',
          overflow: 'hidden',
          paddingTop: 'clamp(100px, 14vh, 125px)',
          paddingBottom: 'clamp(2rem, 4vh, 3.5rem)',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1060px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
          }}
        >
          <h2
            className="section-title heading-serif text-center"
            style={{
              color: '#ffffff',
              marginTop: '0',
              marginBottom: 'clamp(1.2rem, 2.5vh, 2.2rem)',
              fontSize: 'clamp(1.9rem, 3.4vw, 2.75rem)',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            WHAT WE <span style={{ color: 'var(--accent-purple)' }}>BRING</span>
          </h2>

          {/* 3D Half-Roller Cards Stage (Cards dynamically centered on scroll) */}
          <motion.div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              width: '100%',
              perspective: '1200px',
              transformStyle: 'preserve-3d',
              y: drumY,
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
          </motion.div>

          {/* Vertical scroll ticker / ruler track on the right */}
          <BringSideScrollTicker scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}

function CandidateCTA() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 15%"]
  });

  const clipPercent = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPathValue = useMotionTemplate`inset(${clipPercent}% 0 0 0)`;

  return (
    <section
      className="cta-section cta-typographic"
      ref={sectionRef}
      style={{
        position: 'relative',
        background: 'var(--cream)',
        minHeight: '100vh',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', height: '100%', minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Layer 1: Light Cream base */}
        <div style={{ position: 'relative', zIndex: 1, padding: '4rem 2rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="cta-type-inner" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', maxWidth: '1200px' }}>
            <h2 className="cta-type-headline" style={{ color: 'var(--black)', fontSize: 'clamp(3rem, 6.5vw, 5.5rem)', lineHeight: 1.1 }}>
              Ready to Take Control<br />of Your Career Path?
            </h2>
            <p className="cta-eyebrow" style={{ color: 'var(--text-secondary)', marginTop: '1.75rem', fontSize: '1.35rem', maxWidth: '750px', lineHeight: 1.5, textTransform: 'none', letterSpacing: '0px' }}>
              Build real proof of work, work on micro-internships, and land your dream job without the guesswork.
            </p>
            <button className="cta-type-btn" style={{ background: 'var(--purple)', color: '#fff', marginTop: '2.5rem', padding: '1.25rem 3.5rem', fontSize: '1.25rem', borderRadius: '9999px' }}>
              Get Started →
            </button>
          </div>
        </div>

        {/* Layer 2: Full-screen Purple wipe smoothly covering the whole screen */}
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'var(--purple)', zIndex: 2, padding: '4rem 2rem',
            overflow: 'hidden', clipPath: clipPathValue, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
          }}
        >
          <div className="cta-type-inner" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', maxWidth: '1200px', width: '100%' }}>
            <h2 className="cta-type-headline" style={{ color: '#fff', fontSize: 'clamp(3rem, 6.5vw, 5.5rem)', lineHeight: 1.1 }}>
              Ready to Take Control<br />of Your Career Path?
            </h2>
            <p className="cta-eyebrow" style={{ color: '#f0f0f0', marginTop: '1.75rem', fontSize: '1.35rem', maxWidth: '750px', lineHeight: 1.5, textTransform: 'none', letterSpacing: '0px' }}>
              Build real proof of work, work on micro-internships, and land your dream job without the guesswork.
            </p>
            <button className="cta-type-btn" style={{ background: 'var(--black)', color: '#fff', marginTop: '2.5rem', padding: '1.25rem 3.5rem', fontSize: '1.25rem', borderRadius: '9999px' }}>
              Get Started →
            </button>
          </div>
        </motion.div>
      </div>
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
    return scrollYProgress.onChange(latest => {
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
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="problems-section candidate-friction" ref={sectionRef} style={{ minHeight: '85vh', padding: '4.5rem 0 2rem', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', background: 'transparent', padding: '0 clamp(2rem, 5vw, 5rem)' }}>
        <h2
          ref={titleRef}
          className="friction-header"
          style={{
            marginBottom: '0.85rem',
            textAlign: 'left',
            perspective: '800px',
            display: 'block',
          }}
        >
          <span
            style={{
              display: 'block',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1)',
              transform: flipped ? 'rotateY(0deg)' : 'rotateY(-90deg)',
              transitionDelay: '0s',
            }}
          >THE</span>
          <span
            style={{
              display: 'block',
              fontFamily: '"Poppins", sans-serif',
              fontStyle: 'normal',
              fontWeight: 800,
              color: 'var(--accent-purple)',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1)',
              transform: flipped ? 'rotateY(0deg)' : 'rotateY(-90deg)',
              transitionDelay: '0.15s',
            }}
          >FRICTION</span>
        </h2>

        <div className="process-layout" style={{ width: '100%', marginTop: '1rem' }}>
          <div className="process-timeline" style={{ display: 'flex', gap: '2.5rem', width: '100%', position: 'relative' }}>
            <motion.div className="process-timeline-active-line" style={{ position: 'absolute', top: 0, left: 0, height: '2px', background: 'var(--accent-purple)', zIndex: 2, transformOrigin: 'left', scaleX: lineScaleX, width: '100%' }}></motion.div>

            {/* Step 01 */}
            <motion.div
              className={`process-step ${activeStep >= 0 ? 'active' : ''}`}
              animate={{ opacity: activeStep >= 0 ? 1 : 0.35, y: activeStep >= 0 ? 0 : 15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ flex: 1, position: 'relative', paddingTop: '0.85rem' }}
            >
              <div
                className="process-number"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                  color: activeStep >= 0 ? 'var(--accent-purple)' : 'rgba(255,255,255,0.2)',
                  marginBottom: '0.75rem',
                  textShadow: 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                01
              </div>
              <h3 className="tc-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--cream)', marginBottom: '0.5rem' }}>Outdated Campus Tech Stack</h3>
              <p className="tc-body" style={{ color: '#a6a6a6', fontSize: '0.98rem', lineHeight: 1.6 }}>AI and tech evolve every 12 months, but university courses take years to update. What you learn in class often falls short of what top companies demand on Day 1.</p>
            </motion.div>

            {/* Step 02 */}
            <motion.div
              className={`process-step ${activeStep >= 1 ? 'active' : ''}`}
              animate={{ opacity: activeStep >= 1 ? 1 : 0.35, y: activeStep >= 1 ? 0 : 15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ flex: 1, position: 'relative', paddingTop: '0.85rem' }}
            >
              <div
                className="process-number"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                  color: activeStep >= 1 ? 'var(--accent-purple)' : 'rgba(255,255,255,0.2)',
                  marginBottom: '0.75rem',
                  textShadow: 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                02
              </div>
              <h3 className="tc-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--cream)', marginBottom: '0.5rem' }}>Judged in Hours After 4 Years</h3>
              <p className="tc-body" style={{ color: '#a6a6a6', fontSize: '0.98rem', lineHeight: 1.6 }}>Traditional hiring compresses your entire degree into a single resume screening or a 30-minute interview, leading to higher drop-offs and missed opportunities.</p>
            </motion.div>

            {/* Step 03 */}
            <motion.div
              className={`process-step ${activeStep >= 2 ? 'active' : ''}`}
              animate={{ opacity: activeStep >= 2 ? 1 : 0.35, y: activeStep >= 2 ? 0 : 15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ flex: 1, position: 'relative', paddingTop: '0.85rem' }}
            >
              <div
                className="process-number"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                  color: activeStep >= 2 ? 'var(--accent-purple)' : 'rgba(255,255,255,0.2)',
                  marginBottom: '0.75rem',
                  textShadow: 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                03
              </div>
              <h3 className="tc-heading" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--cream)', marginBottom: '0.5rem' }}>The Experience Needed Paradox</h3>
              <p className="tc-body" style={{ color: '#a6a6a6', fontSize: '0.98rem', lineHeight: 1.6 }}>Companies expect prior experience for entry-level roles, but few give you the chance to gain it. Over 77% of grads end up learning everything from scratch on the job.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}



// Combined Scene: Hero ("Where talent IS Built not found") + "What Corporates Face"
// 1. Initial state (scroll=0): ONLY "Where talent IS Built not found" is visible. WCF opacity is 0.
// 2. Scroll: "Where talent / IS / not found" fly away.
// 3. "BUILT" zooms in and dissolves; "WHAT CORPORATES FACE" appears directly behind "BUILT".
// 4. "WHAT CORPORATES FACE" remains completely still until covered by dark curtain.
function CorporateHeroAndProblems({ scrollProgress }) {
  // 1. "Where talent", "IS", and "not found" fly completely off screen and vanish immediately (0 to 0.035)
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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--cream)' }}>
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
                <RollingNumber value="$4,700+" isAnimating={statsVisible} />
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

      {/* Layer 2: Hero Section ("Where talent IS Built not found") on top */}
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
          <motion.div
            style={{ x: leftX, opacity: topOpacity, display: peripheralDisplay }}
            className="text-on-surface text-[clamp(36px,8vw,120px)] whitespace-nowrap block"
          >
            Where talent
          </motion.div>

          <div className="flex items-center justify-center gap-4 text-[clamp(36px,8vw,120px)] w-full">
            <motion.div style={{ x: isX, opacity: isOpacity, display: peripheralDisplay }} className="text-on-surface lowercase">
              IS
            </motion.div>
            <motion.div
              style={{ scale: builtScale, opacity: builtOpacity, transformOrigin: '47.5% 50%', zIndex: 50 }}
              className="text-[var(--accent-purple)] pointer-events-none"
            >
              Built
            </motion.div>
          </div>

          <motion.div style={{ x: rightX, opacity: topOpacity, display: peripheralDisplay }}>
            <span
              className="text-primary block"
              style={{
                fontFamily: 'var(--font-times)',
                fontStyle: 'italic',
                fontSize: 'clamp(32px,7vw,100px)',
                lineHeight: 1,
                textTransform: 'none',
                letterSpacing: 'normal',
                fontWeight: 'normal',
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
      {/* Base layer — light yellow/cream */}
      <div style={{
        position: 'absolute', inset: 0, background: 'var(--cream)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div className="cta-type-inner">
          <p className="cta-eyebrow" style={{ color: 'var(--dark-grey)' }}>The next era of hiring</p>
          <h2 className="cta-type-headline">
            <span className="cta-line cta-line-italic" style={{ color: 'var(--black)' }}>The future is</span>
            <span className="cta-line cta-line-bold" style={{ color: 'var(--black)' }}>Pre-Built</span>
            <span className="cta-line cta-line-italic" style={{ color: 'var(--black)' }}>Talent</span>
          </h2>
          <button className="cta-type-btn" style={{ background: 'var(--purple)', color: '#fff' }}>Enter Factory →</button>
        </div>
      </div>

      {/* Top purple layer — clips in from top on scroll down, clips out on scroll up */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'var(--purple)',
          clipPath: clipPathValue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <div className="cta-type-inner">
          <p className="cta-eyebrow" style={{ color: 'rgba(43,12,55,0.7)' }}>The next era of hiring</p>
          <h2 className="cta-type-headline">
            <span className="cta-line cta-line-italic" style={{ color: 'var(--cream)' }}>The future is</span>
            <span className="cta-line cta-line-bold" style={{ color: 'var(--cream)' }}>Pre-Built</span>
            <span className="cta-line cta-line-italic" style={{ color: 'var(--cream)' }}>Talent</span>
          </h2>
          <button className="cta-type-btn" style={{ background: 'var(--black)', color: '#fff' }}>Get Pipeline →</button>
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
            background: 'var(--cream)',
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
        <CorporateCTA />
      </div>
    </div>
  );
}

// Sub-component: each card handles its position on the continuous rotating semi-circle carousel wheel
function HowItWorksCard({ step, index, totalCards, scrollYProgress }) {
  // Relative position from active focal center (-3 to +3)
  // When scroll reaches index / (totalCards - 1), relPos is 0 (focal center)
  const relPos = useTransform(scrollYProgress, (progress) => {
    const currentPos = progress * (totalCards - 1);
    return index - currentPos;
  });

  // Generous 330px vertical spacing ensuring adjacent cards never collide or overlap
  const cardY = useTransform(relPos, (rel) => {
    return `${rel * 330}px`;
  });

  const cardX = useTransform(relPos, (rel) => {
    return `${Math.pow(Math.abs(rel), 1.7) * 44}px`;
  });

  // Fixed horizontal orientation at all times (cards stay level, no tilting)
  const cardScale = useTransform(relPos, (rel) => {
    const dist = Math.abs(rel);
    return Math.max(0.86, 1.0 - dist * 0.08);
  });

  // Active main card is 100% solid and crystal clear; all other cards remain softly blurred
  const cardBlur = useTransform(relPos, (rel) => {
    const dist = Math.abs(rel);
    if (dist <= 0.35) return 0;
    return Math.min(8, (dist - 0.35) * 6.5);
  });
  const cardFilter = useMotionTemplate`blur(${cardBlur}px)`;

  // Opacity: 1 at focal center, blurred above/below cards remain visible in place
  const cardOpacity = useTransform(relPos, (rel) => {
    const dist = Math.abs(rel);
    if (dist <= 0.4) return 1;
    if (dist >= 2.2) return 0;
    return Math.max(0.38, 1 - (dist - 0.4) * 0.35);
  });

  const zIndex = useTransform(relPos, (rel) => {
    return Math.round(50 - Math.abs(rel) * 12);
  });

  // Point scale on axis line
  const pointScale = useTransform(relPos, (rel) => {
    const dist = Math.abs(rel);
    return dist <= 0.35 ? 1.35 : 0.9;
  });

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: 'min(430px, 86%)',
        right: 'clamp(2rem, 4.5vw, 4rem)',
        borderRadius: '24px',
        overflow: 'visible',
        x: cardX,
        y: cardY,
        rotate: 0,
        opacity: cardOpacity,
        filter: cardFilter,
        scale: cardScale,
        zIndex: zIndex,
        transformOrigin: 'left center',
      }}
    >
      {/* Point attached to card riding directly on the curved axis line */}
      <motion.div
        style={{
          position: 'absolute',
          left: '-10px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'var(--accent-purple)',
          border: '3px solid #F7F5EE',
          boxShadow: '0 0 14px rgba(187, 98, 222, 0.95)',
          scale: pointScale,
          zIndex: 10,
        }}
      />

      {/* Card body */}
      <div
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          border: '1px solid rgba(187, 98, 222, 0.35)',
          background: '#240a2f',
        }}
      >
        {/* Gap statement area — solid brand purple, completely opaque */}
        <div style={{
          minHeight: '170px',
          background: '#240a2f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '1.85rem 1.85rem',
          position: 'relative',
        }}>
          {/* The GAP text — big and bold */}
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
            color: '#ffffff',
            lineHeight: 1.42,
            margin: 0,
            maxWidth: '390px',
          }}>{step.gap}</p>
        </div>

        {/* Footer bar — THE GAP badge */}
        <div style={{
          background: '#180620',
          padding: '0.75rem 1.85rem',
          borderTop: '2px solid var(--accent-purple)',
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--accent-purple)',
            color: '#ffffff',
            padding: '0.3rem 1rem',
            borderRadius: '50px',
            fontSize: '0.68rem',
            fontWeight: 900,
            letterSpacing: '1.5px',
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
      color: '#2b0c37',
      accent: '#BB62DE'

    },
    {
      label: '02',
      gap: 'Zero real-world project exposure before your first full-time role.',
      solution: 'Build Proof of Work, Not Just Resumes',
      body: 'Work on real-world micro-internships with actual corporate briefs. Show hiring managers proof of what you can build, rather than just listing skills on paper.',
      color: '#1a0826',
      accent: '#e093ff'

    },
    {
      label: '03',
      gap: 'Waiting months during placement season with endless interview rounds and uncertainty.',
      solution: 'Skip the Resume Queue',
      body: 'Top companies evaluate your live performance on micro-projects instead of filtering you out with generic criteria.',
      color: '#0f0518',
      accent: '#BB62DE'

    },
    {
      label: '04',
      gap: 'Unsure how to bridge the gap between classroom theory and industry expectations.',
      solution: 'Fast-Track Offers & Zero Retraining',
      body: 'Land job offers faster with complete confidence. Step into your role on Day 1 ready to deliver, without the fear of revoked offers or post-hiring lag.',
      color: '#200840',
      accent: '#d580ff'
    },
  ];

  const totalCards = steps.length;
  const [activeStep, setActiveStep] = useState(0);

  // For each card, determine which step it maps to (0-1 range per card)
  useEffect(() => {
    return scrollYProgress.onChange(latest => {
      const stepSize = 1 / totalCards;
      const idx = Math.min(Math.floor(latest / stepSize), totalCards - 1);
      setActiveStep(idx);
    });
  }, [scrollYProgress, totalCards]);

  return (
    <section ref={sectionRef} style={{
      position: 'relative',
      height: '135vh',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      background: 'var(--cream)',
      zIndex: 10,
    }}>
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* LEFT — Title pushed down from navbar, expanded left section */}
        <div style={{
          flex: '0 0 56%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 6rem)',
          zIndex: 2,
        }}>
          {/* Top Title: HOW IT WORKS — balanced modern scale */}
          <div style={{ position: 'absolute', top: 'clamp(4.2rem, 7.5vh, 5.8rem)', left: 'clamp(2rem, 5vw, 6rem)' }}>
            <h2 style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              color: 'var(--black)',
              margin: 0,
              textTransform: 'uppercase',
            }}>
              HOW <span style={{ color: 'var(--accent-purple)' }}>IT WORKS</span>
            </h2>
          </div>

          {/* Active Solution Container — perfectly proportioned */}
          <div style={{ width: '100%', maxWidth: '580px', marginTop: '2.5rem' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%' }}
              >
                {/* Heading with side vertical accent bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '5px',
                      height: 'clamp(2.2rem, 3.2vw, 2.8rem)',
                      borderRadius: '999px',
                      background: steps[activeStep].accent || 'var(--accent-purple)',
                      flexShrink: 0,
                    }}
                  />
                  <h3 style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
                    fontWeight: 800,
                    color: 'var(--black)',
                    lineHeight: 1.2,
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}>{steps[activeStep].solution}</h3>
                </div>

                {/* Description body underneath */}
                <p style={{
                  fontFamily: 'Century Gothic, sans-serif',
                  fontSize: 'clamp(1.02rem, 1.35vw, 1.18rem)',
                  color: '#383838',
                  lineHeight: 1.6,
                  paddingLeft: '1.45rem',
                  margin: 0,
                  fontWeight: 400,
                }}>{steps[activeStep].body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — circular arc guide line and animated cards matching WOVE structure */}
        <div style={{
          flex: '0 0 42%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'visible',
        }}>
          {/* Precise Semi-Circle Track (R = 500px) matching card point trajectory */}
          <div
            style={{
              position: 'absolute',
              right: 'calc(clamp(2rem, 4.5vw, 4rem) - 500px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '1000px',
              height: '1000px',
              borderRadius: '50%',
              border: '2px dashed rgba(187, 98, 222, 0.35)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

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

const hiringCompanies = [
  {
    name: 'SKYDO',
    symbol: '◆',
    color: '#38BDF8',
    category: 'Cross-border Payments',
    desc: 'B2B cross-border payment platform with zero-markup FX for global exporters.',
    roles: 'Full Stack, Growth Ops',
    hired: '4 Hired',
  },
  {
    name: 'QAPITA',
    symbol: '●',
    color: '#2DD4BF',
    category: 'CapTable & Equity SaaS',
    desc: 'Digital equity management and private market liquidity software platform.',
    roles: 'Backend Dev, Product Analyst',
    hired: '6 Hired',
  },
  {
    name: 'KUTLERRI',
    symbol: '▲',
    color: '#FB923C',
    category: 'Smart Kitchen Tech',
    desc: 'Next-gen automated culinary hardware and connected kitchen systems.',
    roles: 'Frontend Dev, Supply Ops',
    hired: '3 Hired',
  },
  {
    name: 'LEADRAT',
    symbol: '■',
    color: '#A78BFA',
    category: 'Real Estate CRM',
    desc: 'High-velocity lead management and sales acceleration platform for developers.',
    roles: 'Full Stack, QA Eng',
    hired: '5 Hired',
  },
  {
    name: 'RAZORPAY',
    symbol: '★',
    color: '#F43F5E',
    category: 'Payments & Neo-banking',
    desc: 'Full-stack financial services and payments infrastructure unicorn.',
    roles: 'Platform Eng, Backend Systems',
    hired: '8 Hired',
  },
  {
    name: 'CRED',
    symbol: '●',
    color: '#E2E8F0',
    category: 'Fintech Ecosystem',
    desc: 'Premium rewards and high-trust financial ecosystem platform.',
    roles: 'Mobile Dev, UI/UX Designer',
    hired: '4 Hired',
  },
  {
    name: 'DEEL',
    symbol: '◆',
    color: '#60A5FA',
    category: 'Global Payroll & HR',
    desc: 'International contractor compliance and automated global payroll solutions.',
    roles: 'Full Stack, Compliance Ops',
    hired: '7 Hired',
  },
  {
    name: 'ZETA',
    symbol: '▲',
    color: '#F472B6',
    category: 'Next-Gen Core Banking',
    desc: 'Cloud-native modern banking stack powering scalable credit & cards programs.',
    roles: 'Java Systems, Cloud Eng',
    hired: '5 Hired',
  },
];

function CompanyLogoBadge({ company }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative shrink-0 flex items-center gap-2 cursor-pointer font-bold text-sm select-none"
      style={{
        background: isHovered ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
        color: '#fff',
        border: isHovered ? `1px solid ${company.color}` : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '0.9rem 2rem',
        boxShadow: 'none',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        zIndex: isHovered ? 50 : 1,
        transition: 'border 0.2s, background 0.2s, transform 0.2s',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ color: company.color }}>{company.symbol}</span>
      <span>{company.name}</span>

      {/* Floating brief card on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '250px',
              background: '#16161a',
              border: `1px solid ${company.color}88`,
              borderRadius: '14px',
              padding: '0.75rem 0.9rem',
              boxShadow: 'none',
              zIndex: 9999,
              pointerEvents: 'none',
              textAlign: 'left',
              whiteSpace: 'normal',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.88rem', color: '#fff', whiteSpace: 'nowrap' }}>
                <span style={{ color: company.color }}>{company.symbol}</span>
                {company.name}
              </div>
              <span
                style={{
                  fontSize: '0.62rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.08)',
                  color: company.color,
                  fontWeight: 600,
                  border: `1px solid ${company.color}44`,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {company.category}
              </span>
            </div>

            {/* Description */}
            <p style={{ margin: '0 0 0.45rem', fontSize: '0.74rem', color: '#b3b3b3', lineHeight: 1.35, fontWeight: 400 }}>
              {company.desc}
            </p>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.68rem' }}>
              <span style={{ color: '#888' }}>Roles: <strong style={{ color: '#e5e5e5', fontWeight: 600 }}>{company.roles}</strong></span>
              <span style={{ color: 'var(--accent-purple)', fontWeight: 700, background: 'rgba(187,98,222,0.15)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                ✓ {company.hired}
              </span>
            </div>

            {/* Upward triangle pointer */}
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid #16161a',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompanyMarqueeSection() {
  // Triple array duplicate ensures 100% infinite continuous stream with zero gaps at any screen width
  const marqueeList = [...hiringCompanies, ...hiringCompanies, ...hiringCompanies];

  return (
    <section
      className="social-proof-section"
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        padding: '0 0 1.5rem',
        overflow: 'visible',
        background: 'var(--black)',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div
        className="company-logos-wrapper relative w-full"
        style={{
          width: '100%',
          overflow: 'hidden',
          paddingTop: '25px',
          paddingBottom: '160px',
          marginBottom: '-135px',
          maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      >
        <div className="infinite-marquee-track" style={{ overflow: 'visible' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', paddingRight: '2.5rem', flexShrink: 0, overflow: 'visible' }}>
            {marqueeList.map((company, cIndex) => (
              <CompanyLogoBadge key={`m1-${cIndex}`} company={company} />
            ))}
          </div>
          <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', paddingRight: '2.5rem', flexShrink: 0, overflow: 'visible' }}>
            {marqueeList.map((company, cIndex) => (
              <CompanyLogoBadge key={`m2-${cIndex}`} company={company} />
            ))}
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
    offset: ["start start", "end end"]
  });

  // Parallax transforms: Photo starts zoomed in and zooms out to wide view on scroll; text glides with depth
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.45, 1.0]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

  return (
    <div className="page-wrapper candidate-view">
      {/* Pinned Scroll Track for Visible Parallax Zoom */}
      <div ref={heroRef} style={{ position: 'relative', height: '180vh' }}>
        <div
          className="candidate-hero-bg"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* 1. Full-screen Rohit's Photo zooming in clearly as you scroll */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              y: photoY,
              scale: photoScale,
              transformOrigin: '20% 25%',
              zIndex: 1,
            }}
          >
            <img
              src="/rohits.jpeg"
              alt="Antbox Candidate Experience"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '14% 18%',
                display: 'block',
              }}
            />
          </motion.div>

          {/* 2. Gradient overlay: Clear/vivid on Rohit's side (left), high dark opacity on audience side (right) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              background: 'linear-gradient(to right, rgba(10, 10, 14, 0.15) 0%, rgba(10, 10, 14, 0.4) 38%, rgba(10, 10, 14, 0.90) 62%, rgba(10, 10, 14, 0.98) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Bottom subtle edge fade into next section */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '140px',
              zIndex: 2,
              background: 'linear-gradient(to top, var(--black) 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* 3. Hero Message: Solid, razor-sharp, with multi-plane parallax depth on scroll */}
          <div
            className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 py-12 relative flex items-center justify-end"
            style={{ width: '100%', height: '100%', zIndex: 5, paddingRight: 'clamp(1.5rem, 5vw, 5rem)' }}
          >
            <motion.div
              style={{
                maxWidth: '540px',
                width: '100%',
                y: textY,
                opacity: 1,
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
                }}
              >
                <span style={{ display: 'block' }}>CAMPUS TO</span>
                <span style={{ display: 'block', color: 'var(--accent-purple)' }}>CORPORATE</span>
                <span style={{ display: 'block' }}>WITHOUT THE</span>
                <span style={{ display: 'block', color: 'var(--accent-purple)' }}>GUESSWORK</span>
              </h1>
              <p
                className="hero-subtitle"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                  marginTop: '1.75rem',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  maxWidth: '540px',
                }}
              >
                Stop applying blindly. Start building real proof of work.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="candidate-content-flow" style={{ position: 'relative', zIndex: 2 }}>
        <CandidateFriction />

        {/* Social Proof Marquee with pause on hover & company brief popups */}
        <CompanyMarqueeSection />

        <CandidateHowItWorks />
        <CandidateCTA />
      </div>
    </div>
  );
}

export default function Home() {
  const { activeTab } = useTab();

  return (
    <AnimatePresence mode="wait">
      {activeTab === 'corporates' ? (
        <motion.div
          key="corporate"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
        >
          <CorporateView />
        </motion.div>
      ) : (
        <motion.div
          key="candidate"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
        >
          <CandidateView />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
