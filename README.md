# bonma

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/bonma7/bonma?utm_source=oss&utm_medium=github&utm_campaign=bonma7%2Fbonma&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

**Modular Daily Assistant** - A customizable personal dashboard

## Overview

bonma is a modular daily assistant application built with a modern monorepo architecture.

## Project Structure

This is a monorepo containing:
- `apps/` - Application packages
- `packages/` - Shared packages and libraries

## Development

This project uses:
- Bun as the runtime and package manager
- Biome for linting and formatting
- TypeScript for type safety

### Getting Started

See [CLAUDE.md](./CLAUDE.md) for detailed development instructions, architecture overview, and common commands.

### Environment Variables

#### Server Configuration

Copy the server environment template:

```bash
cp apps/server/.env.example apps/server/.env
```

#### Frontend Configuration (Local Development)

The frontend uses **runtime configuration** loaded from `apps/web/public/config.json`. This approach allows the app to work across different environments without rebuilding.

The default config points to `http://localhost:3001`:

```json
{
  "apiUrl": "http://localhost:3001"
}
```

To change the API URL for local development, simply edit this file directly—no rebuild required!
