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

// Each card in the visible grid — fades in together
function BenefitCard({ card, index, totalCards, scrollYProgress }) {
  // Each card staggered fade-in — aligned with new deck entry range (0.26+)
  const cardOpacity = useTransform(
    scrollYProgress,
    [0, 0.28 + index * 0.04, 0.44 + index * 0.04],
    [0, 0, 1]
  );
  const cardY = useTransform(
    scrollYProgress,
    [0, 0.28 + index * 0.04, 0.44 + index * 0.04],
    [40, 40, 0]
  );

  const isTop = index === totalCards - 1;

  return (
    <motion.div
      style={{
        opacity: cardOpacity,
        y: cardY,
        borderRadius: '1.25rem',
        overflow: 'hidden',
        boxShadow: isTop
          ? '0 0 40px 10px rgba(142,67,172,0.35), 0 20px 60px rgba(0,0,0,0.5)'
          : '0 8px 32px rgba(0,0,0,0.4)',
        position: 'relative',
        cursor: 'default',
      }}
    >
      <div style={{
        minHeight: '220px',
        background: isTop
          ? 'linear-gradient(145deg, #561b6e 0%, #2b0c37 100%)'
          : 'linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem 1.75rem',
        position: 'relative',
        overflow: 'hidden',
        border: isTop
          ? '1px solid rgba(234,182,255,0.45)'
          : '1px solid rgba(247,245,238,0.12)',
      }}>
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
        }} />

        {/* Title content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h4 style={{
            margin: '0 0 0.5rem',
            color: isTop ? '#fff' : 'var(--cream)',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '1rem',
            fontWeight: 800,
            letterSpacing: '0.07em',
            lineHeight: 1.3,
          }}>{card.title}</h4>
          <p style={{
            margin: 0,
            color: isTop ? '#e9c8ff' : '#a3a3a3',
            fontSize: '0.88rem',
            lineHeight: 1.6,
          }}>{card.desc}</p>
        </div>

        {/* Number badge — bottom right, transparent */}
        <span style={{
          position: 'absolute',
          right: '1.25rem',
          bottom: '1.25rem',
          fontSize: '2.5rem',
          fontWeight: 900,
          fontFamily: 'Poppins, sans-serif',
          color: 'rgba(255,255,255,0.07)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>0{index + 1}</span>
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

  // Phase 1: message centered immediately, exits upward completely off-screen
  const messageY = useTransform(scrollYProgress, [0, 0.24], ["0vh", "-120vh"]);
  const messageOpacity = useTransform(scrollYProgress, [0, 0.12, 0.20], [1, 1, 0]);

  // Phase 2: Cards grid fade in — starts only after message is fully gone
  const deckOpacity = useTransform(scrollYProgress, [0.26, 0.38], [0, 1]);
  const deckScale = useTransform(scrollYProgress, [0.26, 0.38], [0.92, 1]);

  const totalCards = cardData.length;

  return (
    <section className="solutions-section-pinned" ref={sectionRef}>
      <div className="solutions-sticky-inner">
        {/* Phase 1: big message — immediately visible, then scrolls away */}
        <motion.div className="solutions-fullpage-msg" style={{ opacity: messageOpacity, y: messageY }}>
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

        {/* Phase 2: Cards grid */}
        <motion.div
          style={{ opacity: deckOpacity, scale: deckScale, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1.5rem' }}
        >
          <h2 className="section-title heading-serif text-center" style={{ color: '#fff', marginBottom: '2rem' }}>
            WHAT WE <span style={{ color: 'var(--accent-purple)' }}>BRING</span>
          </h2>

          {/* 5-card grid — all visible at once */}
          {/* Row 1: 3 cards */}
          <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '900px', marginBottom: '1rem' }}>
            {cardData.slice(0, 3).map((card, i) => (
              <div key={i} style={{ flex: 1, minWidth: 0 }}>
                <BenefitCard
                  card={card}
                  index={i}
                  totalCards={totalCards}
                  scrollYProgress={scrollYProgress}
                />
              </div>
            ))}
          </div>
          {/* Row 2: 2 cards centered */}
          <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '900px', justifyContent: 'center' }}>
            {cardData.slice(3).map((card, i) => (
              <div key={i + 3} style={{ flex: '0 0 calc(33.33% - 0.5rem)', minWidth: 0 }}>
                <BenefitCard
                  card={card}
                  index={i + 3}
                  totalCards={totalCards}
                  scrollYProgress={scrollYProgress}
                />
              </div>
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

        <div className="process-layout" style={{ width: '100%' }}>
          <div className="process-timeline">
            <motion.div className="process-timeline-active-line" style={{ position: 'absolute', top: 0, left: 0, height: '1px', background: 'var(--accent-purple)', zIndex: 2, transformOrigin: 'left', scaleX: lineScaleX, width: '100%' }}></motion.div>
            <motion.div className={`process-step ${activeStep >= 0 ? 'active' : ''}`} animate={{ opacity: activeStep >= 0 ? 1 : 0, y: activeStep >= 0 ? 0 : 20 }} transition={{ duration: 0.4, ease: "easeOut" }}>
              <div className="process-number">01</div>
              <h3 className="tc-heading">Outdated Campus Tech Stack</h3>
              <p className="tc-body">AI and tech evolve every 12 months, but university courses take years to update. What you learn in class often falls short of what top companies demand on Day 1.</p>
            </motion.div>
            <motion.div className={`process-step ${activeStep >= 1 ? 'active' : ''}`} animate={{ opacity: activeStep >= 1 ? 1 : 0, y: activeStep >= 1 ? 0 : 20 }} transition={{ duration: 0.4, ease: "easeOut" }}>
              <div className="process-number">02</div>
              <h3 className="tc-heading">Judged in Hours After 4 Years of Study</h3>
              <p className="tc-body">Traditional hiring compresses your entire degree into a single resume screening or a 30-minute interview, leading to higher drop-offs and missed opportunities.</p>
            </motion.div>
            <motion.div className={`process-step ${activeStep >= 2 ? 'active' : ''}`} animate={{ opacity: activeStep >= 2 ? 1 : 0, y: activeStep >= 2 ? 0 : 20 }} transition={{ duration: 0.4, ease: "easeOut" }}>
              <div className="process-number">03</div>
              <h3 className="tc-heading">The Experience Needed Paradox</h3>
              <p className="tc-body">Companies expect prior experience for entry-level roles, but few give you the chance to gain it. Over 77% of grads end up learning everything from scratch on the job.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}



function HeroScrollSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // All words slide out, then "Built" slowly zooms to fill screen
  // Height is 250vh → scroll range is 150vh → animation is 7.5× slower than before
  const leftX = useTransform(scrollYProgress, [0, 0.55], ["0vw", "-100vw"]);
  const topOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const rightX = useTransform(scrollYProgress, [0, 0.55], ["0vw", "100vw"]);

  const isX = useTransform(scrollYProgress, [0, 0.55], ["0vw", "-50vw"]);
  const isOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // Built zooms slowly, reaches full coverage at 0.75, fades out at 0.8
  const builtScale = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [1, 2.5, 100, 100]);
  const builtOpacity = useTransform(scrollYProgress, [0, 0.6, 0.80], [1, 1, 0]);

  // Hero section fades just before Built finishes
  const heroOpacity = useTransform(scrollYProgress, [0.5, 0.80], [1, 0]);

  return (
    <section ref={containerRef} style={{ height: '250vh', position: 'relative', background: 'var(--cream)', zIndex: 1, overflow: 'hidden' }}>
      <motion.div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity }}
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
    </section>
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
          <button className="cta-type-btn" style={{ background: 'var(--black)', color: '#fff' }}>Enter Factory →</button>
        </div>
      </motion.div>
    </section>
  );
}

function CorporateView({ activeTab, setActiveTab }) {
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);  // start animation
        } else {
          setStatsVisible(false); // reset so it replays next time
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: statsRef,
    offset: ["start end", "end start"]
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const yCenter = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yRight = useTransform(scrollYProgress, [0, 1], [180, -180]);

  return (
    <div className="page-wrapper">
      <HeroScrollSection />

      {/* "What Corporates Face" — pulled up 140vh so it appears the moment Built fades out */}
      <section
        className="problems-section"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '3rem',
          paddingBottom: '3rem',
          background: 'var(--cream)',
          position: 'relative',
          zIndex: 3,
          marginTop: '-140vh',
          marginBottom: 0,
        }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
          <h2 className="section-title heading-serif text-center" style={{ color: 'var(--black)', marginBottom: '1rem' }}>WHAT <span style={{ color: 'var(--accent-purple)' }}>CORPORATES</span> FACE</h2>
          <div className="problems-intro text-center" style={{ marginBottom: '3rem' }}>
            <p className="problems-lead">One rushed interview. One resume. One gut call.</p>
          </div>
          <div className="problems-grid" ref={statsRef}>
            <motion.div className="problem-card" style={{ y: yLeft }}>
              <h3 className="problem-stat">70%</h3>
              <p className="problem-text">underperform or quit within a year.</p>
              <a href="#" className="arrow-link"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></a>
            </motion.div>
            <motion.div className="problem-card" style={{ y: yCenter }}>
              <h3 className="problem-stat">$4,700+</h3>
              <p className="problem-text">burned per wrong hire.</p>
              <a href="#" className="arrow-link"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></a>
            </motion.div>
            <motion.div className="problem-card" style={{ y: yRight }}>
              <h3 className="problem-stat">4–6</h3>
              <p className="problem-text">months lost in training before productivity.</p>
              <a href="#" className="arrow-link"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></a>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="scroll-overlay-container" style={{ marginTop: 0 }}>
        <SolutionsSection />

        {/* CTA with scroll-driven purple clip-path animation */}
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
    return scrollYProgress.onChange((latest) => {
      const idx = Math.min(Math.floor(latest * totalCards), totalCards - 1);
      setActiveStep(idx);
    });
  }, [scrollYProgress]);

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
        <section className="social-proof-section" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', padding: '6rem 0', overflow: 'hidden', background: 'var(--black)' }}>
          <div className="w-full text-center">
            <div className="company-logos overflow-hidden relative w-full mt-4" style={{ opacity: 0.9 }}>
              <div className="flex gap-16 whitespace-nowrap animate-marquee">
                {[...Array(3)].map((_, groupIndex) => (
                  <React.Fragment key={groupIndex}>
                    <div className="company-box" style={{ fontSize: '1.2rem', fontWeight: '800', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#38BDF8' }}>◆</span> SKYDO
                    </div>
                    <div className="company-box" style={{ fontSize: '1.2rem', fontWeight: '800', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#2DD4BF' }}>●</span> QAPITA
                    </div>
                    <div className="company-box" style={{ fontSize: '1.2rem', fontWeight: '800', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#FB923C' }}>▲</span> KUTLERRI
                    </div>
                    <div className="company-box" style={{ fontSize: '1.2rem', fontWeight: '800', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#A78BFA' }}>■</span> LEADRAT
                    </div>
                    <div className="company-box" style={{ fontSize: '1.2rem', fontWeight: '800', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#F43F5E' }}>★</span> RAZORPAY
                    </div>
                    <div className="company-box" style={{ fontSize: '1.2rem', fontWeight: '800', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#E2E8F0' }}>●</span> CRED
                    </div>
                    <div className="company-box" style={{ fontSize: '1.2rem', fontWeight: '800', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#60A5FA' }}>◆</span> DEEL
                    </div>
                    <div className="company-box" style={{ fontSize: '1.2rem', fontWeight: '800', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#F472B6' }}>▲</span> ZETA
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <p className="caption" style={{ marginTop: '2.5rem', color: '#666', fontStyle: 'italic', fontSize: '1.1rem' }}>Where AntBox candidates get hired</p>
          </div>
        </section>
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
