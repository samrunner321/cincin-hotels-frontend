'use client';

import Link from 'next/link';

export default function CategoryButton({ icon, name, url, isActive = false, onClick = () => {} }) {
  return (
    <Link 
      href={url}
      className="flex flex-col items-center min-w-[80px] transition-all"
      onClick={onClick}
      aria-label={`Browse ${name} hotels`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="mb-2 w-12 h-12 flex items-center justify-center text-black">
        {icon}
      </div>
      <span className="text-sm text-center">{name}</span>
    </Link>
  );
}