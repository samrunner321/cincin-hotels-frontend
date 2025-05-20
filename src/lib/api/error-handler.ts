import { NextResponse } from 'next/server';
import { logger } from '../utils/logger';

/**
 * Standard API-Fehlertypen
 */
export enum ApiErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  DIRECTUS_ERROR = 'DIRECTUS_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

/**
 * API-Fehlerklasse für strukturierte Fehler
 */
export class ApiError extends Error {
  type: ApiErrorType;
  statusCode: number;
  details?: any;
  
  constructor(
    message: string, 
    type: ApiErrorType = ApiErrorType.INTERNAL_SERVER_ERROR, 
    statusCode: number = 500,
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
  
  /**
   * Konvertiert den Fehler in ein JSON-Objekt
   */
  toJSON() {
    return {
      error: {
        message: this.message,
        type: this.type,
        ...(this.details && { details: this.details }),
      },
    };
  }
}

/**
 * Factory-Funktionen für gängige API-Fehler
 */
export const ApiErrors = {
  validationError: (message: string = 'Validierungsfehler', details?: any) => 
    new ApiError(message, ApiErrorType.VALIDATION_ERROR, 400, details),
  
  notFound: (message: string = 'Ressource nicht gefunden') => 
    new ApiError(message, ApiErrorType.NOT_FOUND, 404),
  
  unauthorized: (message: string = 'Nicht autorisiert') => 
    new ApiError(message, ApiErrorType.UNAUTHORIZED, 401),
  
  forbidden: (message: string = 'Zugriff verweigert') => 
    new ApiError(message, ApiErrorType.FORBIDDEN, 403),
  
  internalServerError: (message: string = 'Interner Serverfehler') => 
    new ApiError(message, ApiErrorType.INTERNAL_SERVER_ERROR, 500),
  
  badRequest: (message: string = 'Ungültige Anfrage', details?: any) => 
    new ApiError(message, ApiErrorType.BAD_REQUEST, 400, details),
  
  directusError: (message: string = 'Fehler beim Zugriff auf die CMS-API', details?: any) => 
    new ApiError(message, ApiErrorType.DIRECTUS_ERROR, 500, details),
  
  rateLimitExceeded: (message: string = 'Rate-Limit überschritten') => 
    new ApiError(message, ApiErrorType.RATE_LIMIT_EXCEEDED, 429),
};

/**
 * Zentraler Fehlerhandler für API-Routen
 * 
 * Verwendung:
 * ```ts
 * export async function GET(request: Request) {
 *   try {
 *     // API-Logik hier
 *     if (!data) {
 *       throw ApiErrors.notFound('Daten nicht gefunden');
 *     }
 *     return NextResponse.json(data);
 *   } catch (error) {
 *     return handleApiError(error);
 *   }
 * }
 * ```
 */
export function handleApiError(error: unknown): NextResponse {
  // Wenn es bereits ein ApiError ist
  if (error instanceof ApiError) {
    logger.error(`API Error [${error.type}]: ${error.message}`, {
      statusCode: error.statusCode,
      details: error.details,
    });
    
    return NextResponse.json(error.toJSON(), { status: error.statusCode });
  }
  
  // Wenn es ein anderer Fehler ist
  const message = error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten';
  logger.error(`Unexpected API Error: ${message}`, { error });
  
  // In der Produktion möchten wir keine internen Details preisgeben
  const publicMessage = process.env.NODE_ENV === 'production' 
    ? 'Ein interner Serverfehler ist aufgetreten' 
    : message;
  
  return NextResponse.json(
    { error: { message: publicMessage, type: ApiErrorType.INTERNAL_SERVER_ERROR } },
    { status: 500 }
  );
}

/**
 * Hilfsfunktion zum Extrahieren von Validierungsdaten aus einer Request
 * Wirft einen ApiError, wenn die Validierung fehlschlägt
 */
export async function validateRequest<T>(
  request: Request, 
  schema: { validateAsync(data: any): Promise<T> }
): Promise<T> {
  try {
    const body = await request.json();
    return await schema.validateAsync(body);
  } catch (error) {
    throw ApiErrors.validationError(
      'Ungültiges Request-Format', 
      error instanceof Error ? { message: error.message } : undefined
    );
  }
}

/**
 * Hilfsfunktion zum Extrahieren von Parametern aus einer URL
 * Wirft einen ApiError, wenn ein benötigter Parameter fehlt
 */
export function getQueryParams(
  searchParams: URLSearchParams,
  required: string[] = [],
  defaultValues: Record<string, string> = {}
): Record<string, string> {
  const params: Record<string, string> = { ...defaultValues };
  
  // Alle Suchparameter extrahieren
  Array.from(searchParams.entries()).forEach(([key, value]) => {
    params[key] = value;
  });
  
  // Prüfen, ob alle benötigten Parameter vorhanden sind
  const missingParams = required.filter(param => !(param in params));
  if (missingParams.length > 0) {
    throw ApiErrors.validationError(
      'Fehlende Parameter', 
      { missingParams }
    );
  }
  
  return params;
}