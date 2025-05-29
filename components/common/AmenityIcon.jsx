'use client';

export default function AmenityIcon({ amenity, size = 24, className = '' }) {
  if (!amenity) return null;

  // If SVG icon is provided, use it
  if (amenity.svg_icon) {
    return (
      <div 
        className={`inline-flex items-center justify-center ${className}`}
        dangerouslySetInnerHTML={{ 
          __html: amenity.svg_icon.replace(/width="[^"]*"/, `width="${size}"`).replace(/height="[^"]*"/, `height="${size}"`) 
        }}
        aria-label={amenity.name}
      />
    );
  }

  // Fallback to icon font or default icon
  if (amenity.icon) {
    return (
      <i 
        className={`${amenity.icon} ${className}`} 
        style={{ fontSize: size }}
        aria-label={amenity.name}
      />
    );
  }

  // Default icon if none provided
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      aria-label={amenity.name}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );
}