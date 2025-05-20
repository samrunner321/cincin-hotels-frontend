// @ts-nocheck
'use client';

import { createDirectus, rest, staticToken } from '@directus/sdk';
import { useState, useEffect } from 'react';
import { getDirectusPublicToken } from '../../lib/auth-utils';

interface DirectusConfigProps {
  onStatusChange?: (status: 'checking' | 'connected' | 'error', error?: string) => void;
}

interface DirectusConfigState {
  status: 'checking' | 'connected' | 'error';
  error: string | null;
}

/**
 * Komponente zum Testen der Directus-Verbindung
 * - Prüft die Verbindung beim Laden
 * - Versteckt sich selbst im UI
 * - Kann optional einen Status-Callback erhalten
 */
export default function DirectusConfig({ onStatusChange }: DirectusConfigProps) {
  const [state, setState] = useState<DirectusConfigState>({
    status: 'checking',
    error: null
  });
  
  useEffect(() => {
    async function checkDirectusConnection() {
      try {
        // URL aus Umgebungsvariablen abrufen
        const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
        
        // Token sicher über auth-utils abrufen
        const token = getDirectusPublicToken();
        
        // Client mit öffentlichem Token erstellen - wir verwenden dies für die Prüfung
        const client = createDirectus(directusUrl)
          .with(rest())
          .with(staticToken(token));
          
        // Verbindung testen, indem Server-Info abgerufen wird
        const info = await client.request(rest.get('server/info'));
        
        if (info) {
          console.log('✅ Directus connection successful:', info);
          setState({ status: 'connected', error: null });
          
          // Status-Callback aufrufen, wenn vorhanden
          if (onStatusChange) {
            onStatusChange('connected');
          }
        } else {
          throw new Error('No response from Directus');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Directus connection failed:', err);
        setState({ status: 'error', error: errorMessage });
        
        // Status-Callback aufrufen, wenn vorhanden
        if (onStatusChange) {
          onStatusChange('error', errorMessage);
        }
      }
    }
    
    checkDirectusConnection();
  }, [onStatusChange]);
  
  // Versteckte Komponente - Überprüfe die Konsole für den Verbindungsstatus
  return (
    <div className="hidden">
      {/* Diese Komponente rendert kein sichtbares UI */}
      {/* Directus Status: {state.status} */}
      {/* {state.error && <p>Error: {state.error}</p>} */}
    </div>
  );
}