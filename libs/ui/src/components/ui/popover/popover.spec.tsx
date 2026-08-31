import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover';

// Closed-path + defaultOpen only (finding B20): PopoverContent portals + mounts ONLY on open.
// `defaultOpen` mounts it without driving Radix's pointer-capture flow (which jsdom lacks), so
// jsdom asserts the trigger + the rendered surface; the open→Escape pointer flow is covered by
// the Chromium storybook play test.
describe('Popover', () => {
  it('renders the trigger and keeps the content unmounted while closed', () => {
    const { getByRole, queryByText } = render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Title</PopoverTitle>
            <PopoverDescription>Body</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    );

    const trigger = getByRole('button', { name: 'Open' });
    expect(trigger.getAttribute('data-slot')).toBe('popover-trigger');
    // Closed → the trigger reports collapsed and the portal content is not in the DOM.
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(queryByText('Title')).toBeNull();
    expect(queryByText('Body')).toBeNull();
  });

  it('renders the content with the DS raised-surface tokens when open', () => {
    const { getByText } = render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Heading</PopoverTitle>
            <PopoverDescription>Description text</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    );

    const content = getByText('Heading').closest(
      '[data-slot="popover-content"]'
    );
    expect(content).toBeTruthy();
    // Token survival — the raised-surface classes translated from stock
    // (bg-popover → bg-dialog-fill, shadow-md → shadow-elevation, rounded-lg → corner-lg, …).
    const cls = content?.className ?? '';
    expect(cls).toContain('bg-dialog-fill');
    expect(cls).toContain('text-dialog-ink');
    expect(cls).toContain('border');
    expect(cls).toContain('shadow-elevation');
    expect(cls).toContain('corner-lg');
    expect(cls).toContain('p-lg');
    expect(cls).toContain('text-format-body');
  });

  it('applies the label format to the title and the muted body format to the description', () => {
    const { getByText } = render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Heading</PopoverTitle>
          <PopoverDescription>Muted line</PopoverDescription>
        </PopoverContent>
      </Popover>
    );

    expect(getByText('Heading').className).toContain('text-format-label-md');
    const desc = getByText('Muted line').className;
    expect(desc).toContain('text-format-body');
    expect(desc).toContain('text-muted');
  });
});
