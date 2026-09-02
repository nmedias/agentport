import type { Meta, StoryObj } from '@storybook/react-vite';

import { Field, FieldError, FieldLabel } from './field';
import { Input } from '../input';

// Second Autodocs page for the error message. meta.component = FieldError → its own ArgsTable; `errors`
// comes from FieldErrorProps' JSDoc via react-docgen (see field.tsx) — a deduped array of `{ message }`
// (one → text, many → bullet list); a single string child is the other form. It renders role="alert" in
// text-destructive and shows only beside an invalid control, so every render wraps it in a data-invalid
// Field. Display-only → no play.
const meta: Meta<typeof FieldError> = {
  title: 'UI/Field/FieldError',
  component: FieldError,
  tags: ['autodocs'],
  args: { errors: [{ message: 'Enter a valid email address.' }] },
  argTypes: {
    errors: {
      control: 'object',
      table: { type: { summary: 'Array<{ message?: string }>' } },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/?node-id=8211-3909',
    },
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The error line of a `Field` — announced immediately as an alert. Pass one message as children, or an `errors` array: duplicates collapse, several messages become a bullet list. It shows when its Field is invalid. The per-row Field API lives on the [`UI/Field`](?path=/docs/ui-field--docs) page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FieldError>;

// API playground — the error(s) under an invalid input. Edit `errors` to add messages — one renders as
// text, several dedupe into a bullet list.
export const Default: Story = {
  render: ({ errors }) => (
    <Field data-invalid className="w-full max-w-md">
      <FieldLabel htmlFor="error-email">Email</FieldLabel>
      <Input id="error-email" type="email" defaultValue="not-an-email" aria-invalid />
      <FieldError errors={errors} />
    </Field>
  ),
};
