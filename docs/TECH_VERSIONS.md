# Technology versions

Versions and package licenses checked against the npm registry on 2026-10-28; exact dependencies are pinned in the workspace manifests and lockfile. Node 24 LTS is required for the current tooling; CI tracks its latest patch.

| Tool or package | Version | License |
|---|---:|---|
| Node.js | 24 LTS (local: 24.22.1) | MIT and other open-source licenses |
| pnpm | 12.15.0 | MIT |
| Turborepo | 2.11.10 | MIT |
| Next.js and eslint-config-next | 16.4.3 | MIT |
| React and React DOM | 19.3.1 | MIT |
| Better Auth | 1.7.14 | MIT |
| Prisma CLI and Client | 7.10.1 | Apache-2.0 |
| @prisma/adapter-pg | 7.10.1 | Apache-2.0 |
| pg | 8.23.1 | MIT |
| Zod | 4.6.7 | MIT |
| tsx | 4.23.15 | MIT |
| sharp | 0.35.5 | Apache-2.0 |
| TypeScript | 5.9.3 | Apache-2.0 |
| Tailwind CSS | 4.3.3 | MIT |
| @tailwindcss/postcss | 4.3.3 | MIT |
| clsx | 2.1.1 | MIT |
| tailwind-merge | 3.7.0 | MIT |
| lucide-react | 1.63.0 | ISC |
| ESLint | 9.39.5 | MIT |
| Prettier | 3.9.10 | MIT |
| @lhci/cli | 0.15.1 | Apache-2.0 |
| Vitest | 5.0.5 | MIT |
| Husky | 9.1.7 | MIT |
| commitlint CLI and conventional config | 21.2.4 | MIT |
| @types/node | 24.19.2 | MIT |
| @types/react and @types/react-dom | 19.3.0 | MIT |
| @types/pg | 8.23.1 | MIT |
| @sd/cs-core (workspace package) | 0.1.0 | private, no third-party code |
| clang and wasm-ld (LLVM) | 23.1.4 locally; CI runner default | Apache-2.0 with LLVM exception |
| Fraunces, Inter, Noto Sans Bengali | current Google Fonts releases fetched by `next/font` | SIL Open Font License 1.1 |

Packages are open-source and locally installed. Prisma 7 uses the Rust-free client with the `pg` driver adapter; the generated client is produced during build and seed, and is not committed. Better Auth is MIT-licensed and self-hosted, with no paid tier needed. The font files are downloaded at build time by `next/font` and served from the deployment; they are not committed. ESLint 9 is pinned because the Next.js ESLint plugins do not yet declare support for ESLint 10. The MIT-licensed `unrs-resolver` native-binding installer is allowed by pnpm. Prettier 3.9.10 is a development-only formatter (registry unpacked size 9,959,033 bytes); it is not shipped to users. No application bundle-size budget has yet been measured; Tailwind emitted 34 KB of uncompressed CSS in the Phase 1 build.

`@lhci/cli` is a development-only Lighthouse runner. The `Lighthouse` workflow uses the Chrome already installed on the Ubuntu runner to audit the deployed URLs; it is not part of the install or build path and adds nothing to the application bundle.

The CS core WASM modules are built with clang and wasm-ld, not with a package dependency. LLVM ships with the Linux, macOS and Windows GitHub runners and on the owner's machine, so `pnpm cs:build-wasm` works without an install. The compiled modules (2.7 KB and 1.1 KB) are committed as base64 TypeScript so install, test and deploy never need a compiler; see [ADR-002](adr/ADR-002-cs-core.md). Python 3 and a JDK are used only by the CI reference job and are never installed by the project.
