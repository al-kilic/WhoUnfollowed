# Contributing to WhoUnfollowed

Thanks for your interest. This is a solo project under active development. Contributions are welcome, especially bug fixes and parser improvements.

## Code of Conduct

This project follows the [Contributor Covenant 2.1](./CODE_OF_CONDUCT.md). Be respectful.

## Dev Setup

```bash
git clone https://github.com/al-kilic/WhoUnfollowed.git
cd WhoUnfollowed
pnpm install
pnpm dev
```

Requires Node.js 20+ and pnpm 9+.

## Commit Style

Conventional commits required:

```
feat(scope): add thing
fix(scope): correct thing
chore: update deps
docs: improve readme
```

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `pnpm typecheck && pnpm lint && pnpm test`
4. Open a PR with a clear description of what and why

## What to Work On

Check open issues. Parser improvements and bug fixes are the highest priority. UI changes need a discussion first.

## Privacy Rule (Non-Negotiable)

The core parser must never send user data to a server. Any PR that violates this will be closed immediately.
