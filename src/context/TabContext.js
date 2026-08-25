"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const TabContext = createContext({
  activeTab: 'corporates',
  setActiveTab: () => {},
});

export function TabProvider({ children }) {
  const [activeTab, setActiveTab] = useState('corporates');

  useEffect(() => {
    if (activeTab === 'candidates') {
      document.body.classList.add('theme-candidate');
    } else {
      document.body.classList.remove('theme-candidate');
    }
  }, [activeTab]);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  return useContext(TabContext);
}
