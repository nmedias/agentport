import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

// Breadcrumb contract — a multi-part NAVIGATION composition, not a single styled element.
// You assemble the parts; there is no variant or state prop:
//  · Breadcrumb is the <nav aria-label="breadcrumb"> landmark; BreadcrumbList is the <ol>
//    carrying the DS body type + muted-ink default; each segment is a BreadcrumbItem (<li>).
//  · The ONE meaningful distinction is current-page vs link: BreadcrumbLink is a muted <a>
//    that darkens to text-ink on hover; BreadcrumbPage is the non-interactive ink leaf
//    (role="link" + aria-current="page", no href). Exactly one Page closes the trail.
//  · BreadcrumbSeparator (chevron) and BreadcrumbEllipsis (collapsed segments, with an
//    sr-only "More" label) are aria-hidden="true" — decoration the screen reader skips.
//  · BreadcrumbLink takes asChild (Radix Slot) to render the look on a router <Link>.
// a11y: the nav landmark, aria-current on the leaf, and aria-hidden separators/ellipsis are
// the wiring axe checks — reflected by these stories. The structural variety (basic trail,
// custom separator, collapsed, router link) is the gallery; there are no faked states.

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  // Curated prop docs for the Autodocs ArgsTable — Breadcrumb is a thin <nav> wrapper
  // (React.ComponentProps<'nav'>) with no design props of its own, so the public API
  // documented here is the container; the parts are shown through the stories below.
  argTypes: {
    children: {
      control: false,
      description:
        'The trail — a single `<BreadcrumbList>` holding `<BreadcrumbItem>`s separated by `<BreadcrumbSeparator>`s, ending in one `<BreadcrumbPage>`.',
      table: { type: { summary: 'React.ReactNode' } },
    },
    className: {
      control: false,
      description: 'Extra classes merged onto the `<nav>` landmark.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nQSNLASjuLvgTh3we8Dp4s/?node-id=8406-5650',
    },
    docs: {
      source: { type: 'code' },
      description: {
        component:
          'The path trail: composed from links, separators and the current-page leaf — no props, you assemble the parts. The key distinction is link vs. current page: the leaf is its own part carrying `aria-current`, not a styled link; an ellipsis part collapses long trails.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

// Default — the API playground. render spreads {...args} into a COMPLETE canonical trail
// (the smallest full instance: two muted links, chevron separators, the ink current-page
// leaf), so the meta argTypes are live ArgsTable rows and the 'code' snippet is a real,
// copyable example. No play: a breadcrumb is display-only navigation with nothing to drive.
export const Default: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// The shortest meaningful trail — one link beside the current page. The two-segment case
// the explorer uses most.
export const TwoLevels: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Schema</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Document Type</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// A collapsed trail — BreadcrumbEllipsis stands in for hidden intermediate segments when
// the path is too long to show in full (aria-hidden, with an sr-only "More" label).
export const WithEllipsis: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// A custom separator — pass any node as the separator's child to override the default
// chevron (here a slash). It stays aria-hidden, so the swap is purely visual.
export const CustomSeparator: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

// asChild merges the link styling onto its single child (Radix Slot) instead of rendering a
// bare <a> — the seam for a router's <Link>. Here a plain <a> stands in, but it keeps the
// muted-ink rest + hover-to-ink look and any child props (className) survive the merge.
export const AsRouterLink: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="#home">Home</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="#components">Components</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
