"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import styles from './about.module.css';

const manifestoParagraphs = [
  "The degree was never a skill test. It was a proxy - cheap, universally agreed on, good enough for fifty years. Then every company announced they'd stopped using it. Harvard and Burning Glass went and checked the actual hires: at some large firms, fewer than 1 in 700 changed.",
  "Turns out you can't delete a filter. You can only replace it. Nobody built the replacement. So I started AntBox in 2024 and did the unglamorous thing - built a tech enabled services business to fund the real one.",
  "The tech enables service half is live. We take final and pre-final year students, run them through specific domains and deploy them into SaaS companies where they're useful on Day 0.",
  "Paying clients, real revenue, and two years of watching up close what actually separates someone who's ready from someone who has a good CGPA. It also happens to be the best data collection operation I could have designed on purpose.",
  "The product half is why I'm actually here. Every hour a student works throws off signal: what they built, how fast they got unstuck, what they did when nobody was watching. We're turning that into a number a hiring manager can trust about someone they've never met."
];

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.85, 1]);
  const color = useTransform(progress, range, ["#D1D1D6", "#FFFFFF"]);
  const fontWeight = useTransform(progress, range, [500, 700]);

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

function TypingSubtitle({ text }) {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    let index = 0;
    const speed = 18; // smooth typing animation speed

    const timer = setInterval(() => {
      index++;
      setDisplayedLength(index);
      if (index >= text.length) {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [isInView, text]);

  return (
    <p ref={containerRef} className={styles.operatorsSubtitle}>
      <span>{text.slice(0, displayedLength)}</span>
      {!isTypingComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.35, repeat: Infinity, repeatType: "reverse" }}
          style={{
            display: 'inline-block',
            width: '2.5px',
            height: '1.1em',
            backgroundColor: '#8B5CF6',
            marginLeft: '3px',
            verticalAlign: '-0.15em',
            borderRadius: '1px'
          }}
        />
      )}
    </p>
  );
}

function HorizontalSwipeValuesSection({ values }) {
  const containerRef = React.useRef(null);
  const [revealedCount, setRevealedCount] = React.useState(1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Phase 1 (0.00 -> 0.15): Roll up entrance animation for Panel 1 black sheet
  const sheetY = useTransform(scrollYProgress, [0.0, 0.15], [100, 0]);
  const sheetRadius = useTransform(scrollYProgress, [0.0, 0.15], ["44px 44px 0 0", "0px 0px 0px 0px"]);

  // Phase 2 (0.18 -> 0.40): Horizontal Swipe from Panel 1 (Black) to Panel 2 (White)
  const panelX = useTransform(scrollYProgress, [0.18, 0.40], ["0vw", "-100vw"]);

  // Phase 3 (0.40 -> 0.95): Card reveal sequence inside Panel 2
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.40) {
        setRevealedCount(1);
      } else if (latest <= 0.95) {
        const cardProgress = (latest - 0.40) / 0.55;
        const step = Math.floor(cardProgress * 5) + 1;
        const count = Math.min(Math.max(step, 1), 5);
        setRevealedCount(count);
      } else {
        setRevealedCount(5);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className={styles.horizontalSwipeTrack} style={{ height: '360vh' }}>
      <div className={styles.horizontalStickyViewport}>
        <motion.div
          style={{ x: panelX }}
          className={styles.horizontalPanelContainer}
        >
          {/* ── PANEL 1: Whole Screen Black Statement Section ── */}
          <motion.div
            style={{ y: sheetY, borderRadius: sheetRadius }}
            className={styles.panelBlackQuote}
          >
            <div className={styles.heroQuoteContainer}>
              <MaskedLineRevealStatement />
            </div>
          </motion.div>

          {/* ── PANEL 2: Full-Screen Section with 5 Cards (Clean Light Background) ── */}
          <div
            style={{ backgroundColor: '#FDFBF7' }}
            className={styles.panelWhiteCards}
          >
            <div className={styles.valuesStickyContainer}>
              {/* Company Values Badge */}
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
                        transitionDelay: `${(index % 5) * 0.05}s`
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
        </motion.div>
      </div>
    </div>
  );
}

function FoundersManifestoSection() {
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        zIndex: 10,
        overflow: 'hidden',
        background: '#0A0A0E'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={styles.darkOverlapSheet}
        style={{ margin: 0, padding: '5.5rem 0 6rem', borderRadius: 0, background: '#0A0A0E' }}
      >
        <div className={styles.darkOverlapContent} style={{ width: '100%', maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

          {/* Centered Heading */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className={styles.manifestoTitle} style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F3E8FF 50%, #C084FC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Founders Manifesto
            </h2>
          </div>

          {/* Centered 2-Column Grid (Founder Photo + Manifesto Content) */}
          <div className={styles.manifestoSection} style={{ display: 'grid', gridTemplateColumns: '310px 1fr', gap: '2.75rem', alignItems: 'center', width: '100%', maxWidth: '1040px', margin: '0 auto' }}>
            <div className={styles.manifestoImageContainer} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className={styles.founderPhotoWrapper} style={{
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
                borderRadius: '22px',
                width: '100%',
                maxWidth: '310px',
                height: '335px'
              }}>
                <Image
                  src="/founder-photo-portrait.jpg"
                  alt="Rohit Singh - Founder & CEO"
                  fill
                  unoptimized
                  className={styles.founderPhoto}
                />
              </div>

              {/* Signature Name Block Below Image */}
              <div style={{
                marginTop: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <span style={{
                  fontFamily: "'Caveat', 'Dancing Script', 'Brush Script MT', cursive",
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  color: '#E9D5FF',
                  letterSpacing: '0.5px',
                  lineHeight: 1,
                  marginBottom: '0.2rem'
                }}>
                  Rohit Singh
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#A1A1AA'
                }}>
                  Founder & CEO
                </span>
              </div>
            </div>
            <div className={styles.manifestoContent}>
              <ContinuousScrollManifesto />
            </div>
          </div>

        </div>
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
  const full2 = "test — ";
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

function ManifestoWord({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.85, 1]);
  const color = useTransform(progress, range, ["#D4D4DE", "#FFFFFF"]);
  const fontWeight = useTransform(progress, range, [500, 700]);

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

function ContinuousScrollManifesto() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"]
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
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {parsedParagraphs.map((paraWords, pIndex) => (
        <p key={pIndex} style={{ lineHeight: 1.6, fontSize: '0.98rem', margin: 0 }}>
          {paraWords.map(({ word, globalIndex }) => {
            const start = globalIndex / totalWords;
            const end = Math.min(1, start + (1 / totalWords) * 3);
            return (
              <ManifestoWord
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
  const videoRef = React.useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Physics-based spring progress for ultra-smooth, slow transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 20,
    restDelta: 0.001
  });

  // Stage 1 (0.00 -> 0.28): Parallax Zoom Expansion into 100% Full Screen
  const cardWidth = useTransform(smoothProgress, [0.00, 0.28], ["85vw", "100vw"]);
  const cardHeight = useTransform(smoothProgress, [0.00, 0.28], ["76vh", "100vh"]);
  const cardRadius = useTransform(smoothProgress, [0.00, 0.28], ["36px", "0px"]);
  const cardScale = useTransform(smoothProgress, [0.00, 0.28], [0.92, 1.0]);

  // Stage 2A (0.28 -> 0.42): Layer 1 (Real Photo & "LIFE AT ANTBOX" Heading) minimizes slowly and fades out
  const initialLayerOpacity = useTransform(smoothProgress, [0.28, 0.42], [1.0, 0.0]);
  const initialLayerScale = useTransform(smoothProgress, [0.28, 0.42], [1.0, 0.82]);
  const initialLayerY = useTransform(smoothProgress, [0.28, 0.42], [0, -30]);

  // Stage 2B (0.36 -> 0.48): Layer 2 (3D Motion Video Animation Frame) smoothly fades in with depth scale
  const videoOpacity = useTransform(smoothProgress, [0.36, 0.48], [0.0, 1.0]);
  const videoScale = useTransform(smoothProgress, [0.36, 0.48, 1.0], [1.5, 1.35, 1.22]);
  const videoY = useTransform(smoothProgress, [0.36, 1.0], ["-2%", "2%"]);

  // Stage 3 (0.42 -> 1.00): Video movement activates ONLY when window reaches FULL SCREEN AND ONLY when scrolling!
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Pause auto playback so movement only occurs when scrolling
    video.pause();

    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (!video.duration || isNaN(video.duration)) return;

      if (latest < 0.42) {
        video.currentTime = 0;
      } else {
        // Smooth frame scrubbing across scroll
        const videoProgress = Math.min(Math.max((latest - 0.42) / 0.58, 0), 1);
        const targetTime = videoProgress * video.duration;
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          video.currentTime = targetTime;
        }
      }
    });

    return () => unsubscribe();
  }, [smoothProgress]);

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
          {/* Layer 1: Real Culture Hero Image + LIFE AT ANTBOX text (Initial State - Minimizes on zoom) */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              zIndex: 2,
              opacity: initialLayerOpacity,
              scale: initialLayerScale,
              y: initialLayerY,
              pointerEvents: 'none'
            }}
          >
            <Image
              src="/culture-hero-real.jpg"
              alt="Life at AntBox"
              fill
              unoptimized
              className={styles.cultureHeroImage}
            />
            <div className={styles.cultureHeroOverlay} style={{ opacity: 0.5 }} />

            {/* Prominent Stacked Heading for Initial Card */}
            <div className={styles.cultureTextBlock}>
              <h2 className={styles.cultureStackedHeading}>
                <span>LIFE</span>
                <span>AT</span>
                <span className={styles.cultureAccentLine}>ANTBOX.</span>
              </h2>
            </div>

            {/* Subtitle & CTA for Initial Card */}
            <div className={styles.cultureBottomRow}>
              <div className={styles.cultureSubGroup}>
                <p className={styles.cultureSubtitle}>
                  But we don't burn out doing it.
                </p>
                <div className={styles.cultureCtaBtn}>
                  Join the team
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Layer 2: Scroll-Driven Motion Background Video Animation (Fades in as card expands) */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              zIndex: 1,
              opacity: videoOpacity
            }}
          >
            <motion.div style={{ y: videoY, scale: videoScale, width: '100%', height: '100%', position: 'relative' }}>
              <video
                ref={videoRef}
                src="/lifeatantbox-animate.mp4"
                muted
                playsInline
                className={styles.cultureHeroImage}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </motion.div>
          </motion.div>
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
      {/* ── Section 1: Operators Hero Section (Rich Immersive Aesthetics) ── */}
      <div className={styles.operatorsHeroSection}>
        {/* Soft Ambient Glow Blurs */}
        <div className={styles.operatorsGlowTopLeft} />
        <div className={styles.operatorsGlowBottomRight} />

        {/* Levitating Floating Trust Badges */}
        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className={`${styles.floatingTrustPill} ${styles.floatingPillTopLeft}`}
        >
          <span style={{ fontSize: '1rem' }}>⚡</span>
          <span>50+ B2B SaaS Teams</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className={`${styles.floatingTrustPill} ${styles.floatingPillTopRight}`}
        >
          <span style={{ fontSize: '1rem' }}>🎯</span>
          <span>Verified Proof-of-Work</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className={`${styles.floatingTrustPill} ${styles.floatingPillBottomLeft}`}
        >
          <span style={{ fontSize: '1rem' }}>🚀</span>
          <span>Day 0 Contributor Ready</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className={`${styles.floatingTrustPill} ${styles.floatingPillBottomRight}`}
        >
          <span style={{ fontSize: '1rem' }}>📈</span>
          <span>98.4% Retention Signal</span>
        </motion.div>

        <div className={styles.operatorsHeaderBlock}>
          {/* Hero Category Badge */}
          <div className={styles.heroCategoryTag}>
            <span>✨</span>
            <span>OPERATOR-LED TALENT ENGINE</span>
          </div>

          <h1 className={styles.operatorsTitle}>
            We are operators who have <span className={styles.operatorsHighlight}>vetted, trained, and deployed</span> top talent for B2B companies.
          </h1>
          <TypingSubtitle text="We take final and pre-final year students, run them through real-world domain teardowns, and deploy them into fast-growing SaaS teams. We bring verified proof of work, owning candidate readiness so they contribute from Day 0." />

          {/* Scroll Guidance Indicator */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={styles.scrollGuidancePill}
          >
            <span>SCROLL TO EXPLORE</span>
            <span style={{ color: '#BB62DE', fontSize: '0.9rem', fontWeight: 800 }}>↓</span>
          </motion.div>
        </div>
      </div>

      {/* ── Section 2: Pinned Horizontal Swipe Track (Black Quote -> White 5 Cards) ── */}
      <HorizontalSwipeValuesSection values={values} />

      {/* ── Section 3: Founders Manifesto (Normal Vertical Scroll Section) ── */}
      <FoundersManifestoSection />

      {/* ── Section 4: Culture Section (3D Parallax Scroll Transition) ── */}
      <ParallaxCultureCard />
    </main>
  );
}
