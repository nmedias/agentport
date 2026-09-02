import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from './label';
import { Input } from '../input';
import { Checkbox } from '../checkbox';

// Label contract — a Radix Label re-clothed in DS tokens (text-format-label-md), DISPLAY-ONLY:
//  · htmlFor↔id is the whole job: it names the associated control, so clicking the label
//    focuses/toggles that control and screen readers read the caption as the field's name.
//    A label is only accessible when an id-matched control exists — that pairing is the a11y gate.
//  · No own state axis. It dims (opacity-50) only by REACTING to a disabled control via two
//    mechanisms it ships verbatim: group-data-[disabled=true] (an ancestor marks the group
//    disabled — the Field pattern) and peer-disabled (a :disabled sibling tagged `peer`). Both
//    need a real disabled control to fire — never faked here.
//  · select-none keeps double-click from selecting the caption text. There is no focus/invalid
//    state of its own to story (those belong to the control it labels).
const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  args: { children: 'Email' },
  // Prop type · description · enum come from the component's JSDoc via react-docgen (see
  // LabelProps in label.tsx — `htmlFor` is re-declared flat there). argTypes adds only what
  // docgen can't supply: `children` is an inherited React.ReactNode (no own JSDoc → no docgen
  // description), so its caption description + text control stay hand-curated here. Label has
  // no defaulted prop, so there is no `table.defaultValue` to declare.
  argTypes: {
    children: {
      control: 'text',
      description: 'Label caption — text (or text + a small icon).',
      table: { type: { summary: 'React.ReactNode' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The caption that names a control via the `htmlFor`↔`id` pairing: clicking it focuses or toggles the control, screen readers read it as the field name. It has no state of its own — it only dims in reaction to a disabled control.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

// Default — the API playground. render spreads {...args} into a complete <Label>, so every
// prop in the meta argTypes is a live control AND an ArgsTable row (no controls.include — it
// would also filter the table) and the 'code' snippet shows a real example, never an empty {}.
// No play: a label is a static <label> with no interaction of its own — it only ever reacts to
// the control it names, which is demonstrated in the usage stories below.
export const Default: Story = {
  render: (args) => <Label {...args} />,
};

// Bound to a text input via htmlFor↔id — clicking the label focuses the input, and the
// caption becomes the input's accessible name. The canonical label usage.
export const WithInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-80 flex-col gap-md">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

// A different real composition: label beside a Checkbox (the toggle-caption row). Same
// htmlFor↔id pairing, so clicking the caption toggles the box and names it for the reader.
export const WithCheckbox: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-md">
      <Checkbox id="terms" defaultChecked />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

// The label has no disabled state of its own — it DIMS by reacting to a disabled control.
// Here the input carries `peer` + `disabled`, so the sibling label's `peer-disabled:opacity-50`
// fires off the real control state (not a faked class). htmlFor↔id keeps the pairing intact.
export const DisabledPeer: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-80 flex-col gap-md">
      <Input id="email-disabled" type="email" placeholder="you@example.com" disabled className="peer" />
      <Label htmlFor="email-disabled">Email address</Label>
    </div>
  ),
};
