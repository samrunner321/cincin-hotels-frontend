import PageHero from '../../src/components/common/PageHero';
import ContentBlock from '../../src/components/common/ContentBlock';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Careers | CinCin Hotels',
  description: 'Join our team and help shape the future of boutique hospitality. Explore career opportunities at CinCin Hotels.',
};

const jobOpenings = [
  {
    id: 1,
    title: 'Hotel Relations Manager',
    location: 'Berlin, Germany',
    department: 'Member Services',
    type: 'Full-time',
    description: 'We are looking for a passionate Hotel Relations Manager to work directly with our member hotels, ensuring they make the most of their CinCin Hotels partnership.'
  },
  {
    id: 2,
    title: 'Content Writer',
    location: 'Remote',
    department: 'Content',
    type: 'Full-time',
    description: 'Join our content team to create compelling stories about our hotels, destinations, and travel experiences for our website and journal.'
  },
  {
    id: 3,
    title: 'Frontend Developer',
    location: 'Berlin, Germany',
    department: 'Technology',
    type: 'Full-time',
    description: 'Help us build and improve our digital platform with a focus on creating beautiful, user-friendly experiences for our guests and hotel partners.'
  },
  {
    id: 4,
    title: 'Marketing Specialist',
    location: 'Berlin, Germany',
    department: 'Marketing',
    type: 'Full-time',
    description: 'Develop and execute marketing campaigns that showcase our unique hotel collection to discerning travelers worldwide.'
  }
];

export default function CareersPage() {
  return (
    <main className="bg-white">
      <PageHero 
        title="Join Our Team" 
        subtitle="Help us shape the future of boutique hospitality"
        backgroundImage="/images/hotels/hotel-7.jpg"
      />
      
      <ContentBlock title="Life at CinCin Hotels">
        <p>
          At CinCin Hotels, we are a passionate team united by our love for unique hospitality experiences and our mission to connect travelers with extraordinary places to stay. We value creativity, authenticity, and a genuine desire to help both our hotel partners and travelers thrive.
        </p>
        <p>
          Working with us means being part of a dynamic, international environment where innovative ideas are encouraged and personal growth is supported. We believe in creating a workplace that is as welcoming and inspiring as the hotels in our collection.
        </p>
      </ContentBlock>
      
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-700">We are committed to delivering exceptional experiences for our partners and users alike.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-700">We thrive through teamwork, both within our company and with our hotel partners.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-700">We continuously explore new ways to improve and enhance our platform and services.</p>
            </div>
          </div>
        </div>
      </div>
      
      <ContentBlock title="Benefits & Perks">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">Flexible Working</h3>
            <p>We offer a hybrid work model with flexible hours to ensure you can work when and where you are most productive.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Hotel Stays</h3>
            <p>Employee discounts at our member hotels let you experience the properties in our collection firsthand.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Learning & Development</h3>
            <p>We support your growth with a personal development budget and regular learning opportunities.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Health & Wellbeing</h3>
            <p>Comprehensive health insurance and wellness initiatives to keep you at your best.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Team Events</h3>
            <p>Regular team outings, retreats, and social events to foster connection and celebrate our successes.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Modern Equipment</h3>
            <p>We provide the tools and technology you need to do your best work, whether in the office or remotely.</p>
          </div>
        </div>
      </ContentBlock>
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-normal mb-12 text-center">Current Openings</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {jobOpenings.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm">
                  <span className="text-gray-600">{job.location}</span>
                  <span className="text-gray-600">{job.department}</span>
                  <span className="text-gray-600">{job.type}</span>
                </div>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <Link href={`/careers/${job.id}`} className="text-black font-medium hover:underline flex items-center">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-700 mb-6">Do not see a position that matches your skills? We are always interested in hearing from talented individuals.</p>
            <Link href="/contact" className="bg-black text-white px-6 py-3 rounded-md inline-flex items-center hover:bg-gray-800 transition-colors">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}