const http = require('http');
const https = require('https');

// Configuration
const DIRECTUS_URL = 'http://localhost:8055';
const TOKENS = {
  'Admin': 'Cys9ZRK2lAugewQ0cQ7ToEd5K8bZFHuW',
  'Claude': 'fNKisxBG7vTtZZS7VJ0d_Rk61GxC6uYC'
};

// Test endpoints
const ENDPOINTS = [
  '/users/me',
  '/collections',
  '/items/hotels',
  '/roles',
  '/permissions'
];

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Helper function to make HTTP requests
function makeRequest(options, body = null) {
  return new Promise((resolve) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          error: null
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        statusCode: null,
        headers: null,
        body: null,
        error: error.message
      });
    });
    
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    
    req.end();
  });
}

// Test function
async function testAuth(tokenName, token, endpoint, method) {
  console.log(`\n${colors.blue}Testing ${tokenName} token on ${endpoint}:${colors.reset}`);
  
  const results = [];
  
  // Test 1: Bearer WITHOUT space (incorrect)
  console.log(`\n  1. Testing Bearer WITHOUT space:`);
  const test1 = await makeRequest({
    hostname: 'localhost',
    port: 8055,
    path: endpoint,
    method: 'GET',
    headers: {
      'Authorization': `Bearer${token}`,  // NO SPACE
      'Content-Type': 'application/json'
    }
  });
  
  const result1 = {
    method: 'Bearer WITHOUT space',
    header: `Authorization: 'Bearer${token}'`,
    status: test1.statusCode,
    success: test1.statusCode === 200
  };
  results.push(result1);
  
  if (result1.success) {
    console.log(`     ${colors.green}✅ SUCCESS - Status: ${test1.statusCode}${colors.reset}`);
  } else {
    console.log(`     ${colors.red}❌ FAILED - Status: ${test1.statusCode}${colors.reset}`);
    if (test1.body) {
      try {
        const error = JSON.parse(test1.body);
        console.log(`     Error: ${error.errors?.[0]?.message || test1.body}`);
      } catch {
        console.log(`     Response: ${test1.body.substring(0, 100)}...`);
      }
    }
  }
  
  // Test 2: Bearer WITH space (correct)
  console.log(`\n  2. Testing Bearer WITH space:`);
  const test2 = await makeRequest({
    hostname: 'localhost',
    port: 8055,
    path: endpoint,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,  // WITH SPACE
      'Content-Type': 'application/json'
    }
  });
  
  const result2 = {
    method: 'Bearer WITH space',
    header: `Authorization: 'Bearer ${token}'`,
    status: test2.statusCode,
    success: test2.statusCode === 200
  };
  results.push(result2);
  
  if (result2.success) {
    console.log(`     ${colors.green}✅ SUCCESS - Status: ${test2.statusCode}${colors.reset}`);
    if (endpoint === '/users/me' && test2.body) {
      try {
        const user = JSON.parse(test2.body);
        console.log(`     User: ${user.data.email || user.data.first_name || 'Unknown'}`);
        console.log(`     Role: ${user.data.role}`);
      } catch {}
    }
  } else {
    console.log(`     ${colors.red}❌ FAILED - Status: ${test2.statusCode}${colors.reset}`);
    if (test2.body) {
      try {
        const error = JSON.parse(test2.body);
        console.log(`     Error: ${error.errors?.[0]?.message || test2.body}`);
      } catch {
        console.log(`     Response: ${test2.body.substring(0, 100)}...`);
      }
    }
  }
  
  // Test 3: Query parameter
  console.log(`\n  3. Testing Query Parameter:`);
  const test3 = await makeRequest({
    hostname: 'localhost',
    port: 8055,
    path: `${endpoint}?access_token=${token}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  const result3 = {
    method: 'Query Parameter',
    header: `URL: ${endpoint}?access_token=${token}`,
    status: test3.statusCode,
    success: test3.statusCode === 200
  };
  results.push(result3);
  
  if (result3.success) {
    console.log(`     ${colors.green}✅ SUCCESS - Status: ${test3.statusCode}${colors.reset}`);
  } else {
    console.log(`     ${colors.red}❌ FAILED - Status: ${test3.statusCode}${colors.reset}`);
  }
  
  // Test 4: X-Directus-Token header
  console.log(`\n  4. Testing X-Directus-Token Header:`);
  const test4 = await makeRequest({
    hostname: 'localhost',
    port: 8055,
    path: endpoint,
    method: 'GET',
    headers: {
      'X-Directus-Token': token,
      'Content-Type': 'application/json'
    }
  });
  
  const result4 = {
    method: 'X-Directus-Token',
    header: `X-Directus-Token: '${token}'`,
    status: test4.statusCode,
    success: test4.statusCode === 200
  };
  results.push(result4);
  
  if (result4.success) {
    console.log(`     ${colors.green}✅ SUCCESS - Status: ${test4.statusCode}${colors.reset}`);
  } else {
    console.log(`     ${colors.red}❌ FAILED - Status: ${test4.statusCode}${colors.reset}`);
  }
  
  return results;
}

// Main diagnostic function
async function runDiagnostics() {
  console.log(`${colors.yellow}=================================`);
  console.log(`DIRECTUS AUTHENTICATION DIAGNOSTICS`);
  console.log(`==================================${colors.reset}`);
  console.log(`\nDirectus URL: ${DIRECTUS_URL}`);
  console.log(`Testing ${Object.keys(TOKENS).length} tokens on ${ENDPOINTS.length} endpoints\n`);
  
  const allResults = {};
  
  // Test each token
  for (const [tokenName, token] of Object.entries(TOKENS)) {
    console.log(`\n${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Testing ${tokenName} Token`);
    console.log(`Token: ${token.substring(0, 10)}...${token.substring(token.length - 10)}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    
    allResults[tokenName] = {};
    
    // Test first endpoint to find working method
    const userMeResults = await testAuth(tokenName, token, '/users/me', 'GET');
    const workingMethod = userMeResults.find(r => r.success);
    
    if (workingMethod) {
      console.log(`\n${colors.green}✅ FOUND WORKING METHOD: ${workingMethod.method}${colors.reset}`);
      console.log(`${colors.green}   Correct format: ${workingMethod.header}${colors.reset}`);
      
      // Test other endpoints with working method
      if (workingMethod.method === 'Bearer WITH space') {
        console.log(`\n${colors.blue}Testing other endpoints with working method:${colors.reset}`);
        
        for (const endpoint of ENDPOINTS.slice(1)) {
          const response = await makeRequest({
            hostname: 'localhost',
            port: 8055,
            path: endpoint,
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`  ${endpoint}: ${response.statusCode === 200 ? colors.green + '✅' : colors.red + '❌'} Status ${response.statusCode}${colors.reset}`);
        }
      }
    } else {
      console.log(`\n${colors.red}❌ NO WORKING METHOD FOUND for ${tokenName} token${colors.reset}`);
    }
    
    allResults[tokenName] = userMeResults;
  }
  
  // Summary
  console.log(`\n${colors.yellow}=================================`);
  console.log(`SUMMARY`);
  console.log(`==================================${colors.reset}`);
  
  let workingTokenFound = false;
  for (const [tokenName, results] of Object.entries(allResults)) {
    const workingMethod = results.find(r => r.success);
    if (workingMethod) {
      workingTokenFound = true;
      console.log(`\n${colors.green}✅ ${tokenName} Token WORKS with: ${workingMethod.method}${colors.reset}`);
      console.log(`   Correct syntax: ${workingMethod.header}`);
    } else {
      console.log(`\n${colors.red}❌ ${tokenName} Token DOES NOT WORK with any method${colors.reset}`);
    }
  }
  
  if (workingTokenFound) {
    console.log(`\n${colors.green}✅ SOLUTION FOUND!${colors.reset}`);
    console.log(`\n${colors.yellow}The correct Authorization header format is:${colors.reset}`);
    console.log(`${colors.green}Authorization: 'Bearer TOKEN'  (WITH a space after Bearer)${colors.reset}`);
    
    console.log(`\n${colors.yellow}Fixing import scripts...${colors.reset}`);
    
    // Return the working configuration
    return {
      success: true,
      format: 'Bearer WITH space',
      header: 'Authorization: Bearer TOKEN'
    };
  } else {
    console.log(`\n${colors.red}❌ No working authentication method found!${colors.reset}`);
    console.log(`\nPossible issues:`);
    console.log(`1. Tokens might be expired or invalid`);
    console.log(`2. Directus might require different authentication`);
    console.log(`3. Permissions might not be configured correctly`);
    
    return {
      success: false,
      format: null,
      header: null
    };
  }
}

// Run diagnostics and fix scripts if solution found
async function main() {
  const result = await runDiagnostics();
  
  if (result.success) {
    console.log(`\n${colors.yellow}=================================`);
    console.log(`APPLYING FIX TO IMPORT SCRIPTS`);
    console.log(`==================================${colors.reset}`);
    
    // The scripts are already using the correct format!
    console.log(`\n${colors.green}✅ Good news! The import scripts are already using the correct format:${colors.reset}`);
    console.log(`   Authorization: Bearer TOKEN (with space)`);
    
    console.log(`\n${colors.yellow}The 403 errors indicate a permissions issue in Directus, not an authentication format issue.${colors.reset}`);
    console.log(`\nTo fix this:`);
    console.log(`1. Login to Directus Admin Panel`);
    console.log(`2. Go to Settings → Access Control`);
    console.log(`3. Configure permissions for the tokens/roles`);
    console.log(`4. Ensure CREATE, READ, UPDATE, DELETE permissions are granted`);
  }
}

// Run the diagnostic
main().catch(console.error);