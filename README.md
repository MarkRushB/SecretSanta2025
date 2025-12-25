<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1VlOI-2N_ImaVfJQ2rsCPlHtHCTfIvDvO

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This app is configured to automatically deploy to GitHub Pages when you push to the main branch.

### Setup Instructions

1. **Add GEMINI_API_KEY Secret:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add a secret named `GEMINI_API_KEY` with your Gemini API key as the value

2. **Enable GitHub Pages:**
   - Go to your repository Settings → Pages
   - Under "Source", select "GitHub Actions"

3. **Deploy:**
   - Push your changes to the `main` branch
   - The GitHub Actions workflow will automatically build and deploy your app
   - Your app will be available at: **https://markrushb.github.io/SecretSanta2025/**

### Manual Deployment

You can also trigger a deployment manually:
- Go to the "Actions" tab in your repository
- Select the "Deploy to GitHub Pages" workflow
- Click "Run workflow"
