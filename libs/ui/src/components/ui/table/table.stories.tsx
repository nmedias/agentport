import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import * as React from 'react';

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
import { Checkbox } from '../checkbox';
import { Badge } from '../badge';

// Table contract — a multi-part data-table composite (no single root; each part is a data-slot
// element wrapping a native table tag):
//  · Table (data-slot="table") wraps a <table> in an overflow-x container and sets the DS body
//    typography (text-format-body); cells inherit it.
//  · TableHead (<th>) is label-weight + ink, left-aligned by default; align a column with
//    text-right / text-center (the column's whole header + cells). TableCell (<td>) inherits body.
//  · TableRow (<tr>) carries the only interaction surface: hover tints with a NEUTRAL wash
//    (hover:bg-muted-fill/50), a selected row (data-state="selected") tints with the ACCENT
//    selection fill (bg-accent-fill) — text stays ink (faithful: stock recolours no text).
//  · TableFooter (<tfoot>) is a quiet summary band (muted fill + top rule + label weight);
//    TableCaption (<caption>) is muted secondary text below the table (caption-bottom).
//  · A checkbox cell drops its right padding ([&:has([role=checkbox])]:pr-0). a11y: the <caption>
//    names the table; checkbox cells need an aria-label at the call site.
const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
  // Table is a passthrough root (it only spreads ComponentProps<'table'>) → react-docgen reads no
  // curated props, so the public surface is hand-authored here. The composition (Header/Body/
  // Footer/Row/Head/Cell/Caption) is documented through the usage stories below — those parts are
  // prop-less pass-throughs, so they get no separate Autodocs pages.
  argTypes: {
    className: {
      control: 'text',
      description: 'Extra classes merged onto the inner `<table>` element.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A data table composed from **`Table`** + the region parts **`TableHeader`** / **`TableBody`** / **`TableFooter`**, **`TableRow`**, the cell parts **`TableHead`** (column header) / **`TableCell`** (data cell), and an optional **`TableCaption`**. Rows are the only interactive surface: hover tints neutral, a `data-state="selected"` row tints with the DS accent selection fill (see **Selectable** and **Row States**). Align a numeric column with `text-right` on its head + cells (see **Alignment**). The parts are prop-less pass-throughs (className/children) → documented here through usage stories, not separate pages.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const invoices = [
  { invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { invoice: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  { invoice: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  { invoice: 'INV005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
];

// Default — the API playground: the canonical invoice table (caption + header + body + footer,
// numeric Amount column right-aligned). className is a live control on the inner <table>. No play:
// a table is static display — the interaction test lives on Selectable (the only interactive form).
export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((row) => (
          <TableRow key={row.invoice}>
            <TableCell className="text-format-label-md">{row.invoice}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell className="text-right">{row.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$1,750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// A controlled selection demo: a checkbox column drives each row's data-state, which paints the
// accent selection tint. Demonstrates the selected state + the checkbox-cell padding rule
// ([&:has([role=checkbox])]:pr-0). Table's only interactive form → it carries the play test.
function SelectableDemo() {
  const rows = invoices.slice(0, 3);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({
    INV002: true,
  });
  const allSelected = rows.every((r) => selected[r.invoice]);
  const someSelected = rows.some((r) => selected[r.invoice]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              aria-label="Select all rows"
              checked={allSelected ? true : someSelected ? 'indeterminate' : false}
              onCheckedChange={(v) =>
                setSelected(
                  v ? Object.fromEntries(rows.map((r) => [r.invoice, true])) : {}
                )
              }
            />
          </TableHead>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow
            key={r.invoice}
            data-state={selected[r.invoice] ? 'selected' : undefined}
          >
            <TableCell>
              <Checkbox
                aria-label={`Select ${r.invoice}`}
                checked={!!selected[r.invoice]}
                onCheckedChange={(v) =>
                  setSelected((s) => ({ ...s, [r.invoice]: !!v }))
                }
              />
            </TableCell>
            <TableCell className="text-format-label-md">{r.invoice}</TableCell>
            <TableCell>{r.status}</TableCell>
            <TableCell className="text-right">{r.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const Selectable: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `function SelectableTable() {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})
  return (
    <Table>
      <TableHeader>{/* … a "select all" Checkbox in the leading TableHead */}</TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id} data-state={selected[r.id] ? "selected" : undefined}>
            <TableCell>
              <Checkbox
                aria-label={\`Select \${r.id}\`}
                checked={!!selected[r.id]}
                onCheckedChange={(v) => setSelected((s) => ({ ...s, [r.id]: !!v }))}
              />
            </TableCell>
            {/* … data cells */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}`,
      },
    },
  },
  render: () => <SelectableDemo />,
  play: async ({ canvas, step }) => {
    const checkbox = canvas.getByRole('checkbox', { name: /select inv001/i });
    const row = canvas.getByRole('row', { name: /inv001/i });

    await step('the row starts unselected', async () => {
      await expect(checkbox).not.toBeChecked();
      await expect(row).not.toHaveAttribute('data-state', 'selected');
    });

    await step('checking the box selects the row (accent tint via data-state)', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).toBeChecked();
      await expect(row).toHaveAttribute('data-state', 'selected');
    });

    await step('unchecking clears the selection', async () => {
      await userEvent.click(checkbox);
      await expect(checkbox).not.toBeChecked();
      await expect(row).not.toHaveAttribute('data-state', 'selected');
    });
  },
};

// The empty state — a single full-width row (colSpan) with the muted "No results." message at a
// comfortable height (h-24). The pattern a data table renders when its row model is empty.
export const EmptyState: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center text-muted-ink">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Column alignment — the align capability that maps to the Figma cell `align` axis. text-left is
// the default; add text-center / text-right to a head + its cells to align the whole column.
export const Alignment: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table className="w-full max-w-md">
      <TableHeader>
        <TableRow>
          <TableHead>Left (default)</TableHead>
          <TableHead className="text-center">Center</TableHead>
          <TableHead className="text-right">Right</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>invoice</TableCell>
          <TableCell className="text-center">Paid</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>contract</TableCell>
          <TableCell className="text-center">Pending</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Cells hold arbitrary components, not just text — a Checkbox in a select column, a Badge in a status
// column (the table cell is just a `<td>`; its children can be any element). Mirrors the Figma
// "Component cells" example. Render-only; the interactive selection flow lives in Selectable.
export const ComponentCells: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Table className="w-full max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <Checkbox aria-label="Select all rows" />
          </TableHead>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <Checkbox aria-label="Select INV001" />
          </TableCell>
          <TableCell className="text-format-label-md">INV001</TableCell>
          <TableCell>
            <Badge variant="secondary">Paid</Badge>
          </TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell>
            <Checkbox aria-label="Select INV002" checked />
          </TableCell>
          <TableCell className="text-format-label-md">INV002</TableCell>
          <TableCell>
            <Badge variant="outline">Pending</Badge>
          </TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// The interaction-state gallery — the three row states side by side. Default sits plain; Hover is
// forced via the pseudo-states addon (the neutral muted wash); Selected carries data-state="selected"
// (the accent selection fill). Render-only.
export const RowStates: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: { hover: ['#tr-hover'] },
  },
  render: () => (
    <Table className="w-full max-w-md">
      <TableHeader>
        <TableRow>
          <TableHead>State</TableHead>
          <TableHead>Invoice</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-format-label-md">Default</TableCell>
          <TableCell>INV001</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow id="tr-hover">
          <TableCell className="text-format-label-md">Hover</TableCell>
          <TableCell>INV002</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell className="text-format-label-md">Selected</TableCell>
          <TableCell>INV003</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
