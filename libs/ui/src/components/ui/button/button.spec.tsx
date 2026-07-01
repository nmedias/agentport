import { render } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders its children', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole('button').textContent).toBe('Click me');
  });

  it('applies the destructive variant class', () => {
    const { getByRole } = render(<Button variant="destructive">Delete</Button>);
    expect(getByRole('button').className).toContain('bg-destructive');
  });

  it('renders as a child element when asChild is set', () => {
    const { getByRole } = render(
      <Button asChild>
        <a href="/schema">Schema</a>
      </Button>
    );
    expect(getByRole('link').getAttribute('href')).toBe('/schema');
  });
});

describe('Button asChild', () => {
  // Slot contract: the button styling merges onto the single child element —
  // no <button> wrapper appears, the child keeps its own className.
  it('merges the button styling onto the child instead of wrapping it', () => {
    const { container, getByRole } = render(
      <Button asChild variant="outline" size="xs">
        <a href="/schema" className="custom-marker">
          Schema
        </a>
      </Button>
    );
    expect(container.querySelector('button')).toBeNull();
    const link = getByRole('link');
    expect(link.getAttribute('data-slot')).toBe('button');
    const cls = link.className.split(/\s+/);
    expect(cls).toContain('h-6'); // size=xs geometry
    expect(cls).toContain('corner-md'); // xs radius step
    expect(cls).toContain('text-format-label-md'); // DS typography survives the merge
    expect(cls).toContain('custom-marker'); // child className preserved
  });

  // The reason the Storybook control is disabled: Radix Slot requires exactly
  // ONE element child — the stories' plain-text children crash it.
  it('throws on a plain-text child (Radix Slot contract)', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Button asChild>Just text</Button>)).toThrow();
    spy.mockRestore();
  });
});
