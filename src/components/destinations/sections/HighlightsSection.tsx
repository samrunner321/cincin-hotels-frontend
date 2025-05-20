// @ts-nocheck
'use client';

import DirectusImage from '../../../../components/common/DirectusImage';

interface Highlight {
  title: string;
  description?: string;
  icon?: string;
  image?: string;
}

interface HighlightsSectionProps {
  highlights: Highlight[];
}

export default function HighlightsSection({ highlights }: HighlightsSectionProps) {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <div className="my-10">
      <h2 className="text-2xl font-semibold mb-6">Destination Highlights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((highlight, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {highlight.image && (
              <div className="aspect-[3/2] relative">
                <DirectusImage 
                  fileId={highlight.image} 
                  alt={highlight.title}
                  className="object-cover"
                  fill
                />
              </div>
            )}
            
            <div className="p-5">
              <div className="flex items-start gap-3">
                {highlight.icon && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="text-lg">{/* Icon would go here */}</span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                  {highlight.description && (
                    <p className="text-gray-600 text-sm">{highlight.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}