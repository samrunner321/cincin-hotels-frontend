'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContentTabs() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'rooms', label: 'ROOMS' },
    { id: 'facilities', label: 'FACILITIES' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'reviews', label: 'REVIEWS' },
    { id: 'info', label: 'INFO' }
  ];
  
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Scroll to corresponding section
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="sticky top-0 z-40 bg-white shadow-md py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <nav className="overflow-x-auto hide-scrollbar flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-4 relative whitespace-nowrap text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-black text-black' 
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          
          <button className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hidden md:block hover:bg-blue-700 transition">
            BOOK NOW
          </button>
        </div>
      </div>
    </div>
  );
}