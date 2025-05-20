/**
 * Mock-Daten für Destinations
 */

export const mockDestinations = [
  {
    id: '1',
    status: 'published',
    name: 'South Tyrol',
    slug: 'south-tyrol',
    subtitle: 'Where Alpine and Mediterranean cultures meet',
    country: 'Italy',
    region: 'alps',
    short_description: 'Experience the unique blend of Austrian and Italian culture in the breathtaking Dolomites.',
    description: `
      South Tyrol (Alto Adige) is Italy's northernmost province where Italian and Austrian cultures 
      harmoniously blend against the dramatic backdrop of the Dolomites. This autonomous region offers 
      a unique cultural experience with three official languages - Italian, German, and Ladin.
      
      Known for its exceptional cuisine that fuses Alpine and Mediterranean influences, South Tyrol
      boasts more Michelin-starred restaurants per capita than any other region in Italy. The area is
      also famous for its excellent wines, particularly the crisp white wines from its high-altitude vineyards.
      
      Throughout the year, visitors can enjoy outdoor activities from skiing in world-class resorts in winter
      to hiking, mountain biking, and climbing during the warmer months. The striking landscapes of the
      UNESCO-protected Dolomites provide a stunning setting for all activities.
    `,
    coordinates: { lat: 46.4983, lng: 11.3548 },
    main_image: {
      id: 'south-tyrol-main',
      title: 'Dolomites Panorama',
      description: 'Panoramic view of the Dolomites in South Tyrol',
      width: 1600,
      height: 900
    },
    gallery: [
      {
        image: {
          id: 'south-tyrol-summer',
          title: 'Alpine Meadows',
          description: 'Green alpine meadows with mountain backdrop',
          width: 1400,
          height: 950
        },
        alt: 'Green alpine meadows with mountain backdrop',
        caption: 'Alpe di Siusi in summer is a hiker\'s paradise',
        season: 'summer'
      },
      {
        image: {
          id: 'south-tyrol-winter',
          title: 'Winter Wonderland',
          description: 'Snowy mountain landscape with chalets',
          width: 1400,
          height: 950
        },
        alt: 'Snowy mountain landscape with chalets',
        caption: 'The Dolomites transform into a magical winter landscape',
        season: 'winter'
      }
    ],
    highlights: [
      {
        title: 'UNESCO World Heritage Dolomites',
        description: 'Explore some of the most dramatic mountain scenery in Europe',
        icon: 'mountains'
      },
      {
        title: 'Fusion Cuisine',
        description: 'Experience the unique blend of Alpine and Mediterranean flavors',
        icon: 'restaurant'
      },
      {
        title: 'Alpine Architecture',
        description: 'Discover distinctive mountain buildings both traditional and contemporary',
        icon: 'architecture'
      }
    ],
    activities: [
      {
        title: 'Hiking & Trekking',
        description: 'Extensive network of well-marked trails for all levels',
        season: 'summer',
        image: {
          id: 'south-tyrol-hiking',
          title: 'Hiking Trails',
          description: 'Hikers on alpine trail',
          width: 1200,
          height: 800
        }
      },
      {
        title: 'Skiing & Snowboarding',
        description: 'World-class ski resorts including Dolomiti Superski area',
        season: 'winter',
        image: {
          id: 'south-tyrol-skiing',
          title: 'Ski Resort',
          description: 'Skiers on slope with mountain backdrop',
          width: 1200,
          height: 800
        }
      }
    ],
    dining: [
      {
        name: 'AlpiNN',
        description: 'Modern alpine cuisine by chef Norbert Niederkofler',
        cuisine: 'Alpine, Italian',
        price_range: '$$$',
        address: 'Kronplatz, 39038 San Vigilio di Marebbe',
        image: {
          id: 'south-tyrol-alpinn',
          title: 'AlpiNN Restaurant',
          description: 'Modern restaurant with panoramic views',
          width: 1200,
          height: 800
        }
      },
      {
        name: 'Hubertus',
        description: 'Gourmet dining highlighting local ingredients',
        cuisine: 'Alpine, Mediterranean',
        price_range: '$$$',
        address: 'Via Furcia 5, 39036 Valdaora',
        image: {
          id: 'south-tyrol-hubertus',
          title: 'Hubertus Restaurant',
          description: 'Elegant dining room with mountain views',
          width: 1200,
          height: 800
        }
      }
    ],
    travel_info: [
      {
        category: 'transportation',
        title: 'Getting Around',
        description: 'South Tyrol has an efficient public transportation system with trains and buses connecting major towns. A regional Mobilcard gives unlimited travel on all public transport.'
      },
      {
        category: 'climate',
        title: 'Weather & Climate',
        description: 'South Tyrol enjoys a unique microclimate with Mediterranean influences and Alpine features. Summers are warm with cool evenings, while winters are cold with reliable snowfall at higher elevations.'
      }
    ],
    weather: [
      {
        season: 'winter',
        temp_low: -5,
        temp_high: 5,
        precipitation: 'Snow',
        description: 'Cold with regular snowfall, perfect for winter sports'
      },
      {
        season: 'summer',
        temp_low: 12,
        temp_high: 25,
        precipitation: 'Occasional rain',
        description: 'Warm sunny days with cool evenings, ideal for hiking'
      }
    ],
    categories: ['mountains', 'culture', 'gastronomy'],
    tags: ['dolomites', 'skiing', 'hiking', 'wine', 'architecture'],
    is_featured: true,
    is_popular: true,
    date_created: '2022-04-15T10:30:00Z',
    date_updated: '2023-11-10T15:45:00Z'
  },
  {
    id: '2',
    status: 'published',
    name: 'Lake Maggiore',
    slug: 'lake-maggiore',
    subtitle: 'Italian-Swiss Lakeside Elegance',
    country: 'Switzerland/Italy',
    region: 'mediterranean',
    short_description: 'Discover the perfect blend of Alpine scenery and Mediterranean atmosphere on the shores of stunning Lake Maggiore.',
    description: `
      Lake Maggiore, the second largest lake in Italy, straddles the border between Italy and Switzerland,
      creating a unique cultural landscape where Swiss efficiency meets Italian charm. The lake's 
      microclimate supports lush Mediterranean vegetation including palm trees, azaleas, and camellias,
      despite being nestled at the foot of the Alps.
      
      The shoreline is dotted with elegant belle époque hotels, historic villas with magnificent gardens,
      and charming fishing villages. The famous Borromean Islands in the Italian part of the lake feature
      baroque palaces and terraced gardens, while the Swiss side offers a more intimate experience with
      picturesque towns like Ascona and Locarno.
      
      Year-round, Lake Maggiore provides opportunities for relaxation and recreation. In summer, the lake
      becomes a hub for water activities, while the surrounding mountains offer hiking and mountain biking.
      In the cooler months, visitors can enjoy the mild climate, cultural attractions, and the proximity
      to Alpine ski resorts.
    `,
    coordinates: { lat: 45.9677, lng: 8.6550 },
    main_image: {
      id: 'lake-maggiore-main',
      title: 'Lake Maggiore Panorama',
      description: 'Panoramic view of Lake Maggiore with mountains in background',
      width: 1600,
      height: 900
    },
    gallery: [
      {
        image: {
          id: 'lake-maggiore-islands',
          title: 'Borromean Islands',
          description: 'Isola Bella with baroque palace and terraced gardens',
          width: 1400,
          height: 950
        },
        alt: 'Isola Bella with baroque palace and terraced gardens',
        caption: 'The magnificent Borromean Islands are a must-visit attraction',
        season: 'summer'
      },
      {
        image: {
          id: 'lake-maggiore-ascona',
          title: 'Ascona Promenade',
          description: 'Colorful waterfront promenade in Ascona',
          width: 1400,
          height: 950
        },
        alt: 'Colorful waterfront promenade in Ascona',
        caption: 'The picturesque promenade of Ascona on the Swiss side',
        season: 'summer'
      }
    ],
    highlights: [
      {
        title: 'Borromean Islands',
        description: 'Visit these jewels of the lake with their palaces and botanical gardens',
        icon: 'island'
      },
      {
        title: 'Mediterranean Gardens',
        description: 'Explore stunning lakeside gardens featuring subtropical plants',
        icon: 'garden'
      },
      {
        title: 'Lakeside Promenades',
        description: 'Stroll along elegant waterfronts in historic towns',
        icon: 'walk'
      }
    ],
    activities: [
      {
        title: 'Boating & Sailing',
        description: 'Discover the lake from the water with a variety of boat trips and rentals',
        season: 'summer',
        image: {
          id: 'lake-maggiore-sailing',
          title: 'Sailing on the Lake',
          description: 'Sailboats on Lake Maggiore',
          width: 1200,
          height: 800
        }
      },
      {
        title: 'Botanical Gardens',
        description: 'Visit Villa Taranto, Villa Pallavicino, and the gardens of Isola Bella',
        season: 'spring',
        image: {
          id: 'lake-maggiore-gardens',
          title: 'Villa Taranto Gardens',
          description: 'Flowering gardens with water features',
          width: 1200,
          height: 800
        }
      }
    ],
    dining: [
      {
        name: 'Ristorante Verbano',
        description: 'Romantic lakeside dining on Isola dei Pescatori',
        cuisine: 'Italian, Seafood',
        price_range: '$$$',
        address: 'Via Ugo Ara, 2, 28838 Isola dei Pescatori',
        image: {
          id: 'lake-maggiore-verbano',
          title: 'Ristorante Verbano',
          description: 'Restaurant terrace with lake view',
          width: 1200,
          height: 800
        }
      },
      {
        name: 'Locanda Oelia',
        description: 'Refined cuisine using local ingredients with a contemporary twist',
        cuisine: 'Mediterranean, Swiss',
        price_range: '$$$$',
        address: 'Via Muraccio 142, 6612 Ascona',
        image: {
          id: 'lake-maggiore-oelia',
          title: 'Locanda Oelia',
          description: 'Elegant dining room with garden',
          width: 1200,
          height: 800
        }
      }
    ],
    travel_info: [
      {
        category: 'transportation',
        title: 'Lake Navigation',
        description: 'Regular ferry services connect towns and attractions around the lake, including the Borromean Islands. Private boat rentals are also available.'
      },
      {
        category: 'best_time',
        title: 'Best Time to Visit',
        description: 'April to October offers the most pleasant weather, with spring (April-June) being particularly beautiful when the gardens are in bloom. September provides warm days with fewer crowds.'
      }
    ],
    weather: [
      {
        season: 'winter',
        temp_low: 0,
        temp_high: 8,
        precipitation: 'Occasional rain',
        description: 'Mild compared to nearby Alpine regions, with rainy days and occasional light snow'
      },
      {
        season: 'summer',
        temp_low: 16,
        temp_high: 28,
        precipitation: 'Occasional thunderstorms',
        description: 'Warm and sunny with refreshing lake breezes, perfect for water activities'
      }
    ],
    categories: ['lakeside', 'gardens', 'culture'],
    tags: ['islands', 'boating', 'history', 'villas', 'gardens'],
    is_featured: true,
    is_popular: true,
    date_created: '2022-05-20T14:15:00Z',
    date_updated: '2023-10-05T11:30:00Z'
  },
  {
    id: '3',
    status: 'published',
    name: 'Swiss Alps',
    slug: 'swiss-alps',
    subtitle: 'Alpine Excellence',
    country: 'Switzerland',
    region: 'alps',
    short_description: 'Experience the majesty of the Swiss Alps with their dramatic peaks, pristine villages, and world-class outdoor activities.',
    description: `
      The Swiss Alps represent the heart of Alpine culture and adventure in Europe. Spanning across
      Switzerland, this iconic mountain range features some of the continent's highest peaks, 
      including the Matterhorn and Jungfrau, alongside pristine valleys, glaciers, and lakes.
      
      Swiss Alpine villages combine fairy-tale charm with sophisticated infrastructure, offering 
      an authentic mountain experience without compromising on comfort or accessibility. Traditional
      wooden chalets with flower-adorned balconies sit alongside contemporary alpine architecture.
      
      The region is a paradise for outdoor enthusiasts in every season. Winter transforms the mountains
      into a wonderland for skiing, snowboarding, and other snow sports, while summer opens up endless
      possibilities for hiking, mountain biking, and climbing. Throughout the year, visitors can enjoy
      breathtaking scenic train journeys, including the famous Glacier Express and Bernina Express.
    `,
    coordinates: { lat: 46.8182, lng: 8.2275 },
    main_image: {
      id: 'swiss-alps-main',
      title: 'Swiss Alps Panorama',
      description: 'Panoramic view of snow-capped Swiss Alps',
      width: 1600,
      height: 900
    },
    gallery: [
      {
        image: {
          id: 'swiss-alps-summer',
          title: 'Alpine Summer',
          description: 'Green alpine meadows with typical Swiss chalet',
          width: 1400,
          height: 950
        },
        alt: 'Green alpine meadows with typical Swiss chalet',
        caption: 'Summer brings lush green landscapes and wildflowers',
        season: 'summer'
      },
      {
        image: {
          id: 'swiss-alps-winter',
          title: 'Winter Sports Paradise',
          description: 'Ski resort with mountain backdrop',
          width: 1400,
          height: 950
        },
        alt: 'Ski resort with mountain backdrop',
        caption: 'World-class skiing and snowboarding throughout the winter season',
        season: 'winter'
      }
    ],
    highlights: [
      {
        title: 'Scenic Train Journeys',
        description: 'Experience breathtaking rail routes through the mountains',
        icon: 'train'
      },
      {
        title: 'Outdoor Adventure',
        description: 'Year-round activities from skiing to hiking and mountaineering',
        icon: 'adventure'
      },
      {
        title: 'Alpine Cuisine',
        description: 'Savor traditional Swiss mountain dishes and local specialties',
        icon: 'food'
      }
    ],
    activities: [
      {
        title: 'Skiing & Snowboarding',
        description: 'Access to some of Europe\'s best ski areas with reliable snow conditions',
        season: 'winter',
        image: {
          id: 'swiss-alps-skiing',
          title: 'Alpine Skiing',
          description: 'Skiers on perfectly groomed slopes',
          width: 1200,
          height: 800
        }
      },
      {
        title: 'Mountain Hiking',
        description: 'Extensive network of well-marked trails for all difficulty levels',
        season: 'summer',
        image: {
          id: 'swiss-alps-hiking',
          title: 'Alpine Trails',
          description: 'Hikers on mountain path with panoramic views',
          width: 1200,
          height: 800
        }
      }
    ],
    dining: [
      {
        name: 'Chez Vrony',
        description: 'Mountain restaurant serving traditional Swiss dishes with a modern twist',
        cuisine: 'Swiss, Alpine',
        price_range: '$$$',
        address: 'Findeln, 3920 Zermatt',
        image: {
          id: 'swiss-alps-vrony',
          title: 'Chez Vrony',
          description: 'Rustic mountain restaurant with Matterhorn views',
          width: 1200,
          height: 800
        }
      },
      {
        name: 'Gurtners Alpine Restaurant',
        description: 'Gourmet alpine cuisine using seasonal ingredients',
        cuisine: 'Swiss, European',
        price_range: '$$$$',
        address: 'Hörnlihütte, 7050 Arosa',
        image: {
          id: 'swiss-alps-gurtners',
          title: 'Gurtners',
          description: 'Modern alpine restaurant interior',
          width: 1200,
          height: 800
        }
      }
    ],
    travel_info: [
      {
        category: 'transportation',
        title: 'Getting Around',
        description: 'Switzerland has an excellent public transportation system with trains and buses connecting even remote mountain villages. The Swiss Travel Pass offers unlimited travel on the network.'
      },
      {
        category: 'best_time',
        title: 'Best Time to Visit',
        description: 'For winter sports, December to April offers the best snow conditions. For hiking and summer activities, June to September provides the most favorable weather.'
      }
    ],
    weather: [
      {
        season: 'winter',
        temp_low: -10,
        temp_high: 2,
        precipitation: 'Snow',
        description: 'Cold with regular snowfall, creating perfect conditions for winter sports'
      },
      {
        season: 'summer',
        temp_low: 10,
        temp_high: 22,
        precipitation: 'Occasional rain',
        description: 'Mild temperatures with clear mountain air, ideal for outdoor activities'
      }
    ],
    categories: ['mountains', 'outdoor', 'luxury'],
    tags: ['skiing', 'hiking', 'scenic', 'trains', 'nature'],
    is_featured: true,
    is_popular: true,
    date_created: '2022-03-10T09:45:00Z',
    date_updated: '2023-11-25T16:20:00Z'
  },
  {
    id: '4',
    status: 'published',
    name: 'Munich',
    slug: 'munich',
    subtitle: 'Bavarian Capital',
    country: 'Germany',
    region: 'central_europe',
    short_description: 'Discover a captivating blend of tradition and innovation in Bavaria\'s sophisticated capital city.',
    description: `
      Munich (München) embodies the perfect balance between Bavarian tradition and cosmopolitan sophistication.
      As the capital of Bavaria, it offers visitors a rich cultural experience with world-class museums,
      historic architecture, beautiful parks, and a thriving arts scene.
      
      The city is famous for its well-preserved historic center, where the Neo-Gothic New Town Hall dominates
      the Marienplatz. Just a few steps away, you can explore the twin-domed Frauenkirche cathedral, a symbol
      of the city, and wander through the bustling Viktualienmarkt food market with its colorful stalls.
      
      While deeply rooted in tradition, evidenced by its beer halls, lederhosen, and annual Oktoberfest celebration,
      Munich is also a forward-thinking city with a strong economic base. Home to major corporations like BMW and
      Siemens, it blends historic charm with modern innovation, creating a dynamic urban environment.
    `,
    coordinates: { lat: 48.1351, lng: 11.5820 },
    main_image: {
      id: 'munich-main',
      title: 'Munich Skyline',
      description: 'Panoramic view of Munich with the Alps in the background',
      width: 1600,
      height: 900
    },
    gallery: [
      {
        image: {
          id: 'munich-marienplatz',
          title: 'Marienplatz',
          description: 'Historic Marienplatz with New Town Hall',
          width: 1400,
          height: 950
        },
        alt: 'Historic Marienplatz with New Town Hall',
        caption: 'The heart of Munich\'s Old Town - Marienplatz with its famous Glockenspiel',
        season: 'all'
      },
      {
        image: {
          id: 'munich-englischer-garten',
          title: 'English Garden',
          description: 'Surfers on the Eisbach wave in English Garden',
          width: 1400,
          height: 950
        },
        alt: 'Surfers on the Eisbach wave in English Garden',
        caption: 'The unique urban surfing spot in Munich\'s expansive English Garden',
        season: 'summer'
      }
    ],
    highlights: [
      {
        title: 'Cultural Attractions',
        description: 'World-class museums, galleries, and historic sites',
        icon: 'museum'
      },
      {
        title: 'Beer Culture',
        description: 'Traditional beer halls and gardens offering authentic Bavarian experience',
        icon: 'beer'
      },
      {
        title: 'Green Spaces',
        description: 'Beautiful parks and gardens throughout the city',
        icon: 'park'
      }
    ],
    activities: [
      {
        title: 'Museum Hopping',
        description: 'Explore the Kunstareal district with its three Pinakothek art museums',
        season: 'all',
        image: {
          id: 'munich-museums',
          title: 'Alte Pinakothek',
          description: 'Famous art museum in Munich',
          width: 1200,
          height: 800
        }
      },
      {
        title: 'Beer Garden Experience',
        description: 'Enjoy traditional food and beer in atmospheric settings',
        season: 'summer',
        image: {
          id: 'munich-biergarten',
          title: 'Beer Garden',
          description: 'Traditional Bavarian beer garden with chestnut trees',
          width: 1200,
          height: 800
        }
      }
    ],
    dining: [
      {
        name: 'Tantris',
        description: 'Legendary fine dining restaurant with iconic 1970s architecture',
        cuisine: 'Contemporary European',
        price_range: '$$$$',
        address: 'Johann-Fichte-Straße 7, 80805 München',
        image: {
          id: 'munich-tantris',
          title: 'Tantris Restaurant',
          description: 'Iconic interior of Tantris restaurant',
          width: 1200,
          height: 800
        }
      },
      {
        name: 'Wirtshaus in der Au',
        description: 'Historic tavern serving authentic Bavarian cuisine',
        cuisine: 'Bavarian, German',
        price_range: '$$',
        address: 'Lilienstraße 51, 81669 München',
        image: {
          id: 'munich-wirtshaus',
          title: 'Wirtshaus in der Au',
          description: 'Traditional Bavarian tavern interior',
          width: 1200,
          height: 800
        }
      }
    ],
    travel_info: [
      {
        category: 'transportation',
        title: 'Public Transport',
        description: 'Munich has an excellent public transportation system with U-Bahn (subway), S-Bahn (suburban trains), trams, and buses. The MVV day ticket offers unlimited travel within the city.'
      },
      {
        category: 'best_time',
        title: 'Best Time to Visit',
        description: 'May through September offers pleasant weather for exploring the city. Late September to early October features the famous Oktoberfest. December is popular for Christmas markets.'
      }
    ],
    weather: [
      {
        season: 'winter',
        temp_low: -2,
        temp_high: 5,
        precipitation: 'Snow and rain',
        description: 'Cold with occasional snowfall, Christmas markets add warmth to the season'
      },
      {
        season: 'summer',
        temp_low: 14,
        temp_high: 25,
        precipitation: 'Occasional rain',
        description: 'Warm days ideal for beer gardens and outdoor activities'
      }
    ],
    categories: ['city', 'culture', 'gastronomy'],
    tags: ['museums', 'beer', 'architecture', 'shopping', 'parks'],
    is_featured: false,
    is_popular: true,
    date_created: '2022-06-12T13:20:00Z',
    date_updated: '2023-09-18T10:45:00Z'
  },
  {
    id: '5',
    status: 'published',
    name: 'Italian Riviera',
    slug: 'italian-riviera',
    subtitle: 'Coastal Elegance',
    country: 'Italy',
    region: 'mediterranean',
    short_description: 'Experience the timeless charm of colorful fishing villages, glamorous resorts, and crystal-clear waters along Italy\'s most enchanting coastline.',
    description: `
      The Italian Riviera, stretching from the French border to Tuscany along the Ligurian Sea,
      offers one of the Mediterranean's most beautiful and varied coastlines. This crescent-shaped
      strip of land is characterized by its dramatic landscape where the Maritime Alps and Apennine
      mountains meet the sea, creating steep cliffs, hidden coves, and picturesque harbors.
      
      The region is perhaps most famous for the Cinque Terre, five colorful fishing villages clinging
      to the cliffs and connected by scenic hiking paths. Equally stunning is Portofino, an exclusive
      harbor town with pastel-colored buildings surrounding its yacht-filled marina.
      
      Along the coast, you'll find a perfect blend of natural beauty, rich history, and delicious
      cuisine. The Italian Riviera is known for its seafood specialties, fragrant basil (the key
      ingredient in Ligurian pesto), and locally-produced olive oil and wine.
    `,
    coordinates: { lat: 44.1142, lng: 9.7800 },
    main_image: {
      id: 'italian-riviera-main',
      title: 'Italian Riviera Coastline',
      description: 'Aerial view of the colorful coastline of Cinque Terre',
      width: 1600,
      height: 900
    },
    gallery: [
      {
        image: {
          id: 'italian-riviera-portofino',
          title: 'Portofino Harbor',
          description: 'Colorful buildings around Portofino harbor',
          width: 1400,
          height: 950
        },
        alt: 'Colorful buildings around Portofino harbor',
        caption: 'The iconic harbor view of Portofino with its pastel-colored houses',
        season: 'summer'
      },
      {
        image: {
          id: 'italian-riviera-manarola',
          title: 'Manarola at Sunset',
          description: 'Cinque Terre village of Manarola glowing at sunset',
          width: 1400,
          height: 950
        },
        alt: 'Cinque Terre village of Manarola glowing at sunset',
        caption: 'Manarola, one of the five villages of Cinque Terre, is spectacular at sunset',
        season: 'summer'
      }
    ],
    highlights: [
      {
        title: 'Cinque Terre',
        description: 'Explore the five colorful villages connected by scenic hiking trails',
        icon: 'village'
      },
      {
        title: 'Coastal Cuisine',
        description: 'Savor fresh seafood and authentic Ligurian specialties like pesto',
        icon: 'food'
      },
      {
        title: 'Seaside Relaxation',
        description: 'Enjoy beautiful beaches and crystal-clear Mediterranean waters',
        icon: 'beach'
      }
    ],
    activities: [
      {
        title: 'Hiking the Sentiero Azzurro',
        description: 'Walk the famous "Blue Path" connecting the Cinque Terre villages',
        season: 'spring',
        image: {
          id: 'italian-riviera-trail',
          title: 'Cinque Terre Trail',
          description: 'Scenic coastal path between villages',
          width: 1200,
          height: 800
        }
      },
      {
        title: 'Sailing & Boat Tours',
        description: 'Experience the coastline from the water for the best views',
        season: 'summer',
        image: {
          id: 'italian-riviera-sailing',
          title: 'Coastal Sailing',
          description: 'Sailboat along the Italian Riviera coastline',
          width: 1200,
          height: 800
        }
      }
    ],
    dining: [
      {
        name: 'Ristorante Miky',
        description: 'Renowned seafood restaurant with creative Ligurian dishes',
        cuisine: 'Italian, Seafood',
        price_range: '$$$',
        address: 'Via Fegina 104, 19016 Monterosso al Mare',
        image: {
          id: 'italian-riviera-miky',
          title: 'Ristorante Miky',
          description: 'Elegant seafood dishes at Ristorante Miky',
          width: 1200,
          height: 800
        }
      },
      {
        name: 'Ristorante Puny',
        description: 'Classic Ligurian cuisine in the heart of Portofino',
        cuisine: 'Italian, Mediterranean',
        price_range: '$$$$',
        address: 'Piazza Martiri dell\'Olivetta 4, 16034 Portofino',
        image: {
          id: 'italian-riviera-puny',
          title: 'Ristorante Puny',
          description: 'Harborside dining at Puny in Portofino',
          width: 1200,
          height: 800
        }
      }
    ],
    travel_info: [
      {
        category: 'transportation',
        title: 'Coastal Transport',
        description: 'Regional trains connect major towns along the coast. In summer, ferry services are an excellent way to travel between coastal towns and enjoy the scenery from the water.'
      },
      {
        category: 'best_time',
        title: 'Best Time to Visit',
        description: 'Late April to June and September to October offer pleasant temperatures with fewer crowds. July and August are peak season with warmer weather but more tourists.'
      }
    ],
    weather: [
      {
        season: 'winter',
        temp_low: 6,
        temp_high: 13,
        precipitation: 'Occasional rain',
        description: 'Mild compared to northern Europe, with sunny days mixed with rainy periods'
      },
      {
        season: 'summer',
        temp_low: 20,
        temp_high: 30,
        precipitation: 'Rare rain',
        description: 'Hot and sunny, perfect for beach days and swimming'
      }
    ],
    categories: ['coastal', 'culture', 'gastronomy'],
    tags: ['villages', 'hiking', 'beaches', 'boats', 'seafood'],
    is_featured: true,
    is_popular: true,
    date_created: '2022-07-08T11:05:00Z',
    date_updated: '2023-08-30T14:15:00Z'
  },
  {
    id: '6',
    status: 'draft',
    name: 'Vienna',
    slug: 'vienna',
    subtitle: 'Imperial Elegance',
    country: 'Austria',
    region: 'central_europe',
    short_description: 'Discover the grandeur of the former Habsburg capital with its magnificent palaces, world-class music, and café culture.',
    description: `
      Vienna (Wien), Austria's capital, is a city steeped in imperial history while embracing contemporary
      culture and innovation. Once the center of the vast Habsburg Empire, Vienna retains its grand
      architecture, opulent palaces, and cultural traditions that reflect its historical significance.
      
      The city is renowned for its musical heritage, having been home to legendary composers like Mozart,
      Beethoven, and Strauss. Today, it maintains this tradition through world-class venues such as the
      Vienna State Opera and the Musikverein, home to the Vienna Philharmonic Orchestra.
      
      Equally important to Viennese culture is its café tradition. The historic coffee houses serve as
      institutions where time seems to stand still, offering a space for relaxation, reflection, and
      indulgence in exquisite pastries and coffee specialties.
    `,
    coordinates: { lat: 48.2082, lng: 16.3738 },
    main_image: {
      id: 'vienna-main',
      title: 'Vienna Cityscape',
      description: 'Panoramic view of Vienna with St. Stephen\'s Cathedral',
      width: 1600,
      height: 900
    },
    categories: ['city', 'culture', 'history'],
    tags: ['music', 'architecture', 'museums', 'coffee', 'imperial'],
    is_featured: false,
    is_popular: false,
    date_created: '2023-09-25T15:40:00Z',
    date_updated: '2023-10-30T12:20:00Z'
  }
];

export default mockDestinations;