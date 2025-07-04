# profiles.dev

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge)](https://github.com/nomadops/profiles.dev/generate)
[![GitHub Action](https://img.shields.io/badge/GitHub%20Action-profiles.dev-blue?style=for-the-badge&logo=github-actions)](https://github.com/marketplace/actions/update-profiles-dev)

Your developer profile, powered by GitHub. This repository serves two purposes:

1. **🎯 Template Repository**: Fork or use as template to create your profile
2. **⚙️ GitHub Action**: Automatically updates your profile on profiles.dev

## 🚀 Quick Start (30 seconds)

### Option 1: Use This Template (Recommended)

1. Click the "Use this template" button above
2. Name your repo (e.g., `my-profile` or anything you like)
3. Edit `profile.yaml` with your information
4. Commit and push - your profile auto-updates!

### Option 2: Add to Existing Repository

Add this workflow to `.github/workflows/update-profile.yml`:

```yaml
name: Update profiles.dev

on:
  push:
    branches: [ main ]
    paths:
      - 'profile.yaml'

permissions:
  id-token: write
  contents: read

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: nomadops/profiles.dev@v1
```

Then create your `profile.yaml` and push!

## 📝 Profile Configuration

Edit `profile.yaml` to customize your profile. All fields are optional:

```yaml
name: Jane Developer
bio: Full-stack developer passionate about open source
location: San Francisco, CA
email: jane@example.com
website: https://jane.dev

# Social links
twitter: "@janedev"
github: janedev
linkedin: https://linkedin.com/in/janedev

# Professional info
skills:
  - TypeScript
  - React
  - Node.js

projects:
  - name: Cool Project
    description: An amazing project
    url: https://github.com/janedev/cool-project
```

See the [full profile schema](#profile-schema) below for all available fields.

## 🎨 Your Profile URL

Once set up, your profile will be available at:

```
https://profiles.dev/YOUR_GITHUB_USERNAME
```

## 📋 Profile Schema

<details>
<summary>Click to see all available fields</summary>

### Basic Information
- `name` - Your display name
- `bio` - Brief description about yourself
- `company` - Current company/organization
- `location` - Your location
- `email` - Contact email
- `website` - Personal website

### Social Links
- `twitter` - Twitter/X handle or URL
- `github` - GitHub username
- `linkedin` - LinkedIn profile URL

### Professional
- `skills` - Array of skills
- `languages` - Array of languages

### Projects
Array of projects with:
- `name` (required)
- `description`
- `url`
- `role`

### Experience
Array of work experiences with:
- `company` (required)
- `position` (required)
- `duration`
- `description`

### Education
Array of education with:
- `institution` (required)
- `degree`
- `field`
- `year`

### Certifications
Array of certifications with:
- `name` (required)
- `issuer`
- `year`
- `url`

</details>

## 🛠️ Advanced Usage

### Manual Updates

Trigger a manual update anytime:

1. Go to Actions tab
2. Select "Update profiles.dev"
3. Click "Run workflow"

### Custom Configuration

```yaml
- uses: nomadops/profiles.dev@v1
  with:
    profile-path: 'custom/path/to/profile.yaml'
    debug: true
```

### Multiple Profiles

```yaml
strategy:
  matrix:
    profile: [personal.yaml, professional.yaml]
steps:
  - uses: actions/checkout@v4
  - uses: nomadops/profiles.dev@v1
    with:
      profile-path: ${{ matrix.profile }}
```

## 🔧 For Action Developers

This repository also contains the GitHub Action source code. See [ACTION_README.md](ACTION_README.md) for development details.

## 🤝 Contributing

We welcome contributions! Whether it's:
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 💡 Ideas and suggestions

Please open an issue or submit a PR.

## 📜 License

MIT © NomadOps

---

<p align="center">
  Made with ❤️ by the <a href="https://github.com/nomadops">NomadOps</a> team
</p>

<p align="center">
  <a href="https://profiles.dev">profiles.dev</a> •
  <a href="https://github.com/nomadops/profiles.dev/issues">Issues</a> •
  <a href="https://github.com/marketplace/actions/update-profiles-dev">Marketplace</a>
</p>