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
function StackedBenefitCard({ card, index, totalCards, scrollYProgress }) {
  // Opening timeline:
  // Card 0 (01): stays at top y = 0
  // Card 1 (02): opens downwards to 80px over [0.15, 0.26]
  // Card 2 (03): opens downwards to 160px over [0.26, 0.37]
  // Card 3 (04): opens downwards to 240px over [0.37, 0.48]
  // Card 4 (05): opens downwards to 320px over [0.48, 0.60]
  // All 5 cards stay fully open and visible from 0.60 to 1.0!
  // On back-scroll: all cards smoothly slide back UP into the single stack at 01!

  const startT = 0.15 + (index - 1) * 0.11;
  const endT = startT + 0.11;
  const targetY = index * 80;

  const cardY = useTransform(
    scrollYProgress,
    index === 0
      ? [0.08, 0.14]
      : [startT, endT],
    index === 0
      ? [0, 0]
      : [0, targetY]
  );

  const cardScale = useTransform(
    scrollYProgress,
    index === 0
      ? [0.08, 0.14]
      : [startT, endT],
    index === 0
      ? [1, 1]
      : [0.96, 1]
  );

  // zIndex: Card 0 is on top of initial stack (5), Card 4 is at bottom (1)
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
        boxShadow: '0 0 40px 8px rgba(142,67,172,0.32), 0 16px 45px rgba(0,0,0,0.55)',
      }}
    >
      <div
        style={{
          minHeight: '74px',
          background: 'linear-gradient(145deg, #561b6e 0%, #2b0c37 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
          border: '1.5px solid rgba(234,182,255,0.45)',
        }}
      >
        {/* Dot grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
          <span
            style={{
              fontSize: '1.85rem',
              fontWeight: 900,
              fontFamily: 'Poppins, sans-serif',
              color: '#ea80fc',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              flexShrink: 0,
              textShadow: '0 0 15px rgba(234,128,252,0.5)',
            }}
          >
            0{index + 1}
          </span>
          <div style={{ flex: 1 }}>
            <h4
              style={{
                margin: '0 0 0.2rem',
                color: '#fff',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.05rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                lineHeight: 1.25,
              }}
            >
              {card.title}
            </h4>
            <p
              style={{
                margin: 0,
                color: '#e9c8ff',
                fontSize: '0.86rem',
                lineHeight: 1.45,
              }}
            >
              {card.desc}
            </p>
          </div>
        </div>

        {/* Badge icon */}
        <div style={{ position: 'relative', zIndex: 1, marginLeft: '1rem', flexShrink: 0 }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(234,182,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(234,182,255,0.45)',
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

  // Phase 1: message centered, exits quickly between 0.06 and 0.12 so What We Bring appears fast
  const messageY = useTransform(scrollYProgress, [0, 0.12], ["0vh", "-100vh"]);
  const messageOpacity = useTransform(scrollYProgress, [0, 0.08, 0.12], [1, 1, 0]);
  const messageDisplay = useTransform(scrollYProgress, (v) => (v > 0.12 ? 'none' : 'flex'));

  // Phase 2: Stacked Cards Deck appears smoothly at [0.10, 0.15] and STAYS visible until CTA
  const deckOpacity = useTransform(scrollYProgress, [0.10, 0.15], [0, 1]);
  const totalCards = cardData.length;

  // Active step counter for bottom pill indicator
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      if (latest < 0.22) setActiveStep(0);
      else if (latest < 0.33) setActiveStep(1);
      else if (latest < 0.44) setActiveStep(2);
      else if (latest < 0.55) setActiveStep(3);
      else setActiveStep(4);
    });
  }, [scrollYProgress]);

  return (
    <section className="solutions-section-pinned" ref={sectionRef} style={{ height: '320vh' }}>
      <div className="solutions-sticky-inner">
        {/* Phase 1: big message — immediately visible, scrolls away fast */}
        <motion.div className="solutions-fullpage-msg" style={{ opacity: messageOpacity, y: messageY, display: messageDisplay }}>
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

        {/* Phase 2: Stacked Cards Deck revealed downwards (01 -> 02 -> 03 -> 04 -> 05) */}
        <motion.div
          style={{
            opacity: deckOpacity,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 1.5rem',
            maxWidth: '920px',
          }}
        >
          <h2 className="section-title heading-serif text-center" style={{ color: '#fff', marginBottom: '1.75rem' }}>
            WHAT WE <span style={{ color: 'var(--accent-purple)' }}>BRING</span>
          </h2>

          {/* Stacked Deck Container */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '820px', height: '400px' }}>
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

          {/* Progress dots indicator */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem', alignItems: 'center' }}>
            {cardData.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === activeStep ? '2rem' : '0.5rem',
                  height: '0.45rem',
                  borderRadius: '999px',
                  background: i === activeStep ? 'var(--accent-purple)' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
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

  const lineScaleX = useTransform(scrollYProgress, [0.25, 0.75], [0, 1]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange(latest => {
      if (latest < 0.4) setActiveStep(0);
      else if (latest < 0.6) setActiveStep(1);
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
    <section className="problems-section candidate-friction" ref={sectionRef} style={{ minHeight: '200vh' }}>
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
              fontFamily: '"Times New Roman", Times, serif',
              fontStyle: 'italic',
              color: 'transparent',
              WebkitTextStroke: '2px var(--accent-purple)',
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
                  textShadow: activeStep >= 0 ? '0 0 30px rgba(187,98,222,0.45)' : 'none',
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
                  textShadow: activeStep >= 1 ? '0 0 30px rgba(187,98,222,0.45)' : 'none',
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
                  textShadow: activeStep >= 2 ? '0 0 30px rgba(187,98,222,0.45)' : 'none',
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
// 1. "Built" zooms in smoothly, and "What Corporates Face" appears directly from behind as soon as Built disappears.
// 2. Numbers roll into place with slot machine digit animation.
// 3. "What Corporates Face" stays pinned and still while the dark "We built antbox..." sheet covers it smoothly.
function CorporateHeroAndProblems({ scrollProgress }) {
  // Hero text fly-out (0.0 to 0.35)
  const leftX = useTransform(scrollProgress, [0, 0.35], ["0vw", "-100vw"]);
  const rightX = useTransform(scrollProgress, [0, 0.35], ["0vw", "100vw"]);
  const isX = useTransform(scrollProgress, [0, 0.35], ["0vw", "-50vw"]);
  const topOpacity = useTransform(scrollProgress, [0, 0.28], [1, 0]);
  const isOpacity = useTransform(scrollProgress, [0, 0.28], [1, 0]);

  // "Built" zoom: smooth scale up to 45x and fades out cleanly
  const builtScale = useTransform(scrollProgress, [0, 0.22, 0.46], [1, 2.5, 45]);
  const builtOpacity = useTransform(scrollProgress, [0, 0.34, 0.46], [1, 1, 0]);
  const heroOpacity = useTransform(scrollProgress, [0.38, 0.46], [1, 0]);
  // Hero layer vanishes at exactly 0.46 revealing WCF underneath
  const heroDisplay = useTransform(scrollProgress, (v) => (v > 0.46 ? 'none' : 'flex'));
  const heroPointerEvents = useTransform(scrollProgress, (v) => (v > 0.46 ? 'none' : 'auto'));

  // Stats roll animation: trigger when hero starts fading
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    return scrollProgress.on('change', (latest) => {
      if (latest >= 0.38) {
        setStatsVisible(true);
      } else {
        setStatsVisible(false);
      }
    });
  }, [scrollProgress]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--cream)' }}>
      {/* Layer 1: "What Corporates Face" — always visible (opacity:1), revealed when hero fades away */}
      <div
        style={{
          opacity: 1,
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 1.5rem',
          background: 'var(--cream)',
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
          <h2 className="section-title heading-serif text-center" style={{ color: 'var(--black)', marginBottom: '1rem' }}>
            WHAT <span style={{ color: 'var(--accent-purple)' }}>CORPORATES</span> FACE
          </h2>
          <div className="problems-intro text-center" style={{ marginBottom: '3rem' }}>
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
      </div>

      {/* Layer 2: Hero Section ("Where talent IS Built not found") */}
      <motion.div
        className="flex flex-col items-center justify-center"
        style={{
          opacity: heroOpacity,
          display: heroDisplay,
          pointerEvents: heroPointerEvents,
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          background: 'var(--cream)',
        }}
      >
        <div className="flex flex-col items-center justify-center gap-2 md:gap-4 font-black tracking-[-0.03em] uppercase leading-[1.05] text-center w-full" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
    offset: ["start 85%", "end 100%"]
  });

  const clipPercent = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPathValue = useMotionTemplate`inset(${clipPercent}% 0 0 0)`;

  return (
    <section ref={sectionRef} style={{ position: 'relative', height: '100dvh', minHeight: '100dvh', margin: 0, padding: 0, overflow: 'hidden' }}>
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
  // Track scroll ONLY over the spacer div — this way heroProgress 0→1 spans just 250vh.
  // The sticky "What Corporates Face" layer is fully revealed at progress ~0.48 (≈120vh into spacer).
  // The dark overlay doesn't enter the viewport until the spacer ends (at total ~350vh of scroll),
  // so there is ~130vh of comfortable viewing of "What Corporates Face" before it gets covered.
  const heroSpacerRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroSpacerRef,
    offset: ["start start", "end start"]
  });

  return (
    <div className="page-wrapper" style={{ position: 'relative' }}>
      {/* Sticky viewport — stays pinned at top:0 for the ENTIRE scroll duration of page-wrapper */}
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

      {/* Spacer — heroProgress tracks THIS div only (0→1 over 250vh).
          Hero animation completes by ~0.48 (120vh). Dark overlay enters at end of spacer (~350vh total). */}
      <div ref={heroSpacerRef} style={{ height: '250vh' }} />

      {/* Dark section — rolls up over the pinned "What Corporates Face" like a curtain */}
      <div className="scroll-overlay-container" style={{ position: 'relative', zIndex: 10, background: 'var(--black)' }}>
        <SolutionsSection />
        <CorporateCTA />
      </div>
    </div>
  );
}

// Sub-component: each card handles its own scroll-driven transforms (fixes hooks-in-loop)
function HowItWorksCard({ step, index, totalCards, scrollYProgress }) {
  const segmentSize = 1 / totalCards;
  const start = index * segmentSize;
  const end = start + segmentSize;

  const cardY = useTransform(
    scrollYProgress,
    [Math.max(0, start - segmentSize * 0.5), start + segmentSize * 0.1, end - segmentSize * 0.1, Math.min(1, end + segmentSize * 0.3)],
    ['80vh', '0vh', '0vh', '-80vh']
  );
  const cardOpacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - segmentSize * 0.5), start, end - segmentSize * 0.1, end],
    [0, 1, 1, 0]
  );
  const cardScale = useTransform(scrollYProgress, [start, end - segmentSize * 0.1], [0.92, 1]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: 'min(500px, 92%)',
        borderRadius: '28px',
        overflow: 'hidden',
        y: cardY,
        opacity: cardOpacity,
        scale: cardScale,
        boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1.5px ${step.accent}55`,
      }}
    >
      {/* Big gap statement area — the main card visual */}
      <div style={{
        minHeight: '320px',
        background: `linear-gradient(145deg, ${step.color} 0%, ${step.accent}33 60%, ${step.color} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        {/* Decorative large emoji watermark */}
        <span style={{
          position: 'absolute', right: '1.5rem', bottom: '1rem',
          fontSize: '7rem', opacity: 0.12, zIndex: 0, pointerEvents: 'none',
        }}>{step.emoji}</span>
        {/* Step number badge */}
        <span style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.12)',
          border: `1px solid ${step.accent}66`,
          color: step.accent,
          padding: '0.3rem 1rem',
          borderRadius: '50px',
          fontSize: '0.75rem',
          fontWeight: 800,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          position: 'relative', zIndex: 1,
        }}>{step.label}</span>
        {/* The GAP text — big and bold */}
        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)',
          color: '#fff',
          lineHeight: 1.45,
          margin: '1.5rem 0 0',
          position: 'relative', zIndex: 1,
          maxWidth: '400px',
        }}>{step.gap}</p>
      </div>
      {/* Footer bar — THE GAP badge + solution teaser */}
      <div style={{
        background: '#111116',
        padding: '1.5rem 2.5rem',
        borderTop: `2px solid ${step.accent}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <span style={{
          display: 'inline-block', background: step.accent,
          color: 'var(--purple-ink)', padding: '0.4rem 1.25rem',
          borderRadius: '50px', fontSize: '0.7rem', fontWeight: 900,
          letterSpacing: '1.5px', textTransform: 'uppercase', flexShrink: 0,
        }}>THE GAP</span>
        <p style={{
          fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.45)', margin: 0, textAlign: 'right',
          lineHeight: 1.3,
        }}>Solution: {step.solution}</p>
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
      const idx = Math.min(Math.floor(latest * totalCards), totalCards - 1);
      setActiveStep(idx);
    });
  }, [scrollYProgress, totalCards]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: `${(totalCards + 1) * 100}vh`,
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
        {/* LEFT — sticky solution panel */}
        <div style={{
          flex: '0 0 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(2rem,5vw,5rem)',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* HOW IT title */}
          <h2 style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'clamp(3rem,7vw,7rem)',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 0.9,
            color: 'var(--black)',
            margin: '0 0 3rem',
            textTransform: 'uppercase',
          }}>
            HOW<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--accent-purple)', fontStyle: 'italic', fontFamily: 'Times New Roman, serif' }}>IT WORKS</span>
          </h2>

          {/* Animated solution text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={{
                display: 'inline-block',
                background: steps[activeStep].accent,
                color: 'var(--purple-ink)',
                padding: '0.3rem 1rem',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '2px',
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
              }}>{steps[activeStep].label} / {totalCards}</span>
              <h3 style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(1.5rem,3vw,2.5rem)',
                fontWeight: 800,
                color: 'var(--black)',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}>{steps[activeStep].solution}</h3>
              <p style={{
                fontFamily: 'Century Gothic, sans-serif',
                fontSize: '1.1rem',
                color: '#545454',
                lineHeight: 1.7,
                maxWidth: '440px',
              }}>{steps[activeStep].body}</p>

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
                {steps.map((_, i) => (
                  <div key={i} style={{
                    width: i === activeStep ? '2rem' : '0.5rem',
                    height: '0.5rem',
                    borderRadius: '999px',
                    background: i === activeStep ? steps[activeStep].accent : 'rgba(0,0,0,0.1)',
                    transition: 'all 0.4s ease',
                  }} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT — scrolling image cards column */}
        <div style={{
          flex: '0 0 50%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
      className="company-box relative inline-flex items-center gap-2 cursor-pointer transition-all duration-300"
      style={{
        fontSize: '1.15rem',
        fontWeight: '800',
        background: isHovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
        color: '#fff',
        border: isHovered ? `1px solid ${company.color}99` : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '0.9rem 2rem',
        boxShadow: isHovered ? `0 8px 30px ${company.color}25` : 'none',
        transform: isHovered ? 'translateY(-2px)' : 'none',
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
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 14px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '280px',
              background: '#16161a',
              border: `1px solid ${company.color}55`,
              borderRadius: '16px',
              padding: '1.15rem 1.25rem',
              boxShadow: `0 20px 50px rgba(0,0,0,0.85), 0 0 25px ${company.color}22`,
              zIndex: 100,
              pointerEvents: 'none',
              textAlign: 'left',
              whiteSpace: 'normal',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                <span style={{ color: company.color }}>{company.symbol}</span>
                {company.name}
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.08)',
                  color: company.color,
                  fontWeight: 600,
                  border: `1px solid ${company.color}33`,
                }}
              >
                {company.category}
              </span>
            </div>

            {/* Description */}
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: '#a3a3a3', lineHeight: 1.45, fontWeight: 400 }}>
              {company.desc}
            </p>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem' }}>
              <span style={{ color: '#888' }}>Roles: <strong style={{ color: '#e5e5e5', fontWeight: 600 }}>{company.roles}</strong></span>
              <span style={{ color: 'var(--accent-purple)', fontWeight: 700, background: 'rgba(187,98,222,0.12)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
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
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '7px solid #16161a',
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
        padding: '11rem 0 6rem',
        overflow: 'visible',
        background: 'var(--black)',
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div className="w-full text-center" style={{ overflow: 'visible' }}>
        <div className="company-logos relative w-full" style={{ opacity: 0.95, overflow: 'visible' }}>
          <div className="flex gap-12 whitespace-nowrap animate-marquee" style={{ overflow: 'visible' }}>
            {[...Array(3)].map((_, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {hiringCompanies.map((company, cIndex) => (
                  <CompanyLogoBadge key={`${groupIndex}-${cIndex}`} company={company} />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        <p className="caption" style={{ marginTop: '3.5rem', color: '#888', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Where AntBox candidates get hired
        </p>
      </div>
    </section>
  );
}

function CandidateView() {
  return (
    <div className="page-wrapper candidate-view">
      <div className="sticky-container candidate-hero-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <main
          className="candidate-hero-section w-full max-w-[1240px] mx-auto px-6 sm:px-10 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center justify-center"
          style={{ minHeight: '100vh', display: 'grid' }}
        >
          {/* Left: Centered Typography */}
          <div className="flex flex-col justify-center text-left py-4">
            <h1 className="hero-title heading-serif" style={{ color: '#fff', fontSize: 'clamp(2.75rem, 5.5vw, 5.5rem)', textTransform: 'uppercase', lineHeight: 1.02 }}>
              <span style={{ display: 'block' }}>CAMPUS TO</span>
              <span className="text-stroke-purple-italic" style={{ display: 'block' }}>CORPORATE</span>
              <span style={{ display: 'block' }}>WITHOUT THE</span>
              <span style={{ display: 'block', color: 'var(--accent-purple)' }}>GUESSWORK</span>
            </h1>
            <p className="hero-subtitle" style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', marginTop: '1.75rem', fontWeight: 500, lineHeight: 1.5, maxWidth: '520px' }}>
              Stop applying blindly. Start building real proof of work.
            </p>
          </div>

          {/* Right: Full-bleed Hero Photo Card (No black letterboxing) */}
          <div className="flex items-center justify-center w-full">
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
          </div>
        </main>
      </div>

      <div className="scroll-overlay-container candidate-overlay">
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
