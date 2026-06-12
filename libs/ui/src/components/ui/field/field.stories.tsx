import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from './field';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Button } from '../button';

// Field has no root element and no props worth a control panel — every story is
// a composition. Render-only: disable the args table.
const meta: Meta<typeof Field> = {
  title: 'UI/Field',
  component: Field,
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<typeof Field>;

// field-input (shadcn docs): vertical Input fields with label + description.
// Exercises the canonical stack order (label → control → description) and the
// label-first / description-first ordering.
export const InputField: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input id="username" type="text" placeholder="Max Leiter" />
            <FieldDescription>Choose a unique username for your account.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            <Input id="password" type="password" placeholder="••••••••" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};

// field-textarea (shadcn docs): a Textarea field with label + description.
export const TextareaField: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
            <Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
            <FieldDescription>Share your thoughts about our service.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};

// field-fieldset (shadcn docs): a FieldSet with a FieldLegend caption + a nested
// two-column grid of Inputs. Exercises the legend (legend variant → title format).
export const Fieldset: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldLegend>Address Information</FieldLegend>
        <FieldDescription>We need your address to deliver your order.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="street">Street Address</FieldLabel>
            <Input id="street" type="text" placeholder="123 Main St" />
          </Field>
          <div className="grid grid-cols-2 gap-xl">
            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input id="city" type="text" placeholder="New York" />
            </Field>
            <Field>
              <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
              <Input id="zip" type="text" placeholder="90502" />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};

// field-responsive (shadcn docs): orientation="responsive" — column on narrow,
// row on @md. Exercises FieldContent (label+description column beside the control),
// FieldSeparator between rows (nests the DS Separator), and a Button action row.
export const Responsive: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <form>
        <FieldSet>
          <FieldLegend>Profile</FieldLegend>
          <FieldDescription>Fill in your profile information.</FieldDescription>
          <FieldSeparator />
          <FieldGroup>
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldDescription>Provide your full name for identification</FieldDescription>
              </FieldContent>
              <Input id="name" placeholder="Evil Rabbit" required />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <FieldDescription>
                  You can write your message here. Keep it short, preferably under 100 characters.
                </FieldDescription>
              </FieldContent>
              <Textarea
                id="message"
                placeholder="Hello, world!"
                required
                className="min-h-[100px] resize-none sm:min-w-[300px]"
              />
            </Field>
            <FieldSeparator />
            <Field orientation="responsive">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  ),
};

// DS-authored (no standalone doc example): the invalid state. data-invalid on the
// Field turns the whole group destructive (text-destructive), aria-invalid drives
// the control's own destructive border/ring, and FieldError renders the message.
// The destructive token is a ⚠ stock PLACEHOLDER — see tokens-reference.md.
export const Invalid: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <FieldGroup>
        <Field data-invalid>
          <FieldLabel htmlFor="email-invalid">Email</FieldLabel>
          <Input id="email-invalid" type="email" defaultValue="not-an-email" aria-invalid />
          <FieldError>Enter a valid email address.</FieldError>
        </Field>
        <Field data-invalid>
          <FieldLabel htmlFor="bio-invalid">Bio</FieldLabel>
          <Textarea id="bio-invalid" defaultValue="x" aria-invalid rows={3} />
          <FieldError errors={[{ message: 'Bio is too short.' }, { message: 'Bio is required.' }]} />
        </Field>
      </FieldGroup>
    </div>
  ),
};

// DS-authored: the horizontal orientation in isolation — label leading, control
// trailing, on one baseline-centered row.
export const Horizontal: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="optin">Subscribe to updates</FieldLabel>
        <Input id="optin" type="text" placeholder="you@example.com" className="max-w-[200px]" />
      </Field>
    </div>
  ),
};
