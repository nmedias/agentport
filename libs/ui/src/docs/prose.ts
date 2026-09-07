/*
  Running text on the docs pages reads at 16px. The type scale has no 16px
  step (body is 14px, lead is 18px), so the size is set here once, on top of
  the body format, and applied only to flowing prose: page intros, section
  leads, notes. Specimen tiles, tables and bars stay on the 14px body format.
*/
export const PROSE = 'text-format-body text-[1rem] leading-[1.6]';
