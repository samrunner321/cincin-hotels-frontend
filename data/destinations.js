/**
 * Destination data for the website
 */
export const destinations = [
  {
    id: '1',
    name: 'South Tyrol',
    slug: 'south-tyrol',
    country: 'Italy',
    region: 'Dolomites',
    description: 'Where Alpine tradition meets Italian flair, South Tyrol offers breathtaking mountain landscapes, world-class cuisine, and a unique cultural blend.',
    longDescription: `
      South Tyrol represents a fascinating blend of Alpine and Mediterranean influences. This northernmost province of Italy, nestled in the heart of the Dolomites (a UNESCO World Heritage site), offers some of the most spectacular mountain scenery in Europe.

      The region is known for its exceptional food culture, boasting more Michelin stars per capita than any other region in Italy. Its cuisine reflects the area's cross-cultural heritage, combining hearty Alpine dishes with Italian refinements and innovative modern techniques.

      South Tyrol's distinctive identity is shaped by its history and trilingual culture (German, Italian, and Ladin are all spoken here). Traditional mountain villages with their onion-domed churches sit alongside sophisticated towns like Merano and Bolzano, where visitors can enjoy thermal spas, excellent shopping, and vibrant cultural scenes.

      The region is an outdoor paradise in every season. Winter brings world-class skiing and snowboarding across extensive, well-maintained resorts. Summer transforms the mountains into a haven for hiking, mountain biking, and climbing. Spring offers beautiful wildflower displays in the Alpine meadows, while autumn brings harvest festivals and spectacular fall colors.

      South Tyrol is also renowned for its exceptional hospitality, with accommodation ranging from family-run guesthouses to sophisticated design hotels that seamlessly integrate with their natural surroundings.
    `,
    highlights: [
      'UNESCO World Heritage Dolomites',
      'Fusion of Alpine and Mediterranean culture',
      'Outstanding food and wine scene',
      'Year-round outdoor activities',
      'Distinctive architecture and design'
    ],
    bestTimeToVisit: 'Year-round, with distinct seasonal offerings. Summer (June-September) for hiking and outdoor activities, winter (December-March) for skiing and snow sports.',
    image: '/images/destinations/south-tyrol/main.jpg',
    images: [
      '/images/destinations/south-tyrol/landscape.jpg',
      '/images/destinations/south-tyrol/village.jpg',
      '/images/destinations/south-tyrol/food.jpg',
      '/images/destinations/south-tyrol/winter.jpg',
      '/images/destinations/south-tyrol/hiking.jpg'
    ],
    popular: true,
    featured: true,
    coordinates: {
      lat: 46.4983,
      lng: 11.3548
    },
    hotels: [
      'forestis',
      'schgaguler-hotel',
      'vigilius-mountain-resort'
    ]
  },
  {
    id: '2',
    name: 'Austrian Alps',
    slug: 'austrian-alps',
    country: 'Austria',
    region: 'Alps',
    description: 'Experience Alpine charm at its finest with picturesque villages, world-class ski resorts, rejuvenating thermal spas, and the famous Austrian hospitality.',
    longDescription: `
      The Austrian Alps combine breathtaking natural beauty with rich cultural traditions and exceptional hospitality. This Alpine region features majestic peaks, verdant valleys, crystal-clear lakes, and charming villages that seem straight from a fairytale.

      Austria has been at the forefront of Alpine tourism for generations, and this expertise is evident in its superb infrastructure. World-renowned ski resorts like Kitzbühel, St. Anton, and Ischgl offer some of Europe's best winter sports facilities, while the summer months reveal an extensive network of hiking trails and mountain biking routes.

      The region's distinctive culture is preserved in its traditional architecture, folk customs, and cuisine. Visitors can experience authentic Alpine lifestyle in the many mountain huts serving hearty local specialties, or indulge in fine dining at sophisticated restaurants that reinvent Austrian classics with contemporary flair.

      Wellness is deeply ingrained in Austrian Alpine culture, with numerous thermal spas and wellness retreats offering rejuvenating treatments in spectacular settings. Many combine ancient healing traditions with modern therapeutic approaches to create unique wellbeing experiences.

      The renowned Austrian hospitality ensures visitors feel welcome, whether staying in a family-run pension, a historic grand hotel, or an innovative design property that showcases the harmonious relationship between contemporary architecture and the natural environment.
    `,
    highlights: [
      'World-class ski resorts and winter sports',
      'Extensive network of summer hiking trails',
      'Charming Alpine villages with traditional architecture',
      'Thermal spas and wellness retreats',
      'Rich cultural heritage and festivals'
    ],
    bestTimeToVisit: 'December to March for winter sports, June to September for hiking and summer activities. May and October offer quieter periods with beautiful spring blooms or fall colors.',
    image: '/images/destinations/austrian-alps/main.jpg',
    images: [
      '/images/destinations/austrian-alps/landscape.jpg',
      '/images/destinations/austrian-alps/village.jpg',
      '/images/destinations/austrian-alps/skiing.jpg',
      '/images/destinations/austrian-alps/lake.jpg',
      '/images/destinations/austrian-alps/hiking.jpg'
    ],
    popular: true,
    featured: false,
    coordinates: {
      lat: 47.5162,
      lng: 13.6490
    },
    hotels: [
      'the-comodo'
    ]
  },
  {
    id: '3',
    name: 'Greek Islands',
    slug: 'greek-islands',
    country: 'Greece',
    region: 'Mediterranean',
    description: 'Discover the magic of the Greek Islands with their crystal-clear waters, whitewashed villages, ancient ruins, and legendary hospitality.',
    longDescription: `
      The Greek Islands represent one of the Mediterranean's most enchanting destinations, where azure waters meet whitewashed villages and millennia of history create a compelling tapestry of experiences. With over 200 inhabited islands, each offers its own distinct character and attractions.

      The Cyclades, including famous islands like Santorini and Mykonos, are known for their iconic architecture of white cubic houses with blue accents, dramatic volcanic landscapes, and vibrant nightlife. The Dodecanese islands, closer to Turkey, feature a fascinating blend of cultures reflected in their medieval architecture, Byzantine churches, and Ottoman influences.

      The Ionian Islands on the western coast showcase a greener landscape with Venetian-influenced architecture, while the Sporades in the northwest Aegean offer some of Greece's most beautiful beaches and natural reserves. Crete, the largest Greek island, is a destination in itself with its distinctive cuisine, remarkable archaeological sites, and diverse landscapes ranging from pristine beaches to rugged mountains.

      Greek island culture centers around philoxenia—love of strangers—manifested in warm hospitality and communal dining experiences. The Mediterranean diet is on full display, with fresh seafood, locally grown vegetables, aromatic herbs, excellent olive oil, and regional wines featuring prominently in island cuisine.

      The islands' appeal stretches beyond summer beach holidays, with spring offering wildflower displays and pleasant hiking conditions, and autumn providing warm sea temperatures without the crowds. Winter reveals the authentic rhythm of island life, particularly on larger islands that maintain year-round communities.
    `,
    highlights: [
      'Extraordinary beaches with crystal-clear waters',
      'Distinctive Cycladic architecture',
      'Rich archaeological heritage',
      'Outstanding Mediterranean cuisine',
      'Traditional island festivals and celebrations'
    ],
    bestTimeToVisit: 'April to June and September to October offer ideal conditions with warm temperatures and fewer crowds. July and August are hottest and busiest.',
    image: '/images/destinations/greek-islands/main.jpg',
    images: [
      '/images/destinations/greek-islands/santorini.jpg',
      '/images/destinations/greek-islands/beach.jpg',
      '/images/destinations/greek-islands/ruins.jpg',
      '/images/destinations/greek-islands/food.jpg',
      '/images/destinations/greek-islands/boat.jpg'
    ],
    popular: true,
    featured: false,
    coordinates: {
      lat: 37.0902,
      lng: 25.3682
    },
    hotels: [
      'casa-cook-samos'
    ]
  },
  {
    id: '4',
    name: 'Swiss Alps',
    slug: 'swiss-alps',
    country: 'Switzerland',
    region: 'Alps',
    description: 'Experience unparalleled Alpine majesty in Switzerland, where pristine lakes mirror snow-capped peaks, efficient transportation connects picturesque villages, and outdoor adventures await in every season.',
    longDescription: `
      The Swiss Alps represent the pinnacle of Alpine splendor, with their dramatic peaks, pristine lakes, and immaculately maintained natural landscapes. Switzerland's reputation for excellence extends throughout its mountain regions, offering visitors exceptional experiences in both luxury and adventure.

      The country's efficient transportation infrastructure makes even the most remote Alpine settings surprisingly accessible. The iconic Swiss trains, including famous routes like the Glacier Express and Bernina Express, provide not just transportation but extraordinary scenic journeys through otherwise inaccessible terrain.

      Swiss Alpine villages like Zermatt, Grindelwald, and St. Moritz have refined mountain hospitality to an art form. Car-free town centers preserve traditional Alpine atmosphere while offering sophisticated amenities, from gourmet restaurants showcasing regional specialties to elegant shops featuring Swiss precision products.

      The Swiss commitment to preserving natural environments while making them accessible results in some of the world's most spectacular outdoor experiences. In winter, perfectly groomed ski areas cater to all ability levels, while summer brings hiking amid stunning scenery on well-marked trails. Adventure seekers can find world-class climbing, paragliding, mountain biking, and other activities supervised by the highly trained guides Switzerland is known for.

      Swiss Alpine wellness traditions date back centuries, with historic thermal towns like Leukerbad offering natural hot springs in magnificent mountain settings. Contemporary spa resorts combine these natural resources with cutting-edge facilities to create rejuvenating retreats after active days in the mountains.
    `,
    highlights: [
      'Iconic mountain peaks including the Matterhorn',
      'Efficient mountain transportation systems',
      'Pristine Alpine lakes and landscapes',
      'World-class skiing and winter sports',
      'Exceptional hiking infrastructure'
    ],
    bestTimeToVisit: 'December to April for winter sports, June to September for hiking and summer activities. May and October are transitional months with variable conditions but fewer visitors.',
    image: '/images/destinations/swiss-alps/main.jpg',
    images: [
      '/images/destinations/swiss-alps/matterhorn.jpg',
      '/images/destinations/swiss-alps/lake.jpg',
      '/images/destinations/swiss-alps/train.jpg',
      '/images/destinations/swiss-alps/skiing.jpg',
      '/images/destinations/swiss-alps/village.jpg'
    ],
    popular: true,
    featured: true,
    coordinates: {
      lat: 46.8182,
      lng: 8.2275
    },
    hotels: [
      'villa-honegg'
    ]
  },
  {
    id: '5',
    name: 'French Riviera',
    slug: 'french-riviera',
    country: 'France',
    region: 'Mediterranean',
    description: 'Experience the glamour and natural beauty of the Côte d\'Azur, with its azure Mediterranean waters, charming coastal towns, exceptional cuisine, and rich artistic heritage.',
    longDescription: `
      The French Riviera (Côte d\'Azur) stretches along the Mediterranean coast of southeastern France, encompassing famed destinations like Saint-Tropez, Cannes, Nice, and Monaco. This legendary coastline has been synonymous with sophistication and beauty since it became one of Europe's first modern resort areas in the 18th century.

      The region's natural splendor forms the foundation of its appeal—the striking blue Mediterranean waters that give the coast its name, the maritime Alps that provide a dramatic backdrop, and the quality of light that has attracted artists for generations. The climate offers over
      300 sunny days annually, creating an almost year-round outdoor lifestyle.

      While glamorous beaches and yacht-filled harbors remain iconic aspects of the Riviera, the region offers much more. Historic cities like Nice showcase belle époque architecture and vibrant cultural scenes. Medieval villages perched on hillsides above the coast, such as Èze and Saint-Paul-de-Vence, provide glimpses into the area's long history and offer breathtaking views.

      The French Riviera has been central to artistic innovation, particularly in modern art. Museums and foundations dedicated to artists like Picasso, Matisse, Chagall, and many others who lived and worked in the region display important collections in often spectacular settings.

      Culinary excellence is integral to the Riviera experience, from seaside restaurants serving fresh Mediterranean seafood to Michelin-starred establishments reinventing Provençal classics. The local markets showcase the bounty of both the sea and the fertile hinterland, while the wine regions of Provence provide perfect accompaniments.
    `,
    highlights: [
      'Iconic coastal towns and beaches',
      'Rich artistic heritage and world-class museums',
      'Exceptional Mediterranean cuisine',
      'Historic perched villages with panoramic views',
      'Glamorous lifestyle and cultural events'
    ],
    bestTimeToVisit: 'April to June and September to October offer ideal weather and fewer crowds. July and August are busiest and most expensive, but feature maximum energy and events.',
    image: '/images/destinations/french-riviera/main.jpg',
    images: [
      '/images/destinations/french-riviera/coast.jpg',
      '/images/destinations/french-riviera/village.jpg',
      '/images/destinations/french-riviera/beach.jpg',
      '/images/destinations/french-riviera/food.jpg',
      '/images/destinations/french-riviera/art.jpg'
    ],
    popular: true,
    featured: false,
    coordinates: {
      lat: 43.7102,
      lng: 7.2620
    },
    hotels: [
      'cheval-blanc-st-tropez'
    ]
  },
  {
    id: '6',
    name: 'Berlin',
    slug: 'berlin',
    country: 'Germany',
    region: 'Central Europe',
    description: 'Discover Berlin\'s unique blend of history, cutting-edge culture, architectural diversity, and vibrant neighborhoods that make it one of Europe\'s most dynamic and creative capitals.',
    longDescription: `
      Berlin stands as one of Europe's most fascinating capitals—a city continuously reinventing itself while acknowledging its complex past. The fall of the Berlin Wall in 1989 triggered a remarkable period of cultural renaissance and urban transformation that continues to this day.

      The city's turbulent 20th-century history is thoughtfully preserved and presented through numerous memorials, museums, and historic sites. From the Brandenburg Gate and remnants of the Wall to the Holocaust Memorial and Checkpoint Charlie, Berlin invites visitors to engage with history in profound and meaningful ways.

      Contemporary Berlin thrives as a creative hub where artists, designers, musicians, and entrepreneurs from around the world find space and inspiration. This creative energy animates the city's thriving gallery scene, innovative startups, legendary nightlife, and distinctive fashion culture.

      Berlin's character emerges through its diverse neighborhoods, each with its own atmosphere. Mitte combines historic sites with contemporary galleries and boutiques. Kreuzberg and Neukölln showcase the city's multicultural influences and alternative scene. Prenzlauer Berg offers elegant 19th-century architecture and family-friendly atmosphere, while Charlottenburg maintains a more traditional West Berlin elegance.

      Green space is abundant, with the massive Tiergarten at the city's center complemented by numerous parks, urban beaches, and the former Tempelhof airport now repurposed as a unique public recreation area. The surrounding lakes and forests of Brandenburg provide easy escapes from urban life.

      Berlin remains one of Europe's most affordable capitals, making its rich cultural offerings, excellent public transportation, diverse dining scene, and creative energy accessible to a wide range of visitors.
    `,
    highlights: [
      'Powerful historic sites and world-class museums',
      'Thriving contemporary arts scene',
      'Distinctive neighborhood cultures',
      'Legendary nightlife and music scene',
      'Abundant green spaces and urban beaches'
    ],
    bestTimeToVisit: 'May to September offers the most pleasant weather for exploring the city and enjoying outdoor activities. December features atmospheric Christmas markets.',
    image: '/images/destinations/berlin/main.jpg',
    images: [
      '/images/destinations/berlin/brandenburggate.jpg',
      '/images/destinations/berlin/eastside.jpg',
      '/images/destinations/berlin/museum.jpg',
      '/images/destinations/berlin/kreuzberg.jpg',
      '/images/destinations/berlin/tiergarten.jpg'
    ],
    popular: false,
    featured: false,
    coordinates: {
      lat: 52.5200,
      lng: 13.4050
    },
    hotels: [
      'michelberger-hotel'
    ]
  },
  {
    id: '7',
    name: 'Paris',
    slug: 'paris',
    country: 'France',
    region: 'Western Europe',
    description: 'The timeless capital of France captivates with its iconic landmarks, world-class museums, charming neighborhoods, and unparalleled culinary scene.',
    longDescription: `
      Paris has captivated the global imagination for centuries as a city of unparalleled beauty, cultural richness, and joie de vivre. Its reputation as a center of art, fashion, gastronomy, and architecture continues to draw visitors seeking both its classic charms and contemporary innovations.

      The city's iconic landmarks—from the Eiffel Tower and Notre-Dame Cathedral to the Arc de Triomphe and Sacré-Cœur Basilica—create one of the world's most recognizable urban landscapes. These monuments anchor a city that reveals new perspectives and hidden treasures with each visit.

      Paris houses some of the world's greatest art collections, from the vast holdings of the Louvre and the Impressionist masterpieces of the Musée d\'Orsay to the modern and contemporary works at the Centre Pompidou and Fondation Louis Vuitton. Beyond these institutions, the city itself functions as a living museum of architectural styles spanning centuries.

      The true Paris experience emerges from exploring its distinctive arrondissements (districts) and neighborhoods. The Latin Quarter hums with academic energy, Saint-Germain-des-Prés maintains its literary and artistic heritage, the Marais showcases medieval architecture alongside contemporary fashion, and Montmartre preserves its village atmosphere high above the city.

      Culinary excellence defines Parisian life, from the morning ritual of fresh baguettes and pastries to the carefully preserved tradition of the multi-course French meal. The city embraces both classic bistros maintaining culinary traditions and innovative restaurants pushing gastronomy in new directions.

      Parks and gardens offer respite from urban intensity, with the formal beauty of the Tuileries and Luxembourg gardens complemented by the larger, more naturalistic Bois de Boulogne and Bois de Vincennes on the city's edges. The Seine River provides another perspective on the city, whether explored by boat or along its scenic walkways.
    `,
    highlights: [
      'Iconic architectural landmarks',
      'World-renowned museums and art collections',
      'Distinctive neighborhood atmospheres',
      'Exceptional culinary traditions',
      'Elegant parks and riverside promenades'
    ],
    bestTimeToVisit: 'April to June and September to October offer pleasant temperatures and relatively fewer crowds. July and August can be hot and busy with tourists, while winter provides a more local experience.',
    image: '/images/destinations/paris/main.jpg',
    images: [
      '/images/destinations/paris/eiffel.jpg',
      '/images/destinations/paris/louvre.jpg',
      '/images/destinations/paris/montmartre.jpg',
      '/images/destinations/paris/seine.jpg',
      '/images/destinations/paris/cafe.jpg'
    ],
    popular: true,
    featured: true,
    coordinates: {
      lat: 48.8566,
      lng: 2.3522
    },
    hotels: [
      'the-hoxton-paris'
    ]
  },
  {
    id: '8',
    name: 'London',
    slug: 'london',
    country: 'United Kingdom',
    region: 'Western Europe',
    description: 'Experience the dynamic capital of the United Kingdom, where centuries of history meet cutting-edge culture, diverse neighborhoods offer endless exploration, and world-class museums and theaters provide cultural richness.',
    longDescription: `
      London combines a profound sense of history with an ever-evolving contemporary identity. As one of the world's most cosmopolitan cities, it offers an extraordinary breadth of experiences, from iconic historic landmarks to cutting-edge cultural innovations.

      The city's history spans nearly two millennia, visible in structures like the Tower of London, Westminster Abbey, and St. Paul's Cathedral. These historic sites coexist with bold contemporary architecture such as The Shard, the London Eye, and the converted Tate Modern power station, creating a cityscape that juxtaposes eras and styles.

      London's cultural offerings are unmatched in their diversity and quality. World-renowned museums like the British Museum, Victoria and Albert Museum, and National Gallery house exceptional collections spanning human history and creative achievement. The West End theater district presents everything from classic Shakespeare to the latest productions, while the city's music scene ranges from the Royal Opera House and historic concert halls to underground venues launching new talent.

      The city reveals itself through its distinctive neighborhoods. The ceremonial grandeur of Westminster contrasts with the financial power of the City of London, the artistic energy of the South Bank, the multicultural vibrancy of Brixton and Brick Lane, and the elegant residential areas of Kensington and Notting Hill.

      London's dining scene reflects its global connections, offering everything from historic pubs serving traditional fare to innovative restaurants representing cuisines from around the world. The city's markets—from Borough Market's gourmet offerings to the eclectic finds at Portobello Road—showcase both local specialties and international flavors.

      Despite its urban intensity, London maintains abundant green space, with royal parks like Hyde Park and Regent's Park providing peaceful retreats. The Thames River remains the city's central artery, offering both transportation and recreational opportunities along its banks.
    `,
    highlights: [
      'Iconic historic landmarks spanning nearly 2,000 years',
      'World-class museums and cultural institutions',
      'Diverse neighborhood cultures',
      'Exceptional theater and music scenes',
      'Historic royal parks and gardens'
    ],
    bestTimeToVisit: 'May to September offers the best weather for exploring the city, though spring and fall can be less crowded. Winter provides atmospheric Christmas decorations and January sales.',
    image: '/images/destinations/london/main.jpg',
    images: [
      '/images/destinations/london/bigben.jpg',
      '/images/destinations/london/towerbridge.jpg',
      '/images/destinations/london/museum.jpg',
      '/images/destinations/london/park.jpg',
      '/images/destinations/london/market.jpg'
    ],
    popular: true,
    featured: false,
    coordinates: {
      lat: 51.5074,
      lng: -0.1278
    },
    hotels: [
      'nomad-london'
    ]
  }
];