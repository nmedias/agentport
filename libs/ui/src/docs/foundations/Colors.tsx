import {
  FoundationsPage,
  Group,
  Rows,
  Row,
  FillSwatch,
  TextSwatch,
  BorderSwatch,
  RingSwatch,
  ScrimSwatch,
} from './foundations-kit';

/*
  Foundations / Colors — every SEMANTIC colour token (tokens-reference.md §1),
  grouped by family and laid out in rows that keep a related set (a fill + its
  ink + its border) together. Each token shows its NAME, the possible utility
  CLASSES, the PRIMITIVE it aliases, its scope (short form), the raw value, and
  the role — all from tokens-reference (not invented). Rendered per scope: frame
  fills as a bg- swatch; ink/text as type; borders as a line; ring as a focus
  sample; scrim as an overlay.
*/

export function Colors() {
  return (
    <FoundationsPage
      eyebrow="Foundations · Colour"
      title="Colour"
      intro="The semantic colour layer — every token is an alias onto the OKLCH ramps (see the Primitives page for the raw ramps). Use them through their utility classes: bg-{name} for fills, text-{name} for ink, border-{name} for edges, ring-{name} for focus. The scope tells you how a token may be applied (fill = surface, text = ink, stroke = edge/ring, shape = icon/marker — note primary and ink have no fill). A neutral light base carries dense data; the OS-blue accent marks selection and focus; dark surfaces are reserved for brand and inverse moments. Light mode is the only mode for now."
    >
      <Group name="Core · surface & ink">
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-surface"
              token="surface"
              utilities="bg-surface"
              primitive="base/white"
              scope="fill"
              value="#ffffff"
              role="App base surface."
              border
            />
            <TextSwatch
              text="text-ink"
              token="ink"
              utilities="text-ink · bg-ink (shape)"
              primitive="ink/900"
              scope="text · shape"
              value="#0d1016"
              role="Primary text / icon (no frame fill)."
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-card-fill"
              token="card-fill"
              utilities="bg-card-fill"
              primitive="ink/50"
              scope="fill"
              value="#f3f5fa"
              role="Raised / secondary panel surface."
            />
            <TextSwatch
              text="text-card-ink"
              token="card-ink"
              utilities="text-card-ink"
              primitive="ink/900"
              scope="text"
              value="#0d1016"
              role="Text on card."
              onFill="bg-card-fill"
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-muted-fill"
              token="muted-fill"
              utilities="bg-muted-fill"
              primitive="ink/25"
              scope="fill"
              value="#f9fcfd"
              role="Quiet chrome surface."
              border
            />
            <TextSwatch
              text="text-muted-ink"
              token="muted-ink"
              utilities="text-muted-ink"
              primitive="ink/500"
              scope="text"
              value="#656971"
              role="Secondary text."
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-background-fixed"
              token="background-fixed"
              utilities="bg-background-fixed"
              primitive="base/white"
              scope="fill"
              value="#ffffff"
              role="Theme-invariant white surface (toggle knob) — must stay white when dark mode lands."
              border
            />
          </Row>
        </Rows>
      </Group>

      <Group name="Primary · secondary · accent">
        <Rows>
          <Row>
            <TextSwatch
              text="text-primary"
              token="primary"
              utilities="text-primary · border-primary · ring-primary · bg-primary (shape)"
              primitive="signal/600"
              scope="text · stroke · shape"
              value="#0063bb"
              role="Brand accent (AA on white) as text / icon / stroke."
            />
            <FillSwatch
              bg="bg-primary-fill"
              token="primary-fill"
              utilities="bg-primary-fill"
              primitive="deep/900"
              scope="fill"
              value="#0d2531"
              role="Dark primary surface (buttons)."
            />
            <TextSwatch
              text="text-primary-ink"
              token="primary-ink"
              utilities="text-primary-ink"
              primitive="signal/100"
              scope="text"
              value="#a4e5ff"
              role="Ink on primary-fill."
              onFill="bg-primary-fill"
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-secondary-fill"
              token="secondary-fill"
              utilities="bg-secondary-fill"
              primitive="still/100"
              scope="fill"
              value="#bde4fd"
              role="Secondary surface."
            />
            <TextSwatch
              text="text-secondary-ink"
              token="secondary-ink"
              utilities="text-secondary-ink"
              primitive="deep/900"
              scope="text"
              value="#0d2531"
              role="Text on secondary."
              onFill="bg-secondary-fill"
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-accent-fill"
              token="accent-fill"
              utilities="bg-accent-fill"
              primitive="deep/50"
              scope="fill"
              value="#eaf8ff"
              role="Selection / active tint."
            />
            <TextSwatch
              text="text-accent-ink"
              token="accent-ink"
              utilities="text-accent-ink"
              primitive="signal/600"
              scope="text"
              value="#0063bb"
              role="Text on accent-fill."
              onFill="bg-accent-fill"
            />
            <BorderSwatch
              border="border-accent-border"
              token="accent-border"
              utilities="border-accent-border"
              primitive="still/200"
              scope="stroke"
              value="#9fcdeb"
              role="Accent edge."
            />
          </Row>
        </Rows>
      </Group>

      <Group
        name="Brand"
        note="On-dark brand accent — the OS-blue cyan (signal/400) on the deep navy surface. brand-ink finally gives the brand cyan its own semantic token (it had none before)."
      >
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-brand-fill"
              token="brand-fill"
              utilities="bg-brand-fill"
              primitive="deep/900"
              scope="fill"
              value="#0d2531"
              role="Dark brand surface."
            />
            <TextSwatch
              text="text-brand-ink"
              token="brand-ink"
              utilities="text-brand-ink · bg-brand-ink (shape)"
              primitive="signal/400"
              scope="text · shape"
              value="#009fe3"
              role="Brand cyan accent on dark — text, icon, or marker. Brand content only; not a primary replacement."
              onFill="bg-brand-fill"
            />
          </Row>
        </Rows>
      </Group>

      <Group name="Destructive">
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-destructive"
              token="destructive"
              utilities="bg-destructive · text-destructive · border-destructive · ring-destructive"
              primitive="error/600"
              scope="fill · text · stroke"
              value="#b01207"
              role="Error / destructive action (fill, text, border + ring)."
            />
            <TextSwatch
              text="text-destructive-ink"
              token="destructive-ink"
              utilities="text-destructive-ink · border-destructive-ink"
              primitive="error/50"
              scope="text · stroke"
              value="#ffe3d9"
              role="Text / edge on destructive."
              onFill="bg-destructive"
            />
          </Row>
        </Rows>
      </Group>

      <Group
        name="Ring & borders"
        note="The line ladder rises border → border-emphasis → border-strong. ring is the focus indicator."
      >
        <Rows>
          <Row>
            <BorderSwatch
              border="border-border"
              token="border"
              utilities="border-border"
              primitive="ink/75"
              scope="stroke"
              value="#e4e6eb"
              role="Default edge (base layer)."
            />
            <BorderSwatch
              border="border-border-emphasis"
              token="border-emphasis"
              utilities="border-border-emphasis"
              primitive="ink/200"
              scope="stroke"
              value="#b8bbc0"
              role="Emphasised line."
            />
            <BorderSwatch
              border="border-border-strong"
              token="border-strong"
              utilities="border-border-strong"
              primitive="ink/300"
              scope="stroke"
              value="#9b9fa5"
              role="Heaviest line."
            />
          </Row>
          <Row>
            <RingSwatch
              ring="ring-ring"
              token="ring"
              utilities="ring-ring · outline-ring"
              primitive="ink/800"
              scope="stroke"
              value="#1e2229"
              role="Focus indicator."
            />
          </Row>
        </Rows>
      </Group>

      <Group name="Dialog & scrim">
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-dialog-fill"
              token="dialog-fill"
              utilities="bg-dialog-fill"
              primitive="base/white"
              scope="fill"
              value="#ffffff"
              role="Raised surface (dialog / popover / command / menu)."
              border
            />
            <TextSwatch
              text="text-dialog-ink"
              token="dialog-ink"
              utilities="text-dialog-ink"
              primitive="ink/900"
              scope="text"
              value="#0d1016"
              role="Text on dialog."
            />
            <ScrimSwatch
              token="scrim"
              utilities="bg-scrim"
              primitive="ink/900 × opacity/10"
              scope="fill"
              value="#0d1016 @ 10%"
              role="Modal backdrop dimmer."
            />
          </Row>
        </Rows>
      </Group>

      <Group name="Input">
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-input-fill"
              token="input-fill"
              utilities="bg-input-fill"
              primitive="ink/25"
              scope="fill"
              value="#f9fcfd"
              role="Field fill (opaque)."
              border
            />
            <FillSwatch
              bg="bg-input-fill-high"
              token="input-fill-high"
              utilities="bg-input-fill-high"
              primitive="ink/400"
              scope="fill"
              value="#7f848b"
              role="Emphasised field fill."
            />
          </Row>
          <Row>
            <BorderSwatch
              border="border-input-border"
              token="input-border"
              utilities="border-input-border"
              primitive="ink/400"
              scope="stroke"
              value="#7f848b"
              role="Field border."
            />
            <TextSwatch
              text="text-input-ink-placeholder"
              token="input-ink-placeholder"
              utilities="text-input-ink-placeholder"
              primitive="ink/500"
              scope="text"
              value="#656971"
              role="Placeholder text."
            />
          </Row>
        </Rows>
      </Group>

      <Group name="Inverse">
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-inverse-fill"
              token="inverse-fill"
              utilities="bg-inverse-fill"
              primitive="deep/950"
              scope="fill"
              value="#00121c"
              role="Dark surface (inverted chips / pills)."
            />
            <TextSwatch
              text="text-inverse-ink"
              token="inverse-ink"
              utilities="text-inverse-ink"
              primitive="ink/50"
              scope="text"
              value="#f3f5fa"
              role="Text on inverse-fill."
              onFill="bg-inverse-fill"
            />
          </Row>
        </Rows>
      </Group>

      <Group name="Sidebar">
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-sidebar-fill"
              token="sidebar-fill"
              utilities="bg-sidebar-fill"
              primitive="ink/25"
              scope="fill"
              value="#f9fcfd"
              role="Sidebar / rail surface."
              border
            />
            <TextSwatch
              text="text-sidebar-ink"
              token="sidebar-ink"
              utilities="text-sidebar-ink"
              primitive="ink/900"
              scope="text"
              value="#0d1016"
              role="Text in sidebar."
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-sidebar-primary-fill"
              token="sidebar-primary-fill"
              utilities="bg-sidebar-primary-fill · text-sidebar-primary-fill"
              primitive="deep/900"
              scope="fill · text"
              value="#0d2531"
              role="Sidebar accent surface (also as text / icon)."
            />
            <TextSwatch
              text="text-sidebar-primary-ink"
              token="sidebar-primary-ink"
              utilities="text-sidebar-primary-ink"
              primitive="signal/200"
              scope="text"
              value="#7cceff"
              role="Text on sidebar-primary-fill."
              onFill="bg-sidebar-primary-fill"
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-sidebar-accent-fill"
              token="sidebar-accent-fill"
              utilities="bg-sidebar-accent-fill"
              primitive="deep/50"
              scope="fill"
              value="#eaf8ff"
              role="Active tint in the sidebar."
            />
            <TextSwatch
              text="text-sidebar-accent-ink"
              token="sidebar-accent-ink"
              utilities="text-sidebar-accent-ink"
              primitive="signal/600"
              scope="text"
              value="#0063bb"
              role="Text on sidebar-accent-fill."
              onFill="bg-sidebar-accent-fill"
            />
          </Row>
          <Row>
            <BorderSwatch
              border="border-sidebar-border"
              token="sidebar-border"
              utilities="border-sidebar-border"
              primitive="ink/50"
              scope="stroke"
              value="#f3f5fa"
              role="Sidebar divider."
            />
            <RingSwatch
              ring="ring-sidebar-ring"
              token="sidebar-ring"
              utilities="ring-sidebar-ring"
              primitive="ink/800"
              scope="stroke"
              value="#1e2229"
              role="Focus in the sidebar."
            />
          </Row>
        </Rows>
      </Group>

      <Group
        name="Charts"
        note="Ramp-bound data-series colours (also available as border-chart-*)."
      >
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-chart-1"
              token="chart-1"
              utilities="bg-chart-1 · border-chart-1"
              primitive="warning/700"
              scope="fill · stroke"
              value="#753100"
              role="Data series 1."
            />
            <FillSwatch
              bg="bg-chart-2"
              token="chart-2"
              utilities="bg-chart-2 · border-chart-2"
              primitive="success/600"
              scope="fill · stroke"
              value="#298058"
              role="Data series 2."
            />
            <FillSwatch
              bg="bg-chart-3"
              token="chart-3"
              utilities="bg-chart-3 · border-chart-3"
              primitive="deep/900"
              scope="fill · stroke"
              value="#0d2531"
              role="Data series 3."
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-chart-4"
              token="chart-4"
              utilities="bg-chart-4 · border-chart-4"
              primitive="warning/400"
              scope="fill · stroke"
              value="#c8923f"
              role="Data series 4."
            />
            <FillSwatch
              bg="bg-chart-5"
              token="chart-5"
              utilities="bg-chart-5 · border-chart-5"
              primitive="error/500"
              scope="fill · stroke"
              value="#c54235"
              role="Data series 5."
            />
          </Row>
        </Rows>
      </Group>
    </FoundationsPage>
  );
}

export default Colors;
