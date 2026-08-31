import { render } from '@testing-library/react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

function renderTable() {
  return render(
    <Table>
      <TableCaption>recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow data-state="selected">
          <TableCell>INV001</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

const cls = (c: HTMLElement | Element | null) => c?.className ?? '';

describe('Table', () => {
  it('renders the composed structure (caption + header + body + footer)', () => {
    const { getByText, container } = renderTable();
    expect(getByText('recent invoices')).toBeTruthy();
    expect(getByText('INV001')).toBeTruthy();
    expect(getByText('Total')).toBeTruthy();
    expect(container.querySelector('[data-slot="table-container"]')).toBeTruthy();
    expect(container.querySelector('table[data-slot="table"]')).toBeTruthy();
  });

  it('table root carries the DS body typography, not the dead text-sm', () => {
    const { container } = renderTable();
    const c = cls(container.querySelector('[data-slot="table"]'));
    expect(c).toContain('text-format-body');
    expect(c).not.toContain('text-sm');
  });

  it('head cell = label format + ink, px-md, h-10 (no dead text-foreground/font-medium)', () => {
    const { container } = renderTable();
    const c = cls(container.querySelector('[data-slot="table-head"]'));
    expect(c).toContain('text-format-label-md');
    expect(c).toContain('text-ink');
    expect(c).toContain('px-md');
    expect(c).toContain('h-10');
    expect(c).not.toContain('font-medium');
    expect(c).not.toContain('text-foreground');
  });

  it('data cell uses the named p-md spacing (not the numeric p-2)', () => {
    const { container } = renderTable();
    const c = cls(container.querySelector('[data-slot="table-cell"]'));
    expect(c).toContain('p-md');
    expect(c).not.toContain('p-2 ');
  });

  it('footer = muted band + label weight + top rule', () => {
    const { container } = renderTable();
    const c = cls(container.querySelector('[data-slot="table-footer"]'));
    expect(c).toContain('bg-muted-fill/50');
    expect(c).toContain('text-format-label-md');
    expect(c).toContain('border-t');
    expect(c).not.toContain('font-medium');
  });

  it('row tints hover neutral (muted) and selected with the accent fill', () => {
    const { container } = renderTable();
    const row = container.querySelector('[data-slot="table-row"]');
    const c = cls(row);
    expect(c).toContain('hover:bg-muted-fill/50');
    expect(c).toContain('has-aria-expanded:bg-muted-fill/50');
    expect(c).toContain('data-[state=selected]:bg-accent-fill');
  });

  it('a selected row carries data-state="selected" (drives the accent tint)', () => {
    const { container } = renderTable();
    // the body row is rendered with data-state="selected"
    const rows = container.querySelectorAll('[data-slot="table-row"]');
    const selected = Array.from(rows).find(
      (r) => r.getAttribute('data-state') === 'selected'
    );
    expect(selected).toBeTruthy();
  });

  it('caption = muted secondary text, named mt-xl margin (no dead text-muted-foreground)', () => {
    const { container } = renderTable();
    const c = cls(container.querySelector('[data-slot="table-caption"]'));
    expect(c).toContain('text-muted');
    expect(c).toContain('text-format-body');
    expect(c).toContain('mt-xl');
    expect(c).not.toContain('text-muted-foreground');
  });

  it('merges a consumer className via cn (named-spacing twMerge: p-xl overrides p-md)', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="p-xl">cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const c = cls(container.querySelector('[data-slot="table-cell"]'));
    expect(c).toContain('p-xl');
    expect(c).not.toContain('p-md');
  });
});
