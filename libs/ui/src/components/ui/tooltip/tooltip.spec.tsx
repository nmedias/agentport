import { act, render } from '@testing-library/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

// jsdom specs cover the CLOSED / trigger path only — TooltipContent is portal-mounted and renders
// ONLY while open (finding B20), and the hover→open flow needs a real browser, so the open path
// lives in the Chromium storybook project (tooltip.stories Default play). Here: the trigger renders,
// carries its data-slot, and stays interactive; no content node exists while closed.
describe('Tooltip', () => {
  function renderClosed() {
    return render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>Add to library</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  it('renders the trigger with its data-slot', () => {
    const { getByText } = renderClosed();
    const trigger = getByText('Hover');
    expect(trigger.getAttribute('data-slot')).toBe('tooltip-trigger');
  });

  it('does not mount the content while closed (portal mounts on open)', () => {
    renderClosed();
    expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull();
    expect(document.body.textContent).not.toContain('Add to library');
  });

  it('keeps the trigger focusable (it is a real button)', () => {
    const { getByText } = renderClosed();
    const trigger = getByText('Hover') as HTMLButtonElement;
    // focus opens the tooltip (Radix schedules a state update) → wrap in act so no warning leaks;
    // the open content is still portal-mounted and not asserted here (open path = the play story).
    act(() => trigger.focus());
    expect(document.activeElement).toBe(trigger);
  });

  it('forwards trigger props (asChild merges onto the child)', () => {
    const { getByRole } = render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a href="#x">link trigger</a>
          </TooltipTrigger>
          <TooltipContent>tip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const link = getByRole('link', { name: 'link trigger' });
    expect(link.getAttribute('href')).toBe('#x');
    expect(link.getAttribute('data-slot')).toBe('tooltip-trigger');
  });
});
