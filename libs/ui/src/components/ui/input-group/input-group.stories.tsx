import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import {
  RiSearchLine,
  RiMailLine,
  RiBankCardLine,
  RiCheckLine,
  RiStarLine,
  RiFileCopyLine,
  RiCornerDownLeftLine,
  RiJavascriptLine,
  RiRefreshLine,
  RiCommandLine,
} from '@remixicon/react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from './input-group';
import { Kbd } from '@/components/ui/kbd';
import { Field, FieldLabel } from '@/components/ui/field';

// InputGroup contract — a composite shell, NOT "an input with addons":
//  · MECHANISM: the GROUP <div role="group"> owns the surface (bg-input-fill +
//    border-input-border + radius); the control inside goes borderless
//    (InputGroupInput/-Textarea carry data-slot="input-group-control"), and
//    InputGroupAddon slots sit beside/around it. `align` places an addon
//    inline-start/-end (left/right of the control) or block-start/-end (the group
//    stacks vertically — a toolbar above/below a textarea).
//  · WHEN focus: the group does NOT own focus — the inner control does. The ring
//    bubbles UP via `has-[…control:focus-visible]` on the group (border-ring +
//    ring-ring/50), so focusing the input lights the whole shell. invalid/disabled
//    bubble the same way (aria-invalid on a child → destructive border+ring;
//    :disabled → opacity-50). Forcing the ring statically = focusVisible on the
//    inner input id (the addon's own focus is not what the group keys on).
//  · Addons are inert chrome: clicking an addon (that isn't a button) refocuses the
//    input; InputGroupButton nests a real DS Button at a mapped size.
const meta: Meta<typeof InputGroup> = {
  title: 'UI/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  args: {},
  // Curated prop docs for the Autodocs ArgsTable — react-docgen can't read the
  // ComponentProps<'div'> the root spreads, so the public API is documented here by
  // hand. The root is a passthrough <div role="group"> (no variant axis); composition
  // happens through the InputGroupAddon/-Input/-Button children, not root props.
  argTypes: {
    children: {
      control: false,
      description:
        'The control + addons — InputGroupInput / InputGroupTextarea plus one or more InputGroupAddon (each `align`ed inline/block).',
      table: { type: { summary: 'React.ReactNode' } },
    },
    className: {
      control: 'text',
      description: 'Extra classes merged onto the group shell (sizing, overrides).',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'Fuses a control and its adornments (icons, buttons, text) into one field: the group owns border, focus and invalid treatment, the control inside goes borderless. Addons sit beside the control or as a bar above/below it. State always originates from the inner control — the group has none of its own, it mirrors.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

// Default — the API playground. render spreads {...args} into a COMPLETE canonical
// group (borderless input + a leading search addon), so the ArgsTable documents the
// root props while the 'code' snippet stays a real example. play drives the inner
// input like a user (query the textbox by its accessible name) and asserts the value.
export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <InputGroup {...args}>
        <InputGroupInput aria-label="Search" placeholder="Search…" />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole('textbox', { name: /search/i });

    await step('typing updates the inner control value', async () => {
      await userEvent.type(input, 'documents');
      await expect(input).toHaveValue('documents');
    });

    // userEvent.type leaves the input focused (→ the group's :focus-visible ring);
    // blur() drops it so the end state matches a real mouse user (no lingering ring).
    await step('blurring clears the focus', async () => {
      input.blur();
      await expect(input).not.toHaveFocus();
    });
  },
};

// Usage — icon addon placements: inline-start, inline-end, both, and two icons in one addon.
export const Icons: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid w-80 gap-2xl">
      <InputGroup>
        <InputGroupInput aria-label="Search" placeholder="Search…" />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Email" type="email" placeholder="Enter your email" />
        <InputGroupAddon align="inline-end">
          <RiMailLine />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Card number" placeholder="Card number" />
        <InputGroupAddon>
          <RiBankCardLine />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <RiCheckLine />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Card number, validated" placeholder="Card number" />
        <InputGroupAddon align="inline-end">
          <RiStarLine />
          <RiCheckLine />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

// Usage — text addons: prefix/suffix labels (currency, URL scheme/TLD, domain suffix).
export const Text: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid w-80 gap-2xl">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Amount" placeholder="0.00" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput aria-label="Website host" placeholder="example.com" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Username" placeholder="username" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@company.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

// Usage — labelled field: FieldLabel (htmlFor) above the group; the htmlFor↔id link
// gives the inner input its accessible name (no aria-label needed in this composition).
export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="search">Schema</FieldLabel>
      <InputGroup>
        <InputGroupInput id="search" placeholder="Search…" />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  ),
};

// Usage — keyboard-shortcut hint: leading icon + a trailing Kbd group (quiet `low` emphasis).
export const Kbd_: Story = {
  name: 'Kbd',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput aria-label="Search" placeholder="Search…" />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd emphasis="low">
            <RiCommandLine />
          </Kbd>
          <Kbd emphasis="low">K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

// Usage — trailing action buttons: an icon button (copy) and a text button (search).
export const Buttons: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid w-80 gap-2xl">
      <InputGroup>
        <InputGroupInput aria-label="Share link" placeholder="https://x.com/shadcn" readOnly />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="Copy" title="Copy" size="icon-sm">
            <RiFileCopyLine />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Search query" placeholder="Type to search…" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="xs" variant="default">
            Search
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

// Usage — textarea with block-aligned toolbars: the group stacks vertically; the
// block-start/-end addons span full width and carry their own dividing border.
export const Textarea: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupTextarea
          aria-label="Code"
          placeholder="console.log('Hello, world!');"
          className="min-h-[160px]"
        />
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="text-format-data-sm">
            <RiJavascriptLine />
            script.js
          </InputGroupText>
          <InputGroupButton aria-label="Refresh" className="ml-auto" size="icon-xs">
            <RiRefreshLine />
          </InputGroupButton>
          <InputGroupButton aria-label="Copy" variant="ghost" size="icon-xs">
            <RiFileCopyLine />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText>Line 1, Column 1</InputGroupText>
          <InputGroupButton size="sm" className="ml-auto" variant="default">
            Run <RiCornerDownLeftLine />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

// States gallery — the real axis is the SHELL state bubbled up from the inner control:
// default / focus / disabled / invalid. focus can't be set by a prop, so the focus row's
// inner input is forced :focus-visible via the pseudo addon (the group keys on the
// control's focus, not the addon's), making the group's focus ring visible statically.
export const States: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: { focusVisible: ['#st-focus'] },
  },
  render: () => (
    <div className="grid w-80 gap-2xl">
      <InputGroup>
        <InputGroupInput aria-label="Default" placeholder="Default" />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput id="st-focus" aria-label="Focus" placeholder="Focus" />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Disabled" placeholder="Disabled" disabled />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-label="Invalid" aria-invalid defaultValue="not-a-valid-value" />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};
