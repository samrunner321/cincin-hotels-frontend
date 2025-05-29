'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import RoomCard from './RoomCard';

export default function RoomList({ 
  rooms = [
    {
      id: 1,
      name: "Deluxe Mountain View Room",
      size: "30m²",
      persons: 2,
      description: "Elegant room with panoramic mountain views, featuring a plush king-size bed and luxurious bathroom.",
      price: "€350",
      image: "/images/hotels/hotel-3.jpg"
    },
    {
      id: 2,
      name: "Junior Suite",
      size: "45m²",
      persons: 3,
      description: "Spacious suite with separate sitting area, king-sized bed, and premium amenities.",
      price: "€480",
      image: "/images/hotels/hotel-4.jpg"
    },
    {
      id: 3,
      name: "Panorama Suite",
      size: "65m²",
      persons: 4,
      description: "Luxury suite with 180° mountain views, featuring a bedroom, separate living room, and private balcony.",
      price: "€620",
      image: "/images/hotels/hotel-5.jpg"
    }
  ]
}) {
  const [showAllRooms, setShowAllRooms] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxCurrentIndex, setLightboxCurrentIndex] = useState(0);
  
  // Show only first 3 rooms initially, or all if toggled
  const displayedRooms = showAllRooms ? rooms : rooms.slice(0, 3);
  
  // Only show toggle button if there are more than 3 rooms
  const showToggleButton = rooms.length > 3;

  const handleToggle = () => {
    setShowAllRooms(!showAllRooms);
  };

  // Modal handlers
  const openDetailModal = (room) => {
    setSelectedRoom(room);
    setDetailModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedRoom(null);
    document.body.style.overflow = 'auto';
  };

  // Lightbox handlers
  const openLightbox = (data) => {
    setLightboxImages(data.images);
    setLightboxCurrentIndex(data.currentIndex);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImages([]);
    setLightboxCurrentIndex(0);
    document.body.style.overflow = 'auto';
  };

  const nextLightboxImage = () => {
    setLightboxCurrentIndex((prev) => 
      prev + 1 >= lightboxImages.length ? 0 : prev + 1
    );
  };

  const prevLightboxImage = () => {
    setLightboxCurrentIndex((prev) => 
      prev - 1 < 0 ? lightboxImages.length - 1 : prev - 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === 'ArrowRight') {
          nextLightboxImage();
        } else if (e.key === 'ArrowLeft') {
          prevLightboxImage();
        } else if (e.key === 'Escape') {
          closeLightbox();
        }
      }
      if (detailModalOpen && e.key === 'Escape') {
        closeDetailModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, detailModalOpen]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <section id="rooms" className="py-16 bg-gray-50">
      {/* Optimized container width */}
      <div className="container mx-auto px-4 max-w-[1500px]">
        <div className="mb-12">
          <h2 className="text-3xl font-light text-center mb-2">Rooms & Suites</h2>
          <div className="w-16 h-0.5 bg-[#93A27F] mx-auto mb-8"></div>
          
          {/* Toggle button - only show if needed */}
          {showToggleButton && (
            <div className="flex justify-center mb-8">
              <button 
                onClick={handleToggle}
                className="text-[#93A27F] hover:text-[#7d8a6b] transition-colors flex items-center group"
              >
                <span>{showAllRooms ? 'View less' : 'View all rooms'}</span>
                <svg 
                  className={`ml-2 transition-transform ${showAllRooms ? 'rotate-180' : ''}`} 
                  width="25" 
                  height="9" 
                  viewBox="0 0 25 9" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {/* Rooms Grid with optimized spacing */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 transition-all duration-500 ease-in-out"
          style={{
            gridTemplateRows: showAllRooms ? 'repeat(auto-fit, minmax(0, 1fr))' : undefined
          }}
        >
          {displayedRooms.map((room, index) => (
            <div
              key={room.id}
              className={`transition-all duration-500 ease-in-out ${
                !showAllRooms && index >= 3 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{
                transitionDelay: showAllRooms ? `${index * 50}ms` : '0ms'
              }}
            >
              <RoomCard 
                name={room.name}
                size={room.size}
                persons={room.persons}
                description={room.description}
                price={room.price}
                image={room.image}
                image_url={room.image_url}
                images={room.images}
                onDetailClick={openDetailModal}
                onImageClick={openLightbox}
              />
            </div>
          ))}
        </div>
        
        {/* Room count indicator */}
        {rooms.length > 0 && (
          <div className="text-center mt-8 text-gray-600 text-sm">
            Showing {displayedRooms.length} of {rooms.length} room{rooms.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative p-6">
              {/* Close button */}
              <button 
                onClick={closeDetailModal}
                className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Room images gallery */}
              <div className="mb-6">
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                  <Image
                    src={selectedRoom.images?.[0]?.url || selectedRoom.image_url}
                    alt={selectedRoom.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                  <button 
                    onClick={() => openLightbox({
                      images: selectedRoom.images || [{ url: selectedRoom.image_url }],
                      currentIndex: 0
                    })}
                    className="absolute top-4 left-4 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 text-white transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Thumbnail gallery */}
                {selectedRoom.images && selectedRoom.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {selectedRoom.images.slice(0, 4).map((img, index) => (
                      <button
                        key={index}
                        onClick={() => openLightbox({
                          images: selectedRoom.images,
                          currentIndex: index
                        })}
                        className="relative aspect-[4/3] rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                      >
                        <Image
                          src={img.url}
                          alt={`${selectedRoom.name} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 200px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Room details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-semibold mb-2">{selectedRoom.name}</h2>
                  <p className="text-lg text-gray-600 mb-4">
                    {selectedRoom.size} • {selectedRoom.persons} {selectedRoom.persons === 1 ? 'Person' : 'Persons'}
                  </p>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedRoom.description}</p>
                  </div>

                  {/* Amenities placeholder */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Free WiFi
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Air Conditioning
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Private Bathroom
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Balcony
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking section */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold">{selectedRoom.price}</span>
                      <span className="text-gray-500"> / night</span>
                    </div>
                    
                    <button className="w-full bg-[#93A27F] text-white py-3 px-6 rounded-xl hover:bg-[#7d8a6b] transition-colors font-medium mb-3">
                      Check Availability
                    </button>
                    
                    <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                      Contact Hotel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-50"
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            onClick={prevLightboxImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full z-50"
            aria-label="Previous image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto px-16">
            <Image
              src={lightboxImages[lightboxCurrentIndex]?.url}
              alt="Room image"
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {lightboxCurrentIndex + 1} / {lightboxImages.length}
            </div>
          </div>
          
          <button 
            onClick={nextLightboxImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full z-50"
            aria-label="Next image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dots indicator */}
          {lightboxImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              {lightboxImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === lightboxCurrentIndex 
                      ? 'bg-white w-6' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}