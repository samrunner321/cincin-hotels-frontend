/**
 * Mock-Daten für Hotels
 */

export const mockHotels = [
  {
    id: '1',
    status: 'published',
    name: 'Hotel Schgaguler',
    slug: 'hotel-schgaguler',
    subtitle: 'Mountain Luxury Retreat',
    location: 'Castelrotto, Italy',
    region: 'alps',
    short_description: 'Modern alpine luxury with minimalist design and stunning Dolomite views.',
    description: `
      Hotel Schgaguler is a family-owned boutique hotel located in the heart of the Dolomites. 
      The recently renovated hotel combines minimalist design with warm alpine hospitality, 
      creating a unique atmosphere that celebrates the surrounding mountain landscape.
      
      The architecture, reimagined by Peter Pichler, features clean lines and a monochromatic 
      scheme that lets the natural beauty of the Dolomites take center stage.
    `,
    coordinates: { lat: 46.5698, lng: 11.5583 },
    address: 'Dorfstraße 15',
    zip: '39040',
    city: 'Castelrotto',
    country: 'Italy',
    main_image: {
      id: 'hotel-schgaguler-main',
      title: 'Hotel Schgaguler Exterior',
      description: 'Modern facade of Hotel Schgaguler with Dolomites in background',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'schgaguler-room',
          title: 'Deluxe Room',
          description: 'Minimalist deluxe room with mountain views',
          width: 1400,
          height: 950
        },
        alt: 'Minimalist deluxe room with mountain views',
        caption: 'Our Deluxe Rooms feature panoramic windows framing the Dolomites'
      },
      {
        image: {
          id: 'schgaguler-spa',
          title: 'Spa Area',
          description: 'Indoor pool with mountain views',
          width: 1400,
          height: 950
        },
        alt: 'Indoor pool with mountain views',
        caption: 'Wellness area with indoor pool and sauna'
      }
    ],
    price_from: 350,
    currency: 'EUR',
    price_notes: 'Per night, breakfast included',
    star_rating: 4,
    user_rating: 4.8,
    review_count: 256,
    year_built: 1986,
    year_renovated: 2018,
    room_count: 42,
    amenities: [
      'free-wifi', 
      'spa', 
      'restaurant', 
      'bar', 
      'room-service', 
      'fitness-center', 
      'parking', 
      'airport-shuttle'
    ],
    features: [
      {
        title: 'Alpine Spa',
        description: 'Indoor pool, saunas, steam baths, and treatments inspired by Alpine traditions',
        icon: 'spa'
      },
      {
        title: 'Gourmet Restaurant',
        description: 'Fine dining with regional and international cuisine featuring local ingredients',
        icon: 'restaurant'
      }
    ],
    categories: ['luxury', 'mountain', 'design'],
    tags: ['ski', 'hiking', 'wellness', 'architecture'],
    destination: '1',
    is_featured: true,
    is_new: false,
    date_created: '2022-05-15T14:30:00Z',
    date_updated: '2023-11-20T09:45:00Z'
  },
  {
    id: '2',
    status: 'published',
    name: 'Hotel Giardino',
    slug: 'hotel-giardino',
    subtitle: 'Mediterranean Elegance',
    location: 'Ascona, Switzerland',
    region: 'mediterranean',
    short_description: 'Lush garden retreat on Lake Maggiore with timeless Mediterranean charm.',
    description: `
      Hotel Giardino Ascona is a five-star resort nestled in a Mediterranean park landscape on the shores of Lake Maggiore.
      The property combines the laid-back ambience of the Mediterranean with Swiss precision and quality.
      
      Surrounded by lush gardens and with views of the nearby mountains, this luxury retreat offers a perfect
      blend of relaxation, culinary excellence, and wellness in a stylish setting.
    `,
    coordinates: { lat: 46.1557, lng: 8.7683 },
    address: 'Via del Segnale 10',
    zip: '6612',
    city: 'Ascona',
    country: 'Switzerland',
    main_image: {
      id: 'hotel-giardino-main',
      title: 'Hotel Giardino Exterior',
      description: 'Hotel Giardino surrounded by lush Mediterranean gardens',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'giardino-pool',
          title: 'Pool Area',
          description: 'Outdoor pool surrounded by palm trees',
          width: 1400,
          height: 950
        },
        alt: 'Outdoor pool surrounded by palm trees',
        caption: 'Our outdoor pool area is a peaceful oasis'
      },
      {
        image: {
          id: 'giardino-suite',
          title: 'Luxury Suite',
          description: 'Elegant suite with terrace',
          width: 1400,
          height: 950
        },
        alt: 'Elegant suite with terrace',
        caption: 'Spacious suites with private terraces overlooking the gardens'
      }
    ],
    price_from: 450,
    currency: 'CHF',
    price_notes: 'Per night, breakfast included',
    star_rating: 5,
    user_rating: 4.9,
    review_count: 312,
    year_built: 1980,
    year_renovated: 2017,
    room_count: 72,
    amenities: [
      'free-wifi', 
      'spa', 
      'restaurant', 
      'bar', 
      'room-service', 
      'fitness-center', 
      'parking', 
      'pool', 
      'tennis'
    ],
    features: [
      {
        title: 'Dipiù Spa',
        description: 'Holistic wellness center with indoor and outdoor treatments',
        icon: 'spa'
      },
      {
        title: 'Michelin-Starred Restaurant',
        description: 'Fine dining at Ecco Ascona, awarded two Michelin stars',
        icon: 'restaurant'
      }
    ],
    categories: ['luxury', 'lakeside', 'gourmet'],
    tags: ['swimming', 'golf', 'wellness', 'gourmet'],
    destination: '2',
    is_featured: true,
    is_new: false,
    date_created: '2022-03-10T11:15:00Z',
    date_updated: '2023-10-05T16:30:00Z'
  },
  {
    id: '3',
    status: 'published',
    name: 'RockResort',
    slug: 'hotel-rockresort',
    subtitle: 'Alpine Architecture',
    location: 'Laax, Switzerland',
    region: 'alps',
    short_description: 'Contemporary design apartments in the heart of a premier Swiss ski resort.',
    description: `
      The rocksresort in Laax represents innovative Alpine architecture at its finest.
      These designer apartments combine sleek, minimalist aesthetics with natural local materials,
      particularly the distinctive Vals quartzite that forms the exterior.
      
      Located directly at the cable car station, the resort offers ski-in/ski-out convenience
      and serves as a perfect base for year-round mountain adventures.
    `,
    coordinates: { lat: 46.8369, lng: 9.2681 },
    address: 'Via Murschetg 15',
    zip: '7032',
    city: 'Laax',
    country: 'Switzerland',
    main_image: {
      id: 'rockresort-main',
      title: 'rocksresort Exterior',
      description: 'Modern stone buildings of rocksresort with mountains in background',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'rockresort-apartment',
          title: 'Premium Apartment',
          description: 'Contemporary apartment with wooden elements',
          width: 1400,
          height: 950
        },
        alt: 'Contemporary apartment with wooden elements',
        caption: 'Our Premium Apartments feature natural materials and modern design'
      },
      {
        image: {
          id: 'rockresort-winter',
          title: 'Winter Panorama',
          description: 'rocksresort during winter season with snow',
          width: 1400,
          height: 950
        },
        alt: 'rocksresort during winter season with snow',
        caption: 'Direct access to the slopes from your apartment'
      }
    ],
    price_from: 300,
    currency: 'CHF',
    price_notes: 'Per night, self-catering',
    star_rating: 4,
    user_rating: 4.7,
    review_count: 189,
    year_built: 2009,
    year_renovated: null,
    room_count: 121,
    amenities: [
      'free-wifi', 
      'restaurants', 
      'bars', 
      'ski-storage', 
      'parking', 
      'shops'
    ],
    features: [
      {
        title: 'Ski-in/Ski-out',
        description: 'Direct access to the Laax ski area with over 224 km of slopes',
        icon: 'skiing'
      },
      {
        title: 'Sustainable Design',
        description: 'Award-winning architecture using local materials and energy-efficient systems',
        icon: 'eco'
      }
    ],
    categories: ['design', 'mountain', 'self-catering'],
    tags: ['ski', 'snowboard', 'hiking', 'mountain-biking', 'architecture'],
    destination: '3',
    is_featured: false,
    is_new: false,
    date_created: '2022-01-20T10:00:00Z',
    date_updated: '2023-09-15T14:20:00Z'
  },
  {
    id: '4',
    status: 'published',
    name: 'Hotel Aurora',
    slug: 'hotel-aurora',
    subtitle: 'Urban Elegance',
    location: 'Munich, Germany',
    region: 'central_europe',
    short_description: 'Modern luxury in the heart of Munich with impeccable service.',
    description: `
      Hotel Aurora brings contemporary elegance to the historic center of Munich.
      Located just steps from Marienplatz, this boutique hotel combines sophisticated 
      design with traditional Bavarian hospitality.
      
      The carefully renovated 19th-century building houses spacious rooms and suites
      featuring modern amenities while preserving historical architectural elements.
    `,
    coordinates: { lat: 48.1371, lng: 11.5754 },
    address: 'Maximilianstrasse 17',
    zip: '80539',
    city: 'Munich',
    country: 'Germany',
    main_image: {
      id: 'hotel-aurora-main',
      title: 'Hotel Aurora Facade',
      description: 'Historic facade of Hotel Aurora in Munich city center',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'aurora-lobby',
          title: 'Elegant Lobby',
          description: 'Modernist lobby with traditional elements',
          width: 1400,
          height: 950
        },
        alt: 'Modernist lobby with traditional elements',
        caption: 'Our welcoming lobby blends contemporary design with Bavarian touches'
      },
      {
        image: {
          id: 'aurora-suite',
          title: 'Executive Suite',
          description: 'Spacious suite with city views',
          width: 1400,
          height: 950
        },
        alt: 'Spacious suite with city views',
        caption: 'Executive suites offer panoramic views of Munich'
      }
    ],
    price_from: 380,
    currency: 'EUR',
    price_notes: 'Per night, breakfast included',
    star_rating: 5,
    user_rating: 4.8,
    review_count: 276,
    year_built: 1895,
    year_renovated: 2019,
    room_count: 63,
    amenities: [
      'free-wifi', 
      'spa', 
      'restaurant', 
      'bar', 
      'room-service', 
      'fitness-center', 
      'concierge', 
      'valet-parking'
    ],
    features: [
      {
        title: 'Rooftop Restaurant',
        description: 'Fine dining with panoramic views of Munich\'s skyline and the Alps',
        icon: 'restaurant'
      },
      {
        title: 'Urban Spa Retreat',
        description: 'Luxury wellness area with indoor pool, saunas, and exclusive treatments',
        icon: 'spa'
      }
    ],
    categories: ['luxury', 'city', 'design'],
    tags: ['business', 'culture', 'shopping', 'gastronomy'],
    destination: '4',
    is_featured: true,
    is_new: false,
    date_created: '2022-04-05T16:45:00Z',
    date_updated: '2023-11-10T12:35:00Z'
  },
  {
    id: '5',
    status: 'published',
    name: 'Forestis Dolomites',
    slug: 'forestis-dolomites',
    subtitle: 'Mountain Sanctuary',
    location: 'Brixen, Italy',
    region: 'alps',
    short_description: 'Exclusive retreat in the Dolomites focused on nature, wellbeing and mindfulness.',
    description: `
      Perched at 1,800 meters above sea level in the UNESCO World Heritage Dolomites, 
      Forestis is a sanctuary for body and soul. Originally built as a sanatorium in 1912,
      the building has been transformed into an adults-only retreat that harnesses the 
      healing power of the mountains.
      
      The minimalist design emphasizes natural materials like local wood and stone, while 
      floor-to-ceiling windows in all spaces frame the spectacular mountain panorama.
    `,
    coordinates: { lat: 46.7364, lng: 11.7218 },
    address: 'Palmschoß 22',
    zip: '39042',
    city: 'Brixen',
    country: 'Italy',
    main_image: {
      id: 'forestis-main',
      title: 'Forestis Exterior',
      description: 'Forestis hotel with panoramic Dolomites views',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'forestis-suite',
          title: 'Luxury Suite',
          description: 'Minimalist suite with panoramic windows',
          width: 1400,
          height: 950
        },
        alt: 'Minimalist suite with panoramic windows',
        caption: 'Every suite features panoramic views of the Dolomites'
      },
      {
        image: {
          id: 'forestis-pool',
          title: 'Infinity Pool',
          description: 'Indoor-outdoor pool with mountain views',
          width: 1400,
          height: 950
        },
        alt: 'Indoor-outdoor pool with mountain views',
        caption: 'Our indoor-outdoor pool connects you with the alpine environment'
      }
    ],
    price_from: 550,
    currency: 'EUR',
    price_notes: 'Per night, half-board included',
    star_rating: 5,
    user_rating: 4.9,
    review_count: 145,
    year_built: 1912,
    year_renovated: 2020,
    room_count: 62,
    amenities: [
      'free-wifi', 
      'spa', 
      'restaurant', 
      'bar', 
      'room-service', 
      'fitness-center', 
      'yoga', 
      'parking'
    ],
    features: [
      {
        title: 'Forest Spa',
        description: 'Holistic wellness concept based on local Tyrolean elements and traditions',
        icon: 'spa'
      },
      {
        title: 'Sustainable Luxury',
        description: 'Eco-friendly operations including geothermal heating and mountain spring water',
        icon: 'eco'
      }
    ],
    categories: ['luxury', 'wellness', 'adults-only'],
    tags: ['hiking', 'meditation', 'yoga', 'sustainable', 'nature'],
    destination: '1',
    is_featured: true,
    is_new: true,
    date_created: '2022-06-30T08:20:00Z',
    date_updated: '2023-12-01T15:10:00Z'
  },
  {
    id: '6',
    status: 'draft',
    name: 'Marina Bay Resort',
    slug: 'marina-bay-resort',
    subtitle: 'Coastal Luxury',
    location: 'Portofino, Italy',
    region: 'mediterranean',
    short_description: 'Exclusive seaside resort with private beach and marina access.',
    description: `
      Marina Bay Resort is nestled in the picturesque harbor of Portofino.
      This exclusive property offers unparalleled views of the Mediterranean,
      direct access to a private beach, and its own marina for guests arriving by sea.
      
      The resort combines traditional Italian coastal architecture with modern luxury,
      creating a sophisticated yet relaxed atmosphere.
    `,
    coordinates: { lat: 44.3016, lng: 9.2097 },
    address: 'Via del Mare 23',
    zip: '16034',
    city: 'Portofino',
    country: 'Italy',
    main_image: {
      id: 'marina-bay-main',
      title: 'Marina Bay View',
      description: 'Marina Bay Resort with Portofino harbor view',
      width: 1600,
      height: 1080
    },
    price_from: 680,
    currency: 'EUR',
    price_notes: 'Per night, breakfast included',
    star_rating: 5,
    categories: ['luxury', 'beach', 'exclusive'],
    tags: ['sailing', 'beach', 'swimming', 'gastronomy'],
    destination: '5',
    is_featured: false,
    is_new: true,
    date_created: '2023-10-15T14:30:00Z',
    date_updated: '2023-11-25T09:45:00Z'
  }
];

export default mockHotels;