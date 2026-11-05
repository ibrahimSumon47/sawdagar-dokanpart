import { randomUUID } from 'node:crypto';
import { getPrisma } from '../../lib/prisma';

interface AuthMail {
  userId?: string;
  toEmail: string;
  subject: string;
  bodyText: string;
}

/**
 * Queues a verification or password-reset message in the in-app outbox.
 *
 * No mail provider is configured, so the message is stored where an admin can
 * read it at `/admin/outbox` instead of pretending it was delivered. The
 * function never throws into Better Auth: a mail failure must not turn a
 * successful registration into an error page.
 */
export async function queueAuthMail(mail: AuthMail): Promise<void> {
  try {
    await getPrisma().mailOutbox.create({
      data: {
        id: randomUUID(),
        userId: mail.userId,
        toEmail: mail.toEmail,
        subject: mail.subject,
        bodyText: mail.bodyText,
        status: 'queued',
      },
    });
  } catch (error) {
    console.error('auth.mail.queue_failed', error instanceof Error ? error.message : 'unknown');
  }
}
