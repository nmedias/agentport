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
// Usage examples mirror ui.shadcn.com/docs/components/select. Skipped (un-ported dep / locale):
// the "Form" example (needs react-hook-form, un-ported) and the "RTL" Arabic locale demo. The
// "Align item with trigger" (position popper/item-aligned) demo is folded into a Default control,
// not a separate structural story.
const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  // The Autodocs ArgsTable follows meta.component → the Select ROOT props (value/defaultValue/
  // onValueChange/open/disabled/required/name) from SelectProps JSDoc. `subcomponents` adds an ArgsTable
  // tab per part — but ONLY for parts with a documentable own API (curated flat props via /docgen-props):
  // SelectTrigger (size), SelectContent (position/align), SelectItem (value/disabled/textValue), SelectValue
  // (placeholder). The purely structural pass-throughs (Group/Label/Separator/ScrollButtons) have no own
  // props → react-docgen yields nothing → an empty "couldn't be auto-generated" tab, so they're omitted
  // (their use is shown in the Groups/Scrollable stories, not a broken table).
  subcomponents: { SelectTrigger, SelectContent, SelectItem, SelectValue },
  tags: ['autodocs'],
  args: { disabled: false },
  // type · description · enum come from SelectProps JSDoc via react-docgen (see select.tsx). argTypes
  // adds only a defaultValue per defaulted root prop (the ArgsTable Default column ignores the @default
  // JSDoc tag). Sub-part controls (size / position / align / value / placeholder) live on the
  // per-subcomponent stories below, scoped via controls.include — the Default panel stays Select-root only.
  argTypes: {
    disabled: { table: { defaultValue: { summary: 'false' } } },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The DS select — a Radix Select whose **trigger** reads as a form field (`bg-input-fill`, `border-input-border`, focus ring, `aria-invalid` red) with a compact `sm` / `default` size, and whose **dropdown** is the raised dialog surface with accent-tinted highlighted items and a check on the selected one. Compose with the **Field** family (`FieldLabel`/`FieldError`) for labelled forms — see the **Invalid** story.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// Bare playground — a complete working Select. The {...args} spread onto <Select> makes the ROOT props
// (disabled / value / defaultValue / open / required …) live controls + ArgsTable rows. Sub-part props
// live on their own per-subcomponent stories below (TriggerControls / ContentControls / ItemControls /
// ValueControls) — Storybook builds controls from a story's args, and `subcomponents` only adds static
// doc tables, never controls. The play drives it: open, pick, assert the value lands on the trigger.
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

// Per-subcomponent control stories — one per part that owns props (the four in the docs ArgsTable). Each
// scopes its panel via controls.include to ONLY that part's props (the Default playground covers the Select
// root), wires them through render, and play-asserts the prop takes effect.

// SelectTrigger — `size` (h-8 / h-7) + `disabled`, driven onto the trigger. (Export name avoids the
// imported `SelectTrigger`; `name` sets the sidebar label.)
export const Trigger: StoryObj<{ size: 'sm' | 'default'; disabled: boolean }> = {
  name: 'SelectTrigger',
  args: { size: 'default', disabled: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'default'], table: { defaultValue: { summary: '"default"' } } },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
  },
  parameters: { controls: { include: ['size', 'disabled'] } },
  render: ({ size, disabled }) => (
    <Select>
      <SelectTrigger aria-label="Trigger size" className="w-50" size={size} disabled={disabled}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('combobox', { name: /trigger size/i });
    await step('reflects the size on data-size', async () => {
      await expect(trigger).toHaveAttribute('data-size', 'default');
    });
    await step('the enabled trigger opens', async () => {
      await userEvent.click(trigger);
      await expect(await screen.findByRole('listbox')).toBeInTheDocument();
      await userEvent.keyboard('{Escape}');
    });
  },
};

// SelectContent — `position` (item-aligned / popper) + `align`, driven onto the dropdown. Toggle them and
// open to see the placement change.
export const Content: StoryObj<{
  position: 'item-aligned' | 'popper';
  align: 'start' | 'center' | 'end';
}> = {
  name: 'SelectContent',
  args: { position: 'item-aligned', align: 'center' },
  argTypes: {
    position: {
      control: 'inline-radio',
      options: ['item-aligned', 'popper'],
      table: { defaultValue: { summary: '"item-aligned"' } },
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      table: { defaultValue: { summary: '"center"' } },
    },
  },
  parameters: { controls: { include: ['position', 'align'] } },
  render: ({ position, align }) => (
    <Select>
      <SelectTrigger aria-label="Dropdown position" className="w-50">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent position={position} align={align}>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('combobox', { name: /dropdown position/i });
    await step('opens the dropdown', async () => {
      await userEvent.click(trigger);
      await expect(await screen.findByRole('listbox')).toBeInTheDocument();
    });
    await step('closes on Escape, focus back on the trigger', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(trigger).toHaveFocus();
    });
  },
};

// SelectItem — `value` (the submitted value) + `disabled`, driven onto one item. `textValue` (typeahead)
// stays documented in the ArgsTable but is NOT a control here: its effect is invisible and a no-op when
// the item's children are plain text (Radix derives the typeahead from them) — a control with no
// observable effect is noise.
export const Item: StoryObj<{ value: string; disabled: boolean }> = {
  name: 'SelectItem',
  args: { value: 'cherry', disabled: false },
  argTypes: {
    value: { control: 'text', table: { defaultValue: { summary: '"cherry"' } } },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
  },
  parameters: { controls: { include: ['value', 'disabled'] } },
  render: ({ value, disabled }) => (
    <Select>
      <SelectTrigger aria-label="Item options" className="w-50">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value={value} disabled={disabled}>
          Cherry
        </SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('combobox', { name: /item options/i });
    await step('opens the listbox', async () => {
      await userEvent.click(trigger);
      await expect(await screen.findByRole('listbox')).toBeInTheDocument();
    });
    await step('selecting the driven item updates the trigger', async () => {
      await userEvent.click(await screen.findByRole('option', { name: 'Cherry' }));
      await expect(trigger).toHaveTextContent('Cherry');
    });
  },
};

// SelectValue — `placeholder`, shown while nothing is selected.
export const Value: StoryObj<{ placeholder: string }> = {
  name: 'SelectValue',
  args: { placeholder: 'Select a fruit' },
  argTypes: {
    placeholder: { control: 'text', table: { defaultValue: { summary: '"Select a fruit"' } } },
  },
  parameters: { controls: { include: ['placeholder'] } },
  render: ({ placeholder }) => (
    <Select>
      <SelectTrigger aria-label="Empty value" className="w-50">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('combobox', { name: /empty value/i });
    await step('shows the placeholder while empty', async () => {
      await expect(trigger).toHaveTextContent('Select a fruit');
    });
  },
};

// Typeahead — where `textValue` earns its place: each option leads with an aria-hidden flag emoji, so its
// text CONTENT starts with the emoji, not the country name → Radix's derived typeahead (match-from-start)
// wouldn't find "portugal". `textValue="Portugal"` restores type-to-select. The play focuses the CLOSED
// trigger (Radix selects on type, like a native <select>) and types to jump — the behaviour proof a
// control can't give. This is why textValue is documented but not a SelectItem control (see SelectItem).
export const Typeahead: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Select>
      <SelectTrigger aria-label="Country" className="w-60">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="de" textValue="Germany">
          <span aria-hidden>🇩🇪</span> Germany
        </SelectItem>
        <SelectItem value="fr" textValue="France">
          <span aria-hidden>🇫🇷</span> France
        </SelectItem>
        <SelectItem value="pt" textValue="Portugal">
          <span aria-hidden>🇵🇹</span> Portugal
        </SelectItem>
        <SelectItem value="jp" textValue="Japan">
          <span aria-hidden>🇯🇵</span> Japan
        </SelectItem>
        <SelectItem value="br" textValue="Brazil">
          <span aria-hidden>🇧🇷</span> Brazil
        </SelectItem>
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole('combobox', { name: /country/i });
    await step('typing on the focused trigger jumps to the textValue match', async () => {
      trigger.focus();
      await userEvent.keyboard('portugal');
      await expect(trigger).toHaveTextContent('Portugal');
    });
    // userEvent leaves the trigger focused; blur so the end state matches a real mouse user.
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
        <span className="text-format-eyebrow text-muted-ink">{label}</span>
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
