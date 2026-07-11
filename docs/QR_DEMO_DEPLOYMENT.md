# QR Demo Deployment

## Goal

The hackathon QR code should open one stable static URL. Judges do not need accounts, API keys, or a shared backend.

## What Each Judge Gets

Every judge receives:

- The same frontend version.
- The same demo code and mock recognition flows.
- Their own browser-local inventory, pet state, actions, demo date, and AI plan progress.

They do not share data with other judges because the MVP stores state in browser local storage through Zustand persist.

## Recommended Mode

Use static QR demo mode:

```bash
VITE_STATIC_QR_DEMO=true
VITE_ENABLE_REMOTE_AI=false
VITE_ENABLE_REAL_OCR=false
```

In this mode:

- Image upload accepts files but uses stable mock recognition candidates.
- AI daily rescue plan uses local rule fallback.
- No `/api/*` backend is required.
- No third-party AI key is required.

## Deployment Shape

The deployable artifact is the Vite static build:

```bash
npm install
npm run build
```

The static host should serve `dist/`.

The QR code should point to the deployed app URL, for example:

```text
https://example-demo-host/pet
```

The exact host can be GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any static server. The app should not depend on host-specific server functions in QR demo mode.

## Data Isolation

Current isolation:

- Different phones: isolated automatically.
- Different browsers on the same device: isolated automatically.
- Same browser and same URL: shared local state.

For a judge’s personal phone, no extra session logic is needed.

If many people use the same shared device, use one of these:

- Click `Clear local data`.
- Click `Reload demo pantry`.
- Open an incognito/private window.
- Future enhancement: add `?session=judge-a` and scope the storage key by session.

## What Not To Use For QR Demo

Do not rely on:

- Vite dev server middleware.
- `/api/recognize`, `/api/coach`, or `/api/daily-plan`.
- Real Google/OpenAI keys.
- Shared backend storage.
- A single shared browser profile for multiple judges.

## Manual Acceptance Checklist

Before generating the final QR code:

- Static build succeeds.
- Deployed URL opens on a phone.
- Dashboard loads demo pantry.
- Add page mock receipt works.
- Uploading an image shows stable mock recognition instead of an API error.
- AI daily rescue plan returns local recipe steps and usage tasks.
- Today mission and AI daily plan synchronize after a food action.
- Refresh preserves the judge’s local state.
- `Clear local data` resets only the current browser.

## Future Remote AI Mode

Remote AI can be added later with serverless functions or a small backend. In that mode:

- API keys stay server-side.
- `/api/recognize`, `/api/coach`, and `/api/daily-plan` become real deployed endpoints.
- Browser-local inventory can still remain isolated per judge.

Do not enable remote AI for the stable hackathon QR demo unless the backend is already deployed and tested.
