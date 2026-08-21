"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <>
      {/* Outer fixed wrapper — always full viewport width, centers the pill */}
      <div
        className="navbar-themed fixed top-0 left-0 right-0 z-50 flex justify-center"
        style={{ paddingTop: isScrolled ? '14px' : '0px', transition: 'padding-top 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <motion.div
          layout
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="flex items-center overflow-hidden"
          style={{
            borderRadius: isScrolled ? '9999px' : '0px',
            background: isScrolled ? '#0a0a0a' : 'transparent',
            backdropFilter: isScrolled ? 'blur(24px)' : 'none',
            paddingLeft: isScrolled ? '40px' : 'clamp(20px, 5vw, 60px)',
            paddingRight: isScrolled ? '32px' : 'clamp(20px, 5vw, 60px)',
            paddingTop: isScrolled ? '16px' : '18px',
            paddingBottom: isScrolled ? '16px' : '18px',
            width: isScrolled ? 'min(800px, 90vw)' : '100%',
            maxWidth: isScrolled ? 'none' : '1536px',
            gap: isScrolled ? '36px' : undefined,
            justifyContent: 'space-between',
            transition: 'border-radius 0.25s cubic-bezier(0.4,0,0.2,1), background 0.25s ease, box-shadow 0.25s ease, padding 0.25s ease, border 0.25s ease, width 0.25s ease',
          }}
        >
          {/* Logo — fades between icon and full logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <div className="relative" style={{ width: isScrolled ? '36px' : '110px', height: isScrolled ? '36px' : '32px', transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1), height 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
              {/* Favicon — shown when scrolled */}
              <img
                alt="Antbox"
                src="/faviconlogo.png"
                className="absolute inset-0 h-full w-auto object-contain transition-opacity duration-300"
                style={{ opacity: isScrolled ? 1 : 0, mixBlendMode: 'screen' }}
              />
              {/* Full dark logo — Corporate theme */}
              <img
                alt="Antbox"
                src="/antboxlogo.png"
                className="logo-corporate absolute inset-0 h-full w-auto object-contain transition-opacity duration-300"
                style={{ opacity: isScrolled ? 0 : 1 }}
              />
              {/* Full white logo — Candidate theme */}
              <img
                alt="Antbox"
                src="/new-white-ant.png"
                className="logo-candidate absolute inset-0 h-full w-auto object-contain transition-opacity duration-300"
                style={{ opacity: isScrolled ? 0 : 1 }}
              />
            </div>
          </Link>

          {/* Nav group — Links and CTA Button */}
          <div className="hidden md:flex items-center" style={{ gap: isScrolled ? '36px' : '28px', transition: 'gap 0.25s ease' }}>
            <nav className="flex items-center" style={{ gap: isScrolled ? '32px' : '28px', transition: 'gap 0.25s ease' }}>
              <Link
                className="navbar-link font-label-sm text-label-sm transition-colors duration-200 whitespace-nowrap"
                style={{ color: isScrolled ? 'rgba(255,255,255,0.85)' : undefined, fontSize: '1.05rem', fontWeight: 500 }}
                href="/about"
              >About</Link>
              <Link
                className="navbar-link font-label-sm text-label-sm transition-colors duration-200 whitespace-nowrap"
                style={{ color: isScrolled ? 'rgba(255,255,255,0.85)' : undefined, fontSize: '1.05rem', fontWeight: 500 }}
                href="/resources"
              >Resources</Link>

            </nav>
            <button className="bg-[#8e43ac] text-white hover:bg-[#702f8a] font-semibold rounded-full transition-all active:scale-95 duration-150 ease-in-out whitespace-nowrap flex-shrink-0 hidden md:inline-flex shadow-lg shadow-purple-500/30 items-center gap-2" style={{ fontSize: '1.05rem', letterSpacing: '0.01em', padding: isScrolled ? '0.8rem 2rem' : '0.875rem 2rem' }}>
              Enter Factory →
            </button>
          </div>

          {/* Mobile hamburger — only on small screens */}
          <button
            onClick={toggleDrawer}
            className="navbar-icon-btn transition-colors duration-200 active:scale-95 md:hidden"
            style={{ color: isScrolled ? '#fff' : undefined }}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>menu</span>
          </button>
        </motion.div>
      </div>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleDrawer}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-80 rounded-r-xl bg-[#1a1a1a] shadow-2xl border-r border-white/10 z-50 transition-transform duration-300 ease-in-out flex flex-col p-md gap-sm ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-md">
          <h2 className="text-white font-black text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>Antbox</h2>
          <button className="text-white/60 hover:text-white p-xs transition-colors" onClick={toggleDrawer}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex flex-col gap-xs">
          <Link className="flex items-center gap-sm px-sm py-xs text-white/70 hover:text-white hover:bg-white/10 rounded-full font-label-sm text-label-sm transition-all" href="/about">
            <span className="material-symbols-outlined">info</span>About
          </Link>
          <Link className="flex items-center gap-sm px-sm py-xs text-white/70 hover:text-white hover:bg-white/10 rounded-full font-label-sm text-label-sm transition-all" href="/resources">
            <span className="material-symbols-outlined">library_books</span>Resources
          </Link>

          <div className="my-sm border-t border-white/10 w-full" />
          <button className="flex items-center gap-sm px-sm py-xs bg-[#8e43ac] text-white rounded-full font-label-sm text-label-sm transition-all hover:bg-[#702f8a] w-full">
            <span className="material-symbols-outlined">factory</span>Enter Factory
          </button>
        </nav>
      </aside>

      {/* Bottom Navigation — mobile */}
      <nav className="fixed bottom-0 w-full z-50 backdrop-blur-lg pb-safe border-t md:hidden navbar-themed-bottom">
        <div className="flex justify-around items-center h-16 w-full">
          <Link className="navbar-bottom-active flex flex-col items-center justify-center transition-colors scale-110 duration-200" href="/">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
            <span className="text-[10px]">Home</span>
          </Link>
          <Link className="navbar-bottom-link flex flex-col items-center justify-center transition-colors duration-200" href="/about">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>help_center</span>
            <span className="text-[10px]">About</span>
          </Link>
          <Link className="navbar-bottom-link flex flex-col items-center justify-center transition-colors duration-200" href="/resources">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>auto_stories</span>
            <span className="text-[10px]">Resources</span>
          </Link>

        </div>
      </nav>
    </>
  );
}
