'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const links = {
    company: [
      { text: 'About Us', href: '/about' },
      { text: 'Contact', href: '/contact' },
      { text: 'Careers', href: '/careers' },
    ],
    business: [
      { text: 'Hotel Membership', href: '/membership' },
      { text: 'Press', href: '/press' },
      { text: 'Partner with Us', href: '/partner' },
    ],
    legal: [
      { text: 'Terms & Conditions', href: '/terms' },
      { text: 'Privacy Policy', href: '/privacy' },
      { text: 'Cookie Policy', href: '/cookies' },
      { text: 'Cookie Settings', href: '#', isButton: true },
      { text: 'Imprint', href: '/imprint' },
    ],
    social: [
      { name: 'Instagram', href: 'https://instagram.com', icon: InstagramIcon },
      { name: 'LinkedIn', href: 'https://linkedin.com', icon: LinkedInIcon },
      { name: 'YouTube', href: 'https://youtube.com', icon: YouTubeIcon },
    ],
  };

  return (
    <footer className="bg-brand-gray-900 text-white pt-10 sm:pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-x-4 lg:gap-x-8">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" aria-label="CinCin Hotels Home">
              <Image 
                src="/images/logo/footer-logo.png" 
                alt="CinCin Hotels" 
                width={37} 
                height={32} 
                className="h-8 w-auto mb-4"
              />
            </Link>
            <p className="text-white mb-4 text-sm">© {currentYear} CinCin Hotels</p>
            <p className="text-gray-300 max-w-sm text-sm sm:text-base">Discover a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.</p>
          </div>
          
          <div className="hidden sm:block md:col-span-1">
            <FooterLinksColumn title="Company" links={links.company} />
          </div>
          
          <div className="hidden sm:block md:col-span-1">
            <FooterLinksColumn title="Business" links={links.business} />
          </div>
          
          <div className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-normal text-white mb-3 sm:mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-1 sm:space-y-2">
              {links.legal.map(link => (
                <li key={link.text}>
                  {link.isButton ? (
                    <button 
                      className="text-gray-300 hover:text-brand-olive-300 transition-colors text-sm py-1 block"
                      onClick={() => console.log('Cookie settings clicked')}
                    >
                      {link.text}
                    </button>
                  ) : (
                    <Link href={link.href} className="text-gray-300 hover:text-brand-olive-300 transition-colors text-sm py-1 block">
                      {link.text}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            
            <div className="flex space-x-4 mt-6">
              {links.social.map(item => (
                <a 
                  key={item.name}
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={item.name}
                  className="text-gray-300 hover:text-brand-olive-300 transition-colors"
                >
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Mobile-only footer links */}
          <div className="col-span-2 grid grid-cols-2 gap-8 sm:hidden mt-4">
            <FooterLinksColumn title="Company" links={links.company} />
            <FooterLinksColumn title="Business" links={links.business} />
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 sm:mt-10 pt-6 text-xs sm:text-sm text-gray-400 text-center md:text-left">
          <p>CinCin Hotels is committed to responsible tourism and environmental sustainability.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinksColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs sm:text-sm font-normal text-white mb-3 sm:mb-4 uppercase tracking-wider">{title}</h3>
      <ul className="space-y-1 sm:space-y-2">
        {links.map(link => (
          <li key={link.text}>
            <Link 
              href={link.href} 
              className="text-gray-300 hover:text-brand-olive-300 transition-colors text-sm py-1 block"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Social Media Icons
function InstagramIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YouTubeIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}