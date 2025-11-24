# Miniature Valley Chase — JAX & NINO

An atmospheric Pixar-style previs built with Next.js, React Three Fiber, and Tailwind CSS. Follow JAX, the confident red miniature jeep, and NINO, the eager blue repair bot, as they rush through a sunlit valley with cinematic depth of field and warm morning light.

The scene loops every eight seconds, mirroring the requested shot: a low tracking camera on the dirt path, dust trails, swaying grasses, and a playful dialogue exchange.

## Tech Stack

- [Next.js 14](https://nextjs.org/) with the App Router
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) and [drei](https://github.com/pmndrs/drei) helpers for the 3D scene
- [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) for depth of field and bloom
- [Tailwind CSS](https://tailwindcss.com/) for layout and typography

## Local Development

Install dependencies (if you have not already):

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the looping previs. The main 3D scene lives in `src/components/MiniValleyScene.tsx`, while page composition and narrative notes are arranged in `src/app/page.tsx`.

## Quality Checks

Run type-safe builds and linting before shipping:

```bash
npm run lint
npm run build
```

## Deployment

This project is tuned for Vercel. Once you are satisfied with the local build, deploy with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-215415b0
```

After deployment, verify the production URL:

```bash
curl https://agentic-215415b0.vercel.app
```

## Scene Overview

- **Setting:** Miniature valley at golden-morning hour; hand-placed stones, short swaying grass tufts, winding dirt road.
- **Characters:** JAX (mini red jeep with animated headlights) and NINO (blue repair bot with a wobbling tool bag).
- **Action:** JAX leads at speed, raising a dusty wake while NINO dashes behind, nearly tripping under the weight of the toolkit.
- **Dialogue:**  
  - JAX: “Come on, Nino! If you’re slow, we won’t make it!”  
  - NINO: “Wait! This bag is too heavy!”
- **Camera:** Low left tracking shot, focus glued to JAX’s wheels with cinematic bokeh and warm volumetric sunlight filtering through trees.
