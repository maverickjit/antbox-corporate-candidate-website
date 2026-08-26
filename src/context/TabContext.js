"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const TabContext = createContext({
  activeTab: 'corporates',
  setActiveTab: () => {},
});

export function TabProvider({ children }) {
  const [activeTab, setActiveTab] = useState('corporates');
  const pathname = usePathname();

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
