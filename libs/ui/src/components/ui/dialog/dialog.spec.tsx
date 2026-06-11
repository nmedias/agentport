import { render, fireEvent, waitFor } from '@testing-library/react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

function Demo({ showCloseButton = true }: { showCloseButton?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('is closed until the trigger is clicked', async () => {
    const { getByText, queryByRole } = render(<Demo />);
    expect(queryByRole('dialog')).toBeNull();
    fireEvent.click(getByText('Open'));
    await waitFor(() => expect(queryByRole('dialog')).toBeTruthy());
  });

  it('renders title, description and footer inside the open dialog', async () => {
    const { getByText, getByRole } = render(<Demo />);
    fireEvent.click(getByText('Open'));
    await waitFor(() => getByRole('dialog'));
    const dialog = getByRole('dialog');
    const title = getByText('Edit profile');
    const desc = getByText('Make changes to your profile.');
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(dialog.getAttribute('aria-describedby')).toBe(desc.id);
    expect(getByText('Cancel').closest('[data-slot="dialog-footer"]')).toBeTruthy();
  });

  it('shows the X close button by default and closes on click', async () => {
    const { getByText, getByRole, queryByRole, getByLabelText } = render(<Demo />);
    fireEvent.click(getByText('Open'));
    await waitFor(() => getByRole('dialog'));
    fireEvent.click(getByLabelText('Close'));
    await waitFor(() => expect(queryByRole('dialog')).toBeNull());
  });

  it('omits the X close button with showCloseButton=false', async () => {
    const { getByText, getByRole, queryByLabelText } = render(
      <Demo showCloseButton={false} />
    );
    fireEvent.click(getByText('Open'));
    await waitFor(() => getByRole('dialog'));
    expect(queryByLabelText('Close')).toBeNull();
  });

  it('closes via a DialogClose in the footer', async () => {
    const { getByText, getByRole, queryByRole } = render(<Demo />);
    fireEvent.click(getByText('Open'));
    await waitFor(() => getByRole('dialog'));
    fireEvent.click(getByText('Cancel'));
    await waitFor(() => expect(queryByRole('dialog')).toBeNull());
  });

  it('keeps the DS typography formats through twMerge', async () => {
    const { getByText, getByRole } = render(<Demo />);
    fireEvent.click(getByText('Open'));
    await waitFor(() => getByRole('dialog'));
    expect(getByText('Edit profile').className).toContain('text-format-title');
    expect(getByText('Make changes to your profile.').className).toContain(
      'text-format-body'
    );
    expect(getByRole('dialog').className).toContain('text-format-body');
    expect(getByRole('dialog').className).toContain('bg-overlay');
  });

  it('keeps DS surface tokens on overlay and footer', async () => {
    const { getByText, getByRole, baseElement } = render(<Demo />);
    fireEvent.click(getByText('Open'));
    await waitFor(() => getByRole('dialog'));
    const overlay = baseElement.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay?.className).toContain('bg-scrim');
    const footer = baseElement.querySelector('[data-slot="dialog-footer"]');
    expect(footer?.className).toContain('bg-muted/50');
    expect(footer?.className).toContain('-mx-xl');
  });
});
