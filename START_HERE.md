# Snigdha — Chapter 23: website source

This ZIP contains the recovered source for the birthday website, including the UI, styling, server-side wish submission route, dependency lockfiles, and existing tests.

## Editing
- app/page.tsx: text, sections, interactions, and birthday content
- app/globals.css: colors, typography, responsive styles
- lib/wish-submit.ts: PocketBase wish submission adapter
- app/api/wishes/route.ts: same-origin POST /api/wishes endpoint

## Run locally
Use Node.js 22.13 or later. In this folder run:

    npm install
    npm run dev

Open the local URL printed by the development server (normally http://localhost:5173).

## Build and host

    npm run build
    npm start

This is a React/Vinext full-stack project. The production build targets a Cloudflare Worker. npm start previews the built Worker locally; it is not a deployment command. For your own hosting, deploy the generated Worker with your own Cloudflare configuration or adapt the source to your chosen server/framework. A static-only host cannot run the /api/wishes route. The original README.md includes framework/build details.

Wish submission points to https://spb.tmadhu.me/api/collections/wish/records. No database data or superuser credentials are included. Existing database tables were not changed. Change RECORDS_URL in lib/wish-submit.ts if you use another backend.

The exported website uses Google Fonts over the network.

This export does not alter the currently published website.
