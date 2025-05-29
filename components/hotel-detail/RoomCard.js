'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function RoomCard({ 
  name = "Deluxe Mountain View Room",
  size = "30m²",
  persons = 2,
  description = "Elegant room with panoramic mountain views, featuring a plush king-size bed and luxurious bathroom.",
  price = "€350",
  image = "/images/hotels/hotel-3.jpg",
  image_url,
  images = [],
  onDetailClick,
  onImageClick
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Use provided images array or fallback to single image
  const roomImages = images && images.length > 0 
    ? images 
    : [{ id: null, url: image_url || image }];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev + 1 >= roomImages.length ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev - 1 < 0 ? roomImages.length - 1 : prev - 1
    );
  };

  // Check if description is longer than 4 lines (approximately 200 characters)
  const isDescriptionLong = description && description.length > 200;
  const truncatedDescription = isDescriptionLong 
    ? description.substring(0, 200) + "..."
    : description;

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick({
        images: roomImages,
        currentIndex: currentImageIndex,
        roomName: name
      });
    }
  };

  const handleDetailClick = () => {
    if (onDetailClick) {
      onDetailClick({
        name,
        size,
        persons,
        description,
        price,
        images: roomImages,
        image_url: image_url || image
      });
    }
  };

  return (
    // Optimized size at 94% for better readability
    <div className="transform scale-[0.94] origin-center">
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <div 
          className="relative aspect-[4/3] group cursor-pointer"
          onClick={handleImageClick}
        >
          <Image
            src={roomImages[currentImageIndex].url}
            alt={name}
            fill
            className="object-cover transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* View fullscreen indicator */}
          <div className="absolute top-3 right-3 z-20 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Navigation arrows - only show if multiple images */}
          {roomImages.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
          
          {/* Pagination dots - only show if multiple images */}
          {roomImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20 flex gap-1.5">
              {roomImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'bg-white w-4' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Reduced padding from p-6 to p-5 */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-base font-medium leading-tight">{name}</h3>
            <div className="text-sm text-gray-600 whitespace-nowrap ml-2">
              {size} • {persons} {persons === 1 ? 'Person' : 'Persons'}
            </div>
          </div>
          
          {/* Text truncation with line-clamp-4 */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
              {description}
            </p>
            {isDescriptionLong && (
              <button 
                onClick={handleDetailClick}
                className="text-[#93A27F] hover:text-[#7d8a6b] text-sm font-medium mt-1 hover:underline transition-colors"
              >
                more...
              </button>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-semibold">{price}</span>
              <span className="text-gray-500 text-sm"> / night</span>
            </div>
            
            <button className="bg-[#93A27F] text-white px-4 py-2 hover:bg-[#7d8a6b] transition-colors rounded-lg text-sm font-medium">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}