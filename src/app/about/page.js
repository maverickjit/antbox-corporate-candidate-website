"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import styles from './about.module.css';

const manifestoParagraphs = [
  "The degree was never a skill test. It was a proxy - cheap, universally agreed on, good enough for fifty years. Then every company announced they'd stopped using it. Harvard and Burning Glass went and checked the actual hires: at some large firms, fewer than 1 in 700 changed.",
  "Turns out you can't delete a filter. You can only replace it. Nobody built the replacement. So I started AntBox in 2024 and did the unglamorous thing - built a tech enabled services business to fund the real one.",
  "The tech enables service half is live. We take final and pre-final year students, run them through specific domains and deploy them into SaaS companies where they're useful on Day 0.",
  "Paying clients, real revenue, and two years of watching up close what actually separates someone who's ready from someone who has a good CGPA. It also happens to be the best data collection operation I could have designed on purpose.",
  "The product half is why I'm actually here. Every hour a student works throws off signal: what they built, how fast they got unstuck, what they did when nobody was watching. We're turning that into a number a hiring manager can trust about someone they've never met."
];

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(progress, range, ["#4A4A52", "#FFFFFF"]);
  const fontWeight = useTransform(progress, range, [400, 800]);

  return (
    <motion.span
      style={{
        opacity,
        color,
        fontWeight,
        display: 'inline-block',
        marginRight: '0.28em'
      }}
    >
      {word}
    </motion.span>
  );
}

function BlackRollingSheetContainer({ children }) {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 0.15"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  return (
    <div ref={containerRef} style={{ position: 'relative', zIndex: 10, width: '100%', marginBottom: '2rem' }}>
      <motion.div
        style={{
          y,
          scale,
          backgroundColor: '#0A0A0E',
          color: '#FFFFFF',
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          borderRadius: '44px',
          padding: '7rem 2rem 6rem',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.45)',
          minHeight: '75vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function ScribbleUnderline({ children, color = "#BB62DE", active = false }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', padding: '0 0.12em' }}>
      <span style={{ position: 'relative', zIndex: 1, fontWeight: 700 }}>{children}</span>
      <svg
        viewBox="0 0 300 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          bottom: '-6px',
          left: '-2%',
          width: '104%',
          height: '18px',
          overflow: 'visible',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <motion.path
          d="M 5,14 C 20,4 45,18 70,8 C 95,18 120,4 145,14 C 170,4 195,18 220,7 C 245,17 270,5 295,12"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M 12,17 C 35,7 65,19 95,10 C 125,20 155,7 185,16 C 215,6 245,18 288,11"
          stroke={color}
          strokeWidth="2.2"
          strokeOpacity="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 0.75 : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
      </svg>
    </span>
  );
}

function MaskedLineRevealStatement() {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const [part1, setPart1] = React.useState('');
  const [part2, setPart2] = React.useState('');
  const [part3, setPart3] = React.useState('');
  const [part4, setPart4] = React.useState('');

  const [activePart, setActivePart] = React.useState(0);
  const [showUnderline, setShowUnderline] = React.useState(false);

  const full1 = "AntBox is built on a simple idea: the degree was never a skill";
  const full2 = "test, ";
  const full3 = "it was a proxy.";
  const full4 = "Nobody built the replacement. So we did.";

  useEffect(() => {
    if (!isInView) return;

    let i1 = 0, i2 = 0, i3 = 0, i4 = 0;
    const speed = 40;

    setActivePart(1);

    const t1 = setInterval(() => {
      if (i1 < full1.length) {
        setPart1(full1.slice(0, i1 + 1));
        i1++;
      } else {
        clearInterval(t1);
        setActivePart(2);
        const t2 = setInterval(() => {
          if (i2 < full2.length) {
            setPart2(full2.slice(0, i2 + 1));
            i2++;
          } else {
            clearInterval(t2);
            setActivePart(3);
            const t3 = setInterval(() => {
              if (i3 < full3.length) {
                setPart3(full3.slice(0, i3 + 1));
                i3++;
              } else {
                clearInterval(t3);
                setTimeout(() => {
                  setActivePart(4);
                  const t4 = setInterval(() => {
                    if (i4 < full4.length) {
                      setPart4(full4.slice(0, i4 + 1));
                      i4++;
                    } else {
                      clearInterval(t4);
                      setShowUnderline(true);
                      setTimeout(() => setActivePart(0), 400);
                    }
                  }, speed);
                }, 180);
              }
            }, speed);
          }
        }, speed);
      }
    }, speed);

    return () => {
      clearInterval(t1);
    };
  }, [isInView]);

  const Cursor = () => (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse' }}
      style={{
        display: 'inline-block',
        width: '3px',
        height: '1.05em',
        backgroundColor: '#BB62DE',
        marginLeft: '3px',
        verticalAlign: '-0.12em',
        borderRadius: '1px'
      }}
    />
  );

  return (
    <div ref={containerRef} className={styles.valuesStatement} style={{ minHeight: '160px', textAlign: 'center' }}>
      <p style={{ margin: 0, textAlign: 'center' }}>
        {part1}
        {activePart === 1 && <Cursor />}
      </p>

      <p style={{ margin: 0, marginTop: '0.2rem', textAlign: 'center' }}>
        {part2}
        {part3 && (
          <span style={{ color: '#D8B4FE', fontStyle: 'italic', fontWeight: 700 }}>
            {part3}
          </span>
        )}
        {(activePart === 2 || activePart === 3) && <Cursor />}
      </p>

      <p style={{ margin: 0, marginTop: '0.2rem', textAlign: 'center' }}>
        {part4 && (
          <ScribbleUnderline color="#BB62DE" active={showUnderline}>
            <span>
              {part4}
            </span>
          </ScribbleUnderline>
        )}
        {activePart === 4 && <Cursor />}
      </p>
    </div>
  );
}

function ContinuousScrollManifesto() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.72", "end 0.38"]
  });

  const parsedParagraphs = React.useMemo(() => {
    let globalIndexCounter = 0;
    return manifestoParagraphs.map(paragraphText => {
      const words = paragraphText.split(" ");
      return words.map(word => ({
        word,
        globalIndex: globalIndexCounter++
      }));
    });
  }, []);

  const totalWords = React.useMemo(() => {
    return parsedParagraphs.reduce((sum, p) => sum + p.length, 0);
  }, [parsedParagraphs]);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {parsedParagraphs.map((paraWords, pIndex) => (
        <p key={pIndex} style={{ lineHeight: 1.75, fontSize: '1.08rem', margin: 0 }}>
          {paraWords.map(({ word, globalIndex }) => {
            const start = globalIndex / totalWords;
            const end = Math.min(1, start + (1 / totalWords) * 3.5);
            return (
              <Word
                key={globalIndex}
                word={word}
                progress={scrollYProgress}
                range={[Math.max(0, start - 0.02), end]}
              />
            );
          })}
        </p>
      ))}
    </div>
  );
}

function RollingImageCardBox({ children }) {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -20]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  return (
    <motion.div
      ref={containerRef}
      style={{ y, scale }}
      className={styles.operatorsImageCardBox}
    >
      {children}
    </motion.div>
  );
}

function ParallaxCultureCard() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Smooth scroll transformations for Full-Screen Expansion
  const cardWidth = useTransform(scrollYProgress, [0.1, 0.65], ["85vw", "100vw"]);
  const cardHeight = useTransform(scrollYProgress, [0.1, 0.65], ["76vh", "100vh"]);
  const cardRadius = useTransform(scrollYProgress, [0.1, 0.65], ["36px", "0px"]);
  const cardScale = useTransform(scrollYProgress, [0.1, 0.65], [0.92, 1.0]);

  // Parallax Zoom transforms for background image / video
  const imageScale = useTransform(scrollYProgress, [0, 0.65, 1], [1.35, 1.05, 1.0]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Parallax Zoom transforms for heading typography
  const textScale = useTransform(scrollYProgress, [0.1, 0.65], [0.88, 1.05]);
  const textY = useTransform(scrollYProgress, [0.1, 0.65], [30, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0.1, 0.65], [0.65, 0.4]);

  return (
    <div ref={containerRef} className={styles.cultureStickyTrack}>
      <div className={styles.cultureStickyInner}>
        <motion.div
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: cardRadius,
            scale: cardScale,
          }}
          className={styles.cultureHeroCard}
        >
          {/* Parallax Zoom Background image / video wrapper */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
            <motion.div style={{ y: imageY, scale: imageScale, width: '100%', height: '100%', position: 'relative' }}>
              <Image
                src="/culture-hero-real.jpg"
                alt="Life at AntBox"
                fill
                unoptimized
                className={styles.cultureHeroImage}
              />
            </motion.div>
          </div>

          <motion.div style={{ opacity: overlayOpacity }} className={styles.cultureHeroOverlay}></motion.div>

          {/* Top badge */}
          <span className={styles.cultureLabelBadge}>CULTURE & LIFE</span>

          {/* Parallax Zoom Big stacked heading */}
          <motion.div style={{ y: textY, scale: textScale }} className={styles.cultureTextBlock}>
            <h2 className={styles.cultureStackedHeading}>
              <span>LIFE</span>
              <span>AT</span>
              <span className={styles.cultureAccentLine}>ANTBOX.</span>
            </h2>
          </motion.div>

          {/* Bottom row */}
          <div className={styles.cultureBottomRow}>
            <div className={styles.cultureSubGroup}>
              <p className={styles.cultureSubtitle}>
                But we don't burn out doing it.
              </p>
              <a href="#jobs" className={styles.cultureCtaBtn}>
                Join the team
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function About() {
  const [activeFilter, setActiveFilter] = useState('View all');
  const [revealedCount, setRevealedCount] = useState(1);
  const valuesSectionRef = React.useRef(null);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealVisible);
        }
      });
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll(`.${styles.reveal}`);
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Initialize Lenis smooth scroll for About page
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    let animationFrameId;

    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Scroll listener for sequential 1-by-1 card reveal synced with Lenis
    const handleScroll = () => {
      if (!valuesSectionRef.current) return;
      const rect = valuesSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const startPoint = windowHeight * 0.65;
      const distanceScrolled = startPoint - rect.top;

      if (distanceScrolled <= 0) {
        setRevealedCount(1);
        return;
      }

      const step = Math.floor(distanceScrolled / 130) + 1;
      const count = Math.min(Math.max(step, 1), 5);

      setRevealedCount(count);
    };

    lenis.on('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      lenis.destroy();
    };
  }, []);

  const values = [
    {
      title: "COOK IN THE GLASS KITCHEN",
      desc: "Nothing great is made behind closed doors. We share the work raw, take the heat in the open, and plate the credit where everyone can see it.",
      bg: "#5BE7C4",
      image: '/value_glass_kitchen_1787311047086.jpg'
    },
    {
      title: "THINK NAPKIN FIRST",
      desc: "If you can't explain it simply, you don't understand it well enough. Clarity comes before action, and thinking comes before doing.",
      bg: "#FF6BE6",
      image: '/value_napkin_first_1787311075113.jpg'
    },
    {
      title: "RESPECT THE GAME CLOCK",
      desc: "Time is a competitive advantage. Move with urgency, honor commitments, and deliver before opportunities expire.",
      bg: "#FFD644",
      image: "/value_game_clock_1787311103049.jpg"
    },
    {
      title: "PROOF OF WORK",
      desc: "Talk is a claim. Work is the evidence. We don't describe what we did, we show what shipped, and it speaks for itself.",
      bg: "#C56BFF",
      image: "/value_proof_work_1787311131543.jpg"
    },
    {
      title: "OWN THE WHOLE BOX",
      desc: "The best seat in the house comes with the whole scoreboard. Touch any part of the work, and all of it becomes yours - every cell carried home.",
      bg: "#FF8359",
      image: "/value_own_box_1787311159506.jpg"
    }
  ];

  const jobs = [
    { title: "Product Designer", category: "Design", desc: "We're looking for a mid-level product designer to join our team.", location: "100% remote", type: "Full-time" },
    { title: "Engineering Manager", category: "Development", desc: "We're looking for an experienced engineering manager to join our team.", location: "100% remote", type: "Full-time" },
    { title: "Customer Success Manager", category: "Customer Service", desc: "We're looking for a customer success manager to join our team.", location: "100% remote", type: "Full-time" },
    { title: "Account Executive", category: "Operations", desc: "We're looking for an account executive to join our team.", location: "100% remote", type: "Full-time" },
    { title: "SEO Marketing Manager", category: "Marketing", desc: "We're looking for an experienced SEO marketing manager to join our team.", location: "100% remote", type: "Full-time" }
  ];

  const partnerLogos = [
    {
      name: 'antbox',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="4" />
        </svg>
      ),
      style: { fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.3px', marginLeft: '4px' }
    },
    {
      name: 'Qapita',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="8" />
          <path d="M16 16l4 4" />
        </svg>
      ),
      style: { fontWeight: 700, fontSize: '0.95rem', marginLeft: '4px' }
    },
    {
      name: 'Anunta',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 22h20L12 2zm0 6l5 10H7l5-10z" />
        </svg>
      ),
      style: { fontWeight: 700, fontSize: '0.95rem', marginLeft: '4px' }
    },
    {
      name: 'Light Inc.',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
        </svg>
      ),
      style: { fontWeight: 700, fontSize: '0.95rem', marginLeft: '4px' }
    },
    {
      name: 'Skydo',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
      ),
      style: { fontWeight: 700, fontSize: '0.95rem', marginLeft: '4px' }
    },
    {
      name: 'Tezo',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="4" cy="6" r="2.5" /><circle cx="12" cy="6" r="2.5" /><circle cx="20" cy="6" r="2.5" />
          <circle cx="4" cy="18" r="2.5" /><circle cx="12" cy="18" r="2.5" /><circle cx="20" cy="18" r="2.5" />
        </svg>
      ),
      style: { fontWeight: 800, fontSize: '0.95rem', marginLeft: '4px' }
    }
  ];

  return (
    <main className={styles.main}>
      {/* ── Section 1: Operators Banner (Reference Style) ── */}
      <div className={styles.operatorsHeroSection}>
        <div className={styles.operatorsHeaderBlock}>
          <h2 className={styles.operatorsTitle}>
            We are operators who have <span className={styles.operatorsHighlight}>vetted, trained, and deployed</span> top talent for B2B companies.
          </h2>
          <p className={styles.operatorsSubtitle}>
            We take final and pre-final year students, run them through real-world domain teardowns, and deploy them into fast-growing SaaS teams. We bring verified proof of work, owning candidate readiness so they contribute from Day 0.
          </p>
        </div>
      </div>

      {/* ── Rolling Black Curtain Sheet (Smooth Scroll Overlay) ── */}
      <BlackRollingSheetContainer>
        <div className={styles.heroQuoteContainer}>
          <MaskedLineRevealStatement />
        </div>
      </BlackRollingSheetContainer>

      {/* ── Section 3: Core Values (White Section with 5 Cards) ── */}
      <div ref={valuesSectionRef} className={styles.valuesSection}>
        <div className={styles.valuesStickyContainer}>
          {/* Company Values Badge above the 5 cards */}
          <div className={styles.valuesMeta} style={{ marginBottom: '1rem' }}>
            <span className={styles.labelBadge}>Company Values</span>
          </div>

          {/* Card Step Indicator */}
          <div className={styles.cardStepIndicator}>
            <div className={styles.stepDots}>
              {[1, 2, 3, 4, 5].map((step) => (
                <button
                  key={step}
                  className={`${styles.stepDot} ${step <= revealedCount ? styles.stepDotActive : ''}`}
                  onClick={() => setRevealedCount(step)}
                  aria-label={`Jump to value ${step}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.inspoCardsContainer}>
            {values.map((value, index) => {
              const isRevealed = index < revealedCount;
              return (
                <div
                  key={index}
                  className={`${styles.inspoCard} ${isRevealed ? styles.inspoCardRevealed : styles.inspoCardHidden}`}
                  style={{
                    backgroundColor: value.bg,
                    transitionDelay: `${(index % 5) * 0.06}s`
                  }}
                >
                  <div className={styles.inspoImageContainer}>
                    {value.image ? (
                      <Image
                        src={value.image}
                        alt={value.title}
                        fill
                        unoptimized
                        className={styles.inspoImage}
                      />
                    ) : null}
                  </div>

                  <div>
                    <h3 className={styles.inspoCardTitle}>{value.title}</h3>
                    <p className={styles.inspoCardDesc}>{value.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Dark Overlapping Card Sheet ── */}
      <div className={styles.darkOverlapSheet}>
        <div className={styles.darkOverlapContent}>
          {/* ── Section 4: Founders Manifesto ── */}
          <div className={`${styles.manifestoOverlapWrapper} ${styles.reveal}`}>
            <div className={styles.manifestoSection}>
              <div className={styles.manifestoImageContainer}>
                <h2 className={styles.manifestoTitle}>Founders Manifesto</h2>
                <div className={styles.founderPhotoWrapper}>
                  <Image
                    src="/founder-photo-portrait.jpg"
                    alt="Founder Photo"
                    fill
                    unoptimized
                    className={styles.founderPhoto}
                  />
                </div>
              </div>
              <div className={styles.manifestoContent}>
                <ContinuousScrollManifesto />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 5: Culture Section (3D Parallax Scroll Transition) ── */}
      <ParallaxCultureCard />
    </main>
  );
}