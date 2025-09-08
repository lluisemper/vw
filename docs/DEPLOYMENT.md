# Deployment

This project is automatically deployed using **Vercel**.

## Production Deployment

- Branch: `main`
- Backend: JSON server hosted on [Render](https://render.com)
- Node is already installed on Render
- Vercel watches the repository and deploys automatically on changes
- After deployment, verify the site at the production URL

## Preview Deployment (Feature Branches and develop)

- Vercel deploys feature branches to preview URLs
- Access requires collaborator authorization on the repository
- Use preview deployments for testing before merging to main

## Prerequisites for preview branches

- Collaborator access to the repository
- Need Nodejs installed locally to connect with a local json-server.
