import { render } from '@testing-library/react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

const Trail = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);

describe('Breadcrumb', () => {
  it('renders a labelled nav with an ordered list', () => {
    const { container } = render(<Trail />);
    const nav = container.querySelector('[data-slot="breadcrumb"]');
    expect(nav?.getAttribute('aria-label')).toBe('breadcrumb');
    expect(container.querySelector('ol[data-slot="breadcrumb-list"]')).toBeTruthy();
  });

  it('carries the DS body typography format + muted default colour on the list', () => {
    const { container } = render(<Trail />);
    const list = container.querySelector('[data-slot="breadcrumb-list"]');
    expect(list?.className).toContain('text-format-body');
    expect(list?.className).toContain('text-muted-ink');
  });

  it('marks the current page with aria-current and ink colour', () => {
    const { container } = render(<Trail />);
    const page = container.querySelector('[data-slot="breadcrumb-page"]');
    expect(page?.getAttribute('aria-current')).toBe('page');
    expect(page?.className).toContain('text-ink');
  });

  it('renders the separator as an aria-hidden chevron vector', () => {
    const { container } = render(<Trail />);
    const sep = container.querySelector('[data-slot="breadcrumb-separator"]');
    expect(sep?.getAttribute('aria-hidden')).toBe('true');
    expect(sep?.querySelector('svg')).toBeTruthy();
  });

  it('renders the ellipsis with an accessible label and a vector glyph', () => {
    const { container } = render(<BreadcrumbEllipsis />);
    const ell = container.querySelector('[data-slot="breadcrumb-ellipsis"]');
    expect(ell?.querySelector('svg')).toBeTruthy();
    expect(ell?.querySelector('.sr-only')?.textContent).toBe('More');
  });
});
