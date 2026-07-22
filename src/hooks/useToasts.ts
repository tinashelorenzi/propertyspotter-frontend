import { useCallback, useRef, useState } from 'react';
import type { ToastMessage } from '../components/admin/ui';

/** Small toast queue shared by the admin screens. */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => dismiss(id), type === 'error' ? 7000 : 4500);
    },
    [dismiss]
  );

  const success = useCallback((message: string) => push(message, 'success'), [push]);
  const error = useCallback(
    (err: unknown) =>
      push(err instanceof Error ? err.message : String(err ?? 'Something went wrong'), 'error'),
    [push]
  );

  return { toasts, push, success, error, dismiss };
}
