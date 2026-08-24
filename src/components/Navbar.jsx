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
        style={{ paddingTop: '12px', transition: 'padding-top 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      >
        <motion.div
          layout
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="liquid-glass-nav flex items-center overflow-hidden"
          style={{
            borderRadius: '9999px',
            paddingLeft: isScrolled ? '20px' : '28px',
            paddingRight: isScrolled ? '8px' : '10px',
            paddingTop: '6px',
            paddingBottom: '6px',
            width: isScrolled ? 'min(560px, 86vw)' : 'min(680px, 90vw)',
            maxWidth: '740px',
            gap: isScrolled ? '20px' : '28px',
            justifyContent: 'space-between',
            transition: 'border-radius 0.3s cubic-bezier(0.4,0,0.2,1), padding 0.3s ease, width 0.3s cubic-bezier(0.4,0,0.2,1), gap 0.3s ease',
          }}
        >
          {/* Logo — fades between icon and full logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <div className="relative flex items-center justify-center" style={{ width: isScrolled ? '28px' : '88px', height: '28px', transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
              {/* Favicon — shown when scrolled */}
              <img
                alt="Antbox"
                src="/faviconlogo.png"
                className="absolute inset-0 h-full w-auto object-contain transition-opacity duration-300"
                style={{ opacity: isScrolled ? 1 : 0, mixBlendMode: 'screen' }}
              />
              {/* Full white logo */}
              <img
                alt="Antbox"
                src="/new-white-ant.png"
                className="absolute inset-0 h-full w-auto object-contain transition-opacity duration-300"
                style={{ opacity: isScrolled ? 0 : 1 }}
              />
            </div>
          </Link>

          {/* Nav group — Links and CTA Button */}
          <div className="hidden md:flex items-center" style={{ gap: isScrolled ? '20px' : '24px', transition: 'gap 0.25s ease' }}>
            <nav className="flex items-center" style={{ gap: '8px' }}>
              <Link
                className="liquid-glass-link navbar-link whitespace-nowrap"
                style={{ fontSize: '0.92rem', fontWeight: 500, padding: '0.35rem 0.8rem' }}
                href="/about"
              >About</Link>
              <Link
                className="liquid-glass-link navbar-link whitespace-nowrap"
                style={{ fontSize: '0.92rem', fontWeight: 500, padding: '0.35rem 0.8rem' }}
                href="/resources"
              >Resources</Link>
            </nav>

            <button className="liquid-glass-btn text-white font-semibold rounded-full active:scale-95 whitespace-nowrap flex-shrink-0 hidden md:inline-flex items-center gap-1.5" style={{ fontSize: '0.9rem', letterSpacing: '0.01em', padding: '0.52rem 1.3rem' }}>
              Enter Factory →
            </button>
          </div>

          {/* Mobile hamburger — only on small screens */}
          <button
            onClick={toggleDrawer}
            className="navbar-icon-btn transition-colors duration-200 active:scale-95 md:hidden"
            style={{ color: '#fff' }}
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
