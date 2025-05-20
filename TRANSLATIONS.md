# Working with Translations in CinCin Hotels

This document explains how to work with translations in the CinCin Hotels application, which integrates with Directus CMS.

## Translation Structure

In our Directus setup, translations are handled through separate translation collections for each main content type:

- **hotels_translations**
- **destinations_translations**
- **categories_translations**
- **rooms_translations**

Each translation collection contains localized versions of content fields linked to the main item.

## Key Fields in Translation Collections

Translation collections typically contain these fields:

- **id**: Unique identifier for the translation record
- **[collection_name]_id**: Foreign key referencing the main item (e.g., `hotels_id`, `destinations_id`)
- **languages_code**: Language code (e.g., `en-US`, `de-DE`)
- **name**: Translated name/title
- **description**: Translated full description
- **short_description**: Translated short description/summary
- **slug**: URL-friendly version of the name, unique per language

## How to Access Translations

When retrieving data from Directus, the main item will have a `translations` field containing an array of IDs pointing to the translation records. 

### Example:

```javascript
// Main hotel object
{
  "id": 1,
  "region": "Alpen",
  "status": "Published",
  "translations": [1, 2]  // Points to records in hotels_translations
}

// Translation in hotels_translations (German)
{
  "id": 1,
  "hotels_id": 1,
  "languages_code": "de-DE",
  "name": "Grand Hotel Alpen",
  "description": "Ein luxuriöses Hotel...",
  "short_description": "Luxus in den Alpen",
  "slug": "grand-hotel-alpen"
}

// Translation in hotels_translations (English)
{
  "id": 2,
  "hotels_id": 1,
  "languages_code": "en-US",
  "name": "Grand Alpine Hotel",
  "description": "A luxurious hotel...",
  "short_description": "Luxury in the Alps",
  "slug": "grand-alpine-hotel"
}
```

## Implementation in Next.js

In your Next.js application, you'll need to:

1. Detect the user's preferred language (from URL, cookie, or browser settings)
2. Fetch both the main item and its translations
3. Find the appropriate translation for the current language
4. Fall back to a default language if the requested translation doesn't exist

### Example Code:

```javascript
// Function to get hotel with translations
async function getHotelWithTranslations(slug, locale = 'en-US') {
  // Get base hotel data
  const hotel = await directusPublicRest.request(
    rest.readItems('hotels', {
      filter: { slug: { _eq: slug } },
      fields: ['*', 'translations.*'],
      limit: 1
    })
  );
  
  if (!hotel || hotel.length === 0) {
    return null;
  }
  
  // Get translation records
  const translations = await directusPublicRest.request(
    rest.readItems('hotels_translations', {
      filter: { 
        hotels_id: { _eq: hotel[0].id },
        languages_code: { _eq: locale }
      },
      limit: 1
    })
  );
  
  // If no translation for requested locale, get default locale
  if (!translations || translations.length === 0) {
    const defaultTranslations = await directusPublicRest.request(
      rest.readItems('hotels_translations', {
        filter: { 
          hotels_id: { _eq: hotel[0].id },
          languages_code: { _eq: 'en-US' }
        },
        limit: 1
      })
    );
    
    return {
      ...hotel[0],
      translation: defaultTranslations[0] || {}
    };
  }
  
  // Return hotel with translation
  return {
    ...hotel[0],
    translation: translations[0]
  };
}
```

## Language Switching

To implement language switching:

1. Add a language selector component to your UI
2. Update the locale in the URL or cookie when language is changed
3. Re-fetch content with the new locale

## Important Tips

1. **Slugs May Differ**: Remember that slugs can be different in each language, so your URLs may change based on the selected language.

2. **Missing Translations**: Always provide a fallback for when translations are missing.

3. **Performance**: To optimize performance, consider fetching translations for only the current language rather than all languages.

4. **SEO**: For SEO purposes, ensure your pages have proper language indicators (`<html lang="de-DE">`) and hreflang links.

5. **Directus Admin**: When adding or editing content in Directus admin, remember to fill in translations for all supported languages.