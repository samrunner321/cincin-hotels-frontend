// @ts-nocheck
'use client';

interface TravelInfo {
  category: 'transportation' | 'climate' | 'best_time' | 'language' | 'currency' | 'customs' | 'tips';
  title: string;
  description: string;
  icon?: string;
}

interface TravelInfoSectionProps {
  travel_info: TravelInfo[];
}

export default function TravelInfoSection({ travel_info }: TravelInfoSectionProps) {
  if (!travel_info || travel_info.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No travel information available for this destination.</p>
      </div>
    );
  }

  // Group travel info by category
  const groupedInfo = travel_info.reduce((acc, info) => {
    if (!acc[info.category]) {
      acc[info.category] = [];
    }
    acc[info.category].push(info);
    return acc;
  }, {} as Record<string, TravelInfo[]>);

  const categoryLabels: Record<string, string> = {
    transportation: 'Transportation',
    climate: 'Climate',
    best_time: 'Best Time to Visit',
    language: 'Language',
    currency: 'Currency',
    customs: 'Customs & Etiquette',
    tips: 'Travel Tips'
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Travel Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groupedInfo).map(([category, items]) => (
          <div key={category} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3">
                  {item.icon && (
                    <div className="flex-shrink-0 w-5 h-5 mt-1 text-primary">
                      {/* Icon would go here */}
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-1">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}