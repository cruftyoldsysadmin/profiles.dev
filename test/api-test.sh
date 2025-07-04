#!/bin/bash
# Test script to verify API connectivity

echo "Testing API endpoints..."

# Test production API
echo -n "Production API (https://api.profiles.dev/webhook): "
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://api.profiles.dev/webhook)
if echo "$STATUS_CODE" | grep -q "405\|200\|401\|403"; then
  echo "✓ Reachable (Status: $STATUS_CODE)"
else
  echo "✗ Not reachable (Status: $STATUS_CODE) - use mock testing"
fi

# Test mock API
echo -n "Mock API (https://httpbin.org/post): "
MOCK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST https://httpbin.org/post)
if echo "$MOCK_STATUS" | grep -q "200"; then
  echo "✓ Reachable (Status: $MOCK_STATUS)"
else
  echo "✗ Not reachable (Status: $MOCK_STATUS)"
fi