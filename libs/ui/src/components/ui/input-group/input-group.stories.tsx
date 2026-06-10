import type { Meta, StoryObj } from '@storybook/react-vite';
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

// Canonical usage set = the structurally-distinct, portable shadcn doc examples
// (see run notes example-inventory). Composition showcases → controls disabled.
const meta: Meta<typeof InputGroup> = {
  title: 'UI/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

// Hero: leading search icon + borderless input. The group owns the border + focus ring.
export const Default: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput placeholder="Search…" />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

// Icon addon placements — inline-start, inline-end, both, and two icons in one addon.
export const Icons: Story = {
  render: () => (
    <div className="grid w-80 gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Search…" />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput type="email" placeholder="Enter your email" />
        <InputGroupAddon align="inline-end">
          <RiMailLine />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon>
          <RiBankCardLine />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <RiCheckLine />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Card number" />
        <InputGroupAddon align="inline-end">
          <RiStarLine />
          <RiCheckLine />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

// Text addons — prefix/suffix labels (currency, URL scheme/TLD, domain suffix).
export const Text: Story = {
  render: () => (
    <div className="grid w-80 gap-6">
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="username" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>@company.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

// Keyboard-shortcut hint — leading icon + trailing Kbd group (quiet `low` emphasis).
export const Kbd_: Story = {
  name: 'Kbd',
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput placeholder="Search…" />
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

// Trailing action buttons — icon button (copy) and a text button (search).
export const Buttons: Story = {
  render: () => (
      <div className="grid w-80 gap-6">
        <InputGroup>
          <InputGroupInput placeholder="https://x.com/shadcn" readOnly/>
          <InputGroupAddon align="inline-end">
            <InputGroupButton aria-label="Copy" title="Copy" size="icon-sm">
              <RiFileCopyLine/>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="Type to search…"/>
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="xs" variant={"default"}>Search</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
  ),
};

// Textarea with block-aligned toolbars — the group stacks vertically; addons get borders.
export const Textarea: Story = {
  render: () => (
    <div className="w-96">
      <InputGroup>
        <InputGroupTextarea
          placeholder="console.log('Hello, world!');"
          className="min-h-[160px]"
        />
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="font-mono font-medium">
            <RiJavascriptLine />
            script.js
          </InputGroupText>
          <InputGroupButton className="ml-auto" size="icon-xs">
            <RiRefreshLine />
          </InputGroupButton>
          <InputGroupButton variant="ghost" size="icon-xs">
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

// Container states — default / disabled / invalid (focus is an interaction state).
export const States: Story = {
  render: () => (
    <div className="grid w-80 gap-6">
      <InputGroup>
        <InputGroupInput placeholder="Default" />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Disabled" disabled />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput aria-invalid defaultValue="not-a-valid-value" />
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};
