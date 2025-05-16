import Link from 'next/link';
import Image from 'next/image';

export default function DestinationCategories({ 
  categories = [
    {
      id: 1,
      title: "Beach Days",
      image: "/images/beach.jpg",
      url: "/destinations/beach"
    },
    {
      id: 2,
      title: "Mountain Retreat",
      image: "/images/mountain.jpg",
      url: "/destinations/mountain"
    },
    {
      id: 3,
      title: "City Break",
      image: "/images/city.jpg",
      url: "/destinations/city"
    },
    {
      id: 4,
      title: "Country-Side",
      image: "/images/countryside.jpg",
      url: "/destinations/countryside"
    }
  ]
}) {
  return (
    <section className="pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={category.url}
              className="group relative h-[550px] overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300 z-10"></div>
              
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <div className="absolute bottom-8 left-0 right-0 text-center z-20">
                <h5 className="text-white text-xl font-normal">{category.title}</h5>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}