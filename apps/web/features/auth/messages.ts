import type { Dictionary } from '../../i18n';

/** Message keys the auth forms and actions can return. */
export type AuthMessageKey =
  | 'notConfigured'
  | 'invalidCredentials'
  | 'tooManyAttempts'
  | 'genericError'
  | 'required'
  | 'emailInvalid'
  | 'phoneInvalid'
  | 'passwordShort'
  | 'passwordMismatch'
  | 'nameShort'
  | 'businessRequired'
  | 'emailTaken'
  | 'resetInvalid'
  | 'passwordWrong'
  | 'googleUnavailable';

const messageKeys: readonly AuthMessageKey[] = [
  'notConfigured',
  'invalidCredentials',
  'tooManyAttempts',
  'genericError',
  'required',
  'emailInvalid',
  'phoneInvalid',
  'passwordShort',
  'passwordMismatch',
  'nameShort',
  'businessRequired',
  'emailTaken',
  'resetInvalid',
  'passwordWrong',
  'googleUnavailable',
];

/**
 * Maps a message key from the auth rules or actions to the active language.
 *
 * Zod issues arrive in kebab case (`password-too-short`) while the catalogue
 * uses camel case, so the key is converted before lookup. Unknown keys fall
 * back to the generic failure text so a new code path can never render an
 * empty alert.
 */
export function authMessage(copy: Dictionary, key?: string): string {
  if (!key) return '';
  const camel = key.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
  const auth = copy.auth as unknown as Record<string, string>;
  return messageKeys.includes(camel as AuthMessageKey) ? auth[camel] : copy.auth.genericError;
}
