'use client';

import { motion } from 'framer-motion';

export default function ContentBlock({ 
  title, 
  children, 
  bgColor = 'bg-white',
  align = 'left'
}) {
  return (
    <section className={`py-10 sm:py-12 md:py-16 ${bgColor}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className={`max-w-full sm:max-w-4xl mx-auto ${align === 'center' ? 'text-center' : ''}`}
        >
          {title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-6 sm:mb-8">{title}</h2>
          )}
          <div className="prose prose-base sm:prose-lg max-w-none">
            {children}
          </div>
        </motion.div>
      </div>
    </section>
  );
}