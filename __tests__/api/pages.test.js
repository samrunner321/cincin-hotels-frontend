/**
 * Tests für CMS-Seiten-API-Endpunkte
 * 
 * Diese Tests überprüfen alle Seiten-bezogenen API-Endpunkte:
 * - /api/pages/[slug] - Einzelne CMS-Seite mit Details
 */

import { server } from './jest.setup.api';
import { rest } from 'msw';
import {
  testEndpointWithSchema,
  measureEndpointPerformance,
  mockServerError,
  mockTimeout,
  testConcurrentRequests,
  compareResponses
} from './utils/test-helpers';
import { pageSchema, errorResponseSchema } from './utils/schemas';
import { mockPages } from './mocks/data/pages';

describe('CMS Seiten API Endpoints', () => {
  // Tests für /api/pages/[slug] Endpunkt
  describe('GET /api/pages/[slug]', () => {
    // Happy Path Tests
    test('sollte eine Seite nach Slug zurückgeben', async () => {
      const pageSlug = 'about';
      const page = await testEndpointWithSchema(`/api/pages/${pageSlug}`, pageSchema);
      
      expect(page.slug).toBe(pageSlug);
      expect(page.title).toBe('About Us');
      expect(page).toHaveProperty('content');
      expect(page).toHaveProperty('featured_image');
    });
    
    test('sollte alle erwarteten Details für eine Seite enthalten', async () => {
      const pageSlug = 'contact';
      const page = await testEndpointWithSchema(`/api/pages/${pageSlug}`, pageSchema);
      
      // Prüfe, ob alle wichtigen Felder vorhanden sind
      expect(page).toHaveProperty('id');
      expect(page).toHaveProperty('title');
      expect(page).toHaveProperty('content');
      expect(page).toHaveProperty('status');
      expect(page).toHaveProperty('slug');
      expect(page).toHaveProperty('template');
      
      // Prüfe optionale Felder, die für SEO wichtig sind
      expect(page).toHaveProperty('meta_title');
      expect(page).toHaveProperty('meta_description');
      expect(page).toHaveProperty('show_in_navigation');
    });
    
    test('sollte nur veröffentlichte Seiten zurückgeben', async () => {
      // Prüfen mit einer veröffentlichten Seite
      const publishedPageSlug = 'about';
      const publishedPage = await testEndpointWithSchema(`/api/pages/${publishedPageSlug}`, pageSchema);
      expect(publishedPage.status).toBe('published');
      
      // Prüfen mit einer Draft-Seite (sollte 404 zurückgeben)
      // Annahme: 'sustainability' ist eine Draft-Seite laut mockPages
      const draftPageSlug = 'sustainability';
      const errorResponse = await testEndpointWithSchema(`/api/pages/${draftPageSlug}`, errorResponseSchema, {
        expectedStatus: 404
      });
      
      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse.error).toContain('not found');
    });

    // Fehlerszenarien
    test('sollte 404 zurückgeben, wenn die Seite nicht gefunden wird', async () => {
      const nonExistentSlug = 'non-existent-page';
      const errorResponse = await testEndpointWithSchema(`/api/pages/${nonExistentSlug}`, errorResponseSchema, {
        expectedStatus: 404
      });
      
      expect(errorResponse).toHaveProperty('error');
      expect(errorResponse.error).toContain('not found');
    });
    
    test('sollte 400 zurückgeben, wenn kein Slug angegeben ist', async () => {
      // Dieser Test ist möglicherweise schwierig in Next.js zu implementieren,
      // da die Route-Handler normalerweise immer einen Slug haben
      // Wir könnten einen leeren Slug verwenden
      const emptySlug = '';
      const errorResponse = await testEndpointWithSchema(`/api/pages/${emptySlug}`, errorResponseSchema, {
        expectedStatus: 400
      });
      
      expect(errorResponse).toHaveProperty('error');
    });
    
    test('sollte einen Serverfehler korrekt behandeln', async () => {
      const pageSlug = 'about';
      
      // Mock einen Serverfehler für diesen Test
      mockServerError(`http://localhost:3000/api/pages/${pageSlug}`);
      
      // Prüfen, ob der Fehler korrekt zurückgegeben wird
      const errorResponse = await testEndpointWithSchema(`/api/pages/${pageSlug}`, errorResponseSchema, {
        expectedStatus: 500
      });
      
      expect(errorResponse).toHaveProperty('error');
    });
    
    // Performance Tests
    test('sollte innerhalb des Performance-Limits antworten', async () => {
      const pageSlug = 'about';
      const { duration } = await measureEndpointPerformance(`/api/pages/${pageSlug}`, 1000);
      
      // Zusätzliche Prüfung für Debug-Output
      console.log(`Response time for /api/pages/${pageSlug}: ${duration.toFixed(2)}ms`);
    });
  });
  
  // Tests für strukturelle Aspekte von Seiten
  describe('CMS-Seiten Struktur und Inhalt', () => {
    test('sollte HTML-Inhalte im Content-Feld korrekt verarbeiten', async () => {
      // Seiten mit umfangreichem Content auswählen
      const pageSlug = 'privacy';
      const page = await testEndpointWithSchema(`/api/pages/${pageSlug}`, pageSchema);
      
      // Prüfen, ob der Content in Markdown-Format vorliegt
      expect(page.content).toContain('#');  // Markdown-Überschriften
      expect(page.content).toContain('-');  // Markdown-Listen
    });
    
    test('sollte korrekte Template-Informationen enthalten', async () => {
      // Prüfen einer Seite mit Standard-Template
      const defaultTemplatePageSlug = 'about';
      const defaultTemplatePage = await testEndpointWithSchema(`/api/pages/${defaultTemplatePageSlug}`, pageSchema);
      expect(defaultTemplatePage.template).toBe('default');
      
      // Prüfen einer Seite mit Sidebar-Template
      const sidebarTemplatePageSlug = 'contact';
      const sidebarTemplatePage = await testEndpointWithSchema(`/api/pages/${sidebarTemplatePageSlug}`, pageSchema);
      expect(sidebarTemplatePage.template).toBe('sidebar');
      
      // Prüfen einer Seite mit Landing-Template
      const landingTemplatePageSlug = 'membership';
      const landingTemplatePage = await testEndpointWithSchema(`/api/pages/${landingTemplatePageSlug}`, pageSchema);
      expect(landingTemplatePage.template).toBe('landing');
    });
  });
  
  // Tests für Navigation-bezogene Aspekte
  describe('CMS-Seiten Navigation', () => {
    test('sollte korrekte Navigation-Flags enthalten', async () => {
      // Prüfen einer Seite, die in der Navigation angezeigt werden soll
      const navVisiblePageSlug = 'about';
      const navVisiblePage = await testEndpointWithSchema(`/api/pages/${navVisiblePageSlug}`, pageSchema);
      expect(navVisiblePage.show_in_navigation).toBe(true);
      
      // Prüfen einer Seite, die nicht in der Navigation angezeigt werden soll
      const navHiddenPageSlug = 'privacy';
      const navHiddenPage = await testEndpointWithSchema(`/api/pages/${navHiddenPageSlug}`, pageSchema);
      expect(navHiddenPage.show_in_navigation).toBe(false);
    });
    
    test('sollte korrekte Sortierreihenfolge haben', async () => {
      // Prüfen der Sortier-Informationen für Navigation
      const aboutPageSlug = 'about';
      const aboutPage = await testEndpointWithSchema(`/api/pages/${aboutPageSlug}`, pageSchema);
      expect(aboutPage.sort).toBe(1);
      
      const contactPageSlug = 'contact';
      const contactPage = await testEndpointWithSchema(`/api/pages/${contactPageSlug}`, pageSchema);
      expect(contactPage.sort).toBe(2);
    });
  });
});