# CinCin Hotels Backend with Directus CMS

This document provides detailed information about the Directus CMS backend implementation for the CinCin Hotels website.

## Overview

The backend is built with Directus CMS, a headless CMS that provides flexible content management capabilities and powerful APIs. It serves as the content infrastructure for the CinCin Hotels website, managing all data related to hotels, rooms, destinations, and other content types.

## Directus Installation & Configuration

### Setup

The Directus instance is set up using Docker Compose for both development and production environments. Key components include:

- PostgreSQL database for data storage
- Redis for caching and rate limiting
- Directus CMS for content management
- NGINX for reverse proxy and SSL termination (production only)

### Environment Variables

Important environment variables include:

- `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`: Database credentials
- `KEY`, `SECRET`: Security keys for Directus
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: Directus admin credentials
- `CORS_ORIGIN`, `PUBLIC_URL`: URL configurations
- `EMAIL_FROM`, `EMAIL_SMTP_*`: Email service configuration

## Data Models

The backend is built around several key data collections:

### Hotels Collection

Hotels are the primary content type, featuring:

**Basic Information:**
- Name, slug, subtitle, location, region
- Short and long descriptions
- Address and map coordinates

**Media:**
- Main image
- Gallery with multiple images
- Video URL

**Pricing:**
- Starting price
- Currency
- Pricing notes

**Features:**
- Star rating and user ratings
- Room count
- Amenities (WiFi, Pool, Spa, etc.)
- Special features with descriptions and images
- Categories and tags

**Relationships:**
- Connection to destination
- Owner information
- Rooms (one-to-many)

**SEO & Display:**
- Meta title and description
- Featured and "new" flags
- Sort order

### Rooms Collection

Rooms belong to hotels and include:

**Basic Information:**
- Name, slug, description
- Size, max occupancy
- Bed type and count
- Bathroom count
- View type

**Media:**
- Main image
- Gallery

**Pricing:**
- Price per night
- Currency
- Pricing notes

**Features:**
- Amenities
- Special features

**Relationships:**
- Connection to parent hotel

### Destinations Collection

Destinations represent locations featured on the platform:

**Basic Information:**
- Name, slug, subtitle
- Country, region
- Short and long descriptions
- Map coordinates

**Media:**
- Main image
- Gallery with seasonal images
- Video URL

**Content Sections:**
- Highlights with descriptions and images
- Activities organized by season
- Dining information with restaurants
- Signature dishes
- Chef spotlights
- Travel information (transportation, climate, etc.)
- Weather data by season

**Categorization:**
- Categories and tags
- Featured and popular flags

**SEO:**
- Meta title and description

### Categories Collection

Categories for grouping and filtering:

- Name and slug
- Description
- Icon
- Type (hotel, destination, or both)
- Featured flag
- Sort order

### Pages Collection

Content pages for static content:

- Title and slug
- Rich text content
- Featured image
- Template selection
- Navigation settings
- SEO metadata

## API Integration

### REST API

The backend exposes a comprehensive REST API for accessing all content types. Key endpoints include:

- `/hotels` - Get all hotels with filtering options
- `/hotels/{slug}` - Get a specific hotel by slug
- `/destinations` - Get all destinations with filtering options
- `/destinations/{slug}` - Get a specific destination by slug
- `/categories` - Get all categories with filtering options
- `/pages/{slug}` - Get a specific page by slug
- `/navigation` - Get navigation pages

### GraphQL API

In addition to REST, the backend also provides a GraphQL API for more flexible and optimized data fetching.

### TypeScript Client

A complete TypeScript client library is available for interacting with the API:

```typescript
// Example API client usage
import { getHotels, getHotelBySlug } from '@/lib/directus';

// Get all published hotels
const hotels = await getHotels({
  filter: { status: { _eq: 'published' } }
});

// Get a specific hotel by slug
const hotel = await getHotelBySlug('the-comodo');
```

## Multilingual Support

The backend is configured to support multiple languages:

- English (en-US) - default language
- German (de-DE)

Translation utilities are provided to handle multilingual content:

```typescript
import { getTranslatedContent, LanguageCode } from '@/lib/i18n';

// Get content in German
const translatedHotel = getTranslatedContent(hotel, 'de-DE');
```

## Security & Performance

### Security Measures

- CORS configuration for production
- Rate limiting using Redis
- Content-Security-Policy headers
- HTTPS with SSL/TLS

### Performance Optimization

- Redis caching for API responses
- Optimized database queries
- Image transformation and caching
- CDN-friendly asset delivery

## Deployment

### Development Environment

Start the development environment:

```bash
npm run directus:dev
```

Stop the development environment:

```bash
npm run directus:stop
```

### Production Environment

Start the production environment:

```bash
npm run directus:prod
```

Stop the production environment:

```bash
npm run directus:prod:stop
```

### Backups

Create a manual database backup:

```bash
npm run backup-db
```

Automated daily backups are configured in the production Docker setup.

## Roles & Permissions

Three main roles are defined for content management:

1. **Editors** - Can edit content but not modify schema
2. **Translators** - Can edit translations only
3. **Managers** - Can manage content and users, but not system settings

## Sample Data

Sample data is provided for development and testing:

- Hotels
- Destinations
- Categories
- Pages

Import sample data:

```bash
npm run import-sample-data
```

## Extending the Backend

### Adding New Collections

1. Define the collection structure in the schema.yaml file
2. Update TypeScript type definitions in directus.ts
3. Add API client functions
4. Extend the hooks for data fetching if needed

### Adding Languages

1. Add the new language to the LANGUAGES object in i18n.ts
2. Update translation functions if necessary
3. Configure the language in Directus

### Custom Extensions

Directus supports various extension types:

- Interfaces
- Displays
- Layouts
- Modules
- Endpoints

Extensions can be placed in the /extensions directory and will be loaded automatically by Directus.

## Troubleshooting

### Common Issues

**Database Connection Problems:**
- Check that PostgreSQL is running
- Verify database credentials in .env

**API Errors:**
- Check CORS configuration
- Verify API token validity
- Check request syntax

**Image Loading Issues:**
- Verify the storage configuration
- Check file permissions on uploads directory