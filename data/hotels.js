/**
 * Mock hotel data
 */
export const hotels = [
  {
    id: '1',
    name: 'The Cōmodo',
    slug: 'the-comodo',
    location: 'Bad Gastein, Austria',
    region: 'Alps',
    description: 'A midcentury-inspired mountain retreat with farm-to-table dining, a full spa with thermal waters, and a curated art collection. Perfect for families and wellness enthusiasts.',
    longDescription: `
      The Cōmodo is nestled in the historic spa town of Bad Gastein, where Belle Époque architecture meets the dramatic Alpine landscape. This reimagined grand hotel combines midcentury design with contemporary comforts to create a stylish mountain retreat.

      The hotel features spacious rooms and suites with panoramic mountain views, warm wood elements, and thoughtfully curated furnishings. The restaurant emphasizes local and seasonal ingredients from Alpine producers, creating a farm-to-table dining experience that celebrates Austrian cuisine with modern touches.

      The extensive spa facilities include a thermal water pool that draws from Bad Gastein's renowned healing springs, a Finnish sauna, steam bath, and treatment rooms offering a range of therapeutic and wellness services. For art enthusiasts, the hotel houses a carefully curated collection of contemporary works that complement the architecture and natural setting.

      During winter, The Cōmodo offers direct access to the Gastein Valley ski area, while summer brings opportunities for hiking, mountain biking, and exploring the region's natural beauty. The hotel welcomes families with dedicated programs and facilities for younger guests.
    `,
    price: {
      currency: 'EUR',
      amount: 325,
      unit: 'night',
    },
    rating: 4.8,
    reviewCount: 124,
    amenities: [
      'Thermal Spa',
      'Farm-to-Table Restaurant',
      'Art Collection',
      'Mountain Views',
      'Ski Storage',
      'Free WiFi',
      'Family Programs'
    ],
    images: [
      '/images/hotels/comodo/main.jpg',
      '/images/hotels/comodo/room.jpg',
      '/images/hotels/comodo/spa.jpg',
      '/images/hotels/comodo/restaurant.jpg',
      '/images/hotels/comodo/exterior.jpg'
    ],
    categories: ['Mountains', 'Spa', 'Design', 'Family'],
    featured: true,
    new: true,
    coordinates: {
      lat: 47.1133,
      lng: 13.1356
    }
  },
  {
    id: '2',
    name: 'Schgaguler Hotel',
    slug: 'schgaguler-hotel',
    location: 'Castelrotto, South Tyrol, Italy',
    region: 'Dolomites',
    description: 'A minimalist mountain retreat in the heart of the Dolomites, featuring clean architectural lines, panoramic views, and a focus on local materials and cuisine.',
    longDescription: `
      The Schgaguler Hotel represents a harmonious blend of Alpine tradition and minimalist modernity. Located in the charming village of Castelrotto in South Tyrol, this family-run boutique hotel was completely redesigned by architect Peter Pichler to create a striking contemporary statement that remains in dialogue with its spectacular Dolomite setting.

      The hotel's 42 rooms and suites embody understated luxury with their clean lines, natural materials, and panoramic windows that frame the mountain views. Local materials including larch wood, linen, and natural stone create a serene atmosphere that connects guests to the surroundings.

      The culinary experience centers on South Tyrolean specialties enhanced with Mediterranean influences, emphasizing locally sourced, seasonal ingredients. The wine selection showcases the exceptional producers of the region.

      The spa area offers a peaceful retreat with an indoor pool, various saunas, steam bath, and treatment rooms where guests can enjoy therapies using Alpine herbs and ingredients. In winter, the hotel provides easy access to the Alpe di Siusi ski area, while summer invites exploration of the UNESCO World Heritage Dolomites through hiking, biking, and climbing.
    `,
    price: {
      currency: 'EUR',
      amount: 390,
      unit: 'night',
    },
    rating: 4.9,
    reviewCount: 87,
    amenities: [
      'Mountain Views',
      'Spa & Wellness',
      'Gourmet Restaurant',
      'Indoor Pool',
      'Ski Storage',
      'Free WiFi',
      'Electric Car Charging'
    ],
    images: [
      '/images/hotels/schgaguler/main.jpg',
      '/images/hotels/schgaguler/room.jpg',
      '/images/hotels/schgaguler/spa.jpg',
      '/images/hotels/schgaguler/restaurant.jpg',
      '/images/hotels/schgaguler/exterior.jpg'
    ],
    categories: ['Mountains', 'Design', 'Spa', 'Boutique'],
    featured: true,
    new: false,
    coordinates: {
      lat: 46.5698,
      lng: 11.5583
    }
  },
  {
    id: '3',
    name: 'Casa Cook Samos',
    slug: 'casa-cook-samos',
    location: 'Samos, Greece',
    region: 'Greek Islands',
    description: 'A bohemian beachfront retreat on the Aegean island of Samos, offering a laid-back atmosphere with private terraces, swim-up rooms, and a focus on wellbeing.',
    longDescription: `
      Casa Cook Samos is nestled on the island's northern coast, where the mountains meet the clear waters of the Aegean Sea. The resort's architecture draws inspiration from traditional Greek villages, with cubic structures cascading down the hillside toward the beach.

      The 128 rooms and suites feature a bohemian-minimalist aesthetic with natural textures, earthy tones, and handcrafted details. Many accommodations offer private terraces with swim-up pool access, hammocks, and panoramic sea views, creating personal sanctuaries for relaxation.

      Culinary offerings celebrate Greek and Mediterranean flavors, with an emphasis on fresh, locally sourced ingredients. The beachfront restaurant and bar provide the perfect setting for dining with spectacular views, while the poolside bar offers refreshments throughout the day.

      The wellness area includes a spacious gym, yoga deck, and spa facilities offering treatments inspired by ancient Greek healing traditions. The resort's multiple swimming pools, including an expansive main pool, provide ample space for cooling off under the Mediterranean sun.

      Casa Cook Samos embraces its natural surroundings with access to a beautiful beach and proximity to the island's rich cultural heritage, including ancient ruins, traditional villages, and lush landscapes perfect for exploration.
    `,
    price: {
      currency: 'EUR',
      amount: 275,
      unit: 'night',
    },
    rating: 4.7,
    reviewCount: 112,
    amenities: [
      'Beachfront',
      'Multiple Pools',
      'Spa & Wellness',
      'Yoga Classes',
      'Mediterranean Restaurant',
      'Free WiFi',
      'Air Conditioning'
    ],
    images: [
      '/images/hotels/casa-cook/main.jpg',
      '/images/hotels/casa-cook/room.jpg',
      '/images/hotels/casa-cook/pool.jpg',
      '/images/hotels/casa-cook/beach.jpg',
      '/images/hotels/casa-cook/restaurant.jpg'
    ],
    categories: ['Beach', 'Design', 'Spa', 'Adults-Only'],
    featured: true,
    new: false,
    coordinates: {
      lat: 37.7553,
      lng: 26.9789
    }
  },
  {
    id: '4',
    name: 'The Hoxton, Paris',
    slug: 'the-hoxton-paris',
    location: 'Paris, France',
    region: 'Western Europe',
    description: 'A stylish urban retreat in an 18th-century residence in the 2nd arrondissement, featuring industrial-chic design, vibrant public spaces, and a popular courtyard restaurant.',
    longDescription: `
      The Hoxton, Paris occupies a magnificent 18th-century residence in the city's 2nd arrondissement, combining historical Parisian grandeur with the brand's signature industrial-chic aesthetic. The hotel's façade and spiral staircases maintain their historic charm, while interiors showcase contemporary design with vintage touches.

      The 172 rooms come in various sizes, each thoughtfully designed with herringbone timber floors, bespoke rugs, and elegant French-inspired details. The comfortable beds with custom headboards and blackout curtains ensure a restful stay in the bustling city.

      At the heart of the hotel is Rivié, a restaurant serving French classics with modern interpretations, transitioning seamlessly from casual breakfast spot to buzzing dinner destination. The courtyard provides a coveted outdoor space rarely found in central Paris, while the Jacques' Bar offers craft cocktails in an intimate, Moroccan-inspired setting.

      The Hoxton's public areas serve as dynamic social spaces where guests and locals alike gather to work, meet, and relax. Its central location provides easy access to key attractions, shopping districts, and the distinctive character of the 2nd arrondissement with its historic passages and vibrant retail scene.
    `,
    price: {
      currency: 'EUR',
      amount: 245,
      unit: 'night',
    },
    rating: 4.5,
    reviewCount: 203,
    amenities: [
      'Restaurant',
      'Courtyard',
      'Cocktail Bar',
      'Meeting Spaces',
      'Free WiFi',
      'Air Conditioning',
      '24-Hour Front Desk'
    ],
    images: [
      '/images/hotels/hoxton-paris/main.jpg',
      '/images/hotels/hoxton-paris/room.jpg',
      '/images/hotels/hoxton-paris/restaurant.jpg',
      '/images/hotels/hoxton-paris/bar.jpg',
      '/images/hotels/hoxton-paris/courtyard.jpg'
    ],
    categories: ['City-Break', 'Design', 'Historic', 'Boutique'],
    featured: false,
    new: false,
    coordinates: {
      lat: 48.8697,
      lng: 2.3501
    }
  },
  {
    id: '5',
    name: 'Forestis',
    slug: 'forestis',
    location: 'Brixen, South Tyrol, Italy',
    region: 'Dolomites',
    description: 'A serene mountain sanctuary perched at 1,800 meters in the UNESCO World Heritage Dolomites, focused on natural wellness and featuring minimalist design that highlights the spectacular views.',
    longDescription: `
      Forestis sits on a sunny plateau at 1,800 meters above sea level, surrounded by the dramatic peaks of the UNESCO World Heritage Dolomites. Originally built as a sanatorium in 1912, the property has been transformed into a refined retreat that emphasizes the healing power of its natural setting.

      The hotel's architecture and design follow minimalist principles with floor-to-ceiling windows that frame the mountain panoramas, creating a seamless connection between indoor spaces and the Alpine environment. The 62 suites feature natural materials including local stone, native timbers, and linen textiles, complemented by understated luxury and contemporary comfort.

      The culinary philosophy centers on forest cuisine, incorporating foraged ingredients, ancient grains, and Alpine herbs into creative, nutritionally balanced dishes. The restaurant's panoramic setting enhances the dining experience with spectacular views throughout the day.

      Forestis distinguishes itself with a wellness concept based on the four elements of water, air, sun, and forest. The extensive spa facilities include pools, saunas, treatment rooms, and outdoor spaces for activities such as forest bathing and high-altitude meditation.

      Available year-round, the hotel offers direct access to skiing in winter and hiking trails in summer, providing guests with an immersive experience in the pristine natural environment of the Dolomites.
    `,
    price: {
      currency: 'EUR',
      amount: 450,
      unit: 'night',
    },
    rating: 4.9,
    reviewCount: 78,
    amenities: [
      'Mountain Views',
      'Spa & Wellness',
      'Indoor/Outdoor Pool',
      'Forest Cuisine Restaurant',
      'Meditation Areas',
      'Ski-In/Ski-Out',
      'Hiking Trails'
    ],
    images: [
      '/images/hotels/forestis/main.jpg',
      '/images/hotels/forestis/room.jpg',
      '/images/hotels/forestis/spa.jpg',
      '/images/hotels/forestis/pool.jpg',
      '/images/hotels/forestis/view.jpg'
    ],
    categories: ['Mountains', 'Spa', 'Design', 'Adults-Only'],
    featured: true,
    new: false,
    coordinates: {
      lat: 46.7145,
      lng: 11.6565
    }
  },
  {
    id: '6',
    name: 'Villa Honegg',
    slug: 'villa-honegg',
    location: 'Ennetbürgen, Switzerland',
    region: 'Swiss Alps',
    description: 'An exclusive art nouveau jewel perched above Lake Lucerne, featuring an iconic infinity pool, refined Swiss hospitality, and panoramic Alpine views.',
    longDescription: `
      Built in 1905 and completely renovated in 2011, Villa Honegg is an exceptional five-star boutique hotel positioned 914 meters above sea level on the Bürgenstock mountain. This intimate property combines the charm of its art nouveau heritage with contemporary luxury and technology.

      The hotel's 23 rooms and suites are individually designed with elegant furnishings, premium materials, and state-of-the-art amenities. Each accommodation offers spectacular views of either Lake Lucerne or the surrounding mountains through large windows that flood the spaces with natural light.

      The restaurant showcases modern Swiss cuisine using fresh, locally sourced ingredients, many from the hotel's own gardens. Guests can dine on the terrace with its breathtaking panoramic views or in the elegant interior dining room.

      Villa Honegg is perhaps best known for its heated outdoor infinity pool, which appears to merge with Lake Lucerne in the distance, creating a floating sensation enhanced by the majestic Alpine backdrop. The spa complex also includes an indoor pool, various saunas, steam rooms, and treatment areas.

      The property's exclusive atmosphere is maintained by its limited capacity and secluded location, providing privacy while remaining accessible to attractions around Lake Lucerne. Activities range from hiking and biking in summer to skiing and snowshoeing in winter, with the hotel offering personalized arrangements for guests.
    `,
    price: {
      currency: 'CHF',
      amount: 650,
      unit: 'night',
    },
    rating: 4.9,
    reviewCount: 91,
    amenities: [
      'Infinity Pool',
      'Panoramic Views',
      'Spa & Wellness',
      'Gourmet Restaurant',
      'Private Cinema',
      'Terrace',
      'Hiking Trails'
    ],
    images: [
      '/images/hotels/villa-honegg/main.jpg',
      '/images/hotels/villa-honegg/pool.jpg',
      '/images/hotels/villa-honegg/room.jpg',
      '/images/hotels/villa-honegg/restaurant.jpg',
      '/images/hotels/villa-honegg/view.jpg'
    ],
    categories: ['Mountains', 'Spa', 'Boutique', 'Fine-Dining'],
    featured: true,
    new: false,
    coordinates: {
      lat: 46.9956,
      lng: 8.3794
    }
  },
  {
    id: '7',
    name: 'NoMad London',
    slug: 'nomad-london',
    location: 'London, United Kingdom',
    region: 'Western Europe',
    description: 'A sophisticated urban retreat housed in a former magistrates\' court near Covent Garden, featuring theatrical design, a dramatic atrium restaurant, and artfully crafted cocktails.',
    longDescription: `
      NoMad London marks the brand\'s first international property, occupying the historic Bow Street Magistrates\' Court and Police Station in Covent Garden. The 19th-century building has been thoughtfully transformed to balance its storied past with contemporary luxury and the distinctive NoMad aesthetic.

      The hotel\'s 91 rooms and suites exhibit the brand\'s signature style with a residential feel, layered with custom furnishings, original artwork, and vintage elements. Freestanding bathtubs, well-stocked minibars, and Argan bathroom amenities enhance the guest experience.

      The culinary centerpiece is the restaurant situated in a three-story atrium with a soaring glass ceiling, lush greenery, and tiered seating creating a theatrical dining environment. The menu celebrates seasonal British ingredients through a refined American lens, while the adjacent Side Hustle offers a sophisticated take on British pub tradition with Mexican-inspired small plates.

      For cocktail enthusiasts, the Library offers an intimate space for daytime refreshments and evening libations, while Common Decency provides a subterranean lounge experience with innovative mixed drinks and late-night entertainment.

      The hotel's central location offers easy access to London's West End theaters, museums, shopping, and dining, making it an ideal base for exploring the cultural wealth of the city.
    `,
    price: {
      currency: 'GBP',
      amount: 455,
      unit: 'night',
    },
    rating: 4.7,
    reviewCount: 113,
    amenities: [
      'Atrium Restaurant',
      'Multiple Bars',
      'Fitness Center',
      'Room Service',
      'Free WiFi',
      'Air Conditioning',
      'Pet-Friendly'
    ],
    images: [
      '/images/hotels/nomad-london/main.jpg',
      '/images/hotels/nomad-london/room.jpg',
      '/images/hotels/nomad-london/restaurant.jpg',
      '/images/hotels/nomad-london/bar.jpg',
      '/images/hotels/nomad-london/suite.jpg'
    ],
    categories: ['City-Break', 'Design', 'Historic', 'Boutique'],
    featured: false,
    new: false,
    coordinates: {
      lat: 51.5129,
      lng: -0.1225
    }
  },
  {
    id: '8',
    name: 'Vigilius Mountain Resort',
    slug: 'vigilius-mountain-resort',
    location: 'Lana, South Tyrol, Italy',
    region: 'Dolomites',
    description: 'An eco-conscious mountain retreat accessible only by cable car, featuring minimalist architecture by Matteo Thun, a focus on sustainability, and stunning views of the South Tyrolean landscape.',
    longDescription: `
      Vigilius Mountain Resort sits at an elevation of 1,500 meters on Monte San Vigilio, accessible only by cable car, which immediately separates guests from the pace of everyday life. Designed by acclaimed architect Matteo Thun, the resort embodies an eco-minimalist philosophy that harmonizes with its Alpine surroundings.

      The hotel's architecture emphasizes natural materials including local timber, glass, and clay, with energy-efficient systems that minimize environmental impact. The 41 rooms and suites continue this theme with clean lines, panoramic windows, and timber elements that create a warm, serene atmosphere.

      Culinary offerings include two distinct restaurants: Restaurant 1500 for gourmet dining featuring modern interpretations of regional specialties, and the more casual Stube Ida serving traditional South Tyrolean dishes. Both emphasize local, seasonal ingredients that reflect the mountain terroir.

      The expansive spa area draws inspiration from the mountain's natural elements, offering indoor and outdoor pools, saunas, steam baths, and treatment rooms where guests can enjoy therapies using Alpine herbs and ingredients. The surrounding landscape provides a natural fitness arena with hiking trails in summer and skiing in winter.

      Vigilius demonstrates a comprehensive commitment to sustainability through its architecture, operations, and programming, offering guests an opportunity to experience luxury hospitality in harmony with nature.
    `,
    price: {
      currency: 'EUR',
      amount: 385,
      unit: 'night',
    },
    rating: 4.8,
    reviewCount: 95,
    amenities: [
      'Mountain Views',
      'Spa & Wellness',
      'Indoor/Outdoor Pools',
      'Sustainable Architecture',
      'Hiking Trails',
      'Two Restaurants',
      'Cable Car Access'
    ],
    images: [
      '/images/hotels/vigilius/main.jpg',
      '/images/hotels/vigilius/room.jpg',
      '/images/hotels/vigilius/spa.jpg',
      '/images/hotels/vigilius/restaurant.jpg',
      '/images/hotels/vigilius/exterior.jpg'
    ],
    categories: ['Mountains', 'Spa', 'Design', 'Boutique'],
    featured: false,
    new: false,
    coordinates: {
      lat: 46.6167,
      lng: 11.1333
    }
  },
  {
    id: '9',
    name: 'Le Cheval Blanc St-Tropez',
    slug: 'cheval-blanc-st-tropez',
    location: 'Saint-Tropez, France',
    region: 'French Riviera',
    description: 'An elegant beachfront maison overlooking the Mediterranean, offering refined luxury with a private beach, Guerlain spa, and a three-Michelin-star restaurant.',
    longDescription: `
      Cheval Blanc St-Tropez occupies a prime position along the French Riviera, combining the intimate atmosphere of a private residence with the exceptional service and amenities of an ultra-luxury hotel. The maison's clean white façade and blue accents reflect the colors of the Mediterranean that stretches before it.

      The 30 rooms and suites are individually designed with a refined nautical aesthetic, featuring custom furnishings, contemporary artwork, and elegant textiles. Most accommodations offer sea views, while the terrace spaces provide private outdoor living areas overlooking the bay.

      Culinary excellence is central to the experience, highlighted by La Vague d\'Or, the three-Michelin-star restaurant helmed by Chef Arnaud Donckele. His creative Mediterranean cuisine celebrates the finest local ingredients through artistic presentation and complex, harmonious flavors. The more casual La Terrasse offers all-day dining with spectacular views.

      The Cheval Blanc Spa features exclusive treatments by Guerlain, tailored to rejuvenate after sun-filled days on the Riviera. The hotel's private beach provides a serene setting for relaxation, with attentive service and water activities available for more active guests.

      The maison's location offers easy access to the vibrant village of Saint-Tropez with its charming streets, boutiques, and cultural attractions, while providing a tranquil retreat from the summer crowds.
    `,
    price: {
      currency: 'EUR',
      amount: 1250,
      unit: 'night',
    },
    rating: 4.9,
    reviewCount: 72,
    amenities: [
      'Private Beach',
      'Three-Michelin-Star Restaurant',
      'Guerlain Spa',
      'Infinity Pool',
      'Water Sports',
      'Fitness Center',
      'Limousine Service'
    ],
    images: [
      '/images/hotels/cheval-blanc/main.jpg',
      '/images/hotels/cheval-blanc/room.jpg',
      '/images/hotels/cheval-blanc/restaurant.jpg',
      '/images/hotels/cheval-blanc/beach.jpg',
      '/images/hotels/cheval-blanc/pool.jpg'
    ],
    categories: ['Beach', 'Fine-Dining', 'Spa', 'Boutique'],
    featured: true,
    new: false,
    coordinates: {
      lat: 43.2731,
      lng: 6.6389
    }
  },
  {
    id: '10',
    name: 'Michelberger Hotel',
    slug: 'michelberger-hotel',
    location: 'Berlin, Germany',
    region: 'Central Europe',
    description: 'A creative, independent hotel in a former factory in Berlin\'s Friedrichshain district, featuring eclectic design, a vibrant courtyard, and a community-focused approach to hospitality.',
    longDescription: `
      The Michelberger Hotel occupies a converted factory building in Berlin\'s vibrant Friedrichshain neighborhood, just steps from the Oberbaum Bridge and the River Spree. This independent hotel has developed a distinctive personality that reflects Berlin\'s creative spirit and community-oriented values.

      The 132 rooms span various categories with unique designs, from cozy hideaways to spacious lofts. Each features custom furnishings, playful details, and thoughtful amenities including organic toiletries and locally sourced refreshments. The design aesthetic combines vintage elements with contemporary touches, creating spaces that feel both comfortable and inspiring.

      The restaurant focuses on seasonal, organic ingredients, many from the hotel's own farm outside Berlin, prepared with creativity and respect for their natural qualities. The courtyard serves as a social hub where guests and locals gather for coffee, cocktails, and conversation amid lush greenery and relaxed seating.

      Rather than traditional hotel facilities, the Michelberger offers experiences that connect guests with Berlin's authentic culture. These include wellness activities like yoga and sauna sessions, cultural programming featuring local artists and musicians, and insider recommendations for exploring the city's lesser-known aspects.

      The hotel's location in Friedrichshain provides easy access to Berlin's renowned nightlife, independent shops, and cultural venues, while its position near public transportation connects guests to the wider city.
    `,
    price: {
      currency: 'EUR',
      amount: 155,
      unit: 'night',
    },
    rating: 4.6,
    reviewCount: 247,
    amenities: [
      'Restaurant & Bar',
      'Courtyard',
      'Sauna',
      'Live Events',
      'Free WiFi',
      'Organic Breakfast',
      'Bicycle Rental'
    ],
    images: [
      '/images/hotels/michelberger/main.jpg',
      '/images/hotels/michelberger/room.jpg',
      '/images/hotels/michelberger/restaurant.jpg',
      '/images/hotels/michelberger/courtyard.jpg',
      '/images/hotels/michelberger/bar.jpg'
    ],
    categories: ['City-Break', 'Design', 'Boutique'],
    featured: false,
    new: false,
    coordinates: {
      lat: 52.5051,
      lng: 13.4481
    }
  }
];