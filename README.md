<div align="center">

<img src="src/assets/forge-logo.webp" alt="Forge logo" width="96" />

# Forge

**Workout and nutrition tracker. Log every rep and meal, and turn your training data into measurable progress.**

[Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Project Structure](#project-structure) · [Roadmap](#roadmap) · [License](#license) · [Author](#author)

</div>

---

## About

Forge is a personal performance system for people who train seriously. It brings workout logging, nutrition tracking, and progress insights into one place, so training data becomes something you can measure and act on.

The public landing page is live. The authenticated dashboard is under development (see the [Roadmap](#roadmap)).

**Live site:** TODO: add your deployed URL

## Features

**Available now (landing site)**

- Scroll-driven hero with interactive 3D fitness models (dumbbells, punching bag, water bottle)
- Animated product sections: philosophy, nutrition tracking, and training progress
- Interactive nutrition target calculator
- Live community statistics (workouts logged, personal records, meals tracked) from the public API
- Responsive layout with accessible, semantic markup
- SEO setup: meta tags, Open Graph image, `sitemap.xml`, `robots.txt`, web app manifest

**In development**

- User authentication
- Dashboard with workout logging, nutrition tracking, and progress charts

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Animation | Motion, GSAP (ScrollTrigger) |
| 3D | Three.js (GLB models) |
| Data fetching | TanStack Query |
| Routing | React Router |
| Icons | Tabler Icons |
| UI components | Custom components, some adapted from Aceternity UI |
| Tooling | ESLint, GitHub Actions CI |

> TODO: add your backend and database here once they are finalized.

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/x-hamza47/fitness-tracker
cd fitness-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment variables

Create a `.env` file in the project root (it is git-ignored):

```env
VITE_API_URL=[TODO](http://localhost:5000/api)
```

> TODO: check `src/lib/api.ts` and match the variable name your code actually reads.

### Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the dev server |
| `npm run build` | Create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

> TODO: confirm these against the `scripts` section of `package.json`.

## Project Structure

```text
src/
├── app/            # Providers and router
├── assets/         # Images, logo, team photos
├── components/
│   ├── common/     # Shared components (navbar)
│   ├── three/      # 3D scene, camera rig, models
│   └── ui/         # Reusable UI components
├── hooks/          # Custom hooks
├── layouts/        # Page layouts
├── lib/            # API client and utilities
├── pages/
│   ├── public/     # Landing page and its sections
│   └── dashboard/  # Authenticated dashboard (in progress)
└── services/       # API service functions
```

## CI/CD

GitHub Actions runs on every push and pull request (see `.github/workflows/ci.yml`).

> TODO: list what the workflow runs (for example lint and build) and how deployment works.

## Roadmap

- [x] Landing page
- [x] Nutrition target calculator
- [x] SEO foundations
- [ ] Authentication
- [ ] Dashboard
- [ ] Workout logging
- [ ] Nutrition tracking
- [ ] Progress charts and insights
- [ ] Automated tests

## License

Copyright (c) 2026 Hamza Aamir. All rights reserved.

This code is provided for viewing purposes only. See [LICENSE](./LICENSE) for details.

## Author

**Hamza Aamir**, Full-Stack Developer

[GitHub](https://github.com/x-hamza47) · [LinkedIn](https://www.linkedin.com/in/hamza-aamir-dev/) · [Portfolio](https://hamzaamir-portfolio.web.app/)