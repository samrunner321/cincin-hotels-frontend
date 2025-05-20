/**
 * Mock-Daten für Zimmer
 */

export const mockRooms = [
  // Zimmer für Hotel Schgaguler (ID: 1)
  {
    id: '101',
    status: 'published',
    name: 'Alpine Suite',
    slug: 'alpine-suite-schgaguler',
    description: `
      Our Alpine Suite offers a harmonious blend of contemporary design and mountain atmosphere. 
      The spacious open-plan layout features floor-to-ceiling windows that frame spectacular views 
      of the Dolomites. Natural materials like local wood and stone create a warm, inviting 
      environment that connects you to the surrounding landscape.
      
      The suite includes a comfortable king-size bed with premium linens, a cozy seating area,
      and a private balcony where you can enjoy mountain vistas. The elegant bathroom features
      a freestanding bathtub, separate rain shower, and luxury amenities.
    `,
    size: '50 m²',
    max_occupancy: 2,
    bed_type: 'king',
    bed_count: 1,
    bathroom_count: 1,
    view_type: 'mountain',
    main_image: {
      id: 'schgaguler-alpine-suite',
      title: 'Alpine Suite',
      description: 'Minimalist alpine suite with panoramic mountain views',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'schgaguler-alpine-suite-bed',
          title: 'Suite Bedroom',
          description: 'King-size bed with mountain view',
          width: 1400,
          height: 950
        },
        alt: 'King-size bed with mountain view',
        caption: 'Premium king-size bed positioned to capture the mountain panorama'
      },
      {
        image: {
          id: 'schgaguler-alpine-suite-bath',
          title: 'Suite Bathroom',
          description: 'Minimalist bathroom with freestanding tub',
          width: 1400,
          height: 950
        },
        alt: 'Minimalist bathroom with freestanding tub',
        caption: 'Elegant bathroom with natural stone elements'
      }
    ],
    price_per_night: 550,
    currency: 'EUR',
    price_notes: 'Breakfast included, excluding local taxes',
    amenities: [
      'king-bed',
      'private-balcony',
      'mountain-view',
      'air-conditioning',
      'wifi',
      'minibar',
      'safe',
      'flat-screen-tv',
      'rainfall-shower',
      'bathrobes',
      'luxury-toiletries',
      'espresso-machine'
    ],
    features: [
      {
        title: 'Panoramic Mountain Views',
        description: 'Floor-to-ceiling windows framing spectacular Dolomite vistas'
      },
      {
        title: 'Luxury Bathroom',
        description: 'Featuring a freestanding bathtub and walk-in rainfall shower'
      }
    ],
    hotel: '1',
    is_featured: true,
    sort: 1,
    date_created: '2022-05-15T15:00:00Z',
    date_updated: '2023-11-20T10:15:00Z'
  },
  {
    id: '102',
    status: 'published',
    name: 'Deluxe Mountain Room',
    slug: 'deluxe-mountain-room-schgaguler',
    description: `
      Our Deluxe Mountain Room offers elegant comfort with a clean, minimalist design philosophy.
      The room features a refined neutral color palette and natural materials that create a 
      serene atmosphere inspired by the surrounding alpine landscape.
      
      Large windows flood the space with natural light and provide beautiful views of either
      the village or the mountains. The thoughtfully designed space includes a comfortable
      queen-size bed, a functional workspace, and a sophisticated bathroom with a walk-in shower.
    `,
    size: '30 m²',
    max_occupancy: 2,
    bed_type: 'queen',
    bed_count: 1,
    bathroom_count: 1,
    view_type: 'mountain',
    main_image: {
      id: 'schgaguler-deluxe-room',
      title: 'Deluxe Mountain Room',
      description: 'Elegant mountain-view room with minimalist design',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'schgaguler-deluxe-room-detail',
          title: 'Room Detail',
          description: 'Thoughtful design details in the Deluxe Room',
          width: 1400,
          height: 950
        },
        alt: 'Thoughtful design details in the Deluxe Room',
        caption: 'Carefully selected furnishings reflect the hotel\'s design ethos'
      }
    ],
    price_per_night: 350,
    currency: 'EUR',
    price_notes: 'Breakfast included, excluding local taxes',
    amenities: [
      'queen-bed',
      'mountain-view',
      'air-conditioning',
      'wifi',
      'minibar',
      'safe',
      'flat-screen-tv',
      'rainfall-shower',
      'bathrobes',
      'luxury-toiletries'
    ],
    features: [
      {
        title: 'Minimalist Alpine Design',
        description: 'Contemporary room featuring a refined aesthetic with natural materials'
      },
      {
        title: 'Luxurious Simplicity',
        description: 'Thoughtfully designed space that focuses on comfort and tranquility'
      }
    ],
    hotel: '1',
    is_featured: false,
    sort: 2,
    date_created: '2022-05-15T15:30:00Z',
    date_updated: '2023-11-20T10:30:00Z'
  },
  
  // Zimmer für Hotel Giardino (ID: 2)
  {
    id: '201',
    status: 'published',
    name: 'Mediterranean Suite',
    slug: 'mediterranean-suite-giardino',
    description: `
      Our Mediterranean Suite embodies the elegant spirit of Lake Maggiore with its sophisticated
      design and expansive living space. The suite opens onto a private terrace surrounded by 
      lush vegetation where you can enjoy panoramic views of our gardens and the lake beyond.
      
      Inside, the generously proportioned rooms feature a soothing color palette inspired by the
      natural surroundings. The suite includes a separate living area with designer furniture,
      a bedroom with a luxury king-size bed, and a spacious bathroom with both a freestanding
      bathtub and a rainfall shower.
    `,
    size: '65 m²',
    max_occupancy: 3,
    bed_type: 'king',
    bed_count: 1,
    bathroom_count: 1,
    view_type: 'lake',
    main_image: {
      id: 'giardino-suite',
      title: 'Mediterranean Suite',
      description: 'Elegant suite with private terrace and lake view',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'giardino-suite-terrace',
          title: 'Suite Terrace',
          description: 'Private terrace with lake views',
          width: 1400,
          height: 950
        },
        alt: 'Private terrace with lake views',
        caption: 'Your personal oasis overlooking Lake Maggiore'
      },
      {
        image: {
          id: 'giardino-suite-bathroom',
          title: 'Luxury Bathroom',
          description: 'Spa-like bathroom with freestanding tub',
          width: 1400,
          height: 950
        },
        alt: 'Spa-like bathroom with freestanding tub',
        caption: 'Indulge in our luxurious bathroom with premium amenities'
      }
    ],
    price_per_night: 750,
    currency: 'CHF',
    price_notes: 'Breakfast included, excluding local taxes',
    amenities: [
      'king-bed',
      'private-terrace',
      'lake-view',
      'separate-living-area',
      'air-conditioning',
      'wifi',
      'minibar',
      'safe',
      'flat-screen-tv',
      'rainfall-shower',
      'bathtub',
      'bathrobes',
      'luxury-toiletries',
      'espresso-machine',
      'turn-down-service'
    ],
    features: [
      {
        title: 'Private Lake-View Terrace',
        description: 'Spacious outdoor space with comfortable furniture and panoramic views'
      },
      {
        title: 'Separate Living Area',
        description: 'Elegantly furnished space ideal for relaxation or entertaining'
      }
    ],
    hotel: '2',
    is_featured: true,
    sort: 1,
    date_created: '2022-03-10T12:00:00Z',
    date_updated: '2023-10-05T17:00:00Z'
  },
  {
    id: '202',
    status: 'published',
    name: 'Garden View Room',
    slug: 'garden-view-room-giardino',
    description: `
      Our Garden View Room offers a tranquil retreat surrounded by the lush Mediterranean 
      vegetation that gives Hotel Giardino its name. These charming rooms feature a 
      harmonious design that blends contemporary comfort with classic elegance.
      
      Each room has its own balcony or terrace overlooking our beautifully landscaped gardens, 
      providing a peaceful setting to relax after a day of exploration. Inside, you'll find a 
      comfortable queen-size bed, a cozy sitting area, and a well-appointed bathroom with a 
      walk-in shower.
    `,
    size: '28 m²',
    max_occupancy: 2,
    bed_type: 'queen',
    bed_count: 1,
    bathroom_count: 1,
    view_type: 'garden',
    main_image: {
      id: 'giardino-garden-room',
      title: 'Garden View Room',
      description: 'Elegant room with balcony overlooking gardens',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'giardino-garden-room-balcony',
          title: 'Room Balcony',
          description: 'Private balcony with garden view',
          width: 1400,
          height: 950
        },
        alt: 'Private balcony with garden view',
        caption: 'Your private outdoor space surrounded by Mediterranean vegetation'
      }
    ],
    price_per_night: 450,
    currency: 'CHF',
    price_notes: 'Breakfast included, excluding local taxes',
    amenities: [
      'queen-bed',
      'balcony',
      'garden-view',
      'air-conditioning',
      'wifi',
      'minibar',
      'safe',
      'flat-screen-tv',
      'rainfall-shower',
      'bathrobes',
      'luxury-toiletries'
    ],
    features: [
      {
        title: 'Mediterranean Garden Setting',
        description: 'Room nestled within our lush landscaped gardens'
      },
      {
        title: 'Contemporary Comfort',
        description: 'Thoughtfully designed space combining elegance and functionality'
      }
    ],
    hotel: '2',
    is_featured: false,
    sort: 2,
    date_created: '2022-03-10T12:30:00Z',
    date_updated: '2023-10-05T17:30:00Z'
  },
  
  // Zimmer für RockResort (ID: 3)
  {
    id: '301',
    status: 'published',
    name: 'Alpine Apartment Premium',
    slug: 'alpine-apartment-premium-rockresort',
    description: `
      Our Alpine Apartment Premium offers contemporary mountain living with a focus on 
      sophisticated design and functionality. These spacious apartments feature an open-plan 
      living and dining area, a fully equipped kitchen, and spectacular views of the 
      surrounding Alpine landscape.
      
      Natural materials dominate the interior design, with local stone and wood creating a 
      warm, authentic atmosphere that complements the striking modern architecture. The 
      apartment includes a bedroom with a king-size bed, a comfortable living area with a 
      sofa bed, and a stylish bathroom with a walk-in shower.
    `,
    size: '60 m²',
    max_occupancy: 4,
    bed_type: 'king',
    bed_count: 1,
    bathroom_count: 1,
    view_type: 'mountain',
    main_image: {
      id: 'rockresort-premium',
      title: 'Alpine Apartment Premium',
      description: 'Modern apartment with mountain views',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'rockresort-premium-living',
          title: 'Living Area',
          description: 'Open-plan living space with contemporary design',
          width: 1400,
          height: 950
        },
        alt: 'Open-plan living space with contemporary design',
        caption: 'The stylish living area features panoramic windows'
      },
      {
        image: {
          id: 'rockresort-premium-kitchen',
          title: 'Kitchen',
          description: 'Modern fully equipped kitchen',
          width: 1400,
          height: 950
        },
        alt: 'Modern fully equipped kitchen',
        caption: 'The kitchen comes with high-quality appliances and all necessities'
      }
    ],
    price_per_night: 450,
    currency: 'CHF',
    price_notes: 'Self-catering, excluding local taxes',
    amenities: [
      'king-bed',
      'sofa-bed',
      'fully-equipped-kitchen',
      'dining-area',
      'mountain-view',
      'wifi',
      'flat-screen-tv',
      'rainfall-shower',
      'heated-floors',
      'ski-storage',
      'parking'
    ],
    features: [
      {
        title: 'Contemporary Alpine Design',
        description: 'Apartment featuring modern architecture with local materials'
      },
      {
        title: 'Fully Equipped Kitchen',
        description: 'High-quality kitchen with all necessary appliances and utensils'
      }
    ],
    hotel: '3',
    is_featured: true,
    sort: 1,
    date_created: '2022-01-20T10:30:00Z',
    date_updated: '2023-09-15T14:50:00Z'
  },
  {
    id: '302',
    status: 'published',
    name: 'Alpine Apartment Standard',
    slug: 'alpine-apartment-standard-rockresort',
    description: `
      Our Alpine Apartment Standard provides comfortable self-catering accommodation with the 
      signature rocksresort contemporary design. The apartment features clean lines, 
      natural materials, and thoughtful functionality throughout.
      
      The space includes a living area with a sofa bed, a well-equipped kitchenette, and a 
      double bedroom. Large windows provide plenty of natural light and views of either the 
      village or the mountains. The modern bathroom features a walk-in shower and heated floors.
    `,
    size: '40 m²',
    max_occupancy: 3,
    bed_type: 'queen',
    bed_count: 1,
    bathroom_count: 1,
    view_type: 'mountain',
    main_image: {
      id: 'rockresort-standard',
      title: 'Alpine Apartment Standard',
      description: 'Comfortable apartment with contemporary design',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'rockresort-standard-bedroom',
          title: 'Standard Bedroom',
          description: 'Modern bedroom with wooden elements',
          width: 1400,
          height: 950
        },
        alt: 'Modern bedroom with wooden elements',
        caption: 'The bedroom features premium bedding and ample storage'
      }
    ],
    price_per_night: 300,
    currency: 'CHF',
    price_notes: 'Self-catering, excluding local taxes',
    amenities: [
      'queen-bed',
      'sofa-bed',
      'kitchenette',
      'dining-area',
      'wifi',
      'flat-screen-tv',
      'rainfall-shower',
      'heated-floors',
      'ski-storage'
    ],
    features: [
      {
        title: 'Functional Design',
        description: 'Thoughtfully designed space maximizing comfort and practicality'
      },
      {
        title: 'Ski-in/Ski-out Access',
        description: 'Convenient location with direct access to the slopes'
      }
    ],
    hotel: '3',
    is_featured: false,
    sort: 2,
    date_created: '2022-01-20T11:00:00Z',
    date_updated: '2023-09-15T15:15:00Z'
  },
  
  // Zimmer für Hotel Aurora (ID: 4)
  {
    id: '401',
    status: 'published',
    name: 'Executive Suite',
    slug: 'executive-suite-aurora',
    description: `
      Our Executive Suite combines historical elegance with contemporary luxury in the heart 
      of Munich. Located on the upper floors of our hotel, these suites offer impressive city 
      views and generous living space for both relaxation and entertaining.
      
      The suite features a separate living room with elegant furnishings, a bedroom with a 
      king-size bed dressed in premium linens, and a luxurious marble bathroom with both a 
      freestanding bathtub and a walk-in rainfall shower. Original architectural details 
      like high ceilings and ornate moldings are complemented by sophisticated modern design.
    `,
    size: '70 m²',
    max_occupancy: 2,
    bed_type: 'king',
    bed_count: 1,
    bathroom_count: 1,
    view_type: 'city',
    main_image: {
      id: 'aurora-exec-suite',
      title: 'Executive Suite',
      description: 'Elegant suite with city views',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'aurora-exec-suite-living',
          title: 'Suite Living Room',
          description: 'Sophisticated living area with historic details',
          width: 1400,
          height: 950
        },
        alt: 'Sophisticated living area with historic details',
        caption: 'The separate living room offers plenty of space to relax or entertain'
      },
      {
        image: {
          id: 'aurora-exec-suite-bath',
          title: 'Marble Bathroom',
          description: 'Luxurious bathroom with freestanding tub',
          width: 1400,
          height: 950
        },
        alt: 'Luxurious bathroom with freestanding tub',
        caption: 'The marble bathroom combines classic and contemporary elements'
      }
    ],
    price_per_night: 650,
    currency: 'EUR',
    price_notes: 'Breakfast included, excluding local taxes',
    amenities: [
      'king-bed',
      'separate-living-room',
      'city-view',
      'air-conditioning',
      'wifi',
      'minibar',
      'safe',
      'flat-screen-tv',
      'rainfall-shower',
      'bathtub',
      'bathrobes',
      'luxury-toiletries',
      'espresso-machine',
      'turn-down-service',
      'concierge-service'
    ],
    features: [
      {
        title: 'Historic Elegance',
        description: 'Suite featuring original architectural details and modern luxury'
      },
      {
        title: 'Panoramic City Views',
        description: 'Upper floor location offering impressive views of Munich'
      }
    ],
    hotel: '4',
    is_featured: true,
    sort: 1,
    date_created: '2022-04-05T17:15:00Z',
    date_updated: '2023-11-10T13:00:00Z'
  },
  {
    id: '402',
    status: 'published',
    name: 'Deluxe City Room',
    slug: 'deluxe-city-room-aurora',
    description: `
      Our Deluxe City Room offers sophisticated comfort in the heart of Munich. Each room 
      combines elements of the building's 19th-century heritage with contemporary design and 
      modern amenities to create an elegant urban retreat.
      
      The rooms feature high ceilings and large windows that fill the space with natural light 
      and provide views of the city. A comfortable queen-size bed, a functional workspace, and 
      a stylish bathroom with a walk-in rainfall shower ensure both comfort and convenience 
      for business and leisure travelers alike.
    `,
    size: '32 m²',
    max_occupancy: 2,
    bed_type: 'queen',
    bed_count: 1,
    bathroom_count: 1,
    view_type: 'city',
    main_image: {
      id: 'aurora-deluxe-room',
      title: 'Deluxe City Room',
      description: 'Elegant room with city views',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'aurora-deluxe-room-detail',
          title: 'Room Detail',
          description: 'Sophisticated design details in the Deluxe Room',
          width: 1400,
          height: 950
        },
        alt: 'Sophisticated design details in the Deluxe Room',
        caption: 'Thoughtfully selected furnishings blend historic and contemporary elements'
      }
    ],
    price_per_night: 380,
    currency: 'EUR',
    price_notes: 'Breakfast included, excluding local taxes',
    amenities: [
      'queen-bed',
      'city-view',
      'air-conditioning',
      'wifi',
      'minibar',
      'safe',
      'flat-screen-tv',
      'rainfall-shower',
      'bathrobes',
      'luxury-toiletries',
      'workspace'
    ],
    features: [
      {
        title: 'Urban Sophistication',
        description: 'Elegant room blending historical elements with modern design'
      },
      {
        title: 'Central Location',
        description: 'Perfect base for exploring Munich\'s attractions'
      }
    ],
    hotel: '4',
    is_featured: false,
    sort: 2,
    date_created: '2022-04-05T17:45:00Z',
    date_updated: '2023-11-10T13:30:00Z'
  },
  
  // Zimmer für Forestis Dolomites (ID: 5)
  {
    id: '501',
    status: 'published',
    name: 'Mountain Penthouse Suite',
    slug: 'mountain-penthouse-suite-forestis',
    description: `
      Our Mountain Penthouse Suite represents the pinnacle of alpine luxury. Located on the 
      top floor, this expansive suite offers unparalleled panoramic views of the Dolomites 
      through floor-to-ceiling windows that showcase the majestic mountain landscape.
      
      The suite features a spacious open-plan living area with a fireplace, a dining space, 
      and a king-size bedroom area. The minimalist design employs natural materials including 
      local wood and stone, creating a sense of harmony with the surrounding nature. The 
      luxurious bathroom includes a freestanding bathtub positioned to enjoy the mountain views, 
      as well as a walk-in rainfall shower.
    `,
    size: '90 m²',
    max_occupancy: 2,
    bed_type: 'king',
    bed_count: 1,
    bathroom_count: 1,
    view_type: 'mountain',
    main_image: {
      id: 'forestis-penthouse',
      title: 'Mountain Penthouse Suite',
      description: 'Luxurious penthouse with panoramic Dolomite views',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'forestis-penthouse-living',
          title: 'Penthouse Living Area',
          description: 'Spacious living area with fireplace and mountain views',
          width: 1400,
          height: 950
        },
        alt: 'Spacious living area with fireplace and mountain views',
        caption: 'The open-plan living space features a cozy fireplace and panoramic windows'
      },
      {
        image: {
          id: 'forestis-penthouse-bath',
          title: 'Penthouse Bathroom',
          description: 'Luxury bathroom with mountain-view bathtub',
          width: 1400,
          height: 950
        },
        alt: 'Luxury bathroom with mountain-view bathtub',
        caption: 'Soak in the freestanding tub while enjoying the Dolomite panorama'
      }
    ],
    price_per_night: 950,
    currency: 'EUR',
    price_notes: 'Half-board included, excluding local taxes',
    amenities: [
      'king-bed',
      'panoramic-view',
      'fireplace',
      'private-terrace',
      'air-conditioning',
      'wifi',
      'minibar',
      'safe',
      'flat-screen-tv',
      'rainfall-shower',
      'bathtub',
      'bathrobes',
      'luxury-toiletries',
      'espresso-machine',
      'turn-down-service',
      'wellness-kit'
    ],
    features: [
      {
        title: 'Panoramic Dolomite Views',
        description: 'Floor-to-ceiling windows showcasing breathtaking mountain vistas'
      },
      {
        title: 'Minimalist Luxury',
        description: 'Sophisticated design using natural materials and subtle earth tones'
      }
    ],
    hotel: '5',
    is_featured: true,
    sort: 1,
    date_created: '2022-06-30T09:00:00Z',
    date_updated: '2023-12-01T15:45:00Z'
  },
  {
    id: '502',
    status: 'published',
    name: 'Forest Suite',
    slug: 'forest-suite-forestis',
    description: `
      Our Forest Suite embodies the Forestis philosophy of connecting with nature through 
      mindful design. The suite offers a tranquil sanctuary where contemporary minimalism 
      meets the natural beauty of the surrounding Dolomites.
      
      Floor-to-ceiling windows frame views of the ancient forest and mountains beyond, while 
      letting abundant natural light flow into the space. The suite features an open-plan 
      layout with a comfortable king-size bed, a sitting area, and a private balcony where 
      you can immerse yourself in the alpine atmosphere. The elegant bathroom includes a 
      rainfall shower and premium amenities.
    `,
    size: '55 m²',
    max_occupancy: 2,
    bed_type: 'king',
    bed_count: 1,
    bathroom_count: 1,
    view_type: 'mountain',
    main_image: {
      id: 'forestis-forest-suite',
      title: 'Forest Suite',
      description: 'Elegant suite with forest and mountain views',
      width: 1600,
      height: 1080
    },
    gallery: [
      {
        image: {
          id: 'forestis-forest-suite-view',
          title: 'Suite View',
          description: 'Panoramic forest and mountain view from the suite',
          width: 1400,
          height: 950
        },
        alt: 'Panoramic forest and mountain view from the suite',
        caption: 'Wake up to breathtaking views of the forested Dolomite landscape'
      }
    ],
    price_per_night: 550,
    currency: 'EUR',
    price_notes: 'Half-board included, excluding local taxes',
    amenities: [
      'king-bed',
      'mountain-view',
      'private-balcony',
      'air-conditioning',
      'wifi',
      'minibar',
      'safe',
      'flat-screen-tv',
      'rainfall-shower',
      'bathrobes',
      'luxury-toiletries',
      'espresso-machine',
      'wellness-kit'
    ],
    features: [
      {
        title: 'Connection to Nature',
        description: 'Suite designed to create harmony between indoor and outdoor environments'
      },
      {
        title: 'Mindful Minimalism',
        description: 'Thoughtful design that promotes tranquility and well-being'
      }
    ],
    hotel: '5',
    is_featured: false,
    sort: 2,
    date_created: '2022-06-30T09:30:00Z',
    date_updated: '2023-12-01T16:15:00Z'
  }
];

export default mockRooms;