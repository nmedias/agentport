import { useId } from 'react';

/**
 * Resolves a stable field id: returns the caller's explicit `id` when given,
 * otherwise an auto-generated one. Lets a control and its `<label htmlFor>`
 * share one id without forcing every call site to invent one.
 */
function useFieldId(id?: string) {
  const reactId = useId();
  return id ?? reactId;
}

export { useFieldId };
