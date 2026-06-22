import { render } from '@testing-library/react';
import { Slider } from './slider';

describe('Slider', () => {
  it('renders a single thumb (role=slider) for one value', () => {
    const { getAllByRole } = render(<Slider defaultValue={[50]} />);
    expect(getAllByRole('slider')).toHaveLength(1);
  });

  it('renders two thumbs for a range (two values)', () => {
    const { getAllByRole } = render(<Slider defaultValue={[25, 75]} />);
    expect(getAllByRole('slider')).toHaveLength(2);
  });

  it('reflects the value via aria-valuenow', () => {
    const { getByRole } = render(<Slider defaultValue={[40]} max={100} />);
    expect(getByRole('slider').getAttribute('aria-valuenow')).toBe('40');
  });

  it('marks the whole control disabled', () => {
    const { container } = render(<Slider defaultValue={[50]} disabled />);
    const root = container.querySelector('[data-slot="slider"]');
    expect(root?.hasAttribute('data-disabled')).toBe(true);
  });

  // DS-utility survival: corner-full is a custom @utility (not stock rounded-*) and must survive
  // cn()/twMerge on both the track and the thumb; the parts carry their data-slot hooks, and the
  // range binds the DS active fill.
  it('keeps the DS utilities and data-slot hooks', () => {
    const { container } = render(<Slider defaultValue={[50]} />);
    const track = container.querySelector('[data-slot="slider-track"]');
    const thumb = container.querySelector('[data-slot="slider-thumb"]');
    const range = container.querySelector('[data-slot="slider-range"]');
    expect(track?.className).toContain('corner-full');
    expect(track?.className).toContain('bg-input-fill-high');
    expect(thumb?.className).toContain('corner-full');
    expect(range?.className).toContain('bg-primary-fill');
  });
});
