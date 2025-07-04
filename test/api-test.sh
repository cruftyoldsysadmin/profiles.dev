#!/bin/bash
# Test script to verify API connectivity

echo "Testing API endpoints..."

# Test production API
echo -n "Production API (https://api.profiles.dev/webhook): "
if curl -s -o /dev/null -w "%{http_code}" https://api.profiles.dev/webhook | grep -q "405\|200\|401"; then
  echo "✓ Reachable"
else
  echo "✗ Not reachable - use mock testing"
fi

# Test mock API
echo -n "Mock API (https://httpbin.org/post): "
if curl -s -o /dev/null -w "%{http_code}" https://httpbin.org/post | grep -q "200"; then
  echo "✓ Reachable"
else
  echo "✗ Not reachable"
fi