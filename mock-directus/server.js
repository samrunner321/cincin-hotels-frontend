const http = require('http');
const fs = require('fs');
const path = require('path');

// Create directories for our mock data
const mockDir = path.join(__dirname, 'data');
if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir, { recursive: true });
}

// Mock data
const destinations = [
  {
    id: 'da8192c5-f28f-4f11-98de-37ca1e729a5a',
    status: 'published',
    name: 'Amalfi Coast',
    slug: 'amalfi-coast',
    subtitle: 'Italy\'s breathtaking coastal paradise',
    country: 'Italy',
    region: 'mediterranean',
    short_description: 'Discover the stunning Amalfi Coast with its dramatic cliffs, colorful villages, and crystal-clear waters of the Mediterranean.',
    main_image: 'amalfi-coast.jpg',
    coordinates: { lat: 40.6333, lng: 14.6027 },
    is_featured: true,
    is_popular: true
  },
  {
    id: '7b824242-1ab8-46a1-8e07-7f96c6a6b383',
    status: 'published',
    name: 'Swiss Alps',
    slug: 'swiss-alps',
    subtitle: 'Majestic mountain landscapes and luxury experiences',
    country: 'Switzerland',
    region: 'alps',
    short_description: 'Experience the breathtaking beauty of the Swiss Alps with their soaring peaks, pristine lakes, and world-class mountain resorts.',
    main_image: 'swiss-alps.jpg',
    coordinates: { lat: 46.8182, lng: 8.2275 },
    is_featured: true,
    is_popular: true
  }
];

const categories = [
  {
    id: '1',
    name: 'Luxury',
    slug: 'luxury',
    type: 'both',
    description: 'Premium accommodations and destinations offering the highest level of service and amenities.',
    featured: true
  },
  {
    id: '2',
    name: 'Beach',
    slug: 'beach',
    type: 'destination',
    description: 'Beautiful coastal locations with stunning beaches and ocean views.',
    featured: true
  },
  {
    id: '3',
    name: 'Mountain',
    slug: 'mountain',
    type: 'destination',
    description: 'Spectacular mountain destinations perfect for outdoor activities and dramatic landscapes.',
    featured: true
  }
];

// Instead of writing mock data, we'll use existing files
// if they exist, otherwise we'll use the default mock data.
try {
  if (!fs.existsSync(path.join(mockDir, 'destinations.json'))) {
    fs.writeFileSync(path.join(mockDir, 'destinations.json'), JSON.stringify(destinations, null, 2));
  }
  
  if (!fs.existsSync(path.join(mockDir, 'categories.json'))) {
    fs.writeFileSync(path.join(mockDir, 'categories.json'), JSON.stringify(categories, null, 2));
  }
  
  // Make sure we have a hotels.json file
  if (!fs.existsSync(path.join(mockDir, 'hotels.json'))) {
    const hotels = [];
    fs.writeFileSync(path.join(mockDir, 'hotels.json'), JSON.stringify(hotels, null, 2));
  }
  
  // Make sure we have a pages.json file
  if (!fs.existsSync(path.join(mockDir, 'pages.json'))) {
    const pages = [];
    fs.writeFileSync(path.join(mockDir, 'pages.json'), JSON.stringify(pages, null, 2));
  }
} catch (error) {
  console.error('Error checking or creating mock data files:', error);
}

// Create a simple HTTP server for the mock API
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  
  console.log(`${req.method} ${pathname}`);

  // Server info endpoint
  if (pathname === '/server/info' || pathname === '/server/health') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      data: {
        directus: {
          version: '10.0.0 (mock)'
        }
      },
      status: 'ok'
    }));
    return;
  }
  
  // Auth login endpoint (mock)
  if (pathname === '/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      res.statusCode = 200;
      res.end(JSON.stringify({
        data: {
          access_token: 'mock-jwt-token',
          expires: 900000,
          refresh_token: 'mock-refresh-token'
        }
      }));
    });
    return;
  }
  
  // Helper function to read mock data file
  const getMockData = (filename) => {
    try {
      const data = fs.readFileSync(path.join(mockDir, filename), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading mock data file ${filename}:`, error);
      return [];
    }
  };

  // Generic items endpoint handler
  const handleItemsEndpoint = (collection) => {
    try {
      // Check for slug filter
      if (url.searchParams.has('filter[slug][_eq]')) {
        const slug = url.searchParams.get('filter[slug][_eq]');
        const items = getMockData(`${collection}.json`);
        const item = items.find(i => i.slug === slug);
        
        res.statusCode = 200;
        res.end(JSON.stringify({
          data: item ? [item] : []
        }));
        return true;
      }
      
      // Check for ID fetch
      const idMatch = pathname.match(new RegExp(`^/items/${collection}/([\\w-]+)$`));
      if (idMatch) {
        const id = idMatch[1];
        const items = getMockData(`${collection}.json`);
        const item = items.find(i => i.id === id);
        
        if (item) {
          res.statusCode = 200;
          res.end(JSON.stringify({
            data: item
          }));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({
            error: {
              message: `Item with id ${id} not found`
            }
          }));
        }
        return true;
      }
      
      // Return all items
      const items = getMockData(`${collection}.json`);
      res.statusCode = 200;
      res.end(JSON.stringify({
        data: items
      }));
      return true;
    } catch (error) {
      console.error(`Error in handleItemsEndpoint for ${collection}:`, error);
      return false;
    }
  };

  // Handle item endpoints
  if (req.method === 'GET') {
    // Map endpoints to collections
    const collections = ['destinations', 'categories', 'hotels', 'pages', 'rooms'];
    
    for (const collection of collections) {
      if (pathname === `/items/${collection}` || pathname.startsWith(`/items/${collection}/`)) {
        if (handleItemsEndpoint(collection)) {
          return;
        }
      }
    }
  }
  
  // Get collection info
  if (pathname === '/collections' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      data: [
        { collection: 'destinations' },
        { collection: 'categories' },
        { collection: 'hotels' },
        { collection: 'rooms' },
        { collection: 'pages' }
      ]
    }));
    return;
  }
  
  // Get fields for a collection
  if (pathname.startsWith('/fields/') && req.method === 'GET') {
    const collection = pathname.split('/')[2];
    let fields = [];
    
    if (collection === 'destinations') {
      fields = [
        { field: 'id' },
        { field: 'status' },
        { field: 'name' },
        { field: 'slug' },
        { field: 'subtitle' },
        { field: 'country' },
        { field: 'region' },
        { field: 'short_description' },
        { field: 'main_image' },
        { field: 'coordinates' },
        { field: 'is_featured' },
        { field: 'is_popular' }
      ];
    } else if (collection === 'categories') {
      fields = [
        { field: 'id' },
        { field: 'name' },
        { field: 'slug' },
        { field: 'type' },
        { field: 'description' },
        { field: 'featured' }
      ];
    } else if (collection === 'hotels') {
      fields = [
        { field: 'id' },
        { field: 'status' },
        { field: 'name' },
        { field: 'slug' },
        { field: 'subtitle' },
        { field: 'location' },
        { field: 'region' },
        { field: 'short_description' },
        { field: 'main_image' },
        { field: 'price_from' },
        { field: 'currency' },
        { field: 'star_rating' },
        { field: 'destination' },
        { field: 'is_featured' }
      ];
    } else if (collection === 'pages') {
      fields = [
        { field: 'id' },
        { field: 'status' },
        { field: 'title' },
        { field: 'slug' },
        { field: 'content' },
        { field: 'template' },
        { field: 'meta_title' },
        { field: 'meta_description' },
        { field: 'show_in_navigation' },
        { field: 'sort' }
      ];
    }
    
    res.statusCode = 200;
    res.end(JSON.stringify({
      data: fields
    }));
    return;
  }
  
  // Handle asset URLs
  if (pathname.startsWith('/assets/')) {
    // In a real implementation, this would serve actual files
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Mock asset content');
    return;
  }
  
  // Default response for unknown routes
  res.statusCode = 404;
  res.end(JSON.stringify({
    error: {
      message: 'Route not found'
    }
  }));
});

const PORT = 8055;
server.listen(PORT, () => {
  console.log(`Mock Directus CMS server running at http://localhost:${PORT}`);
  console.log(`Server info: http://localhost:${PORT}/server/info`);
  console.log(`Destinations: http://localhost:${PORT}/items/destinations`);
  console.log(`Categories: http://localhost:${PORT}/items/categories`);
});