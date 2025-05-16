'use client';

import { useState } from 'react';

export default function TabbedAttractionsSection({
  title = "CinCin's Picks: Best Food & Drink in Zermatt",
  attractions = [
    {
      id: 1,
      name: "Chez Vrony",
      description: "A traditional alpine restaurant with a modern twist, offering stunning Matterhorn views."
    },
    {
      id: 2,
      name: "Findlerhof",
      description: "Known for its local specialties and cozy atmosphere."
    },
    {
      id: 3,
      name: "CERVO Mountain Resort Bar",
      description: "A chic spot for après-ski drinks and live music."
    },
    {
      id: 4,
      name: "Elsie's Bar",
      description: "A quaint wine bar perfect for relaxing evenings."
    }
  ]
}) {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 bg-gray-50 min-h-[300px] relative">
              {attractions.map(item => (
                <div 
                  key={item.id}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 p-8 
                    ${activeTab === item.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/images/journal/journal-3.png)'}}
                >
                  <div className="text-xl font-medium text-white">{item.name}</div>
                  <div className="absolute bottom-6 right-6">
                    <button className="px-3 py-1 border border-white text-white rounded hover:bg-white hover:text-gray-800 transition-colors">
                      Menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="md:col-span-3 p-8">
              <h3 className="text-2xl font-semibold mb-8 md:hidden">{title}</h3>
              <h3 className="text-2xl font-semibold mb-8 hidden md:block">{title}</h3>
              
              <div className="space-y-6">
                {attractions.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`flex cursor-pointer group transition-colors ${
                      activeTab === item.id ? 'text-blue-600' : 'text-gray-800'
                    }`}
                    onMouseEnter={() => setActiveTab(item.id)}
                  >
                    <div className="mr-4 text-3xl font-medium">
                      <span className="inline-block w-6">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium">{item.name}</h4>
                      <p className="text-gray-600 group-hover:text-gray-900">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}