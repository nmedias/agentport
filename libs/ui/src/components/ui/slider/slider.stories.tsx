import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';

import { Slider } from './slider';
import { Field, FieldDescription, FieldTitle } from '../field';

// Slider contract — a Radix Slider.Root (data-slot="slider") whose track + range + thumb(s)
// are pure CSS, not props:
//  · Track = the rail (bg-input-fill-high, corner-full); Range = the filled portion
//    (bg-primary-fill), spanning from min to the thumb (single) or between the thumbs (range).
//  · One Thumb (role="slider") per value → two values render a range. The thumb is a white knob
//    (bg-surface) with an input-border edge; hover/focus-visible/active add the ring-ring/50 3px
//    ring (Input-family focus glow). disabled dims the whole control via data-disabled.
//  · orientation (horizontal | vertical) flips the layout (data-orientation). No invalid state.
// Usage examples mirror ui.shadcn.com/docs/components/radix/slider (the single demo + the
// field-slider range example, composed with the ported Field family). The range/2-thumb form is
// data-driven (pass two values) — modelled in Figma as a Figma-only `thumbs` axis.
const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  tags: ['autodocs'],
  // onValueChange is an fn() spy so Default's play can assert the keyboard step fired.
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
    disabled: false,
    onValueChange: fn(),
  },
  // Prop type · description · enum come from the component's JSDoc via react-docgen (see SliderProps
  // in slider.tsx); Storybook infers each control from the type. argTypes adds only: (1) control
  // overrides — orientation as inline-radio, value off (a controlled value would freeze the
  // playground); (2) a defaultValue per defaulted prop — the ArgsTable Default column ignores the
  // @default JSDoc tag, so every default is declared here uniformly.
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'], table: { defaultValue: { summary: '"horizontal"' } } },
    value: { control: false },
    min: { table: { defaultValue: { summary: '0' } } },
    max: { table: { defaultValue: { summary: '100' } } },
    step: { table: { defaultValue: { summary: '1' } } },
    disabled: { table: { defaultValue: { summary: 'false' } } },
  },
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The DS slider — a Radix slider whose track (`bg-input-fill-high` rail), range (`bg-primary-fill` fill) and thumb(s) are pure CSS. Pass **two values** for a range (one thumb per value). `orientation` (`horizontal` | `vertical`) sets the track direction; the thumb shows the Input-family focus ring. Compose with the **Field** family for a label (see **Field Slider**).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

// Bare slider — the API playground. Renders <Slider {...args} /> in a fixed-width box (the
// control is w-full). aria-label names the otherwise-bare thumb (in real usage a Field/Label
// supplies it). play drives the thumb with the keyboard (Radix steps on ArrowRight) and asserts
// onValueChange (the fn() spy) fired and the value advanced.
export const Default: Story = {
  render: (args) => (
    <div className="w-full max-w-sm">
      <Slider aria-label="Volume" {...args} />
    </div>
  ),
  play: async ({ canvas, args, step }) => {
    const thumb = canvas.getByRole('slider');

    await step('starts at 50', async () => {
      await expect(thumb).toHaveAttribute('aria-valuenow', '50');
    });

    await step('ArrowRight steps the value and fires onValueChange', async () => {
      thumb.focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect(args.onValueChange).toHaveBeenCalled();
      await expect(thumb).toHaveAttribute('aria-valuenow', '51');
    });

    // Drop focus so the end state matches a real mouse user (no lingering ring).
    await step('blurring clears the focus', async () => {
      thumb.blur();
      await expect(thumb).not.toHaveFocus();
    });
  },
};

// Range / two-thumb: pass two values → two thumbs, the Range fill spans between them.
export const Range: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-sm">
      <Slider defaultValue={[25, 75]} max={100} step={1} aria-label="Range" />
    </div>
  ),
};

// docs "field-slider": a labeled range slider composed with the ported Field family
// (FieldTitle + FieldDescription). Controlled so the description reflects the live value.
function PriceRangeField() {
  const [value, setValue] = React.useState([200, 800]);
  return (
    <div className="w-full max-w-md">
      <Field>
        <FieldTitle>Price Range</FieldTitle>
        <FieldDescription>
          Set your budget range ($
          <span className="tabular-nums text-ink">{value[0]}</span> – $
          <span className="tabular-nums text-ink">{value[1]}</span>).
        </FieldDescription>
        <Slider
          value={value}
          onValueChange={setValue}
          max={1000}
          min={0}
          step={10}
          className="mt-md w-full"
          aria-label="Price Range"
        />
      </Field>
    </div>
  );
}

export const FieldSlider: Story = {
  parameters: {
    controls: { disable: true },
    // render delegates to the stateful PriceRangeField wrapper → the auto "Show code"
    // snippet would just read `<PriceRangeField />` and hide the implementation. Surface
    // the real composition a consumer writes (/storybook-rules: wrapper render → source.code).
    docs: {
      source: {
        code: `function PriceRangeField() {
  const [value, setValue] = React.useState([200, 800]);
  return (
    <Field>
      <FieldTitle>Price Range</FieldTitle>
      <FieldDescription>
        Set your budget range (\${value[0]} – \${value[1]}).
      </FieldDescription>
      <Slider
        value={value}
        onValueChange={setValue}
        min={0}
        max={1000}
        step={10}
        className="mt-md w-full"
        aria-label="Price Range"
      />
    </Field>
  );
}`,
      },
    },
  },
  render: () => <PriceRangeField />,
};

// Vertical orientation — code supports it (data-orientation flips the layout). min-h-40 gives
// the track a height to fill.
export const Vertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex h-44 items-stretch">
      <Slider orientation="vertical" defaultValue={[40]} aria-label="Vertical" />
    </div>
  ),
};

// Disabled — data-disabled dims the whole control.
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-full max-w-sm">
      <Slider defaultValue={[50]} disabled aria-label="Disabled" />
    </div>
  ),
};

// DS-authored gallery: the state matrix (maps the Figma Slider variant set —
// orientation × thumbs × state). The focus rows force :focus-visible on the thumb via the
// pseudo-states addon so the focus ring is visible statically. Each bare control carries an
// aria-label (the caption span is decorative).
export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
    pseudo: { focusVisible: ['#sl-focus [data-slot=slider-thumb]', '#sl-range-focus [data-slot=slider-thumb]'] },
  },
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-xl">
      <div className="flex flex-col gap-xs">
        <span className="text-format-body text-muted-ink">Default</span>
        <Slider defaultValue={[50]} aria-label="Default" />
      </div>
      <div className="flex flex-col gap-xs" id="sl-focus">
        <span className="text-format-body text-muted-ink">Focus</span>
        <Slider defaultValue={[50]} aria-label="Focus" />
      </div>
      <div className="flex flex-col gap-xs">
        <span className="text-format-body text-muted-ink">Disabled</span>
        <Slider defaultValue={[50]} disabled aria-label="Disabled" />
      </div>
      <div className="flex flex-col gap-xs">
        <span className="text-format-body text-muted-ink">Range</span>
        <Slider defaultValue={[25, 75]} aria-label="Range" />
      </div>
      <div className="flex flex-col gap-xs" id="sl-range-focus">
        <span className="text-format-body text-muted-ink">Range + focus</span>
        <Slider defaultValue={[25, 75]} aria-label="Range focus" />
      </div>
    </div>
  ),
};
