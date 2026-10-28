# Technology versions

Versions and package licenses checked against the npm registry on 2026-10-28; exact dependencies are pinned in the workspace manifests and lockfile. Node 24 LTS is required for the current tooling; CI tracks its latest patch.

| Tool or package | Version | License |
|---|---:|---|
| Node.js | 24 LTS (local: 24.22.1) | MIT and other open-source licenses |
| pnpm | 12.15.0 | MIT |
| Turborepo | 2.11.10 | MIT |
| Next.js and eslint-config-next | 16.4.3 | MIT |
| React and React DOM | 19.3.1 | MIT |
| sharp | 0.35.5 | Apache-2.0 |
| TypeScript | 5.9.3 | Apache-2.0 |
| ESLint | 9.39.5 | MIT |
| Prettier | 3.9.10 | MIT |
| Vitest | 5.0.5 | MIT |
| Husky | 9.1.7 | MIT |
| commitlint CLI and conventional config | 21.2.4 | MIT |
| @types/node | 24.19.2 | MIT |
| @types/react and @types/react-dom | 19.3.0 | MIT |

Packages are open-source and locally installed. Direct dependencies are limited to the foundation slice; other tools in the architecture specification are introduced when their phase needs them. ESLint 9 is pinned because the Next.js ESLint plugins do not yet declare support for ESLint 10. The MIT-licensed `unrs-resolver` native-binding installer is allowed by pnpm. Prettier 3.9.10 is a development-only formatter (registry unpacked size 9,959,033 bytes); it is not shipped to users. No application bundle-size budget has yet been measured.
