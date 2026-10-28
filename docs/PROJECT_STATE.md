# Project state

## Done
- Product, design, architecture, data and roadmap specifications are documented.
- Phase 0: pnpm/Turborepo workspace, CI on Linux/Windows/macOS, Vercel deployment at https://sawdagar-dokanpart.vercel.app/, pinned formatting, and the documentation baseline. The Windows line-ending failure was fixed in `fix(ci)`.
- Phase 1: Editorial Heritage tokens in `packages/ui/src/theme.css` with light and dark themes, Fraunces/Inter/Noto Sans Bengali via `next/font`, server-rendered theme and language cookies, English and Bangla catalogs, storefront shell (announcement strip, header, mobile menu, footer, trust strip), a shared component library with product card and vendor row skeleton pairs, and the `/design` gallery showing tokens, components, states, both themes and frames at 360/640/768/1024/1280/1536 px.
- Unit tests: 28 across `@sd/domain`, `@sd/ui` and `@sd/web`, including WCAG AA token contrast and skeleton layout parity.
- Lint, typecheck, tests and production build pass locally; the production CSS contains both theme token sets and the utilities used by the gallery.

## Now
- Phase 1 is complete, committed and live: `/design` is served by Vercel, the production page renders the dark theme and Bangla copy from cookies, and CI passed on Linux, Windows and macOS after the CRLF fix. The next slice starts Phase 2: Better Auth with roles and demo sign-in.

## Next
- Phase 2: Prisma schema for users/sessions/organizations on Neon, Better Auth, role and permission guards, Try-demo logins, audit log, basic profiles.
- Configure the Neon connection string and any auth secret in the Vercel and GitHub dashboards; migrations run in GitHub Actions, never locally.
- Add Playwright with axe and the bounding-box skeleton parity test when browser tests enter CI.

## Blocked
- Phase 10 Java hosting: Hugging Face Docker Spaces currently require a paid plan; a free-compliant alternative must be verified before that phase.
- Phase 2 cannot finish until the database connection and auth secret are present in the dashboards, since migrations and sign-in cannot be verified without them.

## Known issues
- The gallery's six width frames are laid out from fixed pixel widths; a person still has to inspect each frame, because there is no automated visual or browser check yet.
- ESLint 9 is deprecated; the Next.js plugins do not yet declare ESLint 10 support.
- Media is represented by the original jamdani SVG pattern until product photography and Cloudinary integration arrive.
