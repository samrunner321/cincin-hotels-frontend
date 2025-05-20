# Migration Plan: directus-client.js → src/lib/api/directus-client.ts

## Übersicht

Der `directus-client.js` ist eine kritische Komponente, die als Schnittstelle zur Directus CMS-API dient. Diese Komponente hat eine Komplexität von 46 und ist eine der Grund-Foundation-Komponenten, die viele andere Komponenten verwenden.

## Quelldatei-Analyse

Bevor wir mit der Migration beginnen, analysieren wir die bestehende Implementierung:

```javascript
// components/common/directus-client.js
// Stellt Verbindungen zum Directus CMS her
// Behandelt API-Aufrufe, Caching und Fehlerbehandlung
```

## Ziel der Migration

1. Vollständige Konvertierung zu TypeScript mit strengen Typen
2. Verbesserte Fehlerbehandlung und besseres Error Reporting
3. Implementierung von effizienteren Caching-Strategien
4. Bessere Konfigurationsmöglichkeiten
5. Umfassende Dokumentation mit JSDoc

## Schrittweise Implementierung

### Schritt 1: TypeScript-Interfaces erstellen

Zunächst erstellen wir die notwendigen TypeScript-Interfaces in `src/types/api.ts`:

```typescript
// src/types/api.ts

export interface DirectusConfig {
  url: string;
  token?: string;
  cacheTimeout?: number;
  fetchTimeout?: number;
  debug?: boolean;
}

export interface DirectusResponse<T> {
  data: T;
  meta?: Record<string, any>;
  error?: DirectusError;
}

export interface DirectusError {
  code: number;
  message: string;
  extensions?: Record<string, any>;
}

export interface DirectusCollection<T> {
  data: T[];
  meta: {
    filter_count?: number;
    total_count?: number;
    page?: number;
    page_count?: number;
  };
}

export interface DirectusAsset {
  id: string;
  title: string;
  description?: string;
  type?: string;
  filesize?: number;
  width?: number;
  height?: number;
  duration?: number;
  embed?: string;
  filename_disk?: string;
  filename_download: string;
  modified_on: string;
  created_on: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface DirectusQueryParams {
  fields?: string[];
  sort?: string[];
  filter?: Record<string, any>;
  limit?: number;
  offset?: number;
  page?: number;
  deep?: Record<string, any>;
  search?: string;
}
```

### Schritt 2: Konfigurationsmodul erstellen

Als nächstes erstellen wir ein Konfigurationsmodul in `src/lib/api/directus-config.ts`:

```typescript
// src/lib/api/directus-config.ts
import { DirectusConfig } from '../../types/api';

const DEFAULT_CONFIG: DirectusConfig = {
  url: process.env.NEXT_PUBLIC_DIRECTUS_URL || '',
  token: process.env.DIRECTUS_API_TOKEN || undefined,
  cacheTimeout: 60000, // 1 Minute
  fetchTimeout: 10000, // 10 Sekunden
  debug: process.env.NODE_ENV === 'development',
};

export function getDirectusConfig(overrides?: Partial<DirectusConfig>): DirectusConfig {
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
  };
}

export function validateDirectusConfig(config: DirectusConfig): void {
  if (!config.url) {
    throw new Error('Directus URL is required');
  }
  
  // URL Format validieren
  try {
    new URL(config.url);
  } catch (e) {
    throw new Error(`Invalid Directus URL: ${config.url}`);
  }
}
```

### Schritt 3: Fehlerbehandlungsmodul erstellen

Dann erstellen wir ein spezielles Fehlerbehandlungsmodul in `src/lib/api/directus-error-handler.ts`:

```typescript
// src/lib/api/directus-error-handler.ts
import { DirectusError } from '../../types/api';

export class DirectusApiError extends Error {
  code: number;
  extensions?: Record<string, any>;

  constructor(error: DirectusError) {
    super(error.message);
    this.name = 'DirectusApiError';
    this.code = error.code;
    this.extensions = error.extensions;
    
    // Stellt sicher, dass instanceof funktioniert
    Object.setPrototypeOf(this, DirectusApiError.prototype);
  }
}

export function handleDirectusError(error: unknown): never {
  if (error instanceof DirectusApiError) {
    throw error;
  }
  
  if (error instanceof Error) {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      throw new DirectusApiError({
        code: 503,
        message: `Service Unavailable: ${error.message}`,
      });
    }
    
    if (error.message.includes('timeout')) {
      throw new DirectusApiError({
        code: 408,
        message: `Request Timeout: ${error.message}`,
      });
    }
    
    throw new DirectusApiError({
      code: 500,
      message: `Internal Error: ${error.message}`,
    });
  }
  
  throw new DirectusApiError({
    code: 500,
    message: `Unknown Error: ${String(error)}`,
  });
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof DirectusApiError && error.code === 404;
}
```

### Schritt 4: Cache-Implementierung

Anschließend erstellen wir ein effizientes Cache-System in `src/lib/api/directus-cache.ts`:

```typescript
// src/lib/api/directus-cache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

export class DirectusCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly defaultTimeout: number;
  
  constructor(defaultTimeout: number = 60000) {
    this.defaultTimeout = defaultTimeout;
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    const now = Date.now();
    if (now - entry.timestamp > this.defaultTimeout) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }
  
  set<T>(key: string, data: T, etag?: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      etag,
    });
  }
  
  getEtag(key: string): string | undefined {
    return this.cache.get(key)?.etag;
  }
  
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }
  
  clear(): void {
    this.cache.clear();
  }
}
```

### Schritt 5: Hauptclient-Implementierung

Schließlich erstellen wir die Hauptimplementierung des Directus-Clients in `src/lib/api/directus-client.ts`:

```typescript
// src/lib/api/directus-client.ts
import {
  DirectusConfig,
  DirectusResponse,
  DirectusCollection,
  DirectusQueryParams,
  DirectusAsset,
} from '../../types/api';
import { getDirectusConfig, validateDirectusConfig } from './directus-config';
import { DirectusApiError, handleDirectusError } from './directus-error-handler';
import { DirectusCache } from './directus-cache';

/**
 * DirectusClient bietet eine typsichere Schnittstelle zur Directus CMS API.
 * 
 * @example
 * ```typescript
 * const client = new DirectusClient();
 * const hotels = await client.getItems<Hotel>('hotels', { 
 *   fields: ['id', 'name', 'description'] 
 * });
 * ```
 */
export class DirectusClient {
  private config: DirectusConfig;
  private cache: DirectusCache;
  
  /**
   * Erzeugt eine neue Instanz des DirectusClient.
   * 
   * @param config - Optionale Konfigurationseinstellungen
   */
  constructor(config?: Partial<DirectusConfig>) {
    this.config = getDirectusConfig(config);
    validateDirectusConfig(this.config);
    this.cache = new DirectusCache(this.config.cacheTimeout);
  }
  
  /**
   * Setzt die Konfiguration des Clients.
   * 
   * @param config - Neue Konfigurationseinstellungen
   */
  setConfig(config: Partial<DirectusConfig>): void {
    this.config = getDirectusConfig(config);
    validateDirectusConfig(this.config);
    
    // Cache-Timeout aktualisieren, wenn es sich geändert hat
    if (config.cacheTimeout && config.cacheTimeout !== this.cache.defaultTimeout) {
      this.cache = new DirectusCache(config.cacheTimeout);
    }
  }
  
  /**
   * Generische Methode für API-Anfragen an Directus.
   * 
   * @param endpoint - API-Endpunkt
   * @param method - HTTP-Methode
   * @param params - Abfrageparameter
   * @param body - Request-Body für POST/PATCH/PUT
   * @param useCache - Cache verwenden (nur für GET)
   * @returns Die API-Antwort
   */
  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    params?: Record<string, any>,
    body?: any,
    useCache: boolean = true
  ): Promise<T> {
    try {
      // URL konstruieren
      const url = new URL(endpoint, this.config.url);
      
      // Query-Parameter hinzufügen
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach(v => url.searchParams.append(key, String(v)));
            } else {
              url.searchParams.append(key, String(value));
            }
          }
        });
      }
      
      const cacheKey = `${method}:${url.toString()}`;
      
      // Bei GET-Anfragen den Cache prüfen
      if (method === 'GET' && useCache) {
        const cachedResult = this.cache.get<T>(cacheKey);
        if (cachedResult) {
          if (this.config.debug) {
            console.log(`[DirectusClient] Cache hit for ${url.toString()}`);
          }
          return cachedResult;
        }
      }
      
      // Request-Header vorbereiten
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Auth-Token hinzufügen, falls vorhanden
      if (this.config.token) {
        headers['Authorization'] = `Bearer ${this.config.token}`;
      }
      
      // ETag für bedingte Anfragen hinzufügen
      const etag = this.cache.getEtag(cacheKey);
      if (etag) {
        headers['If-None-Match'] = etag;
      }
      
      // Fetch-Optionen vorbereiten
      const options: RequestInit = {
        method,
        headers,
      };
      
      // Body hinzufügen für nicht-GET-Anfragen
      if (method !== 'GET' && body !== undefined) {
        options.body = JSON.stringify(body);
      }
      
      // Timeout-Promise erstellen
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timeout after ${this.config.fetchTimeout}ms`));
        }, this.config.fetchTimeout);
      });
      
      // Fetch-Promise mit Timeout ausführen
      const response = await Promise.race([
        fetch(url.toString(), options),
        timeoutPromise
      ]) as Response;
      
      // 304 Not Modified behandeln
      if (response.status === 304) {
        const cachedResult = this.cache.get<T>(cacheKey);
        if (cachedResult) {
          return cachedResult;
        }
      }
      
      // Fehler-Codes behandeln
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          errors: [{ message: `HTTP error ${response.status}` }]
        }));
        
        throw new DirectusApiError({
          code: response.status,
          message: errorData.errors?.[0]?.message || `HTTP error ${response.status}`,
          extensions: errorData.errors?.[0]?.extensions,
        });
      }
      
      // ETag aus der Antwort extrahieren
      const newEtag = response.headers.get('etag');
      
      // Antwort parsen
      const result = await response.json() as T;
      
      // Ergebnis cachen, falls es sich um eine GET-Anfrage handelt
      if (method === 'GET' && useCache) {
        this.cache.set(cacheKey, result, newEtag || undefined);
      }
      
      return result;
    } catch (error) {
      // Fehlerbehandlung
      if (this.config.debug) {
        console.error('[DirectusClient] Error:', error);
      }
      
      throw handleDirectusError(error);
    }
  }
  
  /**
   * Holt eine einzelne Element aus einer Collection.
   * 
   * @param collection - Name der Collection
   * @param id - ID des Elements
   * @param params - Zusätzliche Abfrageparameter
   * @returns Das angeforderte Element
   */
  async getItem<T>(
    collection: string,
    id: string | number,
    params?: DirectusQueryParams
  ): Promise<T> {
    const transformedParams = this.transformQueryParams(params);
    const endpoint = `items/${collection}/${id}`;
    
    const response = await this.request<DirectusResponse<T>>(
      endpoint,
      'GET',
      transformedParams
    );
    
    return response.data;
  }
  
  /**
   * Holt mehrere Elemente aus einer Collection.
   * 
   * @param collection - Name der Collection
   * @param params - Abfrageparameter
   * @returns Die angeforderten Elemente mit Metadaten
   */
  async getItems<T>(
    collection: string,
    params?: DirectusQueryParams
  ): Promise<DirectusCollection<T>> {
    const transformedParams = this.transformQueryParams(params);
    const endpoint = `items/${collection}`;
    
    return this.request<DirectusCollection<T>>(
      endpoint,
      'GET',
      transformedParams
    );
  }
  
  /**
   * Erstellt ein neues Element in einer Collection.
   * 
   * @param collection - Name der Collection
   * @param item - Das zu erstellende Element
   * @returns Das erstellte Element
   */
  async createItem<T>(
    collection: string,
    item: Partial<T>
  ): Promise<T> {
    const endpoint = `items/${collection}`;
    
    const response = await this.request<DirectusResponse<T>>(
      endpoint,
      'POST',
      undefined,
      item,
      false
    );
    
    // Cache für diese Collection invalidieren
    this.cache.invalidatePattern(new RegExp(`items/${collection}`));
    
    return response.data;
  }
  
  /**
   * Aktualisiert ein Element in einer Collection.
   * 
   * @param collection - Name der Collection
   * @param id - ID des Elements
   * @param item - Die zu aktualisierenden Felder
   * @returns Das aktualisierte Element
   */
  async updateItem<T>(
    collection: string,
    id: string | number,
    item: Partial<T>
  ): Promise<T> {
    const endpoint = `items/${collection}/${id}`;
    
    const response = await this.request<DirectusResponse<T>>(
      endpoint,
      'PATCH',
      undefined,
      item,
      false
    );
    
    // Cache für diese Collection invalidieren
    this.cache.invalidatePattern(new RegExp(`items/${collection}`));
    
    return response.data;
  }
  
  /**
   * Löscht ein Element aus einer Collection.
   * 
   * @param collection - Name der Collection
   * @param id - ID des Elements
   */
  async deleteItem(
    collection: string,
    id: string | number
  ): Promise<void> {
    const endpoint = `items/${collection}/${id}`;
    
    await this.request(
      endpoint,
      'DELETE',
      undefined,
      undefined,
      false
    );
    
    // Cache für diese Collection invalidieren
    this.cache.invalidatePattern(new RegExp(`items/${collection}`));
  }
  
  /**
   * Holt ein Asset nach ID.
   * 
   * @param id - ID des Assets
   * @param params - Zusätzliche Abfrageparameter
   * @returns Das angeforderte Asset
   */
  async getAsset(
    id: string,
    params?: DirectusQueryParams
  ): Promise<DirectusAsset> {
    const transformedParams = this.transformQueryParams(params);
    const endpoint = `assets/${id}`;
    
    const response = await this.request<DirectusResponse<DirectusAsset>>(
      endpoint,
      'GET',
      transformedParams
    );
    
    return response.data;
  }
  
  /**
   * Konvertiert Abfrageparameter ins richtige Format für die Directus API.
   * 
   * @param params - Die zu konvertierenden Parameter
   * @returns Transformierte Parameter für die API
   */
  private transformQueryParams(params?: DirectusQueryParams): Record<string, any> {
    if (!params) {
      return {};
    }
    
    const result: Record<string, any> = {};
    
    if (params.fields) {
      result.fields = params.fields.join(',');
    }
    
    if (params.sort) {
      result.sort = params.sort.join(',');
    }
    
    if (params.filter) {
      result.filter = JSON.stringify(params.filter);
    }
    
    if (params.limit !== undefined) {
      result.limit = params.limit;
    }
    
    if (params.offset !== undefined) {
      result.offset = params.offset;
    }
    
    if (params.page !== undefined) {
      result.page = params.page;
    }
    
    if (params.deep) {
      result.deep = JSON.stringify(params.deep);
    }
    
    if (params.search) {
      result.search = params.search;
    }
    
    return result;
  }
  
  /**
   * Löscht den gesamten Cache.
   */
  clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Löscht den Cache für eine bestimmte Collection.
   * 
   * @param collection - Name der Collection
   */
  clearCollectionCache(collection: string): void {
    this.cache.invalidatePattern(new RegExp(`items/${collection}`));
  }
}

// Singleton-Instanz für einfachen Import
const directusClient = new DirectusClient();
export default directusClient;
```

### Schritt 6: Index-Datei für einfachen Import

Zum Schluss erstellen wir eine Index-Datei, um alle Exporte zu bündeln:

```typescript
// src/lib/api/index.ts
export * from './directus-client';
export * from './directus-config';
export * from './directus-error-handler';
export { default as directusClient } from './directus-client';
```

## Tests

Wir erstellen umfassende Tests für den DirectusClient:

```typescript
// src/lib/api/__tests__/directus-client.test.ts
import { DirectusClient } from '../directus-client';
import { DirectusApiError } from '../directus-error-handler';
import fetchMock from 'jest-fetch-mock';

// Mock für fetch
beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('DirectusClient', () => {
  const mockConfig = {
    url: 'https://directus.example.com/',
    token: 'test-token',
  };
  
  it('should fetch items correctly', async () => {
    const client = new DirectusClient(mockConfig);
    const mockResponse = {
      data: [
        { id: '1', name: 'Test Hotel' },
        { id: '2', name: 'Another Hotel' },
      ],
      meta: {
        filter_count: 2,
        total_count: 2,
      },
    };
    
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
    
    const result = await client.getItems('hotels', {
      fields: ['id', 'name'],
    });
    
    expect(fetchMock).toHaveBeenCalledWith(
      'https://directus.example.com/items/hotels?fields=id%2Cname',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token',
        }),
      })
    );
    
    expect(result).toEqual(mockResponse);
  });
  
  it('should handle errors correctly', async () => {
    const client = new DirectusClient(mockConfig);
    
    fetchMock.mockResponseOnce(JSON.stringify({
      errors: [{ message: 'Item not found' }],
    }), { status: 404 });
    
    await expect(client.getItem('hotels', '999')).rejects.toThrow(
      new DirectusApiError({ code: 404, message: 'Item not found' })
    );
  });
  
  it('should use cache for repeated requests', async () => {
    const client = new DirectusClient(mockConfig);
    const mockResponse = {
      data: { id: '1', name: 'Test Hotel' },
    };
    
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
    
    // Erste Anfrage
    await client.getItem('hotels', '1');
    
    // Zweite Anfrage sollte aus dem Cache kommen
    await client.getItem('hotels', '1');
    
    // fetch sollte nur einmal aufgerufen worden sein
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  
  // Weitere Tests für andere Methoden...
});
```

## Migrationsplan für abhängige Komponenten

Nach der Migration des `directus-client` müssen alle abhängigen Komponenten aktualisiert werden:

1. Suche nach allen Imports von `components/common/directus-client.js`
2. Aktualisieren der Imports auf `src/lib/api/directus-client.ts`
3. Anpassen der Aufrufe an die neue API

## Rollback-Strategie

1. Beide Versionen temporär behalten
2. Eine Wrapper-Datei erstellen, die auf die alte Version zurückgreift, falls die neue Version Fehler verursacht

## Validierung und Testen

1. Unit-Tests für alle neuen Module
2. Integration-Tests mit API-Mocks
3. Manuelle Tests mit einer lokalen Directus-Instanz
4. Performance-Benchmarks für die neue Cache-Implementierung

## Zeitplan für directus-client-Migration

| Aufgabe | Geschätzter Aufwand |
|---------|---------------------|
| Analyse der bestehenden Implementierung | 1 Stunde |
| Erstellen der TypeScript-Interfaces | 1 Stunde |
| Implementieren der Konfiguration und Fehlerbehandlung | 1.5 Stunden |
| Implementieren der Cache-Logik | 1 Stunde |
| Implementieren des Hauptclients | 2 Stunden |
| Schreiben der Tests | 1.5 Stunden |
| Dokumentation | 1 Stunde |
| **Gesamt** | **8-9 Stunden** |