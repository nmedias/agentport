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
