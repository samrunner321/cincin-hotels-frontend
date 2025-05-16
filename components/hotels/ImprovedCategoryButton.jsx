'use client';

import Link from 'next/link';

export default function ImprovedCategoryButton({ 
  icon, 
  name, 
  url, 
  isActive = false,
  onClick = () => {}
}) {
  return (
    <Link 
      href={url}
      className={`
        flex flex-col items-center justify-center min-w-[100px] p-3 rounded-lg
        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500
        ${isActive 
          ? 'bg-blue-50 text-blue-700 shadow-sm' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
      `}
      onClick={onClick}
      aria-label={`Browse ${name} hotels`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div 
        className={`w-12 h-12 mb-2 transition-transform duration-300 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium whitespace-nowrap capitalize">
        {name}
      </span>
    </Link>
  );
}