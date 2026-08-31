import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { Textarea } from './textarea';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../field';

// Textarea contract — one bare <textarea> (data-slot="textarea"), the Input sibling
// with a taller box:
//  · NO variant axis — the surface is fixed; the axis is the live CSS STATE
//    (default / focus / filled / disabled / invalid), driven by attributes not props:
//    focus-visible → border-ring + ring; `disabled` → opacity-dim + no pointer events;
//    `aria-invalid` → destructive border/ring. AllStates forces focus statically via the
//    pseudo addon.
//  · field-sizing-content auto-grows the box to its content; `rows` sets the initial height.
//  · a11y: a bare control has no implicit name → every instance needs an associated
//    <FieldLabel htmlFor> (usage examples) or an aria-label (standalone gallery rows).
const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    placeholder: 'Add a description…',
    rows: 3,
  },
  // Story argTypes carry only control config here. The four re-declared props
  // (placeholder/rows/defaultValue/disabled) get their description + type from docgen
  // (JSDoc on TextareaProps) — only control overrides + the defaulted prop's
  // table.defaultValue stay. `aria-invalid` is docgen-unreliable (hyphenated key) and a
  // pure a11y passthrough → it stays fully hand-curated.
  argTypes: {
    placeholder: {
      control: 'text',
    },
    rows: {
      control: 'number',
    },
    defaultValue: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Drives the destructive border + ring (the invalid state).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'A multiline text control — the Input sibling with a taller, auto-growing box. No variant axis; its axis is the live CSS **state** (default/focus/filled/disabled/invalid). A bare control needs a label — compose it with the **Field** family (see **WithLabel**).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// Default — the API playground. render spreads {...args} into a complete <Textarea>, so every
// prop in the meta argTypes is a live control AND an ArgsTable row (no controls.include — it
// would also filter the table) and the 'code' snippet is a real example, never an empty {}.
// play types into the box and asserts the value lands (a textbox HAS no implicit name → query
// by role + the aria-label, then blur so the end state matches a real mouse user, no ring).
export const Default: Story = {
  render: (args) => <Textarea aria-label="Description" {...args} />,
  play: async ({ canvas, step }) => {
    const textarea = canvas.getByRole('textbox', { name: /description/i });

    await step('typing fills the box', async () => {
      await userEvent.type(textarea, 'Schema notes');
      await expect(textarea).toHaveValue('Schema notes');
    });

    // userEvent.type leaves the box programmatically focused (→ :focus-visible ring);
    // blur() drops it so the end state matches a real mouse user (no lingering ring).
    await step('blurring clears the focus', async () => {
      textarea.blur();
      await expect(textarea).not.toHaveFocus();
    });
  },
};

// Usage — the canonical form composition: a labelled field. The bare control gets its
// accessible name from the FieldLabel's htmlFor (not a div+label), the DS form pattern.
export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="tx-bio">Description</FieldLabel>
      <Textarea id="tx-bio" placeholder="Add a description…" rows={3} />
    </Field>
  ),
};

// Usage — label + helper text stacked above the control via FieldContent; the
// description gives the field guidance copy without crowding the label.
export const WithDescription: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field className="max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor="tx-notes">Schema notes</FieldLabel>
        <FieldDescription>
          Visible to anyone with access to this record type.
        </FieldDescription>
      </FieldContent>
      <Textarea id="tx-notes" rows={4} defaultValue={'Draft notes for the invoice type.\nReviewed with the team.'} />
    </Field>
  ),
};

// Usage — the invalid state in context: aria-invalid reddens the control while the
// FieldError (role="alert") carries the message. data-invalid on the Field is the
// hook stock shadcn uses; the DS keeps the label neutral (only control + error go red).
export const WithError: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field data-invalid className="max-w-sm">
      <FieldLabel htmlFor="tx-err">Description</FieldLabel>
      <Textarea id="tx-err" aria-invalid defaultValue="not-a-valid-value" rows={3} />
      <FieldError>A description is required.</FieldError>
    </Field>
  ),
};

// DS-authored gallery: every state side by side, mirroring the Figma .Textarea variant set
// (state = default | focus | filled | disabled | invalid). focus is a live pseudo-state, so
// the focus row is forced via the pseudo addon (targeting its id) — that's the only way to
// show the focus ring statically; the rest are attribute-driven.
const STATE_ROWS = [
  { id: 'tx-default', label: 'Default', placeholder: 'Default' },
  { id: 'tx-focus', label: 'Focus', placeholder: 'Focus' },
  { id: 'tx-filled', label: 'Filled', value: 'Draft notes for the invoice type.\nReviewed with the team.' },
  { id: 'tx-disabled', label: 'Disabled', placeholder: 'Disabled', disabled: true },
  { id: 'tx-invalid', label: 'Invalid', value: 'not-a-valid-value', invalid: true },
] as const;

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: { focusVisible: ['#tx-focus'] },
  },
  render: () => (
    <div className="flex w-80 flex-col gap-lg">
      {STATE_ROWS.map((r) => (
        <div key={r.id} className="flex flex-col gap-xs">
          <span className="text-format-eyebrow text-muted">{r.label}</span>
          <Textarea
            id={r.id}
            aria-label={r.label}
            rows={3}
            placeholder={'placeholder' in r ? r.placeholder : undefined}
            defaultValue={'value' in r ? r.value : undefined}
            disabled={'disabled' in r ? r.disabled : undefined}
            aria-invalid={'invalid' in r ? r.invalid : undefined}
          />
        </div>
      ))}
    </div>
  ),
};
