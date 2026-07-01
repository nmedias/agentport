import { render } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  it('renders its children', () => {
    const { container } = render(<Badge>New</Badge>);
    expect(container.querySelector('[data-slot="badge"]')?.textContent).toBe('New');
  });

  it('carries the DS label typography format', () => {
    const { container } = render(<Badge>New</Badge>);
    expect(container.querySelector('[data-slot="badge"]')?.className).toContain(
      'text-format-label-md'
    );
  });

  it('uses the full-pill DS radius (corner-full), not a dead rounded-*', () => {
    const { container } = render(<Badge>New</Badge>);
    const cls = container.querySelector('[data-slot="badge"]')?.className ?? '';
    expect(cls).toContain('corner-full');
    expect(cls).not.toContain('rounded-');
  });

  it('defaults to the primary variant', () => {
    const { container } = render(<Badge>New</Badge>);
    const el = container.querySelector('[data-slot="badge"]');
    expect(el?.className).toContain('bg-primary-fill');
    expect(el?.getAttribute('data-variant')).toBe('default');
  });

  it('applies the outline variant (bordered, neutral ink)', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    const el = container.querySelector('[data-slot="badge"]');
    expect(el?.className).toContain('border-border');
    expect(el?.className).toContain('text-ink');
    expect(el?.getAttribute('data-variant')).toBe('outline');
  });

  it('applies the secondary and destructive variants', () => {
    const { container, rerender } = render(<Badge variant="secondary">S</Badge>);
    expect(container.querySelector('[data-slot="badge"]')?.className).toContain(
      'bg-secondary-fill'
    );
    rerender(<Badge variant="destructive">D</Badge>);
    expect(container.querySelector('[data-slot="badge"]')?.className).toContain(
      'bg-destructive'
    );
  });

  it('renders as the child element when asChild is set (Radix Slot)', () => {
    const { container } = render(
      <Badge asChild>
        <a href="#x">Link</a>
      </Badge>
    );
    const el = container.querySelector('[data-slot="badge"]');
    expect(el?.tagName).toBe('A');
    expect(el?.getAttribute('href')).toBe('#x');
    expect(el?.className).toContain('bg-primary-fill');
  });

  it('merges a consumer className via cn (twMerge)', () => {
    const { container } = render(<Badge className="px-xl">New</Badge>);
    const cls = container.querySelector('[data-slot="badge"]')?.className ?? '';
    // px-xl overrides the base px-md (named-spacing twMerge extension active)
    expect(cls).toContain('px-xl');
    expect(cls).not.toContain('px-md');
  });
});
