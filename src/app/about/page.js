"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Lenis from 'lenis';
import styles from './about.module.css';

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
      
      const step = Math.floor(distanceScrolled / 160) + 1;
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

        <div className={styles.operatorsImageFrame}>
          <Image
            src="/team-photo-real-v2.jpg"
            alt="AntBox Team Operators"
            fill
            unoptimized
            priority
            className={styles.operatorsImage}
          />
        </div>
      </div>

      {/* ── Section 2: Partner / Core Companies Cards (Moving Belt Ticker) ── */}
      <div className={`${styles.partnerBannerSection} ${styles.reveal}`}>
        <div className={styles.partnerBannerContent}>
          <h2 className={styles.partnerBannerTitle}>
            We are the extended talent arm for 50+ B2B companies
          </h2>
          <div className={styles.partnerBannerDivider}></div>

          {/* Moving Belt Ticker Track */}
          <div className={styles.partnerLogoTickerContainer}>
            <div className={styles.partnerLogoTrack}>
              {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, idx) => (
                <div key={idx} className={styles.partnerLogoCard}>
                  {logo.icon}
                  {logo.customContent ? logo.customContent : <span style={logo.style}>{logo.name}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Core Values (Sequential Scroll 3D Cards) ── */}
      <div ref={valuesSectionRef} className={styles.valuesSection}>
        <div className={styles.heroQuoteContainer}>
          <div className={styles.valuesMeta}>
            <span className={styles.labelBadge}>Company Values</span>
          </div>

          <div className={styles.quoteIconSymbol}>“</div>

          <div className={styles.valuesStatement}>
            <p>
              AntBox is built on a simple idea: the degree was never a skill test —{' '}
              <span className={styles.quoteAccent}>
                <span className={styles.highlightSweepAccent}>it was a proxy.</span>
              </span>
              <br />
              <strong className={styles.highlightSweepStrong}>
                Nobody built the replacement. So we did.
              </strong>
            </p>
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
            <p>
              The degree was never a skill test. It was a proxy - cheap, universally agreed on, good enough for fifty years. Then every company announced they'd stopped using it. Harvard and Burning Glass went and checked the actual hires: at some large firms, fewer than 1 in 700 changed.
            </p>
            <p>
              Turns out you can't delete a filter. You can only replace it. Nobody built the replacement. So I started AntBox in 2024 and did the unglamorous thing - built a tech enabled services business to fund the real one.
            </p>
            <p>
              The tech enables service half is live. We take final and pre-final year students, run them through specific domains and deploy them into SaaS companies where they're useful on Day 0.
            </p>
            <p>
              Paying clients, real revenue, and two years of watching up close what actually separates someone who's ready from someone who has a good CGPA. It also happens to be the best data collection operation I could have designed on purpose.
            </p>
            <p>
              The product half is why I'm actually here. Every hour a student works throws off signal: what they built, how fast they got unstuck, what they did when nobody was watching. We're turning that into a number a hiring manager can trust about someone they've never met.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 4: Culture Section (Full Overlapping Sheet) ── */}
      <div className={`${styles.cultureOverlapWrapper} ${styles.reveal}`}>
        <div className={styles.cultureSection}>
          <div className={styles.cultureHeroCard}>

            {/* Background center image */}
            <Image
              src = '/culture-hero-real.jpg'
              alt="Life at AntBox"
              fill
              unoptimized
              className={styles.cultureHeroImage}
            />
            <div className={styles.cultureHeroOverlay}></div>

            {/* Big stacked heading left */}
            <div className={styles.cultureTextBlock}>
              <h2 className={styles.cultureStackedHeading}>
                <span>LIFE</span>
                <span>AT</span>
                <span className={styles.cultureAccentLine}>ANTBOX.</span>
              </h2>
            </div>

            {/* Bottom row */}
            <div className={styles.cultureBottomRow}>
              {/* Subtitle + CTA bottom-left */}
              <div className={styles.cultureSubGroup}>
                <p className={styles.cultureSubtitle}>
                  But we don't burn out doing it.
                </p>
                <a href="#jobs" className={styles.cultureCtaBtn}>
                  Join the team
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>



    </main>
  );
}
