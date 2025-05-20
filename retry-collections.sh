#!/bin/bash
ADMIN_TOKEN="_hyi9xDNuZOsX3tnM2GCd-GZpTYIoWVn"

echo "Erstelle Collections erneut..."
curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "http://localhost:8055/collections" \
  -d '{"collection":"hotels","meta":{"icon":"hotel"}}'

curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "http://localhost:8055/collections" \
  -d '{"collection":"destinations","meta":{"icon":"place"}}'

curl -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
  -X POST "http://localhost:8055/collections" \
  -d '{"collection":"categories","meta":{"icon":"category"}}'

echo "Prüfe Collections..."
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  -X GET "http://localhost:8055/collections"

