// @ts-nocheck
'use client';

interface WeatherData {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  temp_low: number;
  temp_high: number;
  precipitation?: string;
  description?: string;
}

interface WeatherSectionProps {
  weather: WeatherData[];
}

export default function WeatherSection({ weather }: WeatherSectionProps) {
  if (!weather || weather.length === 0) {
    return null;
  }

  // Sort weather by seasons in chronological order
  const seasonOrder = { spring: 0, summer: 1, autumn: 2, winter: 3 };
  const sortedWeather = [...weather].sort((a, b) => 
    seasonOrder[a.season] - seasonOrder[b.season]
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Seasonal Weather</h2>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
          {sortedWeather.map((item) => {
            // Determine background color based on temperature
            const tempAvg = (item.temp_high + item.temp_low) / 2;
            let bgClass = 'bg-blue-50';
            let textClass = 'text-blue-600';
            
            if (tempAvg > 25) {
              bgClass = 'bg-orange-50';
              textClass = 'text-orange-600';
            } else if (tempAvg > 15) {
              bgClass = 'bg-yellow-50';
              textClass = 'text-yellow-600';
            } else if (tempAvg > 5) {
              bgClass = 'bg-green-50';
              textClass = 'text-green-600';
            }
            
            return (
              <div key={item.season} className="p-6 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 capitalize">{item.season}</h3>
                
                <div className={`flex items-center justify-center ${bgClass} rounded-lg p-4 mb-3`}>
                  <span className={`text-3xl font-bold ${textClass}`}>
                    {item.temp_low}° - {item.temp_high}°C
                  </span>
                </div>
                
                {item.precipitation && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <span className="font-medium">Precipitation:</span> 
                    <span>{item.precipitation}</span>
                  </div>
                )}
                
                {item.description && (
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}