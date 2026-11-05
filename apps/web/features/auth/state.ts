/**
 * Shared shape of the auth form state.
 *
 * It lives outside the `'use server'` actions file because a server-action
 * module may only export async functions, while every form needs the same
 * starting value on the client.
 */

/** State returned to the client forms; `error` maps to a message catalogue key. */
export interface AuthFormState {
  /** A message key such as `invalidCredentials`, or a field-scoped code. */
  error?: string;
  /** Field name to message key, for inline errors under an input. */
  fieldErrors?: Record<string, string>;
  /** Set when a request was accepted and the form should show its confirmation. */
  sent?: boolean;
  /** Set when a password or other detail was saved. */
  saved?: boolean;
}

/** The value every auth form starts from before its first submission. */
export const emptyAuthState: AuthFormState = {};
