import Image from 'next/image';
import Link from 'next/link';

export default function WorldMapSection({
  title = "Explore Our World.",
  subtitle = "Enjoy a handpicked portfolio of one-of-a-kind properties across the globe",
  regions = [
    { id: 1, name: "North America", count: 6, position: { x: 19, y: 42 } },
    { id: 2, name: "Europe", count: 18, position: { x: 47, y: 29 } },
    { id: 3, name: "Asia", count: 4, position: { x: 72, y: 40 } },
    { id: 4, name: "Africa", count: 4, position: { x: 52, y: 71 } },
    { id: 5, name: "South America", count: 2, position: { x: 26, y: 71 } }
  ]
}) {
  return (
    <section className="py-16" style={{ backgroundColor: "#f1f3ee" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-3 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-normal mb-3">{title}</h2>
            <p className="text-gray-700 mb-4 text-sm">{subtitle}</p>
            <Link 
              href="/hotels"
              className="inline-block px-6 py-2 border border-black text-black rounded-md hover:bg-black hover:text-white transition-colors text-sm w-fit"
            >
              All Hotels
            </Link>
          </div>
          
          <div className="md:col-span-9 relative">
            <div className="relative w-full h-[350px] md:h-[450px]">
              <Image
                src="/images/world-map.webp"
                alt="World Map with Hotel Locations"
                fill
                sizes="(max-width: 768px) 100vw, 75vw"
                className="object-contain"
                style={{ filter: 'opacity(0.4) grayscale(0.5)' }}
              />
              
              {regions.map((region) => (
                <div
                  key={region.id}
                  className="absolute"
                  style={{
                    left: `${region.position.x}%`,
                    top: `${region.position.y}%`
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-7 h-7 bg-black text-white flex items-center justify-center mr-2 text-sm">
                      {region.count}
                    </div>
                    <p className="text-black text-sm whitespace-nowrap">{region.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}