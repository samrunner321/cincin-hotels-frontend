#!/bin/bash

ADMIN_TOKEN="_hyi9xDNuZOsX3tnM2GCd-GZpTYIoWVn"
DIRECTUS_URL="http://localhost:8055"

echo "🏷️ Erstelle Felder für Collections..."

# Felder für hotels
curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/hotels" \
  -d '{"field":"name","type":"string","meta":{"interface":"input"},"schema":{"is_nullable":true}}'

curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/hotels" \
  -d '{"field":"description","type":"text","meta":{"interface":"input-multiline"},"schema":{"is_nullable":true}}'

curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/hotels" \
  -d '{"field":"images","type":"json","meta":{"interface":"files","special":["files"]},"schema":{"is_nullable":true}}'

# Felder für destinations
curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/destinations" \
  -d '{"field":"name","type":"string","meta":{"interface":"input"},"schema":{"is_nullable":true}}'

curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/destinations" \
  -d '{"field":"description","type":"text","meta":{"interface":"input-multiline"},"schema":{"is_nullable":true}}'

# Felder für categories
curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/categories" \
  -d '{"field":"name","type":"string","meta":{"interface":"input"},"schema":{"is_nullable":true}}'

curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/categories" \
  -d '{"field":"icon","type":"string","meta":{"interface":"input"},"schema":{"is_nullable":true}}'

echo "Erstelle Relation von hotels zu destinations..."
curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/hotels" \
  -d '{"field":"destination","type":"uuid","meta":{"interface":"select-dropdown-m2o","special":["m2o"]},"schema":{"is_nullable":true}}'

curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/relations" \
  -d '{"collection":"hotels","field":"destination","related_collection":"destinations"}'

echo "Erstelle m2m Relation von hotels zu categories..."
curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/hotels_categories" \
  -d '{"field":"hotels_id","type":"uuid","meta":{"interface":"select-dropdown-m2o","special":["m2o"]},"schema":{"is_nullable":true}}'

curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/hotels_categories" \
  -d '{"field":"categories_id","type":"uuid","meta":{"interface":"select-dropdown-m2o","special":["m2o"]},"schema":{"is_nullable":true}}'

curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/relations" \
  -d '{"collection":"hotels_categories","field":"hotels_id","related_collection":"hotels","meta":{"junction_field":"categories_id"}}'

curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/relations" \
  -d '{"collection":"hotels_categories","field":"categories_id","related_collection":"categories","meta":{"junction_field":"hotels_id"}}'

curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "$DIRECTUS_URL/fields/hotels" \
  -d '{"field":"categories","type":"alias","meta":{"special":["m2m"],"interface":"list-m2m","options":{"template":"{{categories_id.name}}"}}}'

echo "✅ Felder und Beziehungen erstellt!"

