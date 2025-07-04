# GitHub Action Development Documentation

This document contains technical details for developing and maintaining the profiles.dev GitHub Action.

# profiles.dev GitHub Action

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-profiles.dev-blue?logo=github)](https://github.com/marketplace/actions/update-profiles-dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Automatically update your [profiles.dev](https://profiles.dev) profile when you push changes to your repository.

## Features

- 🚀 Automatic profile updates on push
- 🔐 Secure authentication using GitHub OIDC tokens
- ✅ Profile validation before submission
- 📊 Clear success/failure reporting in Actions logs
- 🎯 Zero configuration required (works with defaults)
- 🛡️ Type-safe with full TypeScript support

## Quick Start

1. Create a `profile.yaml` file in your repository root:

```yaml
name: Jane Developer
bio: Full-stack developer passionate about open source
location: San Francisco, CA
email: jane@example.com
website: https://jane.dev
twitter: "@janedev"
github: janedev
linkedin: https://linkedin.com/in/janedev

skills:
  - TypeScript
  - React
  - Node.js
  - Python
  - PostgreSQL

projects:
  - name: Awesome Project
    description: A revolutionary app that changes everything
    url: https://github.com/janedev/awesome-project
    role: Creator & Maintainer

experience:
  - company: Tech Corp
    position: Senior Software Engineer
    duration: 2020 - Present
    description: Leading development of cloud-native applications

education:
  - institution: University of Technology
    degree: B.S. Computer Science
    year: 2019
```

2. Create `.github/workflows/update-profile.yml`:

```yaml
name: Update profiles.dev

on:
  push:
    branches: [ main ]
    paths:
      - 'profile.yaml'
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Update profiles.dev
        uses: nomadops/profiles.dev@v1
        with:
          debug: true # Optional: Enable debug logging
```

That's it! Your profile will automatically update whenever you push changes to `profile.yaml`.

## Configuration

### Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `api-endpoint` | API endpoint for profiles.dev webhook | No | `https://api.profiles.dev/api/webhook` |
| `profile-path` | Path to profile.yaml file | No | `profile.yaml` |
| `debug` | Enable debug logging | No | `false` |

### Outputs

| Output | Description |
|--------|-------------|
| `profile-id` | The ID of the updated profile |
| `status` | Status of the update operation (`success` or `failed`) |
| `message` | Detailed message about the operation |

## Profile Schema

The `profile.yaml` file supports the following fields:

### Required Fields
- None! All fields are optional, allowing you to share only what you want.

### Optional Fields

#### Basic Information
- `name` - Your display name
- `bio` - A brief description about yourself
- `company` - Current company or organization
- `location` - Your location
- `email` - Contact email
- `website` - Personal website URL

#### Social Links
- `twitter` - Twitter/X handle (with or without @)
- `github` - GitHub username
- `linkedin` - LinkedIn profile URL

#### Professional Information
- `skills` - Array of skills/technologies
- `languages` - Array of programming languages

#### Projects
Array of projects with:
- `name` (required) - Project name
- `description` - Project description
- `url` - Project URL
- `role` - Your role in the project

#### Experience
Array of work experiences with:
- `company` (required) - Company name
- `position` (required) - Job title
- `duration` - Time period
- `description` - Role description

#### Education
Array of educational qualifications with:
- `institution` (required) - School/University name
- `degree` - Degree obtained
- `field` - Field of study
- `year` - Graduation year

#### Certifications
Array of certifications with:
- `name` (required) - Certification name
- `issuer` - Issuing organization
- `year` - Year obtained
- `url` - Verification URL

## Advanced Usage

### Manual Trigger

Add a workflow dispatch trigger to update your profile on demand:

```yaml
on:
  push:
    branches: [ main ]
    paths:
      - 'profile.yaml'
  workflow_dispatch:
    inputs:
      debug:
        description: 'Enable debug mode'
        required: false
        default: 'false'
        type: boolean
```

### Custom Profile Path

If your profile file is in a different location:

```yaml
- name: Update profiles.dev
  uses: nomadops/profiles.dev@v1
  with:
    profile-path: '.github/my-profile.yaml'
```

### Conditional Updates

Only update on specific conditions:

```yaml
- name: Update profiles.dev
  if: contains(github.event.head_commit.message, '[update profile]')
  uses: nomadops/profiles.dev@v1
```

### Matrix Builds

Update multiple profiles from a single repository:

```yaml
strategy:
  matrix:
    profile:
      - path: profiles/personal.yaml
        name: personal
      - path: profiles/professional.yaml
        name: professional

steps:
  - uses: actions/checkout@v4
  
  - name: Update ${{ matrix.profile.name }} profile
    uses: nomadops/profiles.dev@v1
    with:
      profile-path: ${{ matrix.profile.path }}
```

## Troubleshooting

### Common Issues

1. **"Profile file not found"**
   - Ensure `profile.yaml` exists in your repository root
   - Check the file name spelling (it's `profile.yaml`, not `profile.yml`)
   - If using a custom path, verify it's correct

2. **"Authentication failed"**
   - Ensure your workflow has `id-token: write` permission
   - Verify your repository is public or has proper access

3. **"Validation failed"**
   - Check the error messages in the Actions log
   - Ensure all URLs are valid
   - Verify email format is correct

### Debug Mode

Enable debug logging for detailed information:

```yaml
- name: Update profiles.dev
  uses: nomadops/profiles.dev@v1
  with:
    debug: true
```

## API Endpoints

The action supports two API endpoints:

1. **Production (Default)**: `https://api.profiles.dev/api/webhook`
   - Used automatically when no `api-endpoint` is specified
   - Requires valid OIDC token from GitHub
   - Creates/updates real profiles

2. **Mock Testing**: `https://httpbin.org/post`
   - Use by setting `api-endpoint: 'https://httpbin.org/post'`
   - Echoes back the request for debugging
   - Useful when API isn't ready or for testing action mechanics

### When to Use Each Endpoint

**Use Production API when:**
- Testing the complete integration
- Verifying OIDC authentication
- Testing in production-like environment
- The API is deployed and ready

**Use Mock API when:**
- The real API isn't deployed yet
- Testing action mechanics only
- Debugging payload structure
- Avoiding test data in production

### Example: Switching to Mock API
```yaml
- uses: nomadops/profiles.dev@v1
  with:
    api-endpoint: 'https://httpbin.org/post'  # Override default
    debug: true
```

## Security

This action uses GitHub's OIDC token feature for secure authentication. No API keys or secrets are required. The token is automatically generated by GitHub and can only be used by authorized repositories.

### Required Permissions

```yaml
permissions:
  id-token: write    # Required for OIDC token
  contents: read     # Required to read profile.yaml
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the action
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@profiles.dev
- 🐛 Issues: [GitHub Issues](https://github.com/nomadops/profiles.dev/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/nomadops/profiles.dev/discussions)

---

Made with ❤️ by [NomadOps](https://github.com/nomadops)