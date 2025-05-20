// @ts-nocheck
'use client';

import { useState } from 'react';
import DirectusImage from '../../../components/common/DirectusImage';

interface Activity {
  title: string;
  description?: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  image?: string;
}

interface ActivitiesSectionProps {
  activities: Activity[];
}

export default function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  const [activeSeason, setActiveSeason] = useState<string>('all');
  
  if (!activities || activities.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No activities information available for this destination.</p>
      </div>
    );
  }

  const filteredActivities = activeSeason === 'all'
    ? activities
    : activities.filter(activity => 
        activity.season === activeSeason || activity.season === 'all'
      );

  const seasons = ['all', 'spring', 'summer', 'autumn', 'winter'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Activities & Experiences</h2>
        
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {seasons.map(season => (
            <button
              key={season}
              onClick={() => setActiveSeason(season)}
              className={`px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap ${
                activeSeason === season
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {season.charAt(0).toUpperCase() + season.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="py-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No activities available for {activeSeason}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredActivities.map((activity, index) => (
            <div key={index} className="flex bg-white rounded-lg shadow-sm overflow-hidden">
              {activity.image ? (
                <div className="w-1/3 relative">
                  <DirectusImage
                    fileId={activity.image}
                    alt={activity.title}
                    className="object-cover"
                    fill
                  />
                </div>
              ) : (
                <div className="w-1/3 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              
              <div className="w-2/3 p-5">
                <div className="inline-block px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600 mb-2">
                  {activity.season === 'all' ? 'Year-round' : activity.season.charAt(0).toUpperCase() + activity.season.slice(1)}
                </div>
                <h3 className="text-lg font-semibold mb-2">{activity.title}</h3>
                {activity.description && (
                  <p className="text-gray-600 text-sm">{activity.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}