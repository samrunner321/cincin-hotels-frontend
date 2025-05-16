'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero({ 
  title = "CINCIN® hotels is a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.",
  subtitle = null,
  buttonText = "Explore all Hotels",
  backgroundImage = "/images/hero-bg.jpg"
}) {
  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3,
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 } 
    }
  };
  
  const scrollToNextSection = () => {
    // Scroll to the next section after the hero
    const nextSection = document.querySelector('section:not(.hero-section) + section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If no next section found, scroll down 100vh
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      className="relative min-h-screen flex items-end pb-40"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-white w-full">
        <div className="flex justify-between items-end">
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <p className="text-xl md:text-2xl leading-relaxed">
              {title}
            </p>
            
            {subtitle && (
              <p className="text-lg opacity-90 mt-2">
                {subtitle}
              </p>
            )}
          </motion.div>
          
          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Link 
              href="/hotels" 
              className="inline-flex items-center text-white bg-transparent border border-white hover:bg-white hover:text-gray-900 transition-colors duration-300 rounded-md px-6 py-3"
            >
              <span>{buttonText}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2" 
                viewBox="0 0 25 9" 
                fill="none"
              >
                <path d="M24.3536 4.85355C24.5488 4.65829 24.5488 4.34171 24.3536 4.14645L21.1716 0.964466C20.9763 0.769204 20.6597 0.769204 20.4645 0.964466C20.2692 1.15973 20.2692 1.47631 20.4645 1.67157L23.2929 4.5L20.4645 7.32843C20.2692 7.52369 20.2692 7.84027 20.4645 8.03553C20.6597 8.2308 20.9763 8.2308 21.1716 8.03553L24.3536 4.85355ZM0 5H24V4H0V5Z" 
                  fill="currentColor"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}