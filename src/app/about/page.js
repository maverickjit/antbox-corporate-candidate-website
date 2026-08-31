"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from 'framer-motion';
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

function BlackQuoteStatementSection() {
  return (
    <div
      className={styles.panelBlackQuote}
      style={{
        width: '100vw',
        left: '50%',
        marginLeft: '-50vw',
        minHeight: '100vh',
        height: '100vh',
        borderRadius: 0,
        padding: '2rem',
        background: '#0A0A0E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2
      }}
    >
      <div className={styles.heroQuoteContainer} style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <MaskedLineRevealStatement />
      </div>
    </div>
  );
}

function CompanyValuesCardsSection({ values }) {
  const containerRef = React.useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Horizontal slide finishes at 0.68, then cards stay completely stationary from 0.68 to 1.0 while next section overlays
  const trackX = useTransform(scrollYProgress, [0.0, 0.68, 1.0], ["0px", "-3160px", "-3160px"]);

  const cardSuits = ['♠', '♥', '♦', '♣', '★'];
  const cardTags = [
    'RADICAL TRANSPARENCY • OPEN CREDIT • NO CLOSED DOORS',
    'FIRST PRINCIPLES • CLARITY FIRST • SIMPLIFY EVERYTHING',
    'URGENCY • MOVE FAST • DELIVER AHEAD OF TIME',
    'VERIFIED EVIDENCE • SHOW DON\'T TELL • SHIP CONSTANTLY',
    'TOTAL ACCOUNTABILITY • FULL OWNERSHIP • NO HANDOFFS'
  ];

  return (
    <div ref={containerRef} className={styles.valuesArcSection}>
      <div className={styles.valuesArcSticky}>
        {/* Section Header */}
        <div className={styles.valuesArcHeader}>
          <h2 className={styles.valuesArcTitle}>
            OUR CORE VALUES
          </h2>
        </div>

        {/* Horizontal Curved Track with 5 Cards (Text Left, Image Right) */}
        <motion.div style={{ x: trackX }} className={styles.valuesArcTrack}>
          {values.map((value, index) => {
            return (
              <motion.div
                key={index}
                className={styles.arcPlayCard}
                style={{
                  borderTop: `6px solid ${value.bg}`
                }}
              >
                {/* Left Column: Text Content */}
                <div className={styles.arcCardLeft}>
                  <div>
                    <div className={styles.arcCardStepRow}>
                      <span className={styles.arcCardSuitIcon}>
                        {cardSuits[index]}
                      </span>
                    </div>

                    <h3 className={styles.arcCardTitle}>
                      {value.title}
                    </h3>
                    <p className={styles.arcCardDesc}>
                      {value.desc}
                    </p>
                  </div>

                  <div className={styles.arcCardFooter}>
                    <span>✦</span>
                    <span>{cardTags[index]}</span>
                  </div>
                </div>

                {/* Right Column: Image Artwork */}
                <div className={styles.arcCardRight} style={{ backgroundColor: value.bg }}>
                  {value.image ? (
                    <Image
                      src={value.image}
                      alt={value.title}
                      fill
                      unoptimized
                      className={styles.arcCardImg}
                    />
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

function FoundersManifestoSection() {
  const sectionRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"]
  });

  // Smooth deck card entrance: overlays directly over the stationary cards section
  const deckRadius = useTransform(scrollYProgress, [0, 1], ["48px 48px 0 0", "36px 36px 0 0"]);
  const deckShadow = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "0 -25px 60px rgba(0, 0, 0, 0.7), 0 -1px 0 rgba(255, 255, 255, 0.1)",
      "0 -50px 120px rgba(0, 0, 0, 0.98), 0 -1px 0 rgba(255, 255, 255, 0.18)"
    ]
  );

  return (
    <motion.div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        marginTop: '-100vh', // Overlays directly over the pinned cards section
        zIndex: 25,
        overflow: 'hidden',
        background: '#0A0A0E',
        borderRadius: deckRadius,
        boxShadow: deckShadow
      }}
    >
      <div
        className={styles.darkOverlapSheet}
        style={{ margin: 0, padding: '6rem 0 6.5rem', borderRadius: 0, background: '#0A0A0E' }}
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
      </div>
    </motion.div>
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Smooth scroll transformations for Full-Screen Expansion (0.10 -> 0.65)
  const cardWidth = useTransform(scrollYProgress, [0.10, 0.65], ["85vw", "100vw"]);
  const cardHeight = useTransform(scrollYProgress, [0.10, 0.65], ["76vh", "100vh"]);
  const cardRadius = useTransform(scrollYProgress, [0.10, 0.65], ["36px", "0px"]);
  const cardScale = useTransform(scrollYProgress, [0.10, 0.65], [0.92, 1.0]);

  // Parallax Zoom transforms for background real culture image
  const imageScale = useTransform(scrollYProgress, [0.00, 0.65, 1.0], [1.35, 1.05, 1.0]);
  const imageY = useTransform(scrollYProgress, [0.00, 1.0], ["-8%", "8%"]);

  // Parallax Zoom transforms for heading typography
  const textScale = useTransform(scrollYProgress, [0.10, 0.65], [0.88, 1.05]);
  const textY = useTransform(scrollYProgress, [0.10, 0.65], [30, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0.10, 0.65], [0.65, 0.4]);

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
          {/* Parallax Zoom Background Image */}
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

const customerReviewsData = [
  // Column 1
  [
    {
      name: "Alexandra Giraldo",
      role: "Global SDR Manager at Cabify",
      avatar: "/avatars/avatar1.jpg",
      tag: "TOP FUNNEL EFFICIENCY",
      text: "I lead a global team of SDRs that was using 7 different tools to complete full top funnel cycle. Now with AntBox operators, candidates hit the ground running with zero ramp-up time. Everything shipped on Day 1."
    },
    {
      name: "Aline Louzada",
      role: "Growth at Clara",
      avatar: "/avatars/avatar2.jpg",
      tag: "99.4% SKILL ACCURACY",
      text: "AntBox is remarkably intuitive and fast. They provide verified proof-of-work candidates rather than generic resumes. We replaced a 3-week screening process with a 48-hour direct deployment."
    },
    {
      name: "Amar Balic",
      role: "Revenue Operations Lead at Twinwin",
      avatar: "/avatars/avatar7.jpg",
      tag: "REV-OPS RIGOR",
      text: "The quality of operators coming out of AntBox is unmatched. The practical training in Glass Kitchen workflows means they already understand production rigor from day zero."
    },
    {
      name: "Elena Rostova",
      role: "VP of Product at Moneta",
      avatar: "/avatars/avatar1.jpg",
      tag: "DESIGN & DEV SYNC",
      text: "We needed senior-caliber execution under tight deadlines. AntBox's operators delivered our core design system rollout 3 weeks ahead of schedule."
    }
  ],
  // Column 2
  [
    {
      name: "José Marques",
      role: "CMO & Business Developer at Dokutech",
      avatar: "/avatars/avatar5.jpg",
      tag: "OUTBOUND STRATEGY",
      text: "Before using AntBox, I was heavily reliant on hit-or-miss recruiter pipelines. AntBox is an incredible upgrade — the workflow is 5x faster and candidates are vetted by actual engineering tests."
    },
    {
      name: "Karén Mkhitaryan",
      role: "CMO at Game Strategies",
      avatar: "/avatars/avatar4.jpg",
      tag: "SCALED OPERATIONS",
      text: "The whole model is built around proof of work instead of credential fluff. Every candidate we brought on had built real systems before they ever interviewed with us."
    },
    {
      name: "David Vance",
      role: "CTO at HyperScale Systems",
      avatar: "/avatars/avatar8.jpg",
      tag: "CORE INFRASTRUCTURE",
      text: "AntBox solved our senior frontend and backend bandwidth bottleneck. We onboarded 3 operators in 4 days, and their code velocity matched our top engineers immediately."
    },
    {
      name: "Sofia Chen",
      role: "Engineering Director at Apex Cloud",
      avatar: "/avatars/avatar4.jpg",
      tag: "CLOUD ARCHITECTURE",
      text: "The transparency and accountability AntBox brings is refreshing. No middlemen, no vanity metrics — just high-performing builders who take ownership."
    }
  ],
  // Column 3
  [
    {
      name: "Lucas Summers",
      role: "Digital Sales Account Manager at Hewlett Packard Enterprise",
      avatar: "/avatars/avatar3.jpg",
      tag: "ENTERPRISE OUTCOMES",
      text: "I went from a 5% open rate to an average of nearly 45% with our AntBox-trained cohort. The domain depth they instill makes a massive difference in complex sales cycles."
    },
    {
      name: "Luke Sheehy",
      role: "GTM at Tidio",
      avatar: "/avatars/avatar6.jpg",
      tag: "48-HOUR DEPLOYMENT",
      text: "During the free trial alone, we generated 5-6 enterprise pipeline meetings. Every candidate arrived fully trained on our exact tech stack and CRM workflows."
    },
    {
      name: "Marcus Thorne",
      role: "VP of Engineering at FinEdge",
      avatar: "/avatars/avatar9.jpg",
      tag: "FINTECH RELIABILITY",
      text: "AntBox operators treated our mission-critical codebase with total care. They embody 'Own The Whole Box' — finding edge cases and patching them before release."
    },
    {
      name: "Priya Nambiar",
      role: "Talent Partner at VentureScale",
      avatar: "/avatars/avatar3.jpg",
      tag: "SERIES A TO C TEAMS",
      text: "We recommend AntBox to all our portfolio founders. It's the most reliable way to hire pre-vetted, high-grit operators without burning engineering bandwidth on interviews."
    }
  ]
];

function CustomerReviewsSection() {
  const columnClasses = [styles.reviewsColUp, styles.reviewsColDown, styles.reviewsColUpFast];

  return (
    <section className={styles.customerReviewsSection}>
      {/* Section Header */}
      <div className={styles.reviewsHeader}>
        <div className={styles.reviewsBadge}>
          <span>✦</span>
          <span>WALL OF PROOF</span>
        </div>
        <h2 className={styles.reviewsTitle}>
          Hear it directly from our customers & partners
        </h2>
        <p className={styles.reviewsSubtitle}>
          Real feedback from high-growth engineering leaders, founders, and operators scaling with AntBox.
        </p>
      </div>

      {/* Marquee Masonry Grid with Gradient Fade Masks */}
      <div className={styles.reviewsContainer}>
        <div className={styles.reviewsFadeTop} />
        <div className={styles.reviewsFadeBottom} />

        <div className={styles.reviewsGrid}>
          {customerReviewsData.map((col, colIndex) => {
            // Duplicate array for seamless infinite vertical marquee looping
            const loopItems = [...col, ...col];
            return (
              <div
                key={colIndex}
                className={`${styles.reviewsColTrack} ${columnClasses[colIndex]}`}
              >
                {loopItems.map((item, idx) => (
                  <div key={idx} className={styles.reviewCard}>
                    <div className={styles.reviewAuthorRow}>
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        width={44}
                        height={44}
                        unoptimized
                        className={styles.reviewAvatar}
                      />
                      <div className={styles.reviewAuthorMeta}>
                        <span className={styles.reviewAuthorName}>{item.name}</span>
                        <span className={styles.reviewAuthorRole}>{item.role}</span>
                        <div className={styles.reviewStars}>
                          {'★'.repeat(5)}
                        </div>
                      </div>
                    </div>

                    <p className={styles.reviewText}>
                      "{item.text}"
                    </p>

                    <div className={styles.reviewTag}>
                      {item.tag}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutFooterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
    }
  };

  return (
    <footer className={styles.subtleFooterSection}>
      <div className={styles.footerContainer}>
        {/* Subtle Badge */}
        <div className={styles.footerBadge}>
          <span>✦</span>
          <span>BUILD WITH US</span>
        </div>

        {/* Heading & Subtitle */}
        <h2 className={styles.footerTitle}>
          Join our team or stay in the loop
        </h2>
        <p className={styles.footerSubtitle}>
          Whether you want to join our operator engine or get weekly dispatches on scaling high-performing teams, we'd love to connect.
        </p>

        {/* Dual Actions Grid: Join Team (Left) + Email Updates (Right) */}
        <div className={styles.footerActionsGrid}>
          {/* Card A: Join Our Team */}
          <div className={styles.footerCard}>
            <div>
              <h3 className={styles.footerCardHeading}>Join Our Team</h3>
              <p className={styles.footerCardText}>
                We are always looking for high-grit product designers, engineers, and growth operators ready to own real work.
              </p>
            </div>
            <a href="/candidates" className={styles.joinTeamBtn}>
              Explore Open Roles
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>

          {/* Card B: Email Updates */}
          <div className={styles.footerCard}>
            <div>
              <h3 className={styles.footerCardHeading}>Get Weekly Updates</h3>
              <p className={styles.footerCardText}>
                No fluff. Just operator playbooks, domain teardowns, and insights from scaling teams across tech.
              </p>
            </div>

            {isSubscribed ? (
              <div className={styles.successMessage}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>You're in the loop! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your work email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.subscribeBtn}>
                  Get Updates
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Subtle Bottom Row */}
        <div className={styles.footerBottomRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Image src="/antboxlogo.png" alt="AntBox Logo" width={22} height={22} unoptimized />
            <span style={{ fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', fontSize: '0.95rem' }}>antbox</span>
          </div>

          <div className={styles.footerLinks}>
            <a href="/corporates">Corporates</a>
            <a href="/candidates">Candidates</a>
            <a href="/about">About</a>
            <a href="/resources">Resources</a>
          </div>

          <div>
            <span>© 2026 AntBox Inc. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HeroCursorFollower({ containerRef }) {
  const mouseX = useMotionValue(600);
  const mouseY = useMotionValue(350);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth responsive spring physics for cursor light
  const springConfig = { damping: 28, stiffness: 200, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Ethereal trailing aura with slightly softer lag
  const trailX = useSpring(mouseX, { damping: 38, stiffness: 110, mass: 0.85 });
  const trailY = useSpring(mouseY, { damping: 38, stiffness: 110, mass: 0.85 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', () => setIsHovered(true));

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef, mouseX, mouseY]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {/* Outer Ethereal Aurora Glow */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          width: '640px',
          height: '640px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(187, 98, 222, 0.22) 0%, rgba(236, 72, 153, 0.12) 35%, rgba(192, 132, 252, 0.04) 65%, transparent 75%)',
          filter: 'blur(55px)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.6s ease'
        }}
      />

      {/* Inner Responsive Ambient Spotlight Beam */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(216, 180, 254, 0.42) 0%, rgba(187, 98, 222, 0.16) 45%, transparent 70%)',
          filter: 'blur(28px)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Subtle Luminous Focal Dot */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(192, 132, 252, 0.5) 50%, transparent 100%)',
          filter: 'blur(5px)',
          opacity: isHovered ? 0.75 : 0,
          transition: 'opacity 0.2s ease'
        }}
      />
    </div>
  );
}

export default function About() {
  const [activeFilter, setActiveFilter] = useState('View all');
  const [revealedCount, setRevealedCount] = useState(1);
  const valuesSectionRef = React.useRef(null);
  const heroContainerRef = React.useRef(null);

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
      <div ref={heroContainerRef} className={styles.operatorsHeroSection}>
        {/* Cursor-following interactive ambient spotlight element */}
        <HeroCursorFollower containerRef={heroContainerRef} />

        {/* Soft Ambient Glow Blurs */}
        <div className={styles.operatorsGlowTopLeft} />
        <div className={styles.operatorsGlowBottomRight} />

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

      {/* ── Section 2A: Whole Screen Black Statement Section ── */}
      <BlackQuoteStatementSection />

      {/* ── Section 2B: Company Core Values (3D Cards Stack with New 1.mp4 Video Animation) ── */}
      <CompanyValuesCardsSection values={values} />

      {/* ── Section 3: Founders Manifesto (Normal Vertical Scroll Section) ── */}
      <FoundersManifestoSection />

      {/* ── Section 4: Culture Section (3D Parallax Scroll Transition) ── */}
      <ParallaxCultureCard />

      {/* ── Section 5: Customer Reviews Marquee Masonry Wall (customerreview.mp4 style) ── */}
      <CustomerReviewsSection />

      {/* ── Section 6: Simple & Subtle Join Team & Email Updates Footer CTA ── */}
      <AboutFooterSection />
    </main>
  );
}