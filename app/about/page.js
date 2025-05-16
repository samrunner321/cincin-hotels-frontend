import PageHero from '../../components/common/PageHero';
import ContentBlock from '../../components/common/ContentBlock';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | CinCin Hotels',
  description: 'Learn about the story, mission and values behind CinCin Hotels and our collection of boutique properties.',
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      <PageHero 
        title="About CinCin Hotels" 
        subtitle="A curated collection of the world's most distinctive boutique hotels"
        backgroundImage="/images/hotels/hotel-2.jpg"
      />
      
      <ContentBlock title="Our Story">
        <p>
          Founded in 2020, CinCin Hotels began with a simple vision: to connect discerning travelers with exceptional boutique hotels that offer authentic, memorable experiences. What started as a small collection of handpicked properties in Europe has grown into a global network of distinctive accommodations, each with its own unique character and charm.
        </p>
        <p>
          Our founder, Samuel Renner, a passionate traveler and hospitality enthusiast, recognized the growing desire for more personalized, intimate hotel experiences. After years of exploring hidden gems across the world and building relationships with visionary hoteliers, he created CinCin Hotels as a platform to showcase these special places to a wider audience.
        </p>
        <p>
          The name "CinCin" - an Italian toast meaning "to your health" - reflects our celebration of life's pleasures and the spirit of connection that travel creates. It embodies our belief that the right hotel doesn't just provide a place to stay; it enhances the entire travel experience and becomes part of the journey itself.
        </p>
      </ContentBlock>
      
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative h-80">
              <Image 
                src="/images/hotels/hotel-4.jpg"
                alt="CinCin Hotels Experience"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative h-80">
              <Image 
                src="/images/hotels/hotel-5.jpg"
                alt="CinCin Hotels Experience"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="relative h-80">
              <Image 
                src="/images/hotels/hotel-6.jpg"
                alt="CinCin Hotels Experience"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
      
      <ContentBlock title="Our Mission">
        <p>
          At CinCin Hotels, we believe that extraordinary stays enrich our lives and create lasting memories. Our mission is to connect travelers with properties that offer not just accommodation, but genuine hospitality, distinctive design, and a sense of place.
        </p>
        <p>
          We carefully select each hotel in our collection based on its unique character, commitment to quality, and ability to provide guests with authentic local experiences. Whether an urban design hotel, a peaceful mountain retreat, or a beachfront sanctuary, each property in our collection has a story to tell and a special atmosphere that sets it apart.
        </p>
        <p>
          Beyond serving travelers, we are committed to supporting independent hotels and preserving the diversity of the hospitality landscape. By championing properties that offer alternatives to standardized experiences, we help maintain the rich tapestry of global hospitality and the cultural heritage it represents.
        </p>
      </ContentBlock>
      
      <ContentBlock title="Our Values" bgColor="bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">Authenticity</h3>
            <p>We believe in real experiences and genuine hospitality. Every hotel in our collection offers something true to its location and heritage.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Quality</h3>
            <p>While each property has its own unique character, all meet our exacting standards for comfort, service, and attention to detail.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
            <p>We prioritize hotels that operate responsibly, respecting their environments and communities while preserving resources for future generations.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Connection</h3>
            <p>We foster meaningful connections - between guests and destinations, travelers and hoteliers, and among our community of like-minded hospitality professionals.</p>
          </div>
        </div>
      </ContentBlock>
      
      <ContentBlock title="Join Our Journey">
        <p>
          Whether you are a traveler seeking extraordinary places to stay, a hotelier interested in joining our collection, or a potential partner who shares our vision, we invite you to become part of the CinCin Hotels story.
        </p>
        <p>
          Explore our curated selection of properties, discover inspiring destinations through our journal, or learn about membership opportunities for your hotel. Together, we can continue to celebrate and support the world's most distinctive accommodations and the unforgettable experiences they create.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="/hotels" className="bg-black text-white px-6 py-3 rounded-md inline-flex items-center hover:bg-gray-800 transition-colors">
            Explore Hotels
          </a>
          <a href="/membership" className="border border-black px-6 py-3 rounded-md inline-flex items-center hover:bg-gray-100 transition-colors">
            Become a Member
          </a>
        </div>
      </ContentBlock>
    </main>
  );
}