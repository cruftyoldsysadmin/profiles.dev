# Migration Guide: profiles.dev v2

This guide helps existing profiles.dev users migrate to the new self-service model.

## What's Changed?

profiles.dev v2 introduces a self-service model where you control your own profile through your GitHub repository. This brings improved security and full ownership of your profile data.

### Key Changes

1. **Repository Name Requirement**: Your repository MUST be named `profiles.dev`
2. **No Manual Triggers**: `workflow_dispatch` is no longer supported
3. **Push Events Only**: Updates only happen on pushes to your default branch
4. **Owner Validation**: Only the repository owner can update their profile

## Migration Steps

### 1. Rename Your Repository

If your current repository is not named `profiles.dev`:

1. Go to your repository Settings
2. Scroll down to "Repository name"
3. Change the name to exactly `profiles.dev`
4. Click "Rename"

### 2. Update Your Workflow

Edit `.github/workflows/update-profile.yml`:

```yaml
name: Update profiles.dev

on:
  push:
    branches: [ main ]  # or 'master' if that's your default
    paths:
      - 'profile.yaml'
  # Remove any workflow_dispatch trigger

permissions:
  id-token: write
  contents: read

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: nomadops/profiles.dev@v2  # Update to v2
```

### 3. Remove Manual Triggers

If you have `workflow_dispatch:` in your workflow, remove it. The API no longer accepts manually triggered updates.

### 4. Verify Your Setup

After making these changes:

1. Edit your `profile.yaml`
2. Commit and push to your default branch
3. Check the Actions tab to see if the update succeeded
4. Visit `https://profiles.dev/YOUR_USERNAME` to see your profile

## Troubleshooting

### Common Errors

**"Repository name must be profiles.dev"**
- Solution: Rename your repository to exactly `profiles.dev`

**"Actor mismatch: push must come from repository owner"**
- Solution: Ensure you're pushing directly, not from a fork or as a different user

**"Only push events to default branch are supported"**
- Solution: Remove `workflow_dispatch` from your workflow and only push to your default branch

**"Rate limit exceeded"**
- Solution: Wait at least 1 minute between profile updates

### Need Help?

If you encounter issues:

1. Check the [error messages](#common-errors) above
2. Review the workflow logs in the Actions tab
3. Ensure your repository meets all [requirements](README.md#-security--requirements)
4. Open an issue if you need further assistance

## Why These Changes?

These changes improve security by ensuring:
- Only you can update your profile (via your own repository)
- No one can trigger updates on your behalf
- Your profile data stays in your control
- Clear audit trail of all changes

Thank you for using profiles.dev!