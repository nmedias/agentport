import { render } from '@testing-library/react';
import { Label } from './label';

describe('Label', () => {
  it('renders with the label data-slot', () => {
    const { container } = render(<Label>Email</Label>);
    const el = container.querySelector('[data-slot="label"]') as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.textContent).toBe('Email');
  });

  it('associates with a control via htmlFor', () => {
    const { container } = render(<Label htmlFor="x">Name</Label>);
    expect(container.querySelector('label')?.getAttribute('for')).toBe('x');
  });

  // Guards the T3 typography pick: the label format class must survive twMerge
  // (it would be dropped if the text-format group were not registered in cn()).
  it('carries the DS label typography format', () => {
    const { container } = render(<Label>Email</Label>);
    expect(
      (container.querySelector('[data-slot="label"]') as HTMLElement).className,
    ).toContain('text-format-label-md');
  });
});
