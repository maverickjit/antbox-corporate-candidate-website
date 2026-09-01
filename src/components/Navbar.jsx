"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTab } from '../context/TabContext';

const emptySubscribe = () => () => {};

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const { activeTab, setActiveTab } = useTab();
  const [isScrolled, setIsScrolled] = useState(false);
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const pillRef = useRef(null);
  const corpBtnRef = useRef(null);
  const candBtnRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update toggle slider indicator position
  useEffect(() => {
    if (!mounted || !isHome) return;
    const pill = pillRef.current;
    const activeBtn = activeTab === 'corporates' ? corpBtnRef.current : candBtnRef.current;
    if (!pill || !activeBtn) return;
    pill.style.left = activeBtn.offsetLeft + 'px';
    pill.style.width = activeBtn.offsetWidth + 'px';
  }, [activeTab, mounted, isScrolled, isHome]);

  if (!mounted) return null;

  const isCorporate = activeTab === 'corporates';
  // When scrolled: corporate pill is dark, candidate pill is light.
  // When not scrolled: corporate hero is beige (#F7F5EE -> light nav), candidate hero is dark (dark nav).
  const isDarkNav = isHome ? (isScrolled ? isCorporate : !isCorporate) : false;

  // Background style
  const getNavBackground = () => {
    if (!isScrolled) return 'transparent';
    if (!isHome) return '#f7f5ee';
    return isCorporate
      ? 'linear-gradient(180deg, rgba(20, 20, 26, 0.96) 0%, rgba(10, 10, 14, 0.98) 100%)'
      : '#f7f5ee';
  };

  // Border style (consistent property to prevent React style conflicts)
  const getNavBorder = () => {
    if (!isScrolled) return '1px solid transparent';
    if (!isHome) return '1px solid rgba(0, 0, 0, 0.12)';
    return isCorporate
      ? '1px solid rgba(255, 255, 255, 0.16)'
      : '1px solid rgba(0, 0, 0, 0.12)';
  };

  // Box shadow
  const getNavBoxShadow = () => {
    if (!isScrolled) return 'none';
    if (!isHome) return '0 16px 40px -8px rgba(0,0,0,0.15), 0 0 20px rgba(187,98,222,0.15), inset 0 1px 0 rgba(255,255,255,0.8)';
    return isCorporate
      ? '0 16px 40px -8px rgba(0,0,0,0.85), 0 0 24px rgba(187,98,222,0.25), inset 0 1px 0 rgba(255,255,255,0.2)'
      : '0 16px 40px -8px rgba(0,0,0,0.35), 0 0 20px rgba(187,98,222,0.2), inset 0 1px 0 rgba(255,255,255,0.8)';
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{
        paddingTop: isScrolled ? '14px' : '0px',
        paddingLeft: isScrolled ? '16px' : '0px',
        paddingRight: isScrolled ? '16px' : '0px',
        transition: 'padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <motion.header
        layout
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="pointer-events-auto grid grid-cols-[1fr_auto_1fr] items-center"
        style={{
          background: getNavBackground(),
          borderRadius: isScrolled ? '9999px' : '0px',
          width: isScrolled ? 'min(920px, 95vw)' : '100%',
          maxWidth: isScrolled ? '920px' : '100%',
          paddingLeft: isScrolled ? '24px' : 'clamp(24px, 4vw, 64px)',
          paddingRight: isScrolled ? '12px' : 'clamp(24px, 4vw, 64px)',
          paddingTop: isScrolled ? '8px' : '18px',
          paddingBottom: isScrolled ? '8px' : '18px',
          border: getNavBorder(),
          boxShadow: getNavBoxShadow(),
          backdropFilter: isScrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(24px)' : 'none',
          transition: 'border-radius 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1), padding 0.35s ease, box-shadow 0.35s ease, border 0.35s ease, background 0.35s ease',
        }}
      >
        {/* Left Column: Logo */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <div
              className="relative flex items-center"
              style={{
                width: isScrolled ? '95px' : '120px',
                height: isScrolled ? '30px' : '34px',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s ease',
              }}
            >
              {/* Black Logo */}
              <img
                alt="Antbox"
                src="/new-bg-rem-ant.png"
                className="h-full w-auto object-contain transition-opacity duration-300 absolute inset-0"
                style={{
                  opacity: isDarkNav ? 0 : 1,
                  filter: isScrolled ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' : 'none',
                }}
              />
              {/* White Logo */}
              <img
                alt="Antbox"
                src="/new-white-ant.png"
                className="h-full w-auto object-contain transition-opacity duration-300 absolute inset-0"
                style={{
                  opacity: isDarkNav ? 1 : 0,
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
                }}
              />
            </div>
          </Link>
        </div>

        {/* Center Column: Corporate / Candidate Toggle Button (Only on Homepage) */}
        <div className="flex items-center justify-center">
          {isHome && (
            <div
              className="relative flex items-center"
              style={{
                background: isDarkNav ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                borderRadius: '9999px',
                padding: '3px',
                border: isDarkNav ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: isDarkNav ? 'inset 0 1.5px 3px rgba(0,0,0,0.4)' : 'inset 0 1.5px 3px rgba(0,0,0,0.06)',
                transition: 'background 0.3s ease, border 0.3s ease',
              }}
            >
              {/* Sliding purple indicator */}
              <div
                ref={pillRef}
                style={{
                  position: 'absolute',
                  top: '3px',
                  bottom: '3px',
                  background: 'linear-gradient(135deg, #c069e4 0%, #8e43ac 100%)',
                  borderRadius: '9999px',
                  transition: 'left 0.28s cubic-bezier(0.4, 0, 0.2, 1), width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 10px rgba(192, 105, 228, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
              />
              <button
                ref={corpBtnRef}
                type="button"
                className="relative z-10 font-semibold tracking-wide transition-colors duration-200"
                style={{
                  padding: isScrolled ? '6px 16px' : '7px 20px',
                  borderRadius: '9999px',
                  fontSize: isScrolled ? '0.84rem' : '0.9rem',
                  color: activeTab === 'corporates' ? '#ffffff' : (isDarkNav ? 'rgba(255, 255, 255, 0.75)' : '#181818'),
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-poppins)',
                }}
                onClick={() => setActiveTab('corporates')}
              >
                Corporates
              </button>
              <button
                ref={candBtnRef}
                type="button"
                className="relative z-10 font-semibold tracking-wide transition-colors duration-200"
                style={{
                  padding: isScrolled ? '6px 16px' : '7px 20px',
                  borderRadius: '9999px',
                  fontSize: isScrolled ? '0.84rem' : '0.9rem',
                  color: activeTab === 'candidates' ? '#ffffff' : (isDarkNav ? 'rgba(255, 255, 255, 0.75)' : '#181818'),
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-poppins)',
                }}
                onClick={() => setActiveTab('candidates')}
              >
                Candidates
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Nav Links & CTA Button */}
        <div className="flex items-center justify-end" style={{ gap: isScrolled ? '16px' : '24px' }}>
          <nav className="hidden md:flex items-center" style={{ gap: isScrolled ? '14px' : '20px' }}>
            <Link
              className="font-medium transition-colors duration-200 px-3.5 py-1.5 rounded-full"
              style={{
                fontSize: isScrolled ? '0.9rem' : '0.95rem',
                fontFamily: 'var(--font-poppins)',
                color: isDarkNav ? 'rgba(255, 255, 255, 0.85)' : '#1a1a1a',
              }}
              href="/about"
            >
              About
            </Link>
            <Link
              className="font-medium transition-colors duration-200 px-3.5 py-1.5 rounded-full"
              style={{
                fontSize: isScrolled ? '0.9rem' : '0.95rem',
                fontFamily: 'var(--font-poppins)',
                color: isDarkNav ? 'rgba(255, 255, 255, 0.85)' : '#1a1a1a',
              }}
              href="/resources"
            >
              Resources
            </Link>
          </nav>

          {/* CTA Button */}
          <button
            type="button"
            className="text-white font-semibold rounded-full active:scale-95 whitespace-nowrap inline-flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #bb62de 0%, #8e43ac 100%)',
              padding: isScrolled ? '8px 20px' : '10px 24px',
              fontSize: isScrolled ? '0.88rem' : '0.95rem',
              fontFamily: 'var(--font-poppins)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 16px rgba(187, 98, 222, 0.45), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            Enter Factory →
          </button>
        </div>
      </motion.header>
    </div>
  );
}
