import PageHero from '../../components/common/PageHero';
import ContentBlock from '../../components/common/ContentBlock';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Press | CinCin Hotels',
  description: 'Press information, media resources, and latest news about CinCin Hotels.',
};

const pressReleases = [
  {
    id: 1,
    title: 'CinCin Hotels Announces Expansion to 75 Properties Across Europe',
    date: 'June 15, 2023',
    excerpt: 'Boutique hotel collection adds 15 new destinations to its carefully curated portfolio.'
  },
  {
    id: 2,
    title: 'CinCin Hotels Launches Redesigned Website and Mobile App',
    date: 'April 3, 2023',
    excerpt: 'New digital platform offers enhanced user experience and personalized travel planning features.'
  },
  {
    id: 3,
    title: 'CinCin Hotels Partners with Leading Sustainability Certification Program',
    date: 'February 12, 2023',
    excerpt: 'Partnership aims to advance environmental responsibility throughout boutique hospitality sector.'
  }
];

const mediaFeatures = [
  {
    id: 1,
    publication: 'Travel + Leisure',
    title: 'How This Boutique Hotel Collective Is Redefining Luxury Travel',
    date: 'May 2023',
    link: '#'
  },
  {
    id: 2,
    publication: 'Condé Nast Traveler',
    title: 'The 10 Most Beautiful Boutique Hotels in Europe',
    date: 'March 2023',
    link: '#'
  },
  {
    id: 3,
    publication: 'Forbes',
    title: 'Meet The Entrepreneur Making Boutique Hotels More Accessible',
    date: 'January 2023',
    link: '#'
  },
  {
    id: 4,
    publication: 'Monocle',
    title: 'How Independent Hotels Are Fighting Back Against Chains',
    date: 'December 2022',
    link: '#'
  }
];

export default function PressPage() {
  return (
    <main className="bg-white">
      <PageHero 
        title="Press & Media" 
        subtitle="Resources and information for journalists and media professionals"
        backgroundImage="/images/hotels/hotel-1.jpg"
      />
      
      <ContentBlock title="About CinCin Hotels">
        <p>
          CinCin Hotels is a curated collection of distinctive boutique hotels across Europe and beyond. Founded in 2020, we connect discerning travelers with independently owned properties that offer exceptional design, authentic experiences, and a true sense of place.
        </p>
        <p>
          Our collection currently includes 75 carefully selected hotels spanning 14 countries, from urban design properties to mountain retreats and coastal escapes. Each hotel in our portfolio meets our rigorous standards for quality, character, and guest experience.
        </p>
        <div className="mt-6">
          <Link href="/about" className="text-black font-medium hover:underline flex items-center">
            Learn more about our story
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </ContentBlock>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-normal mb-12 text-center">Press Releases</h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {pressReleases.map(release => (
              <div key={release.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-2">{release.date}</div>
                <h3 className="text-xl font-semibold mb-3">{release.title}</h3>
                <p className="text-gray-700 mb-4">{release.excerpt}</p>
                <Link href={`/press/releases/${release.id}`} className="text-black font-medium hover:underline flex items-center">
                  Read Full Release
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/press/archive" className="text-black font-medium hover:underline">
              View All Press Releases →
            </Link>
          </div>
        </div>
      </section>
      
      <ContentBlock title="Media Features">
        <div className="space-y-6">
          {mediaFeatures.map(feature => (
            <div key={feature.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="text-sm text-gray-500 mb-1">{feature.publication} | {feature.date}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <Link href={feature.link} className="text-black font-medium hover:underline">
                Read Article →
              </Link>
            </div>
          ))}
        </div>
      </ContentBlock>
      
      <ContentBlock title="Media Resources" bgColor="bg-gray-50">
        <p className="mb-8">
          For high-resolution images, brand assets, and statistics, please access our media kit or contact our press team.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/media-kit.zip" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Download Media Kit</h3>
            <p className="text-gray-600 text-sm">Includes logos, images, fact sheets, and brand guidelines</p>
          </a>
          
          <a href="/press/statistics" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="M18 12V8"></path>
                <path d="M13 12v-2"></path>
                <path d="M8 12V6"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Facts & Figures</h3>
            <p className="text-gray-600 text-sm">Key statistics and growth data about CinCin Hotels</p>
          </a>
        </div>
      </ContentBlock>
      
      <ContentBlock title="Media Inquiries">
        <p>
          For press inquiries, interview requests, or additional information, please contact our press team:
        </p>
        <p className="mt-4">
          <strong>Email:</strong> press@cincinhotels.com<br />
          <strong>Phone:</strong> +49 30 1234 5679
        </p>
        <div className="mt-8">
          <Link href="/contact" className="bg-black text-white px-6 py-3 rounded-md inline-flex items-center hover:bg-gray-800 transition-colors">
            Contact Press Team
          </Link>
        </div>
      </ContentBlock>
    </main>
  );
}