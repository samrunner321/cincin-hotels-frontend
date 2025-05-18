import Image from 'next/image';
import Link from 'next/link';
import ClientProvider from './_components/ClientProvider';
import DirectusConfig from './_components/DirectusConfig';

export const metadata = {
  title: 'CinCin Hotels - Handpicked Luxury Accommodations',
  description: 'Discover a curated collection of unique accommodations, renowned for timeless design and warm, personalized hospitality.',
};

export default function HomePage() {
  // Static mock data
  const featuredHotel = {
    tag: "New to the Club",
    name: "the cōmodo",
    location: "Bad Gastein, Austria",
    description: "The cōmodo in Bad Gastein offers a midcentury-inspired retreat with farm-to-table dining, a full spa, and a curated art collection. Perfect for families and wellness enthusiasts.",
    slug: "the-comodo",
    images: [
      "/images/hotel-1.jpg",
      "/images/hotel-2.jpg",
      "/images/hotel-3.jpg"
    ]
  };
  
  const categories = [
    {
      name: "Culinary",
      image: "/images/category-culinary.jpg",
      slug: "culinary" 
    },
    {
      name: "Spa",
      image: "/images/category-spa.jpg",
      slug: "spa"
    },
    {
      name: "City",
      image: "/images/category-city.jpg",
      slug: "city"
    },
    {
      name: "Beach",
      image: "/images/category-beach.jpg",
      slug: "beach"
    },
    {
      name: "Adults Only",
      image: "/images/category-adults.jpg",
      slug: "adults-only"
    }
  ];
  
  return (
    <ClientProvider>
      <DirectusConfig />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-bg.jpg" 
            alt="CinCin Hotels" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 z-0" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-brooklyn mb-6">
            Handpicked Luxury Hotels
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10">
            Discover unique accommodations renowned for timeless design and warm, personalized hospitality.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/hotels"
              className="px-8 py-3 bg-white text-gray-900 hover:bg-gray-200 transition-colors rounded-full font-medium"
            >
              Explore Hotels
            </Link>
            <Link 
              href="/destinations"
              className="px-8 py-3 border border-white hover:bg-white/20 transition-colors rounded-full font-medium"
            >
              Discover Destinations
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Hotel */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
                <Image 
                  src={featuredHotel.images[0]} 
                  alt={featuredHotel.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <span className="text-sm uppercase tracking-wider text-brand-olive-600 mb-2 block">
                {featuredHotel.tag}
              </span>
              <h2 className="text-3xl md:text-4xl font-brooklyn mb-2">
                {featuredHotel.name}
              </h2>
              <p className="text-gray-600 mb-6">
                {featuredHotel.location}
              </p>
              <p className="text-gray-700 mb-8">
                {featuredHotel.description}
              </p>
              <Link 
                href={`/hotels/${featuredHotel.slug}`}
                className="inline-block px-8 py-3 bg-brand-olive-500 text-white hover:bg-brand-olive-600 transition-colors rounded-full font-medium"
              >
                View Hotel
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-brooklyn mb-12 text-center">
            Explore by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index}
                href={`/hotels/category/${category.slug}`}
                className="group block relative h-[250px] rounded-xl overflow-hidden"
              >
                <Image 
                  src={category.image} 
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-brooklyn text-white">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-20 bg-brand-olive-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-brooklyn mb-6">
            Ready to Discover Your Next Destination?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-10">
            Join our community and get exclusive access to special offers and travel inspirations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/membership"
              className="px-8 py-3 bg-white text-brand-olive-700 hover:bg-gray-100 transition-colors rounded-full font-medium"
            >
              Become a Member
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-3 border border-white hover:bg-white/20 transition-colors rounded-full font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      
      {/* API Test Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-brooklyn mb-6">Directus Integration Status</h3>
          <div className="inline-block px-6 py-3 bg-white shadow rounded-lg">
            <p>Status: <span className="text-green-600 font-semibold">Ready</span></p>
            <p className="text-gray-600">Check the console for detailed connection information</p>
          </div>
          <div className="mt-4">
            <Link
              href="/api/testing"
              target="_blank"
              className="text-blue-600 underline"
            >
              View API Status
            </Link>
          </div>
        </div>
      </section>
    </ClientProvider>
  );
}