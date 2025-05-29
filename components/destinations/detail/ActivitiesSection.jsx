'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ActivitiesSection({ destination, activitiesData }) {
  const [selectedTime, setSelectedTime] = useState('morning');
  
  // Activities data for different destinations
  const getActivitiesForDestination = () => {
    // For Berchtesgaden in German
    if (destination === 'Berchtesgaden' && activitiesData?.language_code === 'de') {
      return {
        morning: [
          {
            id: 1,
            time: '6:00 Uhr',
            name: 'Sonnenaufgang am Königssee',
            description: 'Erleben Sie den magischen Sonnenaufgang über dem kristallklaren Königssee.',
            duration: '2 Stunden',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            type: 'wellness'
          },
          {
            id: 2,
            time: '9:00 Uhr',
            name: 'Salzbergwerk Tour',
            description: 'Entdecken Sie die faszinierende Welt des historischen Salzbergwerks.',
            duration: '3 Stunden',
            image: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=800&q=80',
            type: 'culture'
          },
          {
            id: 3,
            time: '10:00 Uhr',
            name: 'Wanderung zum Watzmannhaus',
            description: 'Genießen Sie eine moderate Bergwanderung mit atemberaubenden Ausblicken.',
            duration: '4 Stunden',
            image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
            type: 'adventure'
          }
        ],
        afternoon: [
          {
            id: 4,
            time: '14:00 Uhr',
            name: 'Kehlsteinhaus Besuch',
            description: 'Besuchen Sie das historische Kehlsteinhaus mit spektakulärem Panoramablick.',
            duration: '3 Stunden',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            type: 'culture'
          },
          {
            id: 5,
            time: '15:00 Uhr',
            name: 'Berchtesgadener Bierverkostung',
            description: 'Probieren Sie lokale Bierspezialitäten in einer traditionellen Brauerei.',
            duration: '2 Stunden',
            image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80',
            type: 'culinary'
          },
          {
            id: 6,
            time: '16:00 Uhr',
            name: 'Alpentherme Wellness',
            description: 'Entspannen Sie in der Watzmann Therme mit Blick auf die Berge.',
            duration: 'Flexibel',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
            type: 'leisure'
          }
        ],
        evening: [
          {
            id: 7,
            time: '18:00 Uhr',
            name: 'Traditioneller Heimatabend',
            description: 'Erleben Sie bayerische Folklore mit Musik, Tanz und regionalen Speisen.',
            duration: '3 Stunden',
            image: 'https://images.unsplash.com/photo-1508253730651-e5ace80a7025?w=800&q=80',
            type: 'culture'
          },
          {
            id: 8,
            time: '19:30 Uhr',
            name: 'Fackelwanderung',
            description: 'Romantische Winterwanderung mit Fackeln durch verschneite Wälder.',
            duration: '2 Stunden',
            image: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80',
            type: 'romantic'
          },
          {
            id: 9,
            time: '20:00 Uhr',
            name: 'Sternbeobachtung in den Alpen',
            description: 'Entdecken Sie den klaren Alpenhimmel bei einer geführten Sternbeobachtung.',
            duration: '2 Stunden',
            image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
            type: 'nightlife'
          }
        ]
      };
    }
    
    // Default activities (original mock data)
    return {
    morning: [
      {
        id: 1,
        time: '6:00 AM',
        name: 'Sunrise Yoga Session',
        description: 'Start your day with beachfront yoga as the sun rises over the Aegean.',
        duration: '1 hour',
        image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
        type: 'wellness'
      },
      {
        id: 2,
        time: '9:00 AM',
        name: 'Island Hopping Tour',
        description: 'Explore nearby islands by boat with swimming stops at secluded beaches.',
        duration: '4 hours',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        type: 'adventure'
      },
      {
        id: 3,
        time: '10:00 AM',
        name: 'Old Town Walking Tour',
        description: 'Discover the history and hidden gems of the charming old town.',
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=800&q=80',
        type: 'culture'
      }
    ],
    afternoon: [
      {
        id: 4,
        time: '12:00 PM',
        name: 'Wine Tasting Experience',
        description: 'Sample local wines at a traditional vineyard with stunning views.',
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80',
        type: 'culinary'
      },
      {
        id: 5,
        time: '2:00 PM',
        name: 'Beach Club Relaxation',
        description: 'Unwind at exclusive beach clubs with premium amenities.',
        duration: 'Flexible',
        image: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80',
        type: 'leisure'
      },
      {
        id: 6,
        time: '4:00 PM',
        name: 'Cooking Class',
        description: 'Learn to prepare traditional Greek dishes with a local chef.',
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        type: 'culinary'
      }
    ],
    evening: [
      {
        id: 7,
        time: '6:30 PM',
        name: 'Sunset Sailing',
        description: 'Sail into the sunset with champagne and light appetizers.',
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b1?w=800&q=80',
        type: 'romantic'
      },
      {
        id: 8,
        time: '8:00 PM',
        name: 'Traditional Greek Night',
        description: 'Experience authentic music, dance, and cuisine at a local taverna.',
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1508253730651-e5ace80a7025?w=800&q=80',
        type: 'culture'
      },
      {
        id: 9,
        time: '10:00 PM',
        name: 'Nightlife Experience',
        description: 'Discover the vibrant nightlife scene with VIP access to top venues.',
        duration: 'Late night',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
        type: 'nightlife'
      }
    ]
    };
  };
  
  // Use the function to get activities
  const activities = getActivitiesForDestination();

  const timeSlots = [
    { id: 'morning', name: activitiesData?.activities_morning || 'Morning', icon: '🌅' },
    { id: 'afternoon', name: activitiesData?.activities_afternoon || 'Afternoon', icon: '☀️' },
    { id: 'evening', name: activitiesData?.activities_evening || 'Evening', icon: '🌆' }
  ];

  const activityTypes = {
    wellness: { color: 'bg-blue-100 text-blue-700', icon: '🧘' },
    adventure: { color: 'bg-green-100 text-green-700', icon: '⛵' },
    culture: { color: 'bg-purple-100 text-purple-700', icon: '🏛️' },
    culinary: { color: 'bg-orange-100 text-orange-700', icon: '🍷' },
    leisure: { color: 'bg-pink-100 text-pink-700', icon: '🏖️' },
    romantic: { color: 'bg-red-100 text-red-700', icon: '💕' },
    nightlife: { color: 'bg-indigo-100 text-indigo-700', icon: '🎉' }
  };

  return (
    <section id="activities" className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            {activitiesData?.activities_things_to || 'Things to'} <span className="font-bold">{activitiesData?.activities_do || 'Do'}</span>
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            {activitiesData?.activities_subtitle ? (
              <span dangerouslySetInnerHTML={{ __html: activitiesData.activities_subtitle.replace('{destination}', destination) }} />
            ) : (
              `Make the most of your stay in ${destination} with our curated selection of activities throughout the day.`
            )}
          </p>

          {/* Time Selector */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {timeSlots.map(slot => (
              <button
                key={slot.id}
                onClick={() => setSelectedTime(slot.id)}
                className={`px-8 py-4 rounded-2xl transition-all flex items-center gap-3 ${
                  selectedTime === slot.id
                    ? 'bg-black text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                <span className="text-2xl">{slot.icon}</span>
                <span className="font-medium">{slot.name}</span>
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform md:-translate-x-1/2"></div>

            {/* Activities */}
            <div className="space-y-12">
              {activities[selectedTime].map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-brand-olive-400 rounded-full transform md:-translate-x-1/2 z-10"></div>

                  {/* Content */}
                  <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <motion.div
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                      whileHover={{ y: -5 }}
                    >
                      <div className="relative h-48">
                        <Image
                          src={activity.image}
                          alt={activity.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                          {activity.time}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className={`flex items-center gap-4 mb-3 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                          <h3 className="text-xl font-semibold">{activity.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${activityTypes[activity.type].color}`}>
                            {activityTypes[activity.type].icon} {activity.type}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">
                          {activity.description}
                        </p>
                        
                        <div className={`flex items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          <span className="text-sm text-gray-500">
                            {activitiesData?.activities_duration || 'Duration'}: {activity.duration}
                          </span>
                          <button className="text-brand-olive-400 hover:text-brand-olive-600 transition-colors flex items-center gap-1">
                            {activitiesData?.activities_book_now || 'Book Now'}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}