'use client';

import { useState, useEffect } from 'react';
import HotelDetailHero from './HotelDetailHero';
import HotelGallery from './HotelGallery';
import HotelAmenities from './HotelAmenities';
import HotelRooms from './HotelRooms';
import { motion } from 'framer-motion';

// Sample hotel data for demonstration
const SAMPLE_HOTEL = {
  id: '1',
  slug: 'hotel-schgaguler',
  name: 'Hotel Schgaguler',
  location: 'Castelrotto, South Tyrol',
  description: 'A sleek, modernist hotel nestled in the heart of the Dolomites, combining alpine tradition with contemporary design.',
  short_description: 'Alpine modernism in the heart of the Dolomites',
  main_image_url: '/images/hotels/hotel-schgaguler.jpg',
  rating: 4.8,
  ratingCount: 48,
  price_from: 320,
  categories: [
    { id: 'mountains', name: 'Mountains' },
    { id: 'design', name: 'Design' }
  ],
  gallery: [
    '/images/hotels/hotel-schgaguler.jpg',
    '/images/hotels/hotel-1.jpg',
    '/images/hotels/hotel-2.jpg',
    '/images/hotels/hotel-3.jpg',
    '/images/hotels/hotel-4.jpg',
    '/images/hotels/hotel-5.jpg'
  ],
  features: [
    {
      icon: 'wifi',
      title: 'High-Speed Wi-Fi',
      description: 'Complimentary high-speed Wi-Fi throughout the hotel premises'
    },
    {
      icon: 'parking',
      title: 'Parking',
      description: 'Private underground parking with valet service available'
    },
    {
      icon: 'breakfast',
      title: 'Breakfast',
      description: 'Gourmet breakfast buffet featuring local and organic products'
    },
    {
      icon: 'spa',
      title: 'Spa & Wellness',
      description: 'Full-service spa with massage, sauna, and treatment rooms'
    },
    {
      icon: 'pool',
      title: 'Indoor/Outdoor Pool',
      description: 'Heated indoor pool with panoramic mountain views'
    },
    {
      icon: 'fitness',
      title: 'Fitness Center',
      description: 'State-of-the-art fitness center with personal training available'
    }
  ],
  amenities: {
    roomAmenities: [
      'Air conditioning',
      'Free Wi-Fi',
      'Flat-screen TV',
      'Minibar',
      'Safe',
      'Coffee/tea maker',
      'Premium bedding',
      'Designer toiletries',
      'Bathrobes & slippers',
      'Rainfall showerhead',
      'Hair dryer',
      'Desk',
      'Blackout drapes'
    ],
    hotelServices: [
      '24-hour front desk',
      'Concierge service',
      'Room service',
      'Luggage storage',
      'Dry cleaning/laundry',
      'Airport shuttle',
      'Babysitting service',
      'Multilingual staff',
      'Tour/ticket assistance',
      'Daily housekeeping',
      'Laundry facilities',
      'Porter/bellhop',
      'Wedding services'
    ],
    facilities: [
      'Restaurant',
      'Bar/lounge',
      'Spa',
      'Indoor pool',
      'Outdoor pool',
      'Fitness center',
      'Sauna',
      'Steam room',
      'Rooftop terrace',
      'Garden',
      'Conference space',
      'Business center',
      'Meeting rooms'
    ]
  },
  hotelInfo: {
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    petsAllowed: 'Small pets allowed (charges may apply)',
    internetAccess: 'Complimentary high-speed Wi-Fi throughout the property',
    languages: ['English', 'German', 'Italian', 'French'],
    creditCards: ['Visa', 'Mastercard', 'American Express', 'Diners Club']
  },
  rooms: [
    {
      id: 1,
      name: "Deluxe Mountain View Room",
      size: "30m²",
      persons: 2,
      description: "Elegant room with panoramic mountain views, featuring a plush king-size bed and luxurious bathroom.",
      price: "€350",
      image: "/images/hotels/hotel-3.jpg",
      featured: false,
      amenities: [
        "King-size bed", "Mountain view", "Free Wi-Fi", "Air conditioning", 
        "Smart TV", "Minibar", "Safe", "Rain shower"
      ],
      cancellationPolicy: "Free cancellation up to 48 hours before arrival. One night charge for later cancellations."
    },
    {
      id: 2,
      name: "Junior Suite",
      size: "45m²",
      persons: 3,
      description: "Spacious suite with separate sitting area, king-sized bed, and premium amenities.",
      price: "€480",
      image: "/images/hotels/hotel-4.jpg",
      featured: true,
      amenities: [
        "King-size bed", "Separate sitting area", "Free Wi-Fi", "Air conditioning", 
        "Smart TV", "Minibar", "Safe", "Bathtub and shower", "Nespresso machine"
      ],
      cancellationPolicy: "Free cancellation up to 48 hours before arrival. One night charge for later cancellations."
    },
    {
      id: 3,
      name: "Panorama Suite",
      size: "65m²",
      persons: 4,
      description: "Luxury suite with 180° mountain views, featuring a bedroom, separate living room, and private balcony.",
      price: "€620",
      image: "/images/hotels/hotel-5.jpg",
      featured: false,
      amenities: [
        "King-size bed", "180° mountain views", "Private balcony", "Separate living room",
        "Free Wi-Fi", "Air conditioning", "Smart TV", "Minibar", "Safe", 
        "Bathtub and shower", "Nespresso machine", "Dining area"
      ],
      cancellationPolicy: "Free cancellation up to 7 days before arrival. 50% charge for later cancellations."
    }
  ]
};

export default function HotelDetailPage({ hotel = SAMPLE_HOTEL }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle scroll events for navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Make navigation sticky after hero section
      setIsNavSticky(scrollPosition > window.innerHeight * 0.7);
      
      // Update active section based on scroll position
      const sections = [
        { id: 'overview', element: document.getElementById('hotel-content') },
        { id: 'gallery', element: document.getElementById('gallery') },
        { id: 'amenities', element: document.getElementById('amenities') },
        { id: 'rooms', element: document.getElementById('rooms') }
      ];
      
      // Find the current section
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = isNavSticky ? 60 : 0; // Adjust based on your nav height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
    }
  };
  
  // Navigation links
  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'rooms', label: 'Rooms & Suites' }
  ];
  
  // Loading indicator
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin h-12 w-12 border-4 border-gray-200 rounded-full border-t-black"></div>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-white relative">
      {/* Hero section */}
      <HotelDetailHero
        hotelName={hotel.name}
        location={hotel.location}
        description={hotel.short_description || hotel.description}
        backgroundImage={hotel.main_image_url}
        slug={hotel.slug}
        rating={hotel.rating}
        ratingCount={hotel.ratingCount}
        price={`€${hotel.price_from}`}
        categoryTags={hotel.categories?.map(cat => typeof cat === 'string' ? cat : cat.name)}
      />
      
      {/* Navigation bar */}
      <nav 
        className={`bg-white border-b border-gray-200 transition-all duration-300 z-30 ${
          isNavSticky ? 'fixed top-0 left-0 right-0 shadow-sm' : 'relative'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8 overflow-x-auto hide-scrollbar py-4">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id === 'overview' ? 'hotel-content' : link.id)}
                  className={`relative whitespace-nowrap transition-colors ${
                    activeSection === link.id 
                      ? 'text-black font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-black' 
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap">
              Book Now
            </button>
          </div>
        </div>
      </nav>
      
      {/* Content sections */}
      <div id="hotel-content" className="pt-10">
        {/* Overview section */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-light mb-6">About This Hotel</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {hotel.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {hotel.features.slice(0, 3).map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 p-6 rounded-xl"
                  >
                    <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2724.990573938649!2d7.4599542!3d46.9520876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478fbe18c35bb4d5%3A0xe4d9d93be11d0d51!2sBern%2C%20Switzerland!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Gallery section */}
        <HotelGallery images={hotel.gallery} />
        
        {/* Amenities section */}
        <HotelAmenities 
          features={hotel.features}
          amenities={hotel.amenities}
          hotelInfo={hotel.hotelInfo}
        />
        
        {/* Rooms section */}
        <HotelRooms rooms={hotel.rooms} />
      </div>
      
      {/* Floating book now button on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          Book Now
        </button>
      </div>
    </main>
  );
}