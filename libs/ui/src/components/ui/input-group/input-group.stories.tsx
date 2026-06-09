import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiSearchLine, RiCloseLine } from '@remixicon/react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from './input-group';

const meta: Meta<typeof InputGroup> = {
  title: 'UI/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

// Leading icon addon (inline-start) + control. The group owns the border + focus
// ring; the input is borderless and fills the row.
export const Default: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <RiSearchLine />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search…" />
      </InputGroup>
    </div>
  ),
};

// Trailing addon with a ghost button.
export const WithTrailingButton: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <RiSearchLine />
        </InputGroupAddon>
        <InputGroupInput placeholder="Filter types…" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Clear">
            <RiCloseLine />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

// Inline text addon (a prefix/suffix label).
export const WithText: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="momentum.example.com" />
      </InputGroup>
    </div>
  ),
};

// Block-aligned addon → the group stacks vertically (toolbar above a textarea).
export const WithTextarea: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupTextarea placeholder="Add a description…" rows={3} />
        <InputGroupAddon align="block-end">
          <InputGroupText>Markdown supported</InputGroupText>
          <InputGroupButton size="xs" className="ml-auto">
            Save
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <RiSearchLine />
        </InputGroupAddon>
        <InputGroupInput placeholder="Disabled" disabled />
      </InputGroup>
    </div>
  ),
};

// Invalid bubbles up from the control to the group border + ring. destructive is
// still a ⚠ placeholder token (stock hex) — see tokens-reference.md.
export const Invalid: Story = {
  render: () => (
    <div className="w-80">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <RiSearchLine />
        </InputGroupAddon>
        <InputGroupInput aria-invalid defaultValue="not-a-valid-value" />
      </InputGroup>
    </div>
  ),
};
