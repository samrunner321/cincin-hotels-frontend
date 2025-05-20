/**
 * Mock-Daten für Kategorien
 */

export const mockCategories = [
  {
    id: '1',
    name: 'Luxury',
    slug: 'luxury',
    description: 'Experience unparalleled luxury with exquisite accommodations, impeccable service, and exceptional amenities.',
    icon: 'star',
    image: {
      id: 'category-luxury',
      title: 'Luxury Accommodation',
      description: 'Elegant hotel suite with panoramic views',
      width: 1600,
      height: 900
    },
    type: 'hotel',
    featured: true,
    sort: 1,
    date_created: '2022-01-15T09:00:00Z',
    date_updated: '2023-05-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Beach',
    slug: 'beach',
    description: 'Discover perfect beachfront locations with stunning coastal views and direct access to sandy shores.',
    icon: 'beach',
    image: {
      id: 'category-beach',
      title: 'Beach Destination',
      description: 'Beautiful beach with turquoise water',
      width: 1600,
      height: 900
    },
    type: 'both',
    featured: true,
    sort: 2,
    date_created: '2022-01-15T09:15:00Z',
    date_updated: '2023-05-20T14:45:00Z'
  },
  {
    id: '3',
    name: 'Mountain',
    slug: 'mountain',
    description: 'Escape to breathtaking mountain retreats offering spectacular views and easy access to outdoor activities.',
    icon: 'mountain',
    image: {
      id: 'category-mountain',
      title: 'Mountain Retreat',
      description: 'Alpine hotel with mountain panorama',
      width: 1600,
      height: 900
    },
    type: 'both',
    featured: true,
    sort: 3,
    date_created: '2022-01-15T09:30:00Z',
    date_updated: '2023-05-20T15:00:00Z'
  },
  {
    id: '4',
    name: 'Design',
    slug: 'design',
    description: 'Explore architecturally significant properties with cutting-edge design and stylish interiors.',
    icon: 'design',
    image: {
      id: 'category-design',
      title: 'Design Hotel',
      description: 'Modern hotel with striking architecture',
      width: 1600,
      height: 900
    },
    type: 'hotel',
    featured: true,
    sort: 4,
    date_created: '2022-01-15T09:45:00Z',
    date_updated: '2023-05-20T15:15:00Z'
  },
  {
    id: '5',
    name: 'City',
    slug: 'city',
    description: 'Stay in the heart of vibrant urban centers with easy access to cultural attractions, dining, and entertainment.',
    icon: 'city',
    image: {
      id: 'category-city',
      title: 'City Hotel',
      description: 'Elegant urban hotel in city center',
      width: 1600,
      height: 900
    },
    type: 'both',
    featured: true,
    sort: 5,
    date_created: '2022-01-15T10:00:00Z',
    date_updated: '2023-05-20T15:30:00Z'
  },
  {
    id: '6',
    name: 'Wellness',
    slug: 'wellness',
    description: 'Rejuvenate body and mind at premium spa hotels offering comprehensive wellness programs and facilities.',
    icon: 'spa',
    image: {
      id: 'category-wellness',
      title: 'Wellness Retreat',
      description: 'Luxury spa with indoor pool',
      width: 1600,
      height: 900
    },
    type: 'hotel',
    featured: false,
    sort: 6,
    date_created: '2022-01-15T10:15:00Z',
    date_updated: '2023-05-20T15:45:00Z'
  },
  {
    id: '7',
    name: 'Gourmet',
    slug: 'gourmet',
    description: 'Indulge in exceptional culinary experiences at hotels known for their outstanding restaurants and food concepts.',
    icon: 'restaurant',
    image: {
      id: 'category-gourmet',
      title: 'Gourmet Dining',
      description: 'Elegant restaurant with fine dining',
      width: 1600,
      height: 900
    },
    type: 'hotel',
    featured: false,
    sort: 7,
    date_created: '2022-01-15T10:30:00Z',
    date_updated: '2023-05-20T16:00:00Z'
  },
  {
    id: '8',
    name: 'Countryside',
    slug: 'countryside',
    description: 'Retreat to peaceful rural locations offering tranquility, natural beauty, and authentic local experiences.',
    icon: 'nature',
    image: {
      id: 'category-countryside',
      title: 'Countryside Retreat',
      description: 'Charming hotel in rural landscape',
      width: 1600,
      height: 900
    },
    type: 'both',
    featured: false,
    sort: 8,
    date_created: '2022-01-15T10:45:00Z',
    date_updated: '2023-05-20T16:15:00Z'
  },
  {
    id: '9',
    name: 'Adults Only',
    slug: 'adults-only',
    description: 'Experience sophisticated tranquility at hotels exclusively designed for adult guests.',
    icon: 'adults',
    image: {
      id: 'category-adults-only',
      title: 'Adults Only Resort',
      description: 'Elegant infinity pool at adults only resort',
      width: 1600,
      height: 900
    },
    type: 'hotel',
    featured: false,
    sort: 9,
    date_created: '2022-01-15T11:00:00Z',
    date_updated: '2023-05-20T16:30:00Z'
  },
  {
    id: '10',
    name: 'Cultural',
    slug: 'cultural',
    description: 'Discover destinations rich in history, art, and local traditions for an immersive cultural experience.',
    icon: 'museum',
    image: {
      id: 'category-cultural',
      title: 'Cultural Destination',
      description: 'Historic town center with traditional architecture',
      width: 1600,
      height: 900
    },
    type: 'destination',
    featured: false,
    sort: 10,
    date_created: '2022-01-15T11:15:00Z',
    date_updated: '2023-05-20T16:45:00Z'
  }
];

export default mockCategories;