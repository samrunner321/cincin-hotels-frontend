'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ViewSwitcher({ onChange }) {
  const [activeView, setActiveView] = useState('grid');
  
  const handleViewChange = (view) => {
    setActiveView(view);
    if (onChange) {
      onChange(view);
    }
  };
  
  return (
    <div className="flex items-center justify-end mb-6">
      <div className="bg-gray-100 p-1 rounded-lg flex">
        <ViewButton 
          icon="grid" 
          isActive={activeView === 'grid'} 
          onClick={() => handleViewChange('grid')} 
          label="Grid View"
        />
        <ViewButton 
          icon="list" 
          isActive={activeView === 'list'} 
          onClick={() => handleViewChange('list')} 
          label="List View"
        />
        <ViewButton 
          icon="map" 
          isActive={activeView === 'map'} 
          onClick={() => handleViewChange('map')} 
          label="Map View"
        />
      </div>
    </div>
  );
}

function ViewButton({ icon, isActive, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center p-2 rounded-md transition-colors ${
        isActive ? 'text-brand-olive-600' : 'text-gray-500 hover:text-gray-700'
      }`}
      aria-label={label}
    >
      {isActive && (
        <motion.div
          layoutId="activeViewBackground"
          className="absolute inset-0 bg-white rounded-md shadow-sm"
          initial={false}
          transition={{ type: 'spring', duration: 0.5 }}
        />
      )}
      <span className="relative z-10">
        {icon === 'grid' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        )}
        {icon === 'list' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        )}
        {icon === 'map' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        )}
      </span>
    </button>
  );
}