import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { Input } from './input';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '../field';

// Input contract — one native <input> (data-slot="input"), state lives in real CSS/attributes,
// not props:
//  · the value is the input's own native state (uncontrolled via defaultValue, or controlled via
//    value+onChange) — "filled" is just a non-empty value, "placeholder" the empty placeholder text.
//  · focus is :focus-visible → border-ring + ring-ring/50 ring-[3px] (only while the field has
//    keyboard focus); AllStates forces it statically via the pseudo-states addon.
//  · invalid is the aria-invalid="true" attribute → destructive border + ring/20 (no extra prop).
//  · disabled is the native attribute → pointer-events-none + opacity-50.
//  A bare input has no visible label, so a11y (axe gate) needs an associated <label htmlFor> /
//  FieldLabel, or an aria-label — never a placeholder alone.
const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    type: 'text',
    placeholder: 'Search…',
    'aria-label': 'Search',
  },
  // Curated prop docs for the Autodocs ArgsTable — Input spreads ComponentProps<'input'> (the full
  // native surface), so the public API is documented here by hand: the props that actually shape the
  // DS states (type/value/disabled) plus the a11y essentials. Interactive/gallery stories scope or
  // disable their own panel.
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url', 'file'],
      description: 'Native input type — drives the keyboard/affordance. `file` switches to the file picker anatomy.',
      table: { type: { summary: 'React.HTMLInputTypeAttribute' }, defaultValue: { summary: '"text"' } },
    },
    placeholder: {
      control: 'text',
      description: 'Hint shown while empty — rendered in the dedicated `input-ink-placeholder` token. Not a label substitute.',
      table: { type: { summary: 'string' } },
    },
    defaultValue: {
      control: 'text',
      description: 'Initial value when uncontrolled (the "filled" state).',
      table: { type: { summary: 'string | number' } },
    },
    value: {
      control: false,
      description: 'Controlled value (pair with `onChange`).',
      table: { type: { summary: 'string | number' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Native disabled — blocks interaction and dims the field (`opacity-50`).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    'aria-invalid': {
      control: 'boolean',
      description: 'Marks the field invalid → destructive border + ring. Pair with a `FieldError`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    'aria-label': {
      control: false,
      description: 'Accessible name for a bare (unlabelled) input. Prefer an associated `FieldLabel` in real forms.',
      table: { type: { summary: 'string' } },
    },
    onChange: {
      control: false,
      description: 'Change handler (required when controlling `value`).',
      table: { type: { summary: '(e: ChangeEvent<HTMLInputElement>) => void' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The DS text field — a native `<input>` whose states are real CSS/attributes, not props: focus (`:focus-visible` ring), `aria-invalid` (destructive ring), `disabled`. Pair it with the **Field** family (`FieldLabel`/`FieldDescription`/`FieldError`) for accessible, labelled forms — see the **WithLabel** / **WithError** stories.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Default — the API playground. render spreads {...args} into a complete <Input>, so every prop in
// the meta argTypes is a live control AND an ArgsTable row (no controls.include — it would also
// filter the table) and the 'code' snippet is a real example, never an empty {}. play types into the
// field (it owns its own value, uncontrolled) and asserts the visible value, ending on blur() so the
// end state matches a real mouse user (no lingering focus ring).
export const Default: Story = {
  render: (args) => <Input {...args} />,
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole('textbox', { name: /search/i });

    await step('typing updates the value', async () => {
      await userEvent.type(input, 'invoice_2024');
      await expect(input).toHaveValue('invoice_2024');
    });

    // userEvent.type leaves the field focused (→ :focus-visible ring); blur() drops it so the
    // end state matches a real mouse user (no lingering ring).
    await step('blurring clears the focus', async () => {
      input.blur();
      await expect(input).not.toHaveFocus();
    });
  },
};

// Usage "WithLabel": the canonical labelled field — FieldLabel (htmlFor) above the input in a
// vertical Field. This is the real composition for a form row; the htmlFor↔id link gives the input
// its accessible name (so no aria-label needed here).
export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="type-name">Type name</FieldLabel>
      <Input id="type-name" placeholder="e.g. invoice" />
    </Field>
  ),
};

// Usage "WithDescription": label + helper text stacked above the input via FieldContent, so the
// description is associated with the field (the docs "with hint" pattern).
export const WithDescription: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field className="max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor="record-type">Record type</FieldLabel>
        <FieldDescription>The technical name as stored in the repository.</FieldDescription>
      </FieldContent>
      <Input id="record-type" defaultValue="document" />
    </Field>
  ),
};

// Usage "WithError": the invalid composition — aria-invalid on the Input + data-invalid on the
// Field + a FieldError message. The control goes destructive; the label stays neutral (the DS Field
// keeps label/description neutral on invalid — only the field + error redden).
export const WithError: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field data-invalid className="max-w-sm">
      <FieldLabel htmlFor="sql-query">SQL query</FieldLabel>
      <Input id="sql-query" aria-invalid defaultValue="SELCT * FROM documents" />
      <FieldError>Syntax error near “SELCT”. Did you mean SELECT?</FieldError>
    </Field>
  ),
};

// Usage "Form": several fields grouped under a FieldSet + FieldLegend + FieldGroup — the real
// multi-row form layout (connection dialog), showing inputs composed alongside each other.
export const Form: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <FieldSet className="max-w-sm">
      <FieldLegend variant="label">Connection</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="conn-host">Host</FieldLabel>
          <Input id="conn-host" type="url" placeholder="https://momentum.example.com" />
        </Field>
        <Field>
          <FieldLabel htmlFor="conn-user">User</FieldLabel>
          <Input id="conn-user" defaultValue="presales" />
        </Field>
        <Field>
          <FieldLabel htmlFor="conn-pass">Password</FieldLabel>
          <Input id="conn-pass" type="password" placeholder="••••••••" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};

// Usage "File": type="file" switches to the file-picker anatomy (the file:* slot styling — a
// borderless inline button before the text). No placeholder; the FieldLabel names it.
export const File: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="schema-import">Import schema</FieldLabel>
      <Input id="schema-import" type="file" />
    </Field>
  ),
};

// DS-authored gallery: every state side by side, mirroring the Figma .Input variant set
// (state = default | placeholder | filled | focus | disabled | invalid). focus is a live
// :focus-visible pseudo-state, forced statically via the pseudo-states addon (targeting #i-focus).
// Each row reuses a labelled column so the gallery stays a11y-clean. Rows from STATE_ROWS.
const STATE_ROWS = [
  { id: 'i-default', label: 'Default (empty)', props: { placeholder: 'Search…' } },
  { id: 'i-filled', label: 'Filled', props: { defaultValue: 'invoice_2024' } },
  { id: 'i-focus', label: 'Focus', props: { defaultValue: 'invoice_2024' } },
  { id: 'i-disabled', label: 'Disabled', props: { defaultValue: 'invoice_2024', disabled: true } },
  { id: 'i-invalid', label: 'Invalid', props: { defaultValue: 'not-a-valid-value', 'aria-invalid': true } },
] as const;

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: { focusVisible: ['#i-focus'] },
  },
  render: () => (
    <div className="flex w-80 flex-col gap-lg">
      {STATE_ROWS.map((row) => (
        <div key={row.id} className="flex flex-col gap-xs">
          <span className="text-format-eyebrow text-muted-ink">{row.label}</span>
          <Input id={row.id} aria-label={row.label} {...row.props} />
        </div>
      ))}
    </div>
  ),
};
