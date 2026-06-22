import { fireEvent, render } from '@testing-library/react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';

function renderGroup(props: React.ComponentProps<typeof ToggleGroup> = { type: 'multiple' }) {
  return render(
    <ToggleGroup {...props}>
      <ToggleGroupItem value="bold" aria-label="bold" />
      <ToggleGroupItem value="italic" aria-label="italic" />
    </ToggleGroup>
  );
}

describe('ToggleGroup', () => {
  it('renders role=group with item buttons', () => {
    const { getByRole, getAllByRole } = renderGroup();
    expect(getByRole('group')).toBeTruthy();
    expect(getAllByRole('button')).toHaveLength(2);
  });

  it('type=multiple lets multiple items be pressed', () => {
    const { getByRole } = renderGroup({ type: 'multiple' });
    const bold = getByRole('button', { name: 'bold' });
    const italic = getByRole('button', { name: 'italic' });
    fireEvent.click(bold);
    fireEvent.click(italic);
    expect(bold.getAttribute('aria-pressed')).toBe('true');
    expect(italic.getAttribute('aria-pressed')).toBe('true');
  });

  it('type=single keeps only one item active (radio semantics)', () => {
    const { getByRole, getAllByRole } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="left" aria-label="left" />
        <ToggleGroupItem value="right" aria-label="right" />
      </ToggleGroup>
    );
    // single-type items are radios, not toggle buttons
    expect(getAllByRole('radio')).toHaveLength(2);
    const left = getByRole('radio', { name: 'left' });
    const right = getByRole('radio', { name: 'right' });
    fireEvent.click(left);
    expect(left.getAttribute('data-state')).toBe('on');
    fireEvent.click(right);
    expect(left.getAttribute('data-state')).toBe('off');
    expect(right.getAttribute('data-state')).toBe('on');
  });

  it('propagates variant + size from the group to items via context', () => {
    const { getAllByRole } = renderGroup({ type: 'multiple', variant: 'outline', size: 'sm' });
    for (const item of getAllByRole('button')) {
      expect(item.getAttribute('data-variant')).toBe('outline');
      expect(item.getAttribute('data-size')).toBe('sm');
    }
  });

  it('reflects the spacing prop on the root data-attribute and --gap', () => {
    const { getByRole } = renderGroup({ type: 'multiple', spacing: 0 });
    const root = getByRole('group');
    expect(root.getAttribute('data-spacing')).toBe('0');
    expect(root.getAttribute('data-orientation')).toBe('horizontal');
  });

  // DS-utility survival: corner-lg (custom @utility) on the root must survive cn()/twMerge.
  it('keeps the DS radius utility on the root', () => {
    const { getByRole } = renderGroup();
    expect(getByRole('group').className).toContain('corner-lg');
  });
});
