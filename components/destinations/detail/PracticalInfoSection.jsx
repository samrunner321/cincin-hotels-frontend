'use client';

import { motion } from 'framer-motion';

export default function PracticalInfoSection({ destination, practicalData = {} }) {
  const practicalInfo = [
    {
      id: 1,
      category: 'Visa & Entry',
      icon: '🛂',
      items: [
        { label: 'Visa Required', value: 'EU Citizens: No visa required', detail: 'Valid passport needed' },
        { label: 'Max Stay', value: '90 days', detail: 'Within 180-day period' },
        { label: 'Entry Requirements', value: 'Passport validity', detail: '3 months beyond stay' }
      ]
    },
    {
      id: 2,
      category: 'Currency & Money',
      icon: '💶',
      items: [
        { label: 'Currency', value: 'Euro (€)', detail: 'EUR' },
        { label: 'Cards Accepted', value: 'Widely accepted', detail: 'Visa, Mastercard, Amex' },
        { label: 'ATMs', value: 'Available everywhere', detail: 'Small fees may apply' }
      ]
    },
    {
      id: 3,
      category: 'Weather & Climate',
      icon: '🌡️',
      items: [
        { label: 'Best Time', value: 'May - September', detail: 'Warm and sunny' },
        { label: 'Peak Season', value: 'July - August', detail: 'Crowded, expensive' },
        { label: 'Average Temp', value: '25-30°C Summer', detail: '10-15°C Winter' }
      ]
    },
    {
      id: 4,
      category: 'Transport',
      icon: '🚕',
      items: [
        { label: 'Airport', value: 'JMK Airport', detail: '6km from town' },
        { label: 'Local Transport', value: 'Buses, Taxis', detail: 'Rental cars recommended' },
        { label: 'Airport Transfer', value: '€20-30', detail: 'Taxi to town center' }
      ]
    },
    {
      id: 5,
      category: 'Health & Safety',
      icon: '🏥',
      items: [
        { label: 'Emergency', value: '112', detail: 'European emergency number' },
        { label: 'Healthcare', value: 'Good quality', detail: 'Travel insurance advised' },
        { label: 'Water', value: 'Tap water safe', detail: 'Bottled widely available' }
      ]
    },
    {
      id: 6,
      category: 'Communication',
      icon: '📱',
      items: [
        { label: 'Country Code', value: '+30', detail: 'Greece' },
        { label: 'Internet', value: 'Widely available', detail: 'Free WiFi common' },
        { label: 'Language', value: 'Greek', detail: 'English widely spoken' }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="practical-info" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            {practicalData?.practical_travel || 'Travel'} <span className="font-bold">{practicalData?.practical_information || 'Information'}</span>
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl">
            {practicalData?.practical_subtitle ? (
              <span dangerouslySetInnerHTML={{ __html: practicalData.practical_subtitle.replace('{destination}', destination) }} />
            ) : (
              `Everything you need to know for a smooth and enjoyable trip to ${destination}.`
            )}
          </p>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {practicalInfo.map((info) => (
              <motion.div
                key={info.id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{info.icon}</span>
                  <h3 className="text-xl font-semibold">{info.category}</h3>
                </div>
                
                <div className="space-y-3">
                  {info.items.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-sm font-medium text-right">{item.value}</span>
                      </div>
                      {item.detail && (
                        <p className="text-xs text-gray-500 mt-1">{item.detail}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Tips */}
          <motion.div
            className="mt-12 bg-brand-olive-100 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              {practicalData?.practical_insider_tips ? (
                <span dangerouslySetInnerHTML={{ __html: practicalData.practical_insider_tips.replace('{destination}', destination) }} />
              ) : (
                `Insider Tips for ${destination}`
              )}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-olive-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-gray-700">
                  Book restaurants in advance during peak season (July-August)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-olive-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-gray-700">
                  Rent a scooter or ATV to explore hidden beaches and villages
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-olive-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-gray-700">
                  Carry cash for small tavernas and beach bars
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-olive-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-gray-700">
                  Visit popular beaches early morning or late afternoon to avoid crowds
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}