const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

// Configuration
const SERVER_URL = 'http://localhost:3001';
const SERVER_START_TIMEOUT = 5000; // 5 seconds to wait for server startup
const ENDPOINTS = [
  { url: '/api/health', expectedStatus: 200 },
  { url: '/api/build-info', expectedStatus: 200 },
  { url: '/api/test', expectedStatus: 200 }
];

// Function to test endpoints
async function testEndpoints() {
  console.log('\n🔍 Testing API endpoints...');
  
  let failedTests = 0;
  
  for (const endpoint of ENDPOINTS) {
    try {
      console.log(`Testing endpoint: ${endpoint.url}`);
      const response = await axios.get(`${SERVER_URL}${endpoint.url}`, { 
        timeout: 5000,
        validateStatus: () => true // Allow any status code to be processed
      });
      
      if (response.status === endpoint.expectedStatus) {
        console.log(`✅ ${endpoint.url} - Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
      } else {
        console.error(`❌ ${endpoint.url} - Expected status ${endpoint.expectedStatus}, got ${response.status}`);
        failedTests++;
      }
    } catch (error) {
      console.error(`❌ ${endpoint.url} - Error: ${error.message}`);
      failedTests++;
    }
    
    console.log('-'.repeat(50));
  }
  
  // Also test the root endpoint
  try {
    console.log(`Testing root endpoint: /`);
    const response = await axios.get(`${SERVER_URL}/`, { 
      timeout: 5000,
      validateStatus: () => true
    });
    
    if (response.status === 200) {
      console.log(`✅ Root endpoint - Status: ${response.status}`);
      console.log(`   Response contains HTML: ${response.data.includes('CincinHotels Express Build Test Server')}`);
    } else {
      console.error(`❌ Root endpoint - Expected status 200, got ${response.status}`);
      failedTests++;
    }
  } catch (error) {
    console.error(`❌ Root endpoint - Error: ${error.message}`);
    failedTests++;
  }
  
  console.log('-'.repeat(50));
  
  return failedTests;
}

// Main function to run tests
async function runTests() {
  console.log('🚀 Starting build test process...');
  
  // Start the server
  const serverProcess = spawn('node', 
    [path.join(__dirname, 'build-test-server.js')], 
    { 
      stdio: 'inherit',
      env: { ...process.env, PORT: '3001' } 
    }
  );
  
  // Handle server process events
  serverProcess.on('error', (err) => {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  });
  
  // Wait for server to start
  console.log(`Waiting ${SERVER_START_TIMEOUT/1000} seconds for server to start...`);
  await new Promise(resolve => setTimeout(resolve, SERVER_START_TIMEOUT));
  
  try {
    // Run tests
    const failedTests = await testEndpoints();
    
    // Report results
    console.log('\n📊 Test Results:');
    if (failedTests === 0) {
      console.log('✅ All tests passed!');
    } else {
      console.error(`❌ ${failedTests} test(s) failed`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error running tests: ${error.message}`);
    process.exit(1);
  } finally {
    // Terminate the server
    serverProcess.kill();
    console.log('\n🛑 Server terminated');
  }
}

// Run the tests
runTests();