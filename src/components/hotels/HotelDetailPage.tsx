// @ts-nocheck
import { Hotel } from '../../lib/directus';
import Image from 'next/image';
import { getAssetURL } from '../../lib/directus';
import DirectusImage from '../../../components/common/DirectusImage';

interface HotelDetailPageProps {
  hotel: Hotel;
}

export default function HotelDetailPage({ hotel }: HotelDetailPageProps) {
  const {
    name,
    location,
    description,
    main_image,
    gallery,
    price_from,
    currency,
    amenities,
    features,
    star_rating,
    rooms
  } = hotel;
  
  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency,
    });
    return formatter.format(price);
  };
  
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gray-900">
        <DirectusImage
          fileId={main_image}
          alt={name}
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-brooklyn mb-2">{name}</h1>
            <p className="text-xl opacity-90">{location}</p>
            {star_rating && (
              <div className="flex mt-2">
                {[...Array(star_rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 mr-1">★</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: description }} />
              
              {features && features.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-brooklyn mb-6">Besondere Merkmale</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                        {feature.description && <p className="text-gray-700">{feature.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {rooms && rooms.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-brooklyn mb-6">Unterkünfte</h2>
                  <div className="space-y-6">
                    {rooms.map((room) => (
                      <div key={room.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/3 h-64 md:h-auto relative">
                          {room.main_image && (
                            <DirectusImage
                              fileId={room.main_image}
                              alt={room.name}
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="p-6 md:w-2/3">
                          <h3 className="text-xl font-medium mb-2">{room.name}</h3>
                          <div className="flex items-center text-gray-600 mb-4">
                            <span className="mr-4">{room.size}</span>
                            <span className="mr-4">•</span>
                            <span>Bis zu {room.max_occupancy} {room.max_occupancy === 1 ? 'Person' : 'Personen'}</span>
                          </div>
                          <p className="text-gray-700 mb-4">{room.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {room.amenities && room.amenities.map((amenity, index) => (
                              <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-2xl font-medium text-brand-olive-600">
                              {formatPrice(room.price_per_night, room.currency)}
                              <span className="text-sm text-gray-500 font-normal"> / Nacht</span>
                            </span>
                            <button className="px-4 py-2 bg-brand-olive-500 text-white rounded-md">
                              Reservieren
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-brooklyn mb-4">Übersicht</h3>
                <p className="text-2xl font-medium text-brand-olive-600 mb-2">
                  ab {formatPrice(price_from, currency)}
                  <span className="text-sm text-gray-500 font-normal"> / Nacht</span>
                </p>
                {amenities && amenities.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Annehmlichkeiten</h4>
                    <ul className="space-y-2">
                      {amenities.map((amenity, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-brand-olive-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {hotel.coordinates && (
                <div className="mt-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-brooklyn mb-4">Lage</h3>
                  <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+93A27F(${hotel.coordinates.lng},${hotel.coordinates.lat})/${hotel.coordinates.lng},${hotel.coordinates.lat},13,0/600x600@2x?access_token=pk.eyJ1IjoiY2luY2luaG90ZWxzIiwiYSI6ImNsMXh4djR1cTA1OXAzbG1ueTB0ajQ2ZWsifQ.jjuqqkJO2VRNQ3QrjLmTZQ`}
                      alt={`Standort von ${name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-gray-700">{hotel.address || location}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery */}
      {gallery && gallery.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-brooklyn mb-6">Galerie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((item, index) => (
                <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                  <DirectusImage
                    fileId={item.image}
                    alt={item.alt || `${name} - Bild ${index + 1}`}
                    className="object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}