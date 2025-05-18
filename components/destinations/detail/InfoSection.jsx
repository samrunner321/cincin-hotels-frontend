'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

export default function InfoSection({ destination }) {
  const { info } = destination;
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const mainCategories = ['travel', 'weather', 'language', 'currency'];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">Travel Information</h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Everything you need to know to plan your trip to {destination.name} with confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {mainCategories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-gray-50 rounded-xl overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#93A27F] flex items-center justify-center mr-3">
                    <CategoryIcon category={category} />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 capitalize">{category}</h3>
                </div>
                <InfoContent category={category} info={info[category]} />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-[#93A27F] bg-opacity-10 rounded-xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="md:w-1/3">
              <h3 className="text-xl font-medium text-gray-900 mb-3">Local Tips</h3>
              <p className="text-gray-700">Insider advice from locals and seasoned travelers to make the most of your stay.</p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 gap-4">
              {info.tips.map((tip, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <p className="text-gray-700">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16"
        >
          <div className="bg-gray-900 text-white rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-medium mb-4">Need Help Planning?</h3>
                <p className="text-gray-300 mb-6">
                  Our concierge team is available to help you plan every aspect of your trip to {destination.name}.
                  From transportation to special experiences, we've got you covered.
                </p>
                <div className="mt-2">
                  <button className="px-6 py-3 bg-[#93A27F] text-white rounded-full hover:bg-opacity-90 transition-all">
                    Contact Concierge
                  </button>
                </div>
              </div>
              <div className="relative aspect-video md:aspect-auto min-h-[200px]">
                <Image
                  src="/images/destinations/crans-montana/concierge.jpg"
                  alt="Concierge service"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CategoryIcon({ category }) {
  // Define SVG paths for each category icon
  const iconPaths = {
    travel: "M5 16V8h14v8H5zm0-14h14v4H5V2zm7 16v-2h.01L12 16z",
    weather: "M12 2a9 9 0 0 1 9 9c0 6-9 13-9 13S3 17 3 11a9 9 0 0 1 9-9zm0 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    language: "M10 20l4-16m2 16l.5-2m-4.5 2h7m-11-10h2.5m1.5 0h7M6 6h2m10 0h-2.5",
    currency: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39h-1.97c-.1-1.4-1.01-1.86-2.4-1.86-1.24 0-2.33.47-2.33 1.47 0 .75.4 1.31 2.55 1.81 2.15.48 4.3 1.29 4.3 3.66 0 1.95-1.54 3.06-3.55 3.4z"
  };

  return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[category]} />
    </svg>
  );
}

function InfoContent({ category, info }) {
  switch (category) {
    case 'travel':
      return (
        <div>
          <p className="text-gray-700 mb-4">{info.description}</p>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Best Way to Arrive</h4>
              <p className="text-gray-700">{info.arrival}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">From the Airport</h4>
              <p className="text-gray-700">{info.fromAirport}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Local Transportation</h4>
              <p className="text-gray-700">{info.localTransport}</p>
            </div>
          </div>
        </div>
      );
    
    case 'weather':
      return (
        <div>
          <p className="text-gray-700 mb-4">{info.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {info.seasons.map((season) => (
              <div key={season.name} className="text-center p-2 bg-white rounded-lg">
                <p className="text-sm font-medium text-gray-900 capitalize">{season.name}</p>
                <p className="text-xl font-medium text-[#93A27F]">{season.temp}</p>
                <p className="text-xs text-gray-600">{season.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'language':
      return (
        <div>
          <p className="text-gray-700 mb-4">{info.description}</p>
          <div className="space-y-2 mt-2">
            <h4 className="text-sm font-medium text-gray-900">Common Phrases</h4>
            <div className="bg-white rounded-lg p-3">
              <table className="w-full">
                <tbody>
                  {info.phrases.map((phrase, index) => (
                    <tr key={index} className={index !== info.phrases.length - 1 ? "border-b border-gray-100" : ""}>
                      <td className="py-2 pr-2 text-gray-700">{phrase.english}</td>
                      <td className="py-2 text-[#93A27F] font-medium">{phrase.local}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    
    case 'currency':
      return (
        <div>
          <p className="text-gray-700 mb-4">{info.description}</p>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Currency</h4>
              <p className="text-gray-700">{info.name} ({info.code})</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Payment Methods</h4>
              <p className="text-gray-700">{info.paymentMethods}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Tipping</h4>
              <p className="text-gray-700">{info.tipping}</p>
            </div>
          </div>
        </div>
      );
    
    default:
      return <p>Information not available</p>;
  }
}