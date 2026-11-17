# Dipangshu Golui — Portfolio

A Next.js 15 App Router portfolio built with TypeScript, Tailwind CSS v4, lucide-react and next/font. The animated build sequence is implemented with one requestAnimationFrame loop and IntersectionObserver.

## Run locally

1. Install Node.js 20.9 or newer.
2. Extract this folder and open it in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open http://localhost:3000.

For a production check, run `npm run build` and then `npm start`.

## Deploy free on Vercel

1. Create a GitHub repository and upload the contents of this folder (not the ZIP itself).
2. Sign in at https://vercel.com using GitHub and choose **Add New → Project**.
3. Import the repository. Vercel should detect Next.js automatically.
4. Keep the default build command (`next build`) and output settings, then select **Deploy**.
5. The free Vercel URL will be shown when deployment completes. You can add a custom domain later.

No environment variables or backend services are required for this version.

## Animation controls

- **P**: pause/resume building
- **A**: toggle robot agents (preference saved in localStorage)
- **T**: reload and run the guided scroll tour
- **Esc** or manual scrolling: stop the tour
- `?agents=on`: force agents on, including reduced-motion preference
- `?agents=off`: force agents off

## Content accuracy notes

All biographical and experience claims are based on the supplied one-page resume. The resume does not list dates, hackathons, named frameworks, client names, project URLs or repository URLs, so none are fabricated. The supplied portrait is a JPEG and has a visible room background; the site applies grayscale/contrast treatment and a bottom fade, but it is not a transparent cutout.
