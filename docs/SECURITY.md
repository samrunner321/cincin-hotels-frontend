# Sicherheitsrichtlinien für CinCin Hotels

Dieses Dokument beschreibt die Sicherheitsrichtlinien und Best Practices für die Entwicklung und den Betrieb der CinCin Hotels Anwendung.

## Zugangsdaten und Secrets

### API-Tokens

Das Projekt verwendet zwei Arten von Direktus-API-Tokens:

1. **Public Token (DIRECTUS_PUBLIC_TOKEN)**
   - Nur für lesende Zugriffe auf öffentliche Daten vorgesehen
   - Eingeschränkte Berechtigungen in Direktus
   - Kann in Client-Code verwendet werden, sollte aber mit Vorsicht behandelt werden

2. **Admin Token (DIRECTUS_ADMIN_TOKEN)**
   - Für administrative Operationen und privilegierte Zugriffe
   - **STRENG NUR** serverseitig verwenden
   - Darf **NIEMALS** im Client-Code oder in öffentlichen Bereichen zugänglich sein

### Token-Zugriffsmethoden

Verwenden Sie immer die sicheren Zugriffsmethoden aus der `auth.ts`-Datei:

```typescript
import { getDirectusPublicToken, getDirectusAdminToken } from '@/lib/auth';

// Für client-seitige, eingeschränkte API-Zugriffe
const publicToken = getDirectusPublicToken();

// Für server-seitige, privilegierte API-Zugriffe
// (Diese Funktion darf nur serverseitig aufgerufen werden)
const adminToken = getDirectusAdminToken();
```

### Umgebungsvariablen

- Speichern Sie Tokens und Secrets ausschließlich in Umgebungsvariablen
- Verwenden Sie `.env.local` für die lokale Entwicklung (nicht in Git)
- Verwenden Sie sichere Umgebungsvariablen in Ihrer Deployment-Plattform (z.B. Vercel Secrets)
- Sensible Umgebungsvariablen dürfen nicht mit NEXT_PUBLIC_ präfixiert werden

## Sichere API-Implementierung

### Input-Validierung

Alle Benutzereingaben müssen validiert werden. Verwenden Sie die `validateRequest`-Funktion:

```typescript
import { validateRequest } from '@/lib/api/error-handler';
import Joi from 'joi'; // oder eine andere Validierungsbibliothek

// Schema definieren
const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

// In API-Route verwenden
export async function POST(request: Request) {
  try {
    const data = await validateRequest(request, schema);
    // Weiterer Code...
  } catch (error) {
    return handleApiError(error);
  }
}
```

### CORS und CSP

- Die CORS-Konfiguration ist in der Middleware definiert
- Die Content Security Policy (CSP) ist ebenfalls in der Middleware definiert
- Ändern Sie diese Einstellungen nur mit größter Vorsicht

## Authentifizierung und Autorisierung

### Benutzerzugriff

- Alle authentifizierten API-Routen müssen die Benutzerzugriffsrechte überprüfen
- Verwenden Sie Middleware für die Authentifizierung
- Implementieren Sie feingranulare Berechtigungen für Datenoperationen

### API-Rate-Limiting

- Implementieren Sie Rate-Limiting für öffentliche API-Endpunkte
- Überwachen Sie ungewöhnliche API-Nutzungsmuster

## Logging und Überwachung

### Sichere Logging-Praktiken

- Verwenden Sie den zentralen Logger (`logger.ts`)
- Sensible Daten werden automatisch aus Logs gefiltert
- Definieren Sie zusätzliche sensible Schlüsselwörter bei Bedarf

```typescript
import { logger } from '@/lib/utils/logger';

// Sicheres Logging ohne sensible Daten
logger.info('Benutzer hat sich angemeldet', { 
  userId: user.id,
  // Passwort-Feld wird automatisch maskiert
  password: 'sensitive-data' // Wird als "[REDACTED]" geloggt
});
```

## Sicherheits-Checkliste

### Bei neuen Features

- [ ] Sind alle Benutzereingaben validiert?
- [ ] Werden Tokens und Secrets sicher verwaltet?
- [ ] Werden sensible Operationen nur serverseitig durchgeführt?
- [ ] Sind API-Routen entsprechend geschützt?
- [ ] Werden alle Fehler sauber behandelt?
- [ ] Werden keine sensiblen Daten im Client exponiert?

### Deployment-Sicherheit

- [ ] Sind alle Produktions-Umgebungsvariablen korrekt gesetzt?
- [ ] Sind Staging- und Produktionsumgebungen getrennt?
- [ ] Ist der Build-Prozess sicher?
- [ ] Sind unnötige Entwicklungsabhängigkeiten entfernt?

## Meldung von Sicherheitsproblemen

Bei Entdeckung von Sicherheitslücken:

1. Sofort das Entwicklungsteam informieren
2. **NICHT** Sicherheitsprobleme in öffentlichen Issues diskutieren
3. Kritische Sicherheitsprobleme sofort beheben, auch außerhalb des regulären Release-Zyklus