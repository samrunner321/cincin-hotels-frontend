# CinCin Hotels Architektur

Diese Dokumentation bietet einen Überblick über die Architektur des CinCin Hotels Projekts, einschließlich der Projektstruktur, Sicherheitsrichtlinien und Best Practices.

## Inhaltsverzeichnis

1. [Projektstruktur](#projektstruktur)
2. [Sicherheitsrichtlinien](#sicherheitsrichtlinien)
3. [Fehlerbehandlung](#fehlerbehandlung)
4. [API-Design](#api-design)
5. [Umgebungsvariablen](#umgebungsvariablen)

## Projektstruktur

Das Projekt folgt einer standardisierten Struktur mit dem Hauptquellcode im `/src`-Verzeichnis:

```
/src/                # Alles Quellcode in einem Verzeichnis
  ├── app/           # Next.js App Router Seiten und Layouts
  │   ├── api/       # API-Routen
  │   ├── hotels/    # Hotels-Seiten
  │   └── ...        # Andere Seiten und Routen
  ├── components/    # React-Komponenten
  │   ├── common/    # Allgemeine Komponenten
  │   ├── hotels/    # Hotel-bezogene Komponenten
  │   └── ...        # Andere Komponenten
  ├── hooks/         # Custom React Hooks
  ├── lib/           # Hilfsfunktionen und Utilities
  │   ├── api/       # API-Funktionen und Fehlerbehandlung
  │   ├── auth.ts    # Authentifizierungs-Funktionen
  │   └── utils/     # Allgemeine Utilities (Logger, etc.)
  └── middleware.ts  # Next.js Middleware
/public/             # Statische Assets
/docs/               # Dokumentation
```

### Komponentenstruktur

- Jede Komponente sollte in ihrer eigenen Datei sein
- Verwenden Sie benannte Exporte für Utilities und Default-Exporte für Komponenten
- Folgen Sie dem Muster von Container/Präsentationskomponenten wo anwendbar

## Sicherheitsrichtlinien

### API-Tokens und Secrets

- **NIEMALS** API-Tokens oder Secrets direkt im Code hardcodieren
- Verwenden Sie die `auth.ts`-Funktionen zum sicheren Zugriff auf Tokens:
  - `getDirectusPublicToken()` - Für clientseitige, eingeschränkte API-Zugriffe
  - `getDirectusAdminToken()` - Für serverseitige, privilegierte API-Zugriffe (niemals im Client)

### Token-Sicherheit

Die Anwendung unterscheidet zwei Arten von Tokens:

1. **Public Token (DIRECTUS_PUBLIC_TOKEN)**
   - Für lesende Zugriffe auf öffentliche Daten
   - Kann im Client-Code verwendet werden (mit Vorsicht)
   - Sollte begrenzte Berechtigungen haben

2. **Admin Token (DIRECTUS_ADMIN_TOKEN)**
   - Für administrative Operationen und privilegierte Zugriffe
   - **STRENG** nur serverseitig verwenden
   - Niemals in Client-Code oder öffentliche APIs durchsickern lassen

### Datensanitisierung

- Validieren Sie alle Benutzereingaben mit der `validateRequest`-Funktion
- Verwenden Sie die `sanitizeContext`-Funktion des Loggers, um sensible Daten zu filtern

## Fehlerbehandlung

### Client-seitige Fehlerbehandlung

Verwenden Sie die `ErrorBoundary`-Komponente, um React-Komponentenfehler zu fangen:

```tsx
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Als Komponente
<ErrorBoundary fallback={<FallbackUI />}>
  <YourComponent />
</ErrorBoundary>

// Oder als HOC
const SafeComponent = withErrorBoundary(YourComponent, {
  fallback: <FallbackUI />,
  onError: (error, errorInfo) => logger.error('Komponentenfehler', { error, errorInfo })
});
```

### API-Fehlerbehandlung

Verwenden Sie den zentralen API-Fehlerhandler für konsistente Fehlerbehandlung:

```ts
import { handleApiError, ApiErrors } from '@/lib/api/error-handler';

export async function GET(request: Request) {
  try {
    // API-Logik
    if (!data) {
      throw ApiErrors.notFound('Daten nicht gefunden');
    }
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Logging

Verwenden Sie den zentralen Logger für konsistentes Logging:

```ts
import { logger } from '@/lib/utils/logger';

// Verschiedene Log-Level
logger.debug('Detaillierte Debugging-Informationen');
logger.info('Allgemeine Informationen');
logger.warn('Warnungen, die Aufmerksamkeit erfordern könnten');
logger.error('Fehler, die behoben werden müssen', { error });

// Performanz-Messung
const endTimer = logger.time('Operation');
// ... Code ausführen
endTimer(); // Gibt "Operation completed in XXXms" aus
```

## API-Design

### API-Routen Struktur

- API-Routen befinden sich in `/src/app/api/`
- Routen sollten saubere, RESTful-Endpunkte haben
- Verwenden Sie die `handleApiError`-Funktion für einheitliche Fehlerbehandlung

### Standardisierte Antwortformate

Erfolgsantworten:
```json
{
  "data": { ... },
  "meta": { ... } // Optional
}
```

Fehlerantworten:
```json
{
  "error": {
    "message": "Fehlermeldung",
    "type": "ERROR_TYPE",
    "details": { ... } // Optional
  }
}
```

## Umgebungsvariablen

### Benötigte Variablen

| Variable | Beschreibung | Beispiel |
|----------|-------------|---------|
| `NEXT_PUBLIC_DIRECTUS_URL` | URL der Directus-API | `http://localhost:8055` |
| `DIRECTUS_PUBLIC_TOKEN` | Token für Leseoperationen | `your_public_token` |
| `DIRECTUS_ADMIN_TOKEN` | Token für Admin-Operationen | `your_admin_token` |

### Vollständige Liste

Siehe `.env.local.example` für eine vollständige Liste mit Erklärungen.