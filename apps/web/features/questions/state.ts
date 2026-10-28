/** Result the ask-the-seller form shows without a page reload. */
export interface QuestionState {
  status: 'idle' | 'success' | 'invalid' | 'limit' | 'failed';
  field?: string;
}

export const initialQuestionState: QuestionState = { status: 'idle' };
