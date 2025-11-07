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

## Deployment

### Deploy to Render (Free)

This project includes a `render.yaml` configuration for easy deployment with PR preview environments.

#### Prerequisites
- A [Render account](https://render.com) (free tier available)
- Your code pushed to a GitHub repository

#### Steps

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

2. **Configure Environment Variables**

   After the initial deployment, set these environment variables in the Render dashboard:

   **For `bonma-api` service:**
   - `CORS_ORIGIN`: Set to your frontend URL (e.g., `https://bonma-web.onrender.com`)

   **For `bonma-web` service:**
   - `API_URL`: Set to your backend URL (e.g., `https://bonma-api.onrender.com`)

   The `API_URL` is used during the build process to generate the runtime `config.json` file, which the frontend loads when it starts.

3. **Deploy**
   - Render will automatically build and deploy both services
   - Your backend will be available at `https://bonma-api.onrender.com`
   - Your frontend will be available at `https://bonma-web.onrender.com`

#### PR Preview Environments

Preview environments are automatically created for pull requests:
- Each PR gets its own temporary deployment with unique URLs
- Preview URLs are posted as comments on the PR
- Previews are deleted when the PR is closed
- Perfect for testing changes before merging

**For preview environments to work properly:**
1. After deploying a PR, note the preview API URL (e.g., `https://bonma-api-pr-123.onrender.com`)
2. Go to the `bonma-web` preview environment settings in Render
3. Set the `API_URL` environment variable to the preview API URL
4. Trigger a redeploy of the web preview

*Note: Preview environment variables need to be set manually for each PR, or you can set up a consistent naming pattern and automate this with Render's API.*

#### Database Persistence

The SQLite database is stored on a persistent disk at `/data/bonma.db`. This ensures your data persists across deployments.

#### Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds (cold start)
- 750 hours/month of free usage per service
