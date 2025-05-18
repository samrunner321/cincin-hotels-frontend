'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ActivitiesSection({ destination }) {
  const { activities } = destination;
  const [activeTab, setActiveTab] = useState('winter');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const seasons = ['winter', 'spring', 'summer', 'fall'];
  
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Explore Activities</h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            {destination.name} offers a diverse range of activities throughout the year.
            From winter sports to summer adventures, there's something for everyone.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
            {seasons.map((season) => (
              <button
                key={season}
                onClick={() => setActiveTab(season)}
                className={`px-4 py-2 rounded-full capitalize transition-all ${
                  activeTab === season 
                    ? 'bg-[#93A27F] text-white' 
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
              >
                {season}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <ActivitiesTimeline 
              activities={activities[activeTab]} 
              onSelectActivity={setSelectedActivity}
              selectedActivity={selectedActivity}
              isInView={isInView}
            />
          </motion.div>
        </AnimatePresence>

        {selectedActivity && (
          <ActivityDetail 
            activity={selectedActivity} 
            onClose={() => setSelectedActivity(null)} 
          />
        )}
      </div>
    </section>
  );
}

function ActivitiesTimeline({ activities, onSelectActivity, selectedActivity, isInView }) {
  return (
    <div className="relative">
      {/* Timeline center line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>
      
      <div className="relative z-10">
        {activities.map((activity, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            className={`flex items-start mb-12 ${
              index % 2 === 0 ? 'flex-row-reverse text-right' : 'flex-row text-left'
            }`}
          >
            <div className="w-1/2 px-4 md:px-8">
              <div 
                className={`bg-white rounded-xl p-6 shadow-md transform transition-all duration-300 cursor-pointer
                  ${selectedActivity === activity ? 'shadow-xl scale-105' : 'hover:shadow-lg hover:scale-102'}`}
                onClick={() => onSelectActivity(activity)}
              >
                <div className="aspect-[16/9] relative mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{activity.title}</h3>
                <p className="text-sm text-[#93A27F] mb-3">
                  {activity.duration} • {activity.difficulty}
                </p>
                <p className="text-gray-700 line-clamp-3">{activity.description}</p>
              </div>
            </div>
            
            <div className="relative flex items-center justify-center w-12">
              <div className="h-12 w-12 bg-[#93A27F] rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activity.icon || "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"} />
                </svg>
              </div>
            </div>
            
            <div className="w-1/2"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ActivityDetail({ activity, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative aspect-[16/9]">
          <Image
            src={activity.image}
            alt={activity.title}
            fill
            className="object-cover rounded-t-xl"
          />
          <button 
            className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2">{activity.title}</h2>
          <div className="flex items-center mb-6">
            <div className="text-sm bg-[#93A27F] text-white px-2 py-0.5 rounded-full mr-2">
              {activity.duration}
            </div>
            <div className="text-sm text-gray-600">
              {activity.difficulty}
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">{activity.fullDescription || activity.description}</p>
          
          {activity.highlights && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Highlights</h3>
              <ul className="space-y-2">
                {activity.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#93A27F] mr-2">•</span>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {activity.practical && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Practical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(activity.practical).map(([key, value], index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-sm text-gray-500 capitalize">{key}</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            <button 
              className="bg-[#93A27F] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}