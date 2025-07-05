# Test Scenarios for profiles.dev Action v2

This document outlines all test scenarios that need to be validated for the updated profiles.dev action that enforces the new API requirements.

## ✅ Success Scenarios

### 1. Valid Repository Setup
- Repository named exactly `profiles.dev`
- Push event to default branch
- Actor matches repository owner
- Valid `profile.yaml` file
- **Expected**: Profile updates successfully

## ❌ Failure Scenarios

### 1. Repository Name Validation
- Repository named `my-profile` (not `profiles.dev`)
- **Expected Error**: "Repository name must be "profiles.dev" but found "my-profile". Please rename your repository to "{owner}/profiles.dev"."

### 2. Event Type Validation
- Workflow triggered via `workflow_dispatch`
- **Expected Error**: "Only push events are supported. Found event type: workflow_dispatch"

### 3. Actor Validation
- Push from a different user (e.g., via PR from fork)
- **Expected Error**: "Push events must come from the repository owner. Actor: {actor}, Owner: {owner}"

### 4. Branch Validation (API-side)
- Push to non-default branch
- **Expected API Error**: "Only updates to the default branch are allowed. Please push to your default branch."

### 5. Rate Limiting
- Multiple pushes within 1 minute
- **Expected API Error**: "Rate limit exceeded. Please try again later."

## 🧪 Testing Instructions

### Local Testing

1. **Test Repository Name Validation**:
   ```bash
   # In a repo NOT named profiles.dev
   # The action should fail immediately with repository name error
   ```

2. **Test Event Type Validation**:
   ```yaml
   # Add workflow_dispatch trigger
   on:
     workflow_dispatch:
   # The action should fail with event type error
   ```

3. **Test Actor Validation**:
   - Have another user push to your repo
   - The action should fail with actor mismatch error

### Integration Testing

1. **Test Successful Update**:
   - Create repo named `profiles.dev`
   - Add valid workflow (push only)
   - Push profile.yaml changes
   - Verify profile updates at https://profiles.dev/{username}

2. **Test API Validation Errors**:
   - Each API validation should return specific error messages
   - Action should parse and display user-friendly errors

## 📋 Validation Checklist

- [ ] Repository name must be `profiles.dev`
- [ ] Only push events accepted
- [ ] Actor must match repository owner
- [ ] Push must be to default branch
- [ ] Rate limit of 1 update per minute enforced
- [ ] Clear error messages for each validation failure
- [ ] Migration guide helps existing users update
- [ ] Documentation clearly states all requirements

## 🔍 Error Message Mapping

| API Error | Action Error Message |
|-----------|---------------------|
| "repository validation failed" | "Repository name must be exactly "{owner}/profiles.dev". Please rename your repository." |
| "actor mismatch" | "Push must come from repository owner. Current actor: {actor}, Expected: {owner}" |
| "only push events" | "Only push events to the default branch are supported. Current event: {eventName}" |
| "default branch" | "Only updates to the default branch are allowed. Please push to your default branch." |

## 📝 Notes

- All validations happen both client-side (in the action) and server-side (in the API)
- Client-side validation provides immediate feedback
- Server-side validation ensures security even if client is bypassed
- Error messages should guide users to the solution