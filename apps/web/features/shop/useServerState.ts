import { useState, type Dispatch, type SetStateAction } from 'react';

/**
 * Keeps local state in step with the latest server-rendered value without an
 * effect. React re-renders immediately after the adjustment, so no stale frame
 * is painted and no cascading effect runs.
 */
export function useServerState<T>(serverValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(serverValue);
  const [previousServerValue, setPreviousServerValue] = useState(serverValue);

  if (serverValue !== previousServerValue) {
    setPreviousServerValue(serverValue);
    setValue(serverValue);
  }

  return [value, setValue];
}
