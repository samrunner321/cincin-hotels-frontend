#!/bin/bash

# CinCin Hotels Directus Setup mit curl
# Dieses Skript verwendet curl, um Collections und Felder in Directus zu erstellen

DIRECTUS_URL="http://localhost:8055"
ADMIN_TOKEN="_hyi9xDNuZOsX3tnM2GCd-GZpTYIoWVn"

echo "🚀 Starte Directus-Setup mit curl für CinCin Hotels..."

# 1. Erstelle Collections
echo "📊 Erstelle Collections..."

# Hotels Collection
echo "Erstelle hotels Collection..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/collections" \
  -d '{"collection":"hotels","meta":{"icon":"hotel","note":"Hotels im CinCin Hotels Netzwerk"}}' > /dev/null

# Destinations Collection
echo "Erstelle destinations Collection..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/collections" \
  -d '{"collection":"destinations","meta":{"icon":"place","note":"Reiseziele für CinCin Hotels"}}' > /dev/null

# Categories Collection
echo "Erstelle categories Collection..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/collections" \
  -d '{"collection":"categories","meta":{"icon":"category","note":"Kategorien für Hotels"}}' > /dev/null

# Articles Collection
echo "Erstelle articles Collection..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/collections" \
  -d '{"collection":"articles","meta":{"icon":"article","note":"Blog und Journal Artikel"}}' > /dev/null

# 2. Erstelle Felder
echo -e "\n🏷️ Erstelle Felder für Collections..."

# Hotels Felder
echo "Erstelle Felder für hotels..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/hotels" \
  -d '{"field":"name","type":"string","meta":{"interface":"input"},"schema":{"is_nullable":true}}' > /dev/null

curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/hotels" \
  -d '{"field":"description","type":"text","meta":{"interface":"input-multiline"},"schema":{"is_nullable":true}}' > /dev/null

curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/hotels" \
  -d '{"field":"images","type":"json","meta":{"interface":"files","special":["files"]},"schema":{"is_nullable":true}}' > /dev/null

# Categories Felder
echo "Erstelle Felder für categories..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/categories" \
  -d '{"field":"name","type":"string","meta":{"interface":"input"},"schema":{"is_nullable":true}}' > /dev/null

curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/categories" \
  -d '{"field":"icon","type":"string","meta":{"interface":"input"},"schema":{"is_nullable":true}}' > /dev/null

# Articles Felder
echo "Erstelle Felder für articles..."
curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/articles" \
  -d '{"field":"title","type":"string","meta":{"interface":"input"},"schema":{"is_nullable":true}}' > /dev/null

curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/articles" \
  -d '{"field":"content","type":"text","meta":{"interface":"input-rich-text-md"},"schema":{"is_nullable":true}}' > /dev/null

curl -s -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/articles" \
  -d '{"field":"author","type":"string","meta":{"interface":"input"},"schema":{"is_nullable":true}}' > /dev/null

echo -e "\n✅ Directus-Setup erfolgreich abgeschlossen!"