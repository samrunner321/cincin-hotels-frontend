const http = require('http');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
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

  // Simplified routing
  if (req.url === '/server/info' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      data: {
        directus: {
          version: '10.0.0 (mock)'
        }
      }
    }));
  } 
  else if (req.url === '/collections' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      data: [
        { collection: 'destinations' },
        { collection: 'hotels' },
        { collection: 'categories' }
      ]
    }));
  }
  else if (req.url === '/fields/destinations' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      data: [
        { field: 'id' },
        { field: 'slug' },
        { field: 'name' },
        { field: 'country' },
        { field: 'short_description' },
        { field: 'description' },
        { field: 'main_image' }
      ]
    }));
  }
  else if (req.url === '/fields/hotels' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      data: [
        { field: 'id' },
        { field: 'slug' },
        { field: 'name' },
        { field: 'short_description' },
        { field: 'main_image' }
      ]
    }));
  }
  else if (req.url === '/fields/categories' && req.method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({
      data: [
        { field: 'id' },
        { field: 'name' },
        { field: 'slug' },
        { field: 'type' }
      ]
    }));
  }
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 8055;
server.listen(PORT, () => {
  console.log(`Mock Directus API server running at http://localhost:${PORT}`);
});