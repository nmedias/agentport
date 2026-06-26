import { render } from '@testing-library/react';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './item';

describe('Item', () => {
  it('renders its content (title + description)', () => {
    const { getByText } = render(
      <Item>
        <ItemContent>
          <ItemTitle>invoice</ItemTitle>
          <ItemDescription>9 required fields</ItemDescription>
        </ItemContent>
      </Item>
    );
    expect(getByText('invoice')).toBeTruthy();
    expect(getByText('9 required fields')).toBeTruthy();
  });

  it('carries the DS body typography + corner-lg radius, not a dead rounded-*', () => {
    const { container } = render(<Item>row</Item>);
    const cls = container.querySelector('[data-slot="item"]')?.className ?? '';
    expect(cls).toContain('text-format-body');
    expect(cls).toContain('corner-lg');
    expect(cls).not.toContain('rounded-');
  });

  it('defaults to the default variant + default size', () => {
    const { container } = render(<Item>row</Item>);
    const el = container.querySelector('[data-slot="item"]');
    expect(el?.getAttribute('data-variant')).toBe('default');
    expect(el?.getAttribute('data-size')).toBe('default');
    expect(el?.className).toContain('border-transparent');
    expect(el?.className).toContain('px-lg');
  });

  it('applies the outline variant (bordered)', () => {
    const { container } = render(<Item variant="outline">row</Item>);
    const el = container.querySelector('[data-slot="item"]');
    expect(el?.className).toContain('border-border');
    expect(el?.getAttribute('data-variant')).toBe('outline');
  });

  it('applies the muted variant (soft DS fill)', () => {
    const { container } = render(<Item variant="muted">row</Item>);
    expect(container.querySelector('[data-slot="item"]')?.className).toContain(
      'bg-muted-fill/50'
    );
  });

  it('compacts to the xs size on the DS spacing scale (md steps)', () => {
    const { container } = render(
      <Item size="xs">row</Item>
    );
    const el = container.querySelector('[data-slot="item"]');
    expect(el?.getAttribute('data-size')).toBe('xs');
    expect(el?.className).toContain('gap-md');
    expect(el?.className).toContain('px-md');
    expect(el?.className).toContain('py-md');
  });

  it('titles use the DS label format; descriptions the muted body', () => {
    const { container } = render(
      <Item>
        <ItemContent>
          <ItemTitle>title</ItemTitle>
          <ItemDescription>desc</ItemDescription>
        </ItemContent>
      </Item>
    );
    expect(container.querySelector('[data-slot="item-title"]')?.className).toContain(
      'text-format-label'
    );
    const desc = container.querySelector('[data-slot="item-description"]')?.className ?? '';
    expect(desc).toContain('text-format-body');
    expect(desc).toContain('text-muted-ink');
  });

  it('sizes an icon media slot and rounds an image media slot with the DS corner token', () => {
    const { container, rerender } = render(
      <ItemMedia variant="icon">
        <svg />
      </ItemMedia>
    );
    expect(container.querySelector('[data-slot="item-media"]')?.getAttribute('data-variant')).toBe(
      'icon'
    );
    rerender(
      <ItemMedia variant="image">
        <img alt="" />
      </ItemMedia>
    );
    const img = container.querySelector('[data-slot="item-media"]')?.className ?? '';
    expect(img).toContain('corner-sm');
    expect(img).not.toContain('rounded-');
  });

  it('exposes the list semantics: ItemGroup is a list, ItemSeparator a divider', () => {
    const { container } = render(
      <ItemGroup>
        <Item>a</Item>
        <ItemSeparator />
        <Item>b</Item>
      </ItemGroup>
    );
    expect(container.querySelector('[data-slot="item-group"]')?.getAttribute('role')).toBe('list');
    expect(container.querySelector('[data-slot="item-separator"]')).toBeTruthy();
  });

  it('renders as the child element when asChild is set (Radix Slot)', () => {
    const { container } = render(
      <Item asChild>
        <a href="#x">link row</a>
      </Item>
    );
    const el = container.querySelector('[data-slot="item"]');
    expect(el?.tagName).toBe('A');
    expect(el?.getAttribute('href')).toBe('#x');
    expect(el?.className).toContain('corner-lg');
  });

  it('merges a consumer className via cn (named-spacing twMerge)', () => {
    const { container } = render(<Item className="px-xl">row</Item>);
    const cls = container.querySelector('[data-slot="item"]')?.className ?? '';
    // px-xl overrides the base px-lg (named-spacing twMerge extension active)
    expect(cls).toContain('px-xl');
    expect(cls).not.toContain('px-lg');
  });
});
