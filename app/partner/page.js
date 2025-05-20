import PageHero from '../../src/components/common/PageHero';
import ContentBlock from '../../src/components/common/ContentBlock';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Partner With Us | CinCin Hotels',
  description: 'Explore partnership opportunities with CinCin Hotels to reach our community of discerning travelers.',
};

const partnerTypes = [
  {
    title: 'Hotels & Properties',
    description: 'For boutique hotels looking to join our collection',
    image: '/images/hotels/hotel-2.jpg',
    link: '/membership',
    cta: 'Become a Member'
  },
  {
    title: 'Brands & Lifestyle',
    description: 'For brands that want to reach our community of discerning travelers',
    image: '/images/hotels/hotel-3.jpg',
    link: '/partner/brands',
    cta: 'Brand Partnerships'
  },
  {
    title: 'Travel Agencies',
    description: 'For travel professionals looking to offer our collection to their clients',
    image: '/images/hotels/hotel-4.jpg',
    link: '/partner/agencies',
    cta: 'Agency Program'
  }
];

const currentPartners = [
  '/images/partners/partner-1.png',
  '/images/partners/partner-2.png',
  '/images/partners/partner-3.png',
  '/images/partners/partner-4.png',
  '/images/partners/partner-5.png',
  '/images/partners/partner-6.png'
];

export default function PartnerPage() {
  return (
    <main className="bg-white">
      <PageHero 
        title="Partner With Us" 
        subtitle="Join our network and connect with discerning travelers worldwide"
        backgroundImage="/images/hotels/hotel-5.jpg"
      />
      
      <ContentBlock title="Why Partner With CinCin Hotels?">
        <p>
          CinCin Hotels connects quality-conscious travelers with exceptional boutique accommodations around the world. Our platform showcases distinctive properties that offer authentic experiences and outstanding service.
        </p>
        <p>
          Partnering with CinCin Hotels means joining a community dedicated to excellence in hospitality and gaining access to our growing audience of discerning travelers who value quality, authenticity, and memorable experiences.
        </p>
      </ContentBlock>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-normal mb-12 text-center">Partnership Opportunities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image 
                    src={type.image}
                    alt={type.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                  <p className="text-gray-600 mb-6">{type.description}</p>
                  <Link href={type.link} className="bg-black text-white px-4 py-2 rounded-md inline-flex items-center hover:bg-gray-800 transition-colors text-sm">
                    {type.cta}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <ContentBlock title="Our Partner Network" align="center">
        <p className="text-center max-w-3xl mx-auto mb-12">
          We collaborate with a select group of partners who share our commitment to quality and our appreciation for distinctive experiences.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {/* These would be actual partner logos in a real implementation */}
          {currentPartners.map((partner, index) => (
            <div key={index} className="h-16 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-400 font-medium">Partner Logo</span>
            </div>
          ))}
        </div>
      </ContentBlock>
      
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-normal mb-6">Ready to Partner With Us?</h2>
          <p className="text-gray-300 mb-8">
            Let us discuss how we can work together to create value for your business and our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-white text-black px-6 py-3 rounded-md inline-flex items-center hover:bg-gray-100 transition-colors">
              Get in Touch
            </Link>
            <Link href="/membership" className="border border-white text-white px-6 py-3 rounded-md inline-flex items-center hover:bg-white/10 transition-colors">
              Hotel Membership
            </Link>
          </div>
        </div>
      </section>
      
      <ContentBlock title="Frequently Asked Questions">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">What types of hotels qualify for your collection?</h3>
            <p>We look for independently owned or operated boutique hotels that offer exceptional quality, distinctive character, and authentic experiences. Our selection process considers factors like design, service standards, guest reviews, and overall alignment with our brand values.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">How do brand partnerships work?</h3>
            <p>We offer various collaboration opportunities for lifestyle brands, including co-branded content, special offers for our audience, event partnerships, and featured placement on our platform. Each partnership is customized based on mutual objectives and audience alignment.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Do you offer commission for travel agencies?</h3>
            <p>Yes, we have a dedicated program for travel advisors and agencies that includes competitive commission rates, priority support, and exclusive offers for your clients. Contact us for more details about our agency program.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">How long does the partnership process take?</h3>
            <p>The timeline varies depending on the type of partnership. For hotels joining our collection, the process typically takes 4-6 weeks from initial inquiry to onboarding. For brand partnerships, we can often move more quickly, especially for time-sensitive opportunities.</p>
          </div>
        </div>
      </ContentBlock>
    </main>
  );
}