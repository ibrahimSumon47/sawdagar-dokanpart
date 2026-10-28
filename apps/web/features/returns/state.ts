/** Result the return form shows without a page reload. */
export interface ReturnState {
  status: 'idle' | 'success' | 'invalid' | 'window' | 'failed';
  field?: string;
}

export const initialReturnState: ReturnState = { status: 'idle' };
