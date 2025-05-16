import { notFound } from 'next/navigation';
import { getCategoryBySlug, getHotelsByCategory } from '@/lib/api';
import { getAllCategories } from '@/lib/api';
import HotelList from '@/components/hotels/HotelList';
import CategoryBar from '@/components/hotels/CategoryBar';

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { slug } = params;
  const categoryData = await getCategoryBySlug(slug);
  
  if (!categoryData) {
    return {
      title: 'Category Not Found - CinCin Hotels',
    };
  }
  
  const category = categoryData.data;
  
  return {
    title: `${category.name} Hotels - CinCin Hotels`,
    description: category.description,
    openGraph: {
      title: `${category.name} Hotels - CinCin Hotels`,
      description: category.description,
      images: [
        {
          url: category.image,
          width: 1200,
          height: 630,
          alt: `${category.name} Hotels`,
        },
      ],
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  
  // Fetch data in parallel
  const [categoryData, hotelsData, allCategoriesData] = await Promise.all([
    getCategoryBySlug(slug),
    getHotelsByCategory(slug),
    getAllCategories()
  ]);
  
  // If category not found, return 404 page
  if (!categoryData) {
    notFound();
  }
  
  const category = categoryData.data;
  const hotels = hotelsData.data;
  const allCategories = allCategoriesData.data;
  
  // Create a hero section with category background
  const HeroSection = () => (
    <div className="relative h-80 bg-gray-900">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${category.image})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name} Hotels</h1>
        <p className="text-xl md:text-2xl max-w-2xl">
          {category.description}
        </p>
      </div>
    </div>
  );
  
  return (
    <main>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <CategoryBar activeCategory={slug} />
        
        <HotelList 
          hotels={hotels}
          title={`${category.name} Hotels`}
          subtitle={`${hotels.length} hotels with ${category.name.toLowerCase()} experiences`}
          emptyMessage={`No hotels found in the ${category.name.toLowerCase()} category. Please try a different category.`}
        />
      </div>
    </main>
  );
}

// Generate static paths for all categories
export async function generateStaticParams() {
  const categoriesData = await getAllCategories();
  const categories = categoriesData.data;
  
  return categories.map(category => ({
    slug: category.slug,
  }));
}