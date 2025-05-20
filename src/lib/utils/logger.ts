/**
 * Logger-Modul für CinCin Hotels
 * 
 * Bietet einheitliche Logging-Funktionen mit Support für verschiedene Log-Level
 * und kontextbezogene Metadaten.
 */

/**
 * Log-Level-Typen
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Log-Eintrag-Interface
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

/**
 * Zentrale Logger-Klasse
 */
class Logger {
  private minLevel: LogLevel;
  private enableConsole: boolean;
  
  constructor() {
    // Standardmäßig alle Logs ausgeben
    this.minLevel = LogLevel.DEBUG;
    this.enableConsole = true;
    
    // In Produktionsumgebung nur INFO und höher loggen
    if (process.env.NODE_ENV === 'production') {
      this.minLevel = LogLevel.INFO;
    }
  }
  
  /**
   * Konfiguration des Loggers
   */
  configure(options: { minLevel?: LogLevel; enableConsole?: boolean }) {
    if (options.minLevel !== undefined) {
      this.minLevel = options.minLevel;
    }
    
    if (options.enableConsole !== undefined) {
      this.enableConsole = options.enableConsole;
    }
  }
  
  /**
   * Prüft, ob ein Log-Level ausgegeben werden soll
   */
  private shouldLog(level: LogLevel): boolean {
    const levelPriority: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
    };
    
    return levelPriority[level] >= levelPriority[this.minLevel];
  }
  
  /**
   * Erstellt einen Log-Eintrag
   */
  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    // Sensible Daten filtern - Tokens, Passwörter usw.
    const sanitizedContext = context 
      ? this.sanitizeContext(context) 
      : undefined;
    
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: sanitizedContext,
    };
  }
  
  /**
   * Entfernt sensible Daten aus dem Kontext
   */
  private sanitizeContext(context: Record<string, any>): Record<string, any> {
    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'auth', 'credential', 'direktus_token',
      'directus_token', 'directus_admin_token', 'directus_public_token'
    ];
    
    const result: Record<string, any> = {};
    
    Object.entries(context).forEach(([key, value]) => {
      // Prüfen, ob der Schlüssel sensibel ist
      const isKeySensitive = sensitiveKeys.some(sk => 
        key.toLowerCase().includes(sk.toLowerCase())
      );
      
      if (isKeySensitive) {
        // Sensible Daten maskieren
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        // Rekursiv durch verschachtelte Objekte gehen
        result[key] = this.sanitizeContext(value);
      } else {
        // Nichtsensible Daten beibehalten
        result[key] = value;
      }
    });
    
    return result;
  }
  
  /**
   * Gibt den Log-Eintrag aus
   */
  private output(entry: LogEntry): void {
    if (!this.enableConsole) return;
    
    const { timestamp, level, message, context } = entry;
    
    // Farbkodierung für verschiedene Log-Level
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m',  // Grün
      [LogLevel.WARN]: '\x1b[33m',  // Gelb
      [LogLevel.ERROR]: '\x1b[31m', // Rot
      reset: '\x1b[0m',             // Reset
    };
    
    // Formatierte Log-Ausgabe
    const prefix = `${colors[level]}[${level.toUpperCase()}]\x1b[0m [${timestamp}]`;
    
    if (typeof window === 'undefined') {
      // Server-seitige Ausgabe
      const formattedContext = context 
        ? `\n${JSON.stringify(context, null, 2)}`
        : '';
      
      // Entsprechende Console-Methode verwenden
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(`${prefix} ${message}${formattedContext}`);
          break;
        case LogLevel.INFO:
          console.info(`${prefix} ${message}${formattedContext}`);
          break;
        case LogLevel.WARN:
          console.warn(`${prefix} ${message}${formattedContext}`);
          break;
        case LogLevel.ERROR:
          console.error(`${prefix} ${message}${formattedContext}`);
          break;
      }
    } else {
      // Client-seitige Ausgabe
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(prefix, message, context || '');
          break;
        case LogLevel.INFO:
          console.info(prefix, message, context || '');
          break;
        case LogLevel.WARN:
          console.warn(prefix, message, context || '');
          break;
        case LogLevel.ERROR:
          console.error(prefix, message, context || '');
          break;
      }
    }
  }
  
  /**
   * Öffentliche Logging-Methoden
   */
  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
      this.output(entry);
    }
  }
  
  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.createLogEntry(LogLevel.INFO, message, context);
      this.output(entry);
    }
  }
  
  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.createLogEntry(LogLevel.WARN, message, context);
      this.output(entry);
    }
  }
  
  error(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.createLogEntry(LogLevel.ERROR, message, context);
      this.output(entry);
    }
  }
  
  /**
   * Performancemessung
   */
  time(label: string): () => void {
    if (!this.shouldLog(LogLevel.DEBUG)) return () => {};
    
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      this.debug(`${label} completed in ${duration.toFixed(2)}ms`);
    };
  }
}

// Exportiere eine singleton-Instanz des Loggers
export const logger = new Logger();

/**
 * Beispiel-Verwendung:
 * 
 * ```ts
 * import { logger } from '../../../lib/utils/logger';
 * 
 * // Grundlegende Verwendung
 * logger.info('Anwendung gestartet');
 * logger.warn('Veraltete Funktion aufgerufen', { function: 'oldFunction', caller: 'Component X' });
 * logger.error('Fehler beim Laden der Daten', { error: err, componentName: 'DataLoader' });
 * 
 * // Performancemessung
 * const endTimer = logger.time('API-Anfrage');
 * await fetchData();
 * endTimer(); // Gibt aus: "API-Anfrage completed in XXXms"
 * ```
 */