"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const TabContext = createContext({
  activeTab: 'corporates',
  setActiveTab: () => {},
});

export function TabProvider({ children }) {
  const [activeTab, setActiveTabState] = useState('corporates');
  const pathname = usePathname();

  // Load persisted tab from URL query param or localStorage on initial mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlTab = urlParams.get('tab');
        if (urlTab === 'candidates' || urlTab === 'corporates') {
          setActiveTabState(urlTab);
          localStorage.setItem('antbox_active_tab', urlTab);
          return;
        }

        const savedTab = localStorage.getItem('antbox_active_tab');
        if (savedTab === 'candidates' || savedTab === 'corporates') {
          setActiveTabState(savedTab);
        }
      }
    } catch (e) {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const setActiveTab = useCallback((tab) => {
    setActiveTabState(tab);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('antbox_active_tab', tab);
        if (window.history) {
          const url = new URL(window.location.href);
          url.searchParams.set('tab', tab);
          window.history.replaceState(null, '', url.toString());
        }
      }
    } catch (e) {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  useEffect(() => {
    // Only apply candidate dark theme class to body on the homepage
    if (pathname === '/' && activeTab === 'candidates') {
      document.body.classList.add('theme-candidate');
    } else {
      document.body.classList.remove('theme-candidate');
    }
  }, [activeTab, pathname]);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  return useContext(TabContext);
}
