import type { Dictionary } from '../../i18n';

/**
 * The part of the message catalogue the auth forms render.
 *
 * A server component may hand any dictionary slice to a client component, but
 * React refuses to serialise a function, and several slices (reviews, seller,
 * admin) hold builders such as `basedOn(count)` that return a finished
 * sentence. `auth` and `roles` are plain strings, so the auth pages pass this
 * narrower object and the forms stay serialisable.
 */
export type AuthCopy = Pick<Dictionary, 'auth' | 'roles'>;

/** Narrows a full dictionary to the plain-string sections the auth forms use. */
export function authCopyFor(copy: Dictionary): AuthCopy {
  return { auth: copy.auth, roles: copy.roles };
}
