import { toNextJsHandler } from 'better-auth/next-js';
import { getAuth } from '../../../../lib/auth';

const handler = (request: Request) => getAuth().handler(request);

/** Better Auth HTTP endpoints, including sign-in and session checks. */
export const { GET, POST } = toNextJsHandler(handler);
