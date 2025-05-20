'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchDebugData() {
      try {
        const response = await fetch('/api/debug-directus');
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error('Error fetching debug data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDebugData();
  }, []);
  
  if (loading) {
    return <div className="p-8">Loading debug information...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Directus API Debug</h1>
      
      <div className="space-y-8">
        {/* Server Ping */}
        <section className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Server Ping</h2>
          <pre className="bg-white p-2 rounded">
            {results.serverPing || 'No response'}
          </pre>
        </section>
        
        {/* Public Token */}
        <section className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Public Token Request</h2>
          <div className="mb-2">Status: {results.hotelsPublicToken?.status}</div>
          <pre className="bg-white p-2 rounded overflow-auto max-h-60">
            {JSON.stringify(results.hotelsPublicToken?.data, null, 2)}
          </pre>
        </section>
        
        {/* Admin Token */}
        <section className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Admin Token Request</h2>
          <div className="mb-2">Status: {results.hotelsAdminToken?.status}</div>
          <pre className="bg-white p-2 rounded overflow-auto max-h-60">
            {JSON.stringify(results.hotelsAdminToken?.data, null, 2)}
          </pre>
        </section>
        
        {/* Directus Token */}
        <section className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Directus Token Request</h2>
          <div className="mb-2">Status: {results.hotelsDirectusToken?.status}</div>
          <pre className="bg-white p-2 rounded overflow-auto max-h-60">
            {JSON.stringify(results.hotelsDirectusToken?.data, null, 2)}
          </pre>
        </section>
        
        {/* Query Param */}
        <section className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Query Parameter Request</h2>
          <div className="mb-2">Status: {results.hotelsQueryParam?.status}</div>
          <pre className="bg-white p-2 rounded overflow-auto max-h-60">
            {JSON.stringify(results.hotelsQueryParam?.data, null, 2)}
          </pre>
        </section>
        
        {/* Full Results */}
        <section className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">All Results</h2>
          <pre className="bg-white p-2 rounded overflow-auto max-h-96">
            {JSON.stringify(results, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}