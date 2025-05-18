'use client';

import { createDirectus, rest, staticToken } from '@directus/sdk';
import { useEffect, useState } from 'react';

// Create a client-side component to test Directus connection
export default function DirectusConfig() {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function checkDirectusConnection() {
      try {
        // Get URL from env
        const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
        
        // Create client with public token - we'll use this for checking
        const client = createDirectus(directusUrl)
          .with(rest())
          .with(staticToken('kFQlJAEbLr5BrPGIbqODGDWiL1TJgLfE')); // Using the public token
          
        // Test connection by fetching server info
        const info = await client.request(rest.get('server/info'));
        
        if (info) {
          console.log('✅ Directus connection successful:', info);
          setStatus('connected');
        } else {
          throw new Error('No response from Directus');
        }
      } catch (err) {
        console.error('❌ Directus connection failed:', err);
        setError(err.message);
        setStatus('error');
      }
    }
    
    checkDirectusConnection();
  }, []);
  
  return (
    <div className="hidden">
      {/* Hidden component - check console for connection status */}
      Directus Status: {status}
      {error && <p>Error: {error}</p>}
    </div>
  );
}