<div align="center">

# WhoUnfollowed

**See who doesn't follow you back on Instagram. Open source, so you can check that for yourself.**

Upload the data export Instagram already gives you. Your browser reads it locally and shows the full picture in seconds. No password, no server, no login.

[![Web app license: AGPL-3.0](https://img.shields.io/badge/web-AGPL--3.0-01696F?style=flat-square)](./LICENSE)
[![Core license: MPL-2.0](https://img.shields.io/badge/core-MPL--2.0-A84B2F?style=flat-square)](./packages/core/LICENSE)
[![Built with Next.js 15](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Self-hosted](https://img.shields.io/badge/hosting-self--hosted-0B2426?style=flat-square)](https://www.hetzner.com/cloud/)

[**whounfollowed.co**](https://whounfollowed.co) · [How it works](#how-it-works) · [Privacy](#privacy) · [Self-hosting](#self-hosting)

</div>

---

## Why this exists

Most Instagram follower trackers ask for your password. That breaks Instagram's terms of service, puts your account at risk, and hands your credentials to a stranger.

WhoUnfollowed takes a different path. Instagram's **Download Your Information** feature (mandated by GDPR) gives you a ZIP of your own follower and following data. WhoUnfollowed reads that file **entirely inside your browser**. There is no upload, no server round trip, and no account required on the free plan.

You export data you already own. We just read it. And unlike every closed-source tracker in this space, you don't have to take that claim on faith: the web app is AGPL-3.0 and the parser that touches your data is MPL-2.0, both public in this repository. Read the code instead of trusting a privacy policy.

## What you get

- The complete list of accounts you follow that don't follow you back
- A **Radar** health score with follow ratio and a growth timeline
- **Snapshot comparison** to see exactly who unfollowed you between two dates
- One-click CSV export of any list
- On the free plan, zero bytes ever leave your device

## How it works

1. Request your data from Instagram (Followers and Following, JSON format, all time)
2. Download the ZIP that Instagram emails you, usually within minutes
3. Drop it on [whounfollowed.co](https://whounfollowed.co)
4. The browser parses it in roughly two seconds and renders the full report

| | |
|---|---|
| Typical parse time | ~2 seconds |
| Data sent to a server (free plan) | 0 bytes |
| Instagram API calls | 0 |
| Passwords required | 0 |

Step-by-step export guide: [How to export your Instagram data](https://whounfollowed.co/how-to-export).

## Features

### Free, no signup

- Full non-followers list from a single export
- CSV export
- Runs entirely client-side

### Pro

- Unlimited snapshot history
- **Radar**: health score, follow-age tracking, pending-follow detection
- Snapshot comparison across any two dates
- Follower growth charts
- Triage workflow
- Encrypted cloud sync *(in progress)*

### Mobile *(planned)*

- iOS and Android, included with Pro
- Works offline
- Share results as an image

## Tech stack

A TypeScript monorepo managed with [Turborepo](https://turbo.build/) and [pnpm workspaces](https://pnpm.io/workspaces).

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| UI | React 19, [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| Components | [Base UI](https://base-ui.com/), [Lucide](https://lucide.dev/), [Recharts](https://recharts.org/) |
| Client state | [Zustand](https://github.com/pmndrs/zustand) |
| Local storage | [Dexie](https://dexie.org/) (IndexedDB) |
| Tooling | [Turborepo](https://turbo.build/), pnpm, ESLint, Prettier, Husky |
| Infrastructure | [Hetzner Cloud](https://www.hetzner.com/cloud/), Docker, Caddy, PostgreSQL 16 |

Requires Node ≥ 20 and pnpm ≥ 9.

## Repository layout

```
WhoUnfollowed/
├── apps/
│   └── web/            # Next.js 15 web app (AGPL-3.0)
├── packages/
│   ├── core/           # ZIP parsing and follower-diff engine (MPL-2.0)
│   └── ui/             # Shared component library
├── docs/               # Format notes and architecture docs
├── turbo.json          # Turborepo pipeline
└── pnpm-workspace.yaml # Workspace definition
```

## Getting started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)

### Install and run

```bash
git clone https://github.com/al-kilic/WhoUnfollowed.git
cd WhoUnfollowed
pnpm install

# Start every app in dev mode (Turbopack)
pnpm dev
# Web app: http://localhost:3000
```

### Common scripts

```bash
pnpm build       # Build all packages and apps
pnpm typecheck   # Type-check the workspace
pnpm lint        # Lint
pnpm test        # Run the test suite (Vitest)
pnpm clean       # Remove build artifacts
```

## Privacy

The privacy model is short enough to fit here in full:

- The ZIP is read by JavaScript inside your browser tab.
- On the **free plan**, nothing is stored and nothing is sent anywhere.
- On **Pro**, only the snapshots you explicitly save are stored, encrypted, so you can compare them across devices.
- No Instagram login. No third-party API calls. No credential storage.

The parsing engine lives in [`packages/core`](./packages/core) under the MPL-2.0 license, so anyone can read exactly what happens to their data.

Full policy: [whounfollowed.co/privacy](https://whounfollowed.co/privacy).

## Self-hosting

The full web app is open source. Clone the repo, copy the variables from `.env.example`, and run `pnpm dev` (or build the Docker image for production).

**Included out of the box:** the entire free tier, plus Radar, snapshot comparison, the triage workflow, and CSV export, all running locally.

**Requires backend infrastructure:** Pro features depend on a server by design. Cross-device snapshot history, email alerts on new unfollowers, and long-term trend charts store data server-side and will not work in a purely local build unless you run the backend yourself.

## Roadmap

- [x] Single-snapshot non-follower analysis
- [x] CSV export
- [x] Radar health score
- [x] Snapshot comparison (who unfollowed between dates)
- [x] Follower growth charts
- [x] Light and dark themes
- [x] Mobile-responsive layout
- [ ] Encrypted cloud sync for Pro snapshots
- [ ] iOS app
- [ ] Android app

Release notes: [whounfollowed.co/changelog](https://whounfollowed.co/changelog).

## Contributing

The project is under active development. Issues for bugs and feature requests are welcome, and so are pull requests. For anything substantial, please open an issue first so we can align on direction.

## License

This repository uses an open-core model:

- **Web app** ([`apps/web`](./apps/web)): [AGPL-3.0](./LICENSE). If you run a modified version as a network service, you must publish your source.
- **Core engine** ([`packages/core`](./packages/core)): [MPL-2.0](./packages/core/LICENSE). Use it freely in any project. Modifications to the licensed files stay open, the rest of your code does not have to.

## Contact

Built by [Alan Kılıç](https://github.com/al-kilic) · [aekilicc@gmail.com](mailto:aekilicc@gmail.com) · [@alterindoles](https://instagram.com/alterindoles)

Not affiliated with Instagram or Meta.
