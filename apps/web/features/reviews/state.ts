/** Result the review form shows without leaving the page. */
export interface ReviewState {
  status: 'idle' | 'success' | 'invalid' | 'duplicate' | 'failed';
  /** Field path from Zod, mapped to a message by the client. */
  field?: string;
}

export const initialReviewState: ReviewState = { status: 'idle' };
