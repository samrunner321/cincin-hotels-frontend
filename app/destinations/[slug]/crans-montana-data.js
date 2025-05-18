// Beispieldaten für Crans-Montana
export const cransMontanaData = {
  name: 'Crans-Montana',
  slug: 'crans-montana',
  country: 'Switzerland',
  region: 'Valais',
  elevation: "1,500m",
  coordinates: { lat: 46.3082, lng: 7.4794 },
  description: 'A sun-drenched Alpine playground offering breathtaking panoramic views of the Swiss Alps and Rhône Valley, where pristine skiing, world-class golf, and luxurious wellness experiences meet.',
  longDescription: `Perched at an altitude of 1,500 meters in the heart of the Swiss Alps, Crans-Montana is a sophisticated mountain destination that combines natural beauty with refined luxury. This sun-blessed plateau offers more than 300 days of sunshine per year and showcases one of Switzerland's most spectacular panoramas – a sweeping vista from the Matterhorn to Mont Blanc.

  Originally two separate villages that have grown together, Crans-Montana has evolved from a health retreat into a cosmopolitan Alpine resort while maintaining its authentic mountain charm. The destination boasts pristine ski slopes in winter, verdant hiking trails in summer, and the renowned Severiano Ballesteros golf course, which hosts the Omega European Masters annually.
  
  The resort's unique microclimate allows for a diverse landscape of Alpine lakes, forests, vineyards, and glaciers, all accessible within minutes. Luxury boutiques, gourmet restaurants, and vibrant après-ski venues complement the outdoor experiences, making Crans-Montana as appealing for its cultural and leisure offerings as for its natural splendor.
  
  Whether seeking adrenaline-pumping mountain sports, tranquil nature walks, or indulgent spa treatments, visitors to Crans-Montana discover a year-round Alpine destination that masterfully balances adventure and relaxation in a setting of extraordinary natural beauty.`,
  image: '/images/hotels/hotel-1.jpg',
  heroImage: '/images/hotels/hotel-1.jpg',
  seasonalImages: {
    winter: '/images/hotels/hotel-2.jpg',
    spring: '/images/hotels/hotel-3.jpg',
    summer: '/images/hotels/hotel-4.jpg',
    autumn: '/images/hotels/hotel-5.jpg',
  },
  hotels: [
    {
      id: 1,
      name: 'Chetzeron',
      location: 'Crans-Montana',
      description: 'A transformed ski gondola station perched at 2,112m, offering panoramic Alpine views and ski-in/ski-out access.',
      image: '/images/hotels/hotel-1.jpg',
      imageNight: '/images/hotels/hotel-5.jpg',
      price: '€€€€',
      url: '/hotels/chetzeron',
      features: ['Panoramic Views', 'Ski-in/Ski-out', 'Restaurant', 'Spa']
    },
    {
      id: 2,
      name: 'LeCrans Hotel & Spa',
      location: 'Crans-Montana',
      description: 'An intimate luxury chalet hotel featuring themed suites, exceptional gastronomy, and a holistic spa.',
      image: '/images/hotels/hotel-2.jpg',
      imageNight: '/images/hotels/hotel-6.jpg',
      price: '€€€€€',
      url: '/hotels/lecrans-hotel-spa',
      features: ['Gourmet Dining', 'Spa', 'Private Balconies', 'Wine Cellar']
    },
    {
      id: 3,
      name: 'Hotel Guarda Golf',
      location: 'Crans-Montana',
      description: 'Refined luxury overlooking the famous Severiano Ballesteros golf course with ski access and Michelin-starred dining.',
      image: '/images/hotels/hotel-3.jpg',
      imageNight: '/images/hotels/hotel-7.jpg',
      price: '€€€€',
      url: '/hotels/guarda-golf',
      features: ['Golf Course Access', 'Michelin Restaurant', 'Pool', 'Family Friendly']
    },
    {
      id: 4,
      name: 'Crans Ambassador',
      location: 'Crans-Montana',
      description: 'Contemporary Alpine elegance with dramatic floor-to-ceiling windows showcasing mountain vistas.',
      image: '/images/hotels/hotel-4.jpg',
      imageNight: '/images/hotels/hotel-1.jpg',
      price: '€€€',
      url: '/hotels/crans-ambassador',
      features: ['Panoramic Views', 'Modern Design', 'Wellness Center', 'Cocktail Bar']
    }
  ],
  dining: {
    restaurants: [
      {
        name: "Le Mont Blanc",
        cuisine: "Fine Dining",
        description: "Michelin-starred restaurant offering innovative interpretations of Swiss classics with a panoramic Alpine backdrop.",
        image: "/images/hotels/hotel-5.jpg",
        priceRange: "€€€€",
        location: "LeCrans Hotel & Spa",
        coordinates: { x: 32, y: 40 }
      },
      {
        name: "Cervin",
        cuisine: "Swiss Traditional",
        description: "Cozy mountain restaurant specializing in authentic Valais dishes like raclette and fondue in a rustic Alpine setting.",
        image: "/images/hotels/hotel-6.jpg",
        priceRange: "€€",
        location: "Montana Village Center",
        coordinates: { x: 65, y: 38 }
      },
      {
        name: "Chetzeron Restaurant",
        cuisine: "Modern Alpine",
        description: "Breathtaking dining at 2,112m elevation, featuring seasonal ingredients and stunning terrace views of the Alps.",
        image: "/images/hotels/hotel-7.jpg",
        priceRange: "€€€",
        location: "Chetzeron Hotel",
        coordinates: { x: 22, y: 18 }
      },
      {
        name: "Giardino Gourmand",
        cuisine: "Italian",
        description: "Refined Italian cuisine using premium ingredients, served in an elegant setting with a beautiful garden terrace.",
        image: "/images/hotels/hotel-1.jpg",
        priceRange: "€€€",
        location: "Crans Center",
        coordinates: { x: 38, y: 45 }
      },
      {
        name: "La Desalpe",
        cuisine: "Farm-to-Table",
        description: "Charming restaurant serving fresh Alpine cuisine sourced directly from local farmers and the restaurant's own garden.",
        image: "/images/hotels/hotel-2.jpg",
        priceRange: "€€",
        location: "Aminona",
        coordinates: { x: 85, y: 52 }
      }
    ],
    signatureDishes: [
      {
        name: "Raclette du Valais AOP",
        restaurant: "Cervin",
        description: "Traditional melted Valais cheese scraped onto a plate and served with potatoes, pickles, and dried meat.",
        image: "/images/hotels/hotel-3.jpg"
      },
      {
        name: "Perch Filets from Lac Léman",
        restaurant: "Le Mont Blanc",
        description: "Delicate lake fish served with lemon butter sauce, accompanied by seasonal vegetables and wild rice.",
        image: "/images/hotels/hotel-4.jpg"
      },
      {
        name: "Alpine Herb Crusted Lamb",
        restaurant: "Chetzeron Restaurant",
        description: "Local lamb encrusted with mountain herbs, served with polenta and glazed root vegetables.",
        image: "/images/hotels/hotel-5.jpg"
      },
      {
        name: "Wild Mushroom Risotto",
        restaurant: "Giardino Gourmand",
        description: "Creamy risotto featuring foraged mushrooms from the Alpine forests, finished with Valais saffron.",
        image: "/images/hotels/hotel-6.jpg"
      },
      {
        name: "Tarte aux Myrtilles",
        restaurant: "La Desalpe",
        description: "Buttery pastry tart filled with wild Alpine blueberries, served with homemade vanilla ice cream.",
        image: "/images/hotels/hotel-7.jpg"
      },
      {
        name: "Dried Meat Platter",
        restaurant: "Cervin",
        description: "Selection of air-dried beef, cured ham, and Alpine sausages served with local cheese and rye bread.",
        image: "/images/hotels/hotel-1.jpg"
      }
    ],
    featuredChef: {
      name: "Pierre Crepaud",
      restaurant: "Le Mont Blanc at LeCrans Hotel",
      image: "/images/hotels/hotel-2.jpg",
      accolades: "Michelin Star, 17/20 Gault Millau",
      quote: "My cuisine is a reflection of these majestic mountains – bold, authentic, and rooted in the incredible ingredients that the Valais region provides throughout the seasons."
    }
  },
  activities: {
    winter: [
      {
        title: "Alpine Skiing & Snowboarding",
        description: "Explore 140km of immaculately groomed pistes across all difficulty levels, with spectacular views and reliable snow conditions thanks to the Plaine Morte Glacier.",
        duration: "Half/Full Day",
        difficulty: "All Levels",
        image: "/images/hotels/hotel-3.jpg",
        icon: "M6 21h12L12 3 6 21zm5-3.2v.2h2v-.2h-2zm0-3v2h2v-2h-2z",
        highlights: [
          "140km of pistes for all ability levels",
          "Modern lift system with minimal waiting times",
          "Spectacular views from the Plaine Morte Glacier at 3,000m",
          "Excellent ski schools for beginners",
          "Challenging black runs for advanced skiers"
        ],
        fullDescription: "Crans-Montana offers one of Switzerland's most diverse and scenic ski areas. With 140km of pistes reaching up to the Plaine Morte Glacier at 3,000m, skiers and snowboarders of all levels can find their perfect run. The south-facing location ensures plenty of sunshine, while modern snowmaking systems guarantee excellent conditions throughout the season. The resort is particularly known for its wide, cruising blue runs that are perfect for intermediate skiers looking to build confidence.",
        practical: {
          "Season": "December to April, with glacier skiing possible into May",
          "Lift Pass": "CHF 75 for adults (daily), various multi-day options available",
          "Equipment Rental": "Available throughout the resort from CHF 45/day",
          "Lessons": "Group and private lessons in multiple languages"
        }
      },
      {
        title: "Cross-Country Skiing",
        description: "Discover 15km of meticulously prepared cross-country trails winding through snow-covered forests and across frozen lakes.",
        duration: "2-4 Hours",
        difficulty: "Beginner to Advanced",
        image: "/images/hotels/hotel-4.jpg",
        icon: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm4 16v-4h-1v4h1zm3 0v-7h-1v7h1zm3 0v-10h-1v10h1zm3 0v-14h-1v14h1z",
        highlights: [
          "15km of trails through picturesque winter landscapes",
          "Both classic and skating styles supported",
          "Night skiing available on illuminated tracks",
          "Rental equipment and lessons available",
          "Special trails for beginners at Golf-Severiano-Ballesteros plateau"
        ]
      },
      {
        title: "Winter Hiking",
        description: "Experience the tranquility of the snow-covered Alps on 65km of prepared winter hiking trails suitable for all fitness levels.",
        duration: "1-6 Hours",
        difficulty: "Easy to Moderate",
        image: "/images/hotels/hotel-5.jpg",
        icon: "M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 5.28l-3.5 2.04v4.68c0 .84-1.18 1.5-2 1.5-1.02 0-2-.98-2-2v-3.68l-4.06-2.04c-.5-.25-.93-.78-.93-1.37 0-.83.8-1.5 1.74-1.28L11 10l3.24-1.42c.95-.2 1.76.48 1.76 1.28 0 .6-.44 1.15-.94 1.4z",
        highlights: [
          "Panoramic trails with spectacular mountain views",
          "Well-marked and maintained paths accessible to all",
          "Mountain restaurants and warming huts along routes",
          "Special sunrise hikes with breakfast at mountain restaurants",
          "Guided tours available with local experts"
        ]
      },
      {
        title: "Ice Skating",
        description: "Glide across the ice while surrounded by mountain views at Crans-Montana's central ice rink or on the magical frozen surface of Lac Grenon.",
        duration: "1-2 Hours",
        difficulty: "All Levels",
        image: "/images/hotels/hotel-6.jpg",
        icon: "M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z",
        highlights: [
          "Olympic-sized indoor rink in the sports center",
          "Natural ice skating on Lac Grenon when conditions permit",
          "Evening skating with lights and music",
          "Equipment rental available",
          "Lessons for beginners and children"
        ]
      }
    ],
    spring: [
      {
        title: "Spring Skiing",
        description: "Enjoy the unique pleasure of skiing in sunshine and mild temperatures on high-altitude slopes while flowers bloom in the valley below.",
        duration: "Half/Full Day",
        difficulty: "All Levels",
        image: "/images/hotels/hotel-7.jpg",
        highlights: [
          "Sun-drenched slopes with excellent snow conditions at higher elevations",
          "Fewer crowds and reduced lift pass prices",
          "Unforgettable skiing on the Plaine Morte Glacier",
          "Possibility to combine skiing with other spring activities",
          "Lively après-ski on sunny terraces"
        ]
      },
      {
        title: "Golf",
        description: "Tee off on world-class courses as they emerge from winter, with spectacular mountain backdrops enhancing every swing.",
        duration: "4-5 Hours",
        difficulty: "All Levels",
        image: "/images/hotels/hotel-1.jpg",
        highlights: [
          "Four 9-hole courses and the legendary Severiano Ballesteros 18-hole course",
          "Home to the Omega European Masters tournament",
          "Breathtaking views of the Alps from every hole",
          "Top-quality facilities including practice areas and professional instruction",
          "Special spring rates and packages"
        ]
      },
      {
        title: "Wildlife Watching",
        description: "Witness the Alpine awakening as marmots emerge from hibernation and ibex descend from higher elevations to graze on fresh spring growth.",
        duration: "3-4 Hours",
        difficulty: "Easy",
        image: "/images/hotels/hotel-2.jpg",
        highlights: [
          "Expert guided tours focused on Alpine wildlife",
          "Opportunities to observe marmots, ibex, chamois, and golden eagles",
          "Professional photography instruction available",
          "Educational content suitable for families with children",
          "Early morning tours for best wildlife viewing"
        ]
      },
      {
        title: "Botanical Walks",
        description: "Discover the extraordinary diversity of Alpine flora as colorful wildflowers transform the mountainsides after the snow melts.",
        duration: "2-3 Hours",
        difficulty: "Easy",
        image: "/images/hotels/hotel-3.jpg",
        highlights: [
          "Guided walks with botanical experts",
          "Identification of rare Alpine flowers and medicinal plants",
          "Photography opportunities for magnificent wildflower displays",
          "Educational content about Alpine ecosystems",
          "Tastings of traditional herb teas and plant-based products"
        ]
      }
    ],
    summer: [
      {
        title: "Hiking",
        description: "Explore over 300km of marked hiking trails through Alpine meadows, fragrant forests, and high mountain passes with breathtaking panoramas.",
        duration: "1-8 Hours",
        difficulty: "Easy to Challenging",
        image: "/images/hotels/hotel-4.jpg",
        highlights: [
          "Vast network of well-maintained and clearly marked trails",
          "Routes suitable for all ages and fitness levels",
          "Themed trails focusing on nature, history, and local culture",
          "Mountain huts and restaurants for refreshments along popular routes",
          "Guided group hikes available daily throughout summer"
        ]
      },
      {
        title: "Mountain Biking",
        description: "Experience the thrill of downhill runs or explore lengthy cross-country circuits through diverse Alpine terrain.",
        duration: "2-6 Hours",
        difficulty: "Beginner to Expert",
        image: "/images/hotels/hotel-5.jpg",
        highlights: [
          "177km of marked mountain bike trails",
          "Bike park with technically challenging downhill runs",
          "E-bike friendly routes with charging stations",
          "Bike rental and repair services throughout the resort",
          "Guided tours and skills courses for all levels"
        ]
      },
      {
        title: "Golf Championship",
        description: "Play on the legendary Severiano Ballesteros course, home to the Omega European Masters and one of Europe's most scenic golf venues.",
        duration: "4-5 Hours",
        difficulty: "Intermediate to Advanced",
        image: "/images/hotels/hotel-6.jpg",
        highlights: [
          "18-hole championship course designed by Severiano Ballesteros",
          "Spectacular Alpine views from every hole",
          "Top-quality practice facilities",
          "Professional instruction available",
          "Elegant clubhouse with exceptional dining"
        ]
      },
      {
        title: "Lake Activities",
        description: "Enjoy swimming, stand-up paddleboarding, and pedalos on Crans-Montana's five mountain lakes with their crystal-clear Alpine waters.",
        duration: "2-3 Hours",
        difficulty: "Easy",
        image: "/images/hotels/hotel-7.jpg",
        highlights: [
          "Five natural mountain lakes with beach areas",
          "Water temperatures reaching 22°C in summer",
          "Equipment rental for various water activities",
          "Lakeside picnic areas and restaurants",
          "Family-friendly swimming areas with lifeguards"
        ]
      }
    ],
    fall: [
      {
        title: "Autumn Hiking",
        description: "Witness the spectacular transformation of larch forests into golden splendor while hiking through crisp mountain air and uncrowded trails.",
        duration: "2-6 Hours",
        difficulty: "Easy to Moderate",
        image: "/images/hotels/hotel-1.jpg",
        highlights: [
          "Spectacular fall colors, especially in the larch forests",
          "Clear air offering exceptional long-distance views",
          "Wildlife viewing opportunities as animals prepare for winter",
          "Mushroom foraging with expert guides",
          "Photography walks capturing autumn's golden light"
        ]
      },
      {
        title: "Wine Harvest Experience",
        description: "Participate in the grape harvest on sun-drenched vineyard terraces and enjoy wine tastings with local producers in nearby villages.",
        duration: "Half/Full Day",
        difficulty: "Easy",
        image: "/images/hotels/hotel-2.jpg",
        highlights: [
          "Hands-on participation in the traditional grape harvest",
          "Guided tours of historic vineyards and cellars",
          "Tastings of Valais wines including the local specialties",
          "Traditional harvest meals shared with local producers",
          "Transportation provided from Crans-Montana to wine villages"
        ]
      },
      {
        title: "Mountain Biking",
        description: "Enjoy perfect riding conditions on less crowded trails with the beauty of fall colors enhancing the mountain landscape.",
        duration: "2-5 Hours",
        difficulty: "All Levels",
        image: "/images/hotels/hotel-3.jpg",
        highlights: [
          "Ideal temperatures for comfortable riding",
          "Special fall biking packages with reduced rates",
          "Spectacular scenery with autumn colors",
          "E-bike tours to more remote fall foliage locations",
          "End-of-season events and competitions"
        ]
      },
      {
        title: "Photography Workshops",
        description: "Capture the magical fall atmosphere with expert guidance on landscape and nature photography in perfect lighting conditions.",
        duration: "4 Hours",
        difficulty: "All Levels",
        image: "/images/hotels/hotel-4.jpg",
        highlights: [
          "Professional instruction tailored to all skill levels",
          "Focus on capturing fall colors and mountain landscapes",
          "Small groups ensuring personalized attention",
          "Access to prime photography locations",
          "Evening sessions covering editing techniques"
        ]
      }
    ]
  },
  info: {
    travel: {
      description: "Crans-Montana is easily accessible by public transportation or car, with excellent connections to major Swiss cities and international airports.",
      arrival: "Fly into Geneva Airport (2h drive) or Zurich Airport (3h drive). Direct trains from both airports to Sierre, then a scenic funicular or bus ride to the resort.",
      fromAirport: "Swiss Federal Railways (SBB) offers direct trains from both Geneva and Zurich airports to Sierre. From there, take the funicular railway directly to Montana (20 min) or a local bus.",
      localTransport: "The resort area is well-served by free shuttle buses. Walking between Crans and Montana takes about 20 minutes along a scenic path. Taxis are readily available."
    },
    weather: {
      description: "Crans-Montana enjoys a privileged south-facing position with exceptional sunshine (over 300 days annually) and a mild Alpine climate.",
      seasons: [
        {
          name: "winter",
          temp: "-5° to 5°C",
          description: "Cold but sunny with reliable snow at altitude"
        },
        {
          name: "spring",
          temp: "5° to 15°C",
          description: "Mild with wildflowers and occasional showers"
        },
        {
          name: "summer",
          temp: "15° to 25°C",
          description: "Warm days, cool evenings, occasional thunderstorms"
        },
        {
          name: "fall",
          temp: "8° to 18°C",
          description: "Crisp, clear days with spectacular visibility"
        }
      ]
    },
    language: {
      description: "While Crans-Montana is in the French-speaking part of Switzerland, many locals speak excellent English and German, especially in tourist establishments.",
      phrases: [
        {
          english: "Hello",
          local: "Bonjour"
        },
        {
          english: "Thank you",
          local: "Merci"
        },
        {
          english: "Goodbye",
          local: "Au revoir"
        },
        {
          english: "Please",
          local: "S'il vous plaît"
        },
        {
          english: "Excuse me",
          local: "Excusez-moi"
        },
        {
          english: "Cheers!",
          local: "Santé!"
        }
      ]
    },
    currency: {
      description: "Switzerland uses the Swiss Franc (CHF), not the Euro. While some establishments accept Euros, you'll generally receive change in Swiss Francs at unfavorable rates.",
      name: "Swiss Franc",
      code: "CHF",
      paymentMethods: "Credit cards are widely accepted. ATMs are readily available throughout the resort area. Many places also accept contactless and mobile payments.",
      tipping: "Service is typically included in restaurant bills. It's customary to round up for good service, but extensive tipping is not expected."
    },
    tips: [
      "Purchase the Crans-Montana Card for your stay (often included with accommodations) which provides free public transportation and discounts on activities.",
      "The south-facing slopes mean afternoon sun can soften snow - plan early morning skiing during warmer periods for better conditions.",
      "Book restaurants in advance during peak holiday periods, especially for popular mountain establishments.",
      "Bring high-quality sun protection year-round, as the Alpine sun is strong even on cooler days.",
      "Visit the local Fromagerie d'Alpage to sample and purchase authentic regional cheeses made using traditional methods.",
      "Wine enthusiasts should take the funicular down to Sierre to explore the famous Valais vineyards and cellars."
    ]
  },
  imageGallery: [
    '/images/hotels/hotel-1.jpg',
    '/images/hotels/hotel-2.jpg',
    '/images/hotels/hotel-3.jpg',
    '/images/hotels/hotel-4.jpg',
    '/images/hotels/hotel-5.jpg',
    '/images/hotels/hotel-6.jpg',
    '/images/hotels/hotel-7.jpg'
  ],
  restaurants: [
    {
      id: 1,
      name: 'LeMontBlanc',
      description: 'Michelin-starred alpine cuisine featuring seasonal local ingredients with a panoramic terrace.',
      cuisine: 'Contemporary Alpine',
      priceRange: '€€€€',
      mustTry: 'Valais lamb with herb crust',
      image: '/images/hotels/hotel-5.jpg',
      location: { lat: 46.3102, lng: 7.4814 }
    },
    {
      id: 2,
      name: 'Chetzeron Restaurant',
      description: 'High-altitude dining with 360° mountain views and modern interpretations of Swiss classics.',
      cuisine: 'Modern Swiss',
      priceRange: '€€€',
      mustTry: 'Perch from Lake Geneva with alpine herbs',
      image: '/images/hotels/hotel-6.jpg',
      location: { lat: 46.3132, lng: 7.4644 }
    },
    {
      id: 3,
      name: 'La Désalpe',
      description: 'Traditional Swiss chalet serving authentic mountain specialties in a rustic atmosphere.',
      cuisine: 'Traditional Swiss',
      priceRange: '€€',
      mustTry: 'Cheese fondue with black truffle',
      image: '/images/hotels/hotel-7.jpg',
      location: { lat: 46.3072, lng: 7.4734 }
    },
    {
      id: 4,
      name: 'Café Cher-Mignon',
      description: 'Casual bistro offering homemade pastries, local wines, and artisanal cheeses.',
      cuisine: 'Swiss Bistro',
      priceRange: '€€',
      mustTry: 'Valais platter with dried meats and alpine cheeses',
      image: '/images/hotels/hotel-1.jpg',
      location: { lat: 46.3082, lng: 7.4794 }
    },
    {
      id: 5,
      name: 'Zerodix',
      description: 'Lively après-ski spot with terrace, serving gourmet burgers and craft cocktails.',
      cuisine: 'International',
      priceRange: '€€',
      mustTry: 'Raclette burger with Alpine cheese',
      image: '/images/hotels/hotel-2.jpg',
      location: { lat: 46.3122, lng: 7.4654 }
    },
    {
      id: 6,
      name: 'Oxygen',
      description: 'Contemporary dining with Japanese influences, featuring fresh sushi and Alpine fusion dishes.',
      cuisine: 'Asian Fusion',
      priceRange: '€€€',
      mustTry: 'Swiss salmon sashimi with mountain herbs',
      image: '/images/hotels/hotel-3.jpg',
      location: { lat: 46.3062, lng: 7.4784 }
    }
  ],
  practicalInfo: {
    bestTimeToVisit: 'Winter (December-April) for skiing; Summer (June-September) for hiking and golf',
    gettingThere: {
      byAir: 'Nearest airports are Geneva (2 hours) and Zurich (3 hours) with train connections to Sierre, followed by a funicular',
      byTrain: 'Train to Sierre, then connect to the funicular SMC (Sierre-Montana-Crans) for a scenic 20-minute ride up the mountain',
      byCar: 'From Geneva or Zurich, take the A9 motorway to Sierre, then follow signs to Crans-Montana (30-minute drive uphill)'
    },
    climate: {
      winter: { temp: '-5°C to 5°C', description: 'Cold with reliable snowfall' },
      spring: { temp: '5°C to 15°C', description: 'Mild with blooming alpine flowers' },
      summer: { temp: '15°C to 25°C', description: 'Warm days, cool evenings' },
      autumn: { temp: '8°C to 18°C', description: 'Mild with spectacular foliage' }
    },
    language: 'French (primary), German and English widely spoken',
    currency: 'Swiss Franc (CHF)',
    timeZone: 'Central European Time (CET/CEST)',
    essentialPhrases: [
      { phrase: 'Bonjour', pronunciation: 'bon-ZHOOR', meaning: 'Hello' },
      { phrase: 'Merci', pronunciation: 'mair-SEE', meaning: 'Thank you' },
      { phrase: 'S\'il vous plaît', pronunciation: 'seel voo PLEH', meaning: 'Please' },
      { phrase: 'Excusez-moi', pronunciation: 'ex-koo-zay MWAH', meaning: 'Excuse me' },
      { phrase: 'Au revoir', pronunciation: 'oh ruh-VWAHR', meaning: 'Goodbye' }
    ]
  }
};

export function getDestinationData(slug) {
  if (slug === 'crans-montana') {
    return cransMontanaData;
  }
  
  // In a real implementation, this would fetch data for other destinations
  // For now, return Crans-Montana data as a fallback
  return cransMontanaData;
}