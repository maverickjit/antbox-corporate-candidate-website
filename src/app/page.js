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

// Stacked Card in "WHAT WE BRING" — all purple type, opens downwards 01 -> 02 -> 03 -> 04 -> 05 on scroll
// Stacked Card in "WHAT WE BRING" — opens downwards on scroll
function StackedBenefitCard({ card, index, totalCards, scrollYProgress }) {
  const startT = 0.15 + (index - 1) * 0.12;
  const endT = Math.min(startT + 0.12, 0.85);
  const targetY = index * 84;

  const cardY = useTransform(
    scrollYProgress,
    index === 0
      ? [0.10, 0.18]
      : [startT, endT],
    index === 0
      ? [0, 0]
      : [0, targetY]
  );

  const cardScale = useTransform(
    scrollYProgress,
    index === 0
      ? [0.10, 0.18]
      : [startT, endT],
    index === 0
      ? [1, 1]
      : [0.97, 1]
  );

  const zIndex = totalCards - index;

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        y: cardY,
        scale: cardScale,
        zIndex: zIndex,
        borderRadius: '1.25rem',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          minHeight: '94px',
          background: 'linear-gradient(145deg, #441558 0%, #22092c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.35rem 2.2rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(234,182,255,0.25)',
        }}
      >
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
          {/* Side vertical accent bar beside card */}
          <div
            style={{
              width: '4px',
              height: '38px',
              borderRadius: '2px',
              background: 'var(--accent-purple)',
              flexShrink: 0,
              boxShadow: '0 0 10px rgba(187,98,222,0.5)',
            }}
          />
          <div style={{ flex: 1 }}>
            <h4
              style={{
                margin: '0 0 0.25rem',
                color: '#fff',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.1rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                lineHeight: 1.25,
              }}
            >
              {card.title}
            </h4>
            <p
              style={{
                margin: 0,
                color: '#e9c8ff',
                fontSize: '0.9rem',
                lineHeight: 1.45,
              }}
            >
              {card.desc}
            </p>
          </div>
        </div>

        {/* Badge icon */}
        <div style={{ position: 'relative', zIndex: 1, marginLeft: '1.25rem', flexShrink: 0 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(234,182,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(234,182,255,0.35)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SolutionsSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Phase 1: "WE BUILT ANTBOX..." parallax exit (moves up with scale and depth)
  const messageY = useTransform(scrollYProgress, [0, 0.14], ["0%", "-28%"]);
  const messageScale = useTransform(scrollYProgress, [0, 0.14], [1, 0.92]);
  const messageOpacity = useTransform(scrollYProgress, [0.04, 0.14], [1, 0]);
  const messageDisplay = useTransform(scrollYProgress, (v) => (v >= 0.14 ? 'none' : 'flex'));

  // Phase 2: "WHAT WE BRING" parallax entrance, then stays 100% solid
  const deckY = useTransform(scrollYProgress, [0.05, 0.14], ["40px", "0px"]);
  const deckScale = useTransform(scrollYProgress, [0.05, 0.14], [0.96, 1]);
  const deckOpacity = useTransform(scrollYProgress, [0.06, 0.13], [0, 1]);
  const totalCards = cardData.length;

  return (
    <section className="solutions-section-pinned" ref={sectionRef} style={{ height: '190vh' }}>
      <div className="solutions-sticky-inner">
        {/* Phase 1: big message with smooth Parallax Transition */}
        <motion.div
          className="solutions-fullpage-msg"
          style={{
            opacity: messageOpacity,
            y: messageY,
            scale: messageScale,
            display: messageDisplay,
          }}
        >
          <h3>
            <span className="msg-line">
              <span style={{ color: '#f7f5ee' }}>WE BUILT </span>
              <span style={{ color: 'var(--accent-purple)' }}>ANTBOX</span>
            </span>
            <span className="msg-line msg-line-straight" style={{ color: '#f7f5ee' }}>TO END THIS</span>
            <span className="msg-line">
              <span style={{ color: 'var(--accent-purple)' }}>GAME </span>
              <span style={{ color: '#f7f5ee' }}>OF </span>
              <span style={{ color: 'var(--accent-purple)' }}>CHANCE</span>
            </span>
          </h3>
        </motion.div>

        {/* Phase 2: Stacked Cards Deck — parallax entrance and stays 100% solid */}
        <motion.div
          style={{
            opacity: deckOpacity,
            y: deckY,
            scale: deckScale,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '6.5rem 1.5rem 2rem',
            maxWidth: '1020px',
          }}
        >
          <h2 className="section-title heading-serif text-center" style={{ color: '#fff', marginBottom: '1.75rem' }}>
            WHAT WE <span style={{ color: 'var(--accent-purple)' }}>BRING</span>
          </h2>

          {/* Stacked Deck Container */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '1020px', height: '460px' }}>
            {cardData.map((card, i) => (
              <StackedBenefitCard
                key={i}
                card={card}
                index={i}
                totalCards={totalCards}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}



function CandidateCTA() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 100%"]
  });

  const clipPercent = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPathValue = useMotionTemplate`inset(${clipPercent}% 0 0 0)`;

  return (
    <section className="cta-section cta-typographic" ref={sectionRef} style={{ position: 'relative', background: 'var(--cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ width: '100%', flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
          <div className="cta-type-inner" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto' }}>
            <h2 className="cta-type-headline" style={{ color: 'var(--black)', fontSize: 'clamp(3.5rem, 7vw, 6rem)', lineHeight: 1.1 }}>
              Ready to Take Control<br />of Your Career Path?
            </h2>
            <p className="cta-eyebrow" style={{ color: 'var(--text-secondary)', marginTop: '2rem', fontSize: '1.5rem', maxWidth: '750px', lineHeight: 1.5, textTransform: 'none', letterSpacing: '0px' }}>
              Build real proof of work, work on micro-internships, and land your dream job without the guesswork.
            </p>
            <button className="cta-type-btn" style={{ background: 'var(--purple)', color: '#fff', marginTop: '3rem', padding: '1.5rem 4rem', fontSize: '1.4rem', borderRadius: '9999px' }}>
              Get Started →
            </button>
          </div>
        </div>

        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'var(--purple)', zIndex: 2, padding: '2rem',
            overflow: 'hidden', clipPath: clipPathValue, display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}
        >
          <div className="cta-type-inner" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', width: '100%' }}>
            <h2 className="cta-type-headline" style={{ color: '#fff', fontSize: 'clamp(3.5rem, 7vw, 6rem)', lineHeight: 1.1 }}>
              Ready to Take Control<br />of Your Career Path?
            </h2>
            <p className="cta-eyebrow" style={{ color: '#f0f0f0', marginTop: '2rem', fontSize: '1.5rem', maxWidth: '750px', lineHeight: 1.5, textTransform: 'none', letterSpacing: '0px' }}>
              Build real proof of work, work on micro-internships, and land your dream job without the guesswork.
            </p>
            <button className="cta-type-btn" style={{ background: 'var(--black)', color: '#fff', marginTop: '3rem', padding: '1.5rem 4rem', fontSize: '1.4rem', borderRadius: '9999px' }}>
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
    <section className="problems-section candidate-friction" ref={sectionRef} style={{ minHeight: '135vh' }}>
      <div style={{ position: 'sticky', top: '0', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', background: 'transparent', padding: '0 clamp(2rem, 5vw, 5rem)' }}>
        <h2
          ref={titleRef}
          className="friction-header"
          style={{
            marginBottom: '3rem',
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

        <div className="process-layout" style={{ width: '100%', marginTop: '3.5rem' }}>
          <div className="process-timeline" style={{ display: 'flex', gap: '2.5rem', width: '100%', position: 'relative' }}>
            <motion.div className="process-timeline-active-line" style={{ position: 'absolute', top: 0, left: 0, height: '2px', background: 'var(--accent-purple)', zIndex: 2, transformOrigin: 'left', scaleX: lineScaleX, width: '100%' }}></motion.div>

            {/* Step 01 */}
            <motion.div
              className={`process-step ${activeStep >= 0 ? 'active' : ''}`}
              animate={{ opacity: activeStep >= 0 ? 1 : 0.35, y: activeStep >= 0 ? 0 : 15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ flex: 1, position: 'relative', paddingTop: '1.5rem' }}
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
                  marginBottom: '1rem',
                  textShadow: 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                01
              </div>
              <h3 className="tc-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cream)', marginBottom: '0.6rem' }}>Outdated Campus Tech Stack</h3>
              <p className="tc-body" style={{ color: '#a6a6a6', fontSize: '1.02rem', lineHeight: 1.6 }}>AI and tech evolve every 12 months, but university courses take years to update. What you learn in class often falls short of what top companies demand on Day 1.</p>
            </motion.div>

            {/* Step 02 */}
            <motion.div
              className={`process-step ${activeStep >= 1 ? 'active' : ''}`}
              animate={{ opacity: activeStep >= 1 ? 1 : 0.35, y: activeStep >= 1 ? 0 : 15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ flex: 1, position: 'relative', paddingTop: '1.5rem' }}
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
                  marginBottom: '1rem',
                  textShadow: 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                02
              </div>
              <h3 className="tc-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cream)', marginBottom: '0.6rem' }}>Judged in Hours After 4 Years</h3>
              <p className="tc-body" style={{ color: '#a6a6a6', fontSize: '1.02rem', lineHeight: 1.6 }}>Traditional hiring compresses your entire degree into a single resume screening or a 30-minute interview, leading to higher drop-offs and missed opportunities.</p>
            </motion.div>

            {/* Step 03 */}
            <motion.div
              className={`process-step ${activeStep >= 2 ? 'active' : ''}`}
              animate={{ opacity: activeStep >= 2 ? 1 : 0.35, y: activeStep >= 2 ? 0 : 15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ flex: 1, position: 'relative', paddingTop: '1.5rem' }}
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
                  marginBottom: '1rem',
                  textShadow: 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                03
              </div>
              <h3 className="tc-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cream)', marginBottom: '0.6rem' }}>The Experience Needed Paradox</h3>
              <p className="tc-body" style={{ color: '#a6a6a6', fontSize: '1.02rem', lineHeight: 1.6 }}>Companies expect prior experience for entry-level roles, but few give you the chance to gain it. Over 77% of grads end up learning everything from scratch on the job.</p>
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
  // 1. "Where talent", "IS", and "not found" fly away and fade immediately (0 to 0.05)
  const leftX = useTransform(scrollProgress, [0, 0.06], ["0vw", "-70vw"]);
  const rightX = useTransform(scrollProgress, [0, 0.06], ["0vw", "70vw"]);
  const isX = useTransform(scrollProgress, [0, 0.06], ["0vw", "-45vw"]);
  const topOpacity = useTransform(scrollProgress, [0, 0.04], [1, 0]);
  const isOpacity = useTransform(scrollProgress, [0, 0.04], [1, 0]);

  // 2. "Built" starts zooming immediately from scroll=0, smoothly expanding up to 26x
  const builtScale = useTransform(scrollProgress, [0, 0.28], [1, 26]);
  const builtOpacity = useTransform(scrollProgress, [0, 0.20, 0.28], [1, 1, 0]);

  // 3. "What Corporates Face" opacity is delayed (starts at 0.04 after Built starts expanding),
  // reaches 100% solid by 0.24, and stays completely solid with zero blur when the curtain overlays it
  const wcfOpacity = useTransform(
    scrollProgress,
    [0, 0.04, 0.14, 0.24],
    [0, 0, 0.50, 1]
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
      {/* Layer 1: "What Corporates Face" — solid, non-blurred, stationary until covered by curtain */}
      <motion.div
        style={{
          opacity: wcfOpacity,
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
            style={{ x: leftX, opacity: topOpacity }}
            className="text-on-surface text-[clamp(36px,8vw,120px)] whitespace-nowrap block"
          >
            Where talent
          </motion.div>

          <div className="flex items-center justify-center gap-4 text-[clamp(36px,8vw,120px)] w-full">
            <motion.div style={{ x: isX, opacity: isOpacity }} className="text-on-surface lowercase">
              IS
            </motion.div>
            <motion.div
              style={{ scale: builtScale, opacity: builtOpacity, transformOrigin: 'center center', zIndex: 50 }}
              className="text-[var(--accent-purple)] pointer-events-none"
            >
              Built
            </motion.div>
          </div>

          <motion.div style={{ x: rightX, opacity: topOpacity }}>
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
        borderTopLeftRadius: '2.5rem',
        borderTopRightRadius: '2.5rem',
        boxShadow: '0 -30px 80px rgba(0, 0, 0, 0.85)',
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

      {/* Dark section — rolls up and hovers over the pinned "What Corporates Face" with clean rounded corners and NO black shadow */}
      <div
        className="scroll-overlay-container"
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'var(--black)',
          marginTop: '-100vh',
          boxShadow: 'none',
          borderTopLeftRadius: '2.5rem',
          borderTopRightRadius: '2.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <SolutionsSection />
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

  // Y moves smoothly along vertical arc (bottom -> center -> top)
  const cardY = useTransform(relPos, (rel) => {
    return `${rel * 38}vh`;
  });

  // X creates semi-circle arc: curves inwards (-45px) at center, outward at edges
  const cardX = useTransform(relPos, (rel) => {
    const clampedRel = Math.max(-2.5, Math.min(2.5, rel));
    const offset = -45 + Math.pow(clampedRel, 2) * 26;
    return `${offset}px`;
  });

  // Tangent rotation along the semi-circle wheel curve
  const cardRotate = useTransform(relPos, (rel) => {
    return rel * 16;
  });

  // Scale: 1.02 at focal center, smooth taper outward
  const cardScale = useTransform(relPos, (rel) => {
    const dist = Math.abs(rel);
    return Math.max(0.76, 1.02 - dist * 0.12);
  });

  // Opacity: 1 at focal center, smoothly fades at distance
  const cardOpacity = useTransform(relPos, (rel) => {
    const dist = Math.abs(rel);
    if (dist <= 0.6) return 1;
    if (dist >= 1.7) return 0;
    return 1 - (dist - 0.6) / 1.1;
  });

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: 'min(500px, 92%)',
        right: 'clamp(1rem, 4vw, 3.5rem)',
        borderRadius: '26px',
        overflow: 'hidden',
        x: cardX,
        y: cardY,
        rotate: cardRotate,
        opacity: cardOpacity,
        scale: cardScale,
        boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
        border: '1px solid rgba(187, 98, 222, 0.35)',
        transformOrigin: 'right center',
        background: '#240a2f',
      }}
    >
      {/* Big gap statement area — solid brand purple, completely opaque */}
      <div style={{
        minHeight: '260px',
        background: '#240a2f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '2.5rem 2.25rem',
        position: 'relative',
      }}>
        {/* The GAP text — big and bold */}
        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(1.2rem, 2.1vw, 1.5rem)',
          color: '#ffffff',
          lineHeight: 1.45,
          margin: 0,
          maxWidth: '420px',
        }}>{step.gap}</p>
      </div>

      {/* Footer bar — THE GAP badge */}
      <div style={{
        background: '#180620',
        padding: '1.15rem 2.25rem',
        borderTop: '2px solid var(--accent-purple)',
        display: 'flex',
        alignItems: 'center',
      }}>
        <span style={{
          display: 'inline-block',
          background: 'var(--accent-purple)',
          color: '#ffffff',
          padding: '0.35rem 1.15rem',
          borderRadius: '50px',
          fontSize: '0.72rem',
          fontWeight: 900,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}>THE GAP</span>
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

  // For each card, determine which step it maps to (0-1 range per card)
  const totalCards = steps.length;

  // Active step driven by scroll
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const idx = Math.min(Math.round(latest * (totalCards - 1)), totalCards - 1);
      setActiveStep(idx);
    });
  }, [scrollYProgress, totalCards]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '210vh',
        background: '#F7F5EE',
      }}
    >
      {/* Sticky wrapper — fills viewport */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* LEFT — HOW IT WORKS title and active solution panel */}
        <div style={{
          flex: '0 0 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(2rem, 5vw, 6rem)',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* HOW IT WORKS title — large, bold, and prominent */}
          <h2 style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(3.5rem, 6.8vw, 6.25rem)',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 0.88,
            color: 'var(--black)',
            margin: '0 0 3.25rem',
            textTransform: 'uppercase',
          }}>
            HOW<br />
            <span style={{ color: 'var(--accent-purple)' }}>IT WORKS</span>
          </h2>

          {/* Animated solution text with vertical accent bar ONLY beside heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: '520px',
              }}
            >
              {/* Heading with side vertical accent bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.15rem' }}>
                <div
                  style={{
                    width: '4.5px',
                    height: '2.5rem',
                    borderRadius: '999px',
                    background: steps[activeStep].accent || 'var(--accent-purple)',
                    flexShrink: 0,
                  }}
                />
                <h3 style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(1.5rem, 2.7vw, 2.35rem)',
                  fontWeight: 800,
                  color: 'var(--black)',
                  lineHeight: 1.15,
                  margin: 0,
                }}>{steps[activeStep].solution}</h3>
              </div>

              {/* Description body underneath without side bar */}
              <p style={{
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '1.08rem',
                color: '#545454',
                lineHeight: 1.65,
                paddingLeft: '1.5rem',
                margin: 0,
              }}>{steps[activeStep].body}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT — scrolling cards with semi-circle animation attached to right edge */}
        <div style={{
          flex: '0 0 50%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'hidden',
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
        boxShadow: isHovered ? `0 8px 30px ${company.color}35` : 'none',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        zIndex: isHovered ? 50 : 1,
        transition: 'border 0.2s, box-shadow 0.2s, background 0.2s, transform 0.2s',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ color: company.color }}>{company.symbol}</span>
      <span>{company.name}</span>

      {/* Floating brief card on hover — compact sizing */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 12px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '235px',
              background: '#16161a',
              border: `1px solid ${company.color}88`,
              borderRadius: '14px',
              padding: '0.75rem 0.9rem',
              boxShadow: `0 15px 40px rgba(0,0,0,0.95), 0 0 20px ${company.color}25`,
              zIndex: 999,
              pointerEvents: 'none',
              textAlign: 'left',
              whiteSpace: 'normal',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>
                <span style={{ color: company.color }}>{company.symbol}</span>
                {company.name}
              </div>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.08)',
                  color: company.color,
                  fontWeight: 600,
                  border: `1px solid ${company.color}44`,
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

            {/* Downward triangle pointer */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #16161a',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompanyMarqueeSection() {
  return (
    <section
      className="social-proof-section"
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        padding: '2rem 0 3.5rem',
        overflow: 'visible',
        background: 'var(--black)',
        position: 'relative',
        zIndex: 20,
      }}
    >
      <div className="w-full text-center" style={{ overflow: 'visible' }}>
        <div className="company-logos relative w-full flex" style={{ overflow: 'visible', paddingTop: '55px', paddingBottom: '10px' }}>
          <div className="marquee-track flex" style={{ overflow: 'visible' }}>
            <div className="flex gap-12 shrink-0 animate-marquee" style={{ display: 'flex', alignItems: 'center', overflow: 'visible' }}>
              {hiringCompanies.map((company, cIndex) => (
                <CompanyLogoBadge key={`a-${cIndex}`} company={company} />
              ))}
            </div>
            <div className="flex gap-12 shrink-0 animate-marquee" aria-hidden="true" style={{ display: 'flex', alignItems: 'center', overflow: 'visible' }}>
              {hiringCompanies.map((company, cIndex) => (
                <CompanyLogoBadge key={`b-${cIndex}`} company={company} />
              ))}
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

  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroPhotoY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.1]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);

  return (
    <div className="page-wrapper candidate-view">
      <div ref={heroRef} className="candidate-hero-bg" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

        <motion.main
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="candidate-hero-section w-full max-w-[1240px] mx-auto px-6 sm:px-10 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center justify-center"
        >
          {/* Left: Centered Typography with Parallax */}
          <motion.div style={{ y: heroTextY }} className="flex flex-col justify-center text-left py-4">
            <h1 className="hero-title heading-serif" style={{ color: '#fff', fontSize: 'clamp(2.75rem, 5.5vw, 5.5rem)', textTransform: 'uppercase', lineHeight: 1.02 }}>
              <span style={{ display: 'block' }}>CAMPUS TO</span>
              <span style={{ display: 'block', color: 'var(--accent-purple)' }}>CORPORATE</span>
              <span style={{ display: 'block' }}>WITHOUT THE</span>
              <span style={{ display: 'block', color: 'var(--accent-purple)' }}>GUESSWORK</span>
            </h1>
            <p className="hero-subtitle" style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', marginTop: '1.75rem', fontWeight: 500, lineHeight: 1.5, maxWidth: '520px' }}>
              Stop applying blindly. Start building real proof of work.
            </p>
          </motion.div>

          {/* Right: Full-bleed Hero Photo Card with Parallax */}
          <motion.div style={{ y: heroPhotoY }} className="flex items-center justify-center w-full">
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: 'clamp(380px, 52vh, 520px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.75), 0 0 32px rgba(187, 98, 222, 0.2)',
                background: '#16161a',
              }}
            >
              <img
                src="/rohits.jpeg"
                alt="Antbox Candidate Experience"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                }}
              />
              {/* Subtle edge overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.25)',
                  borderRadius: '24px',
                }}
              />
            </div>
          </motion.div>
        </motion.main>
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
