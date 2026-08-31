import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent } from 'storybook/test';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';
import { Field, FieldDescription, FieldError, FieldLabel } from '../field';

// Select contract — a Radix Select: SelectTrigger is the closed combobox button (input-like —
// bg-input-fill + border-input-border + corner-lg; `size` sets h-8/h-7; focus-visible adds
// border-ring + 3px ring/50; aria-invalid adds the destructive border + ring; data-placeholder
// greys the value via input-ink-placeholder; a trailing chevron is fixed). SelectContent is the
// raised dropdown (Portal, mounts on open) on the dialog surface (bg-dialog-fill + border +
// shadow-elevation); SelectItem highlights on focus via accent-fill + accent-ink and shows a
// trailing check when selected. Compose with the Field family for labelled / invalid forms.
//
// This page documents the value-driven Select ROOT + the usage compositions. Each sub-part with its
// own API gets its own Autodocs page (UI/Select/SelectTrigger | SelectContent | SelectItem | SelectValue),
// mirroring UI/RadioGroup → UI/RadioGroup/Item — not meta.subcomponents (which can't surface controls and
// renders empty tabs for the prop-less parts).
//
// Usage examples mirror ui.shadcn.com/docs/components/select. Skipped (un-ported dep / locale): the
// "Form" example (needs react-hook-form, un-ported) and the "RTL" Arabic locale demo.
const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  args: { disabled: false },
  // type · description · enum come from SelectProps JSDoc via react-docgen (see select.tsx). argTypes
  // adds only a defaultValue per defaulted root prop (the ArgsTable Default column ignores the @default
  // JSDoc tag). Sub-part props (size / position / align / value / placeholder) live on their own pages.
  argTypes: {
    disabled: { table: { defaultValue: { summary: 'false' } } },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The DS select — a Radix Select whose **trigger** reads as a form field (`bg-input-fill`, `border-input-border`, focus ring, `aria-invalid` red) with a compact `sm` / `default` size, and whose **dropdown** is the raised dialog surface with accent-tinted highlighted items and a check on the selected one. Compose with the **Field** family (`FieldLabel`/`FieldError`) for labelled forms — see the **Invalid** story. Each sub-part with its own API has a dedicated page: [SelectTrigger](?path=/docs/ui-select-selecttrigger--docs) · [SelectContent](?path=/docs/ui-select-selectcontent--docs) · [SelectItem](?path=/docs/ui-select-selectitem--docs) · [SelectValue](?path=/docs/ui-select-selectvalue--docs).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// Playground — a complete working Select. The {...args} spread onto <Select> makes the ROOT props
// (disabled / value / defaultValue / open / required …) live controls + ArgsTable rows. The play drives
// it: open, pick, assert the value lands on the trigger.
export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Favorite fruit" className="w-50">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('combobox', { name: /favorite fruit/i });

    await step('opens the listbox on click', async () => {
      await userEvent.click(trigger);
      // SelectContent portals to document.body → query the screen, not the canvas.
      await expect(await screen.findByRole('listbox')).toBeInTheDocument();
    });

    await step('selecting an option updates the trigger value', async () => {
      await userEvent.click(await screen.findByRole('option', { name: 'Blueberry' }));
      await expect(trigger).toHaveTextContent('Blueberry');
    });

    // Selection returns focus to the trigger (→ :focus-visible ring); blur so the end state
    // matches a real mouse user.
    await step('blurring clears the focus', async () => {
      trigger.blur();
      await expect(trigger).not.toHaveFocus();
    });
  },
};

// docs "Groups" — SelectGroup + SelectLabel split by a SelectSeparator. The label captions each
// group; the separator is a full-bleed border line between them.
export const Groups: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Select>
      <SelectTrigger aria-label="Timezone" className="w-60">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern (EST)</SelectItem>
          <SelectItem value="cst">Central (CST)</SelectItem>
          <SelectItem value="pst">Pacific (PST)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich (GMT)</SelectItem>
          <SelectItem value="cet">Central European (CET)</SelectItem>
          <SelectItem value="eet">Eastern European (EET)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// docs "Scrollable" — a long option list; the SelectScrollUp/DownButton affordances appear at the
// edges of the dropdown when it overflows the available height.
const TIMEZONES = [
  'UTC−12:00',
  'UTC−11:00',
  'UTC−10:00',
  'UTC−09:00',
  'UTC−08:00',
  'UTC−07:00',
  'UTC−06:00',
  'UTC−05:00',
  'UTC−04:00',
  'UTC−03:00',
  'UTC−02:00',
  'UTC−01:00',
  'UTC±00:00',
  'UTC+01:00',
  'UTC+02:00',
  'UTC+03:00',
  'UTC+04:00',
  'UTC+05:00',
  'UTC+06:00',
  'UTC+07:00',
  'UTC+08:00',
  'UTC+09:00',
  'UTC+10:00',
  'UTC+11:00',
  'UTC+12:00',
];

export const Scrollable: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Select>
      <SelectTrigger aria-label="UTC offset" className="w-50">
        <SelectValue placeholder="Select an offset" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>UTC offset</SelectLabel>
          {TIMEZONES.map((tz) => (
            <SelectItem key={tz} value={tz}>
              {tz}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// docs "Disabled" — a whole-select disabled trigger, plus a single disabled option (data-disabled
// dims it and blocks selection). Both states dim to 50%.
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-lg">
      <Select disabled>
        <SelectTrigger aria-label="Disabled select" className="w-50">
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger aria-label="With a disabled option" className="w-50">
          <SelectValue placeholder="One option disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana" disabled>
            Banana (out of stock)
          </SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// docs "Invalid" — the select composed in the ported Field family (the doc's real composition, not a
// bare div + label): Field data-invalid + aria-invalid on the trigger reddens the border, FieldError
// shows the message. Mirrors the sibling Invalid stories (checkbox/switch/radio). The destructive ring
// is focus-gated → resting invalid shows only the red border (the ring appears on focus, see TriggerStates).
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field data-invalid className="max-w-sm">
      <FieldLabel htmlFor="country">Country</FieldLabel>
      <Select>
        <SelectTrigger id="country" aria-invalid className="w-full">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="at">Austria</SelectItem>
          <SelectItem value="ch">Switzerland</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>Used to set your default tax region.</FieldDescription>
      <FieldError>Please select a country to continue.</FieldError>
    </Field>
  ),
};

// DS-authored gallery (no standalone doc example): the trigger across size × state, side by side,
// mirroring the Figma Select trigger set. Focus rows are forced via the pseudo-states addon
// (targeted by trigger id), so the focus ring — and the focus-gated invalid red ring — render
// statically. Closed triggers only (the dropdown is covered by Default's play test).
export const TriggerStates: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: { focusVisible: ['#st-focus', '#st-invalid-focus'] },
  },
  render: () => {
    const cell = (label: string, props: React.ComponentProps<typeof SelectTrigger>) => (
      <div className="flex flex-col gap-xs">
        <span className="text-format-eyebrow text-muted">{label}</span>
        <Select>
          <SelectTrigger aria-label={label} className="w-50" {...props}>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
    return (
      <div className="flex flex-col gap-lg">
        {cell('Default', {})}
        {cell('Small', { size: 'sm' })}
        {cell('Focus', { id: 'st-focus' })}
        {cell('Disabled', { disabled: true })}
        {cell('Invalid', { 'aria-invalid': true })}
        {cell('Invalid + focus', { id: 'st-invalid-focus', 'aria-invalid': true })}
      </div>
    );
  },
};
