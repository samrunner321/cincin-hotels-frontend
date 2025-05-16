'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function MembershipBenefits() {
  const benefits = [
    {
      icon: '/images/icons/world.svg',
      title: 'Global Visibility',
      description: 'Your property will be showcased to our exclusive audience of discerning travelers worldwide.'
    },
    {
      icon: '/images/icons/marketing.svg',
      title: 'Marketing Support',
      description: 'Benefit from our digital marketing expertise, professional photography, and content creation.'
    },
    {
      icon: '/images/icons/community.svg',
      title: 'Hotelier Community',
      description: 'Connect with like-minded hoteliers through exclusive events and our private network.'
    },
    {
      icon: '/images/icons/booking.svg',
      title: 'Direct Bookings',
      description: 'Increase your direct reservations with our seamless booking technology.'
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal mb-4">Why Join CinCin Hotels</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We partner with unique hotels that offer exceptional experiences. Our members enjoy numerous benefits designed to enhance their business and guest experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Image
                  src={benefit.icon || '/images/icons/star.svg'}
                  alt={benefit.title}
                  width={30}
                  height={30}
                  className="h-6 w-auto"
                />
              </div>
              <h3 className="text-xl text-center font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600 text-center">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}