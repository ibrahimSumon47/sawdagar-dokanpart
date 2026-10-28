# ADR-002: native CS modules with tested ports

- Status: accepted
- Date: 2026-10-28

## Context

Phase 10 asks for four CS modules: search ranking in C++ compiled to WebAssembly, a SKU kit in C compiled to WebAssembly, demand insights in Python and settlement in Java. Each must be tested in CI and used in the product. The site is a Next.js app on Vercel's free Hobby plan, the only runtime available is Node, and the project rule is free-forever services with no trial and no card.

## Decision

- The two native modules are compiled to small freestanding WASM modules and committed as base64 TypeScript modules. The site instantiates them in the Node process, at most once per process, and falls back to a TypeScript port when `WebAssembly` refuses the bytes.
- Both implementations are held to the same integer outputs by fixtures: the tests score every fixture pair through WASM and through the port and require equality.
- The Python and Java modules are **reference implementations**, not deployed services. They are run by a dedicated CI job (`node scripts/check-reference-modules.mjs --require`) against the same fixtures, and the TypeScript ports used by the Seller Center and admin finance must match those fixtures.
- WASM is built with clang (`--target=wasm32 -nostdlib`) and `wasm-ld`, both present on Linux, macOS and Windows runners. `pnpm cs:build-wasm` regenerates the artifacts; the committed artifacts are what the app and CI use.

## Alternatives considered

1. **Ship only the native modules.** Rejected: a runtime without WebAssembly, a bundler change or a corrupted artifact would remove search ordering entirely instead of degrading. The fallback is small because the algorithm is pure.
2. **Ship only TypeScript.** Rejected: the phase exists to demonstrate the native boundary, and a port alone does not show compiled code, memory layout or an ABI.
3. **Deploy Python and Java as separate services.** Rejected: no free-forever host was verified (Hugging Face Docker Spaces needs a paid plan), and a network hop for a pure function adds failure modes without adding product value. The reference implementations stay readable and CI-verified.
4. **Compile WASM during the Vercel build.** Rejected: it would make every deploy depend on a compiler and a download, slow the build and risk a failed deploy over an artifact that changes only when the algorithm does.

## Consequences

- Two implementations of each algorithm must be kept in step. The fixtures and parity tests make a drift a failing test rather than a silent difference.
- Regenerating WASM requires clang locally; the README documents the command. CI verifies behaviour, not reproducibility of the bytes.
- The Python and Java code is not reachable from the site, so `docs/CS_FUNDAMENTALS.md` must explain it and the `/cs-lab` page must show its output, or a reader would never see it.
