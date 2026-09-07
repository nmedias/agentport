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
  Foundations / Colour — every SEMANTIC colour token (tokens-reference.md §1),
  grouped by role and laid out in rows that keep a related set (a fill + its ink
  + its border) together. The `role` text is the canonical `use` sentence from
  tokens-reference — the same string sits on the Figma variable description; do
  not paraphrase it here. Naming and scope rules live on the Architecture page,
  not in these intros.
*/

export function Colour() {
  return (
    <FoundationsPage
      eyebrow="Foundations · Colour"
      title="Colour"
      intro="The semantic colour layer, light mode only — the only colours a component binds. Surfaces, their ink and their edges are designed as sets: pick a fill, then take its partners."
    >
      <Group name="Surface & text">
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-surface"
              token="surface"
              utilities="bg-surface"
              primitive="base/white"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#ffffff"
              role="App base surface."
              border
            />
            <TextSwatch
              text="text-ink"
              token="ink"
              utilities="text-ink · bg-ink (shape)"
              primitive="neutral/900"
              scopes="SHAPE_FILL · TEXT_FILL"
              value="#0d1016"
              role="Default text / icon colour. Shape fill only — no frame fill (dark surfaces use inverse-fill)."
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-card-fill"
              token="card-fill"
              utilities="bg-card-fill"
              primitive="neutral/50"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#f3f5fa"
              role="Raised / secondary panel surface."
            />
            <TextSwatch
              text="text-card-ink"
              token="card-ink"
              utilities="text-card-ink"
              primitive="neutral/900"
              scopes="SHAPE_FILL · TEXT_FILL"
              value="#0d1016"
              role="Text on card-fill."
              onFill="bg-card-fill"
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-muted-fill"
              token="muted-fill"
              utilities="bg-muted-fill"
              primitive="neutral/25"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#f9fcfd"
              role="Low-emphasis surface that recedes behind content — quiet strips, row hover, quiet variants of a control. Content panels use card-fill instead."
              border
            />
            <TextSwatch
              text="text-muted-ink"
              token="muted-ink"
              utilities="text-muted-ink"
              primitive="neutral/500"
              scopes="SHAPE_FILL · TEXT_FILL"
              value="#656971"
              role="Text / icon on muted-fill only. For de-emphasised text on any other surface use muted."
              onFill="bg-muted-fill"
            />
            <TextSwatch
              text="text-muted"
              token="muted"
              utilities="text-muted · bg-muted (shape)"
              primitive="neutral/500"
              scopes="SHAPE_FILL · TEXT_FILL"
              value="#656971"
              role="De-emphasised text, icon or marker on surfaces other than muted-fill — descriptions, hints, group headings, secondary glyphs. Shape fill only — no frame fill (surfaces use muted-fill)."
            />
          </Row>
        </Rows>
      </Group>

      <Group name="Action">
        <Rows>
          <Row>
            <TextSwatch
              text="text-primary"
              token="primary"
              utilities="text-primary · border-primary · ring-primary · bg-primary (shape)"
              primitive="signal/600"
              scopes="SHAPE_FILL · TEXT_FILL · STROKE_COLOR"
              value="#0063bb"
              role="Emphasis colour for interactive text and glyphs on light surfaces (AA on white) — links, link-style actions, caret / marker shapes. Shape fill only — no frame fill (surfaces use primary-fill). On dark surfaces use brand-ink; for state tints use accent-fill."
            />
            <FillSwatch
              bg="bg-primary-fill"
              token="primary-fill"
              utilities="bg-primary-fill"
              primitive="deep/900"
              scopes="FRAME_FILL · SHAPE_FILL · STROKE_COLOR"
              value="#0d2531"
              role="Dark surface of the main action and of the checked / on state of a control (check box, radio dot, switch track, filled range). Also the edge of that same area, so fill and edge read as one form. Pairs with primary-ink."
            />
            <TextSwatch
              text="text-primary-ink"
              token="primary-ink"
              utilities="text-primary-ink"
              primitive="signal/100"
              scopes="SHAPE_FILL · TEXT_FILL"
              value="#a4e5ff"
              role="Text, icon or marker on primary-fill only (the marker inside a control, e.g. a radio dot)."
              onFill="bg-primary-fill"
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-secondary-fill"
              token="secondary-fill"
              utilities="bg-secondary-fill"
              primitive="still/100"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#bde4fd"
              role="Light surface of the secondary action — secondary buttons, badges. Lower weight than primary-fill; for quiet chrome use muted-fill. Pairs with secondary-ink."
            />
            <TextSwatch
              text="text-secondary-ink"
              token="secondary-ink"
              utilities="text-secondary-ink"
              primitive="deep/900"
              scopes="SHAPE_FILL · TEXT_FILL"
              value="#0d2531"
              role="Text / icon on secondary-fill only."
              onFill="bg-secondary-fill"
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-accent-fill"
              token="accent-fill"
              utilities="bg-accent-fill"
              primitive="deep/50"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#eaf8ff"
              role="Tint that marks state — selected rows, active items, hover on list entries. Not an action surface (that is secondary-fill / primary-fill). Pairs with accent-ink and accent-border."
            />
            <TextSwatch
              text="text-accent-ink"
              token="accent-ink"
              utilities="text-accent-ink"
              primitive="signal/600"
              scopes="SHAPE_FILL · TEXT_FILL"
              value="#0063bb"
              role="Text / icon on accent-fill only."
              onFill="bg-accent-fill"
            />
            <BorderSwatch
              border="border-accent-border"
              token="accent-border"
              utilities="border-accent-border"
              primitive="still/200"
              scopes="STROKE_COLOR"
              value="#9fcdeb"
              role="Edge of an accent-fill area — outlines the selected / active item. Not a focus ring (use ring)."
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-destructive"
              token="destructive"
              utilities="bg-destructive · text-destructive · border-destructive · ring-destructive"
              primitive="error/600"
              scopes="FRAME_FILL · SHAPE_FILL · TEXT_FILL · STROKE_COLOR"
              value="#b01207"
              role="Colour of irreversible actions and errors — delete buttons, invalid-field borders, error text, its focus ring. One token for fill, text and stroke. Not for warnings. Pairs with destructive-ink when used as a surface."
            />
            <TextSwatch
              text="text-destructive-ink"
              token="destructive-ink"
              utilities="text-destructive-ink · border-destructive-ink"
              primitive="error/50"
              scopes="SHAPE_FILL · TEXT_FILL · STROKE_COLOR"
              value="#ffe3d9"
              role="Text, icon, edge or marker on a destructive surface only (e.g. the dot of an invalid radio)."
              onFill="bg-destructive"
            />
          </Row>
        </Rows>
      </Group>

      <Group
        name="Lines & focus"
        note="The line ladder rises border → border-emphasis → border-strong. Start at border."
      >
        <Rows>
          <Row>
            <BorderSwatch
              border="border-border"
              token="border"
              utilities="border-border"
              primitive="neutral/75"
              scopes="SHAPE_FILL · STROKE_COLOR"
              value="#e4e6eb"
              role="Default edge — dividers, card and field outlines on light surfaces. Start here; step up only when a line must read stronger."
            />
            <BorderSwatch
              border="border-border-emphasis"
              token="border-emphasis"
              utilities="border-border-emphasis"
              primitive="neutral/200"
              scopes="SHAPE_FILL · STROKE_COLOR"
              value="#b8bbc0"
              role="Second step of the line ladder — table header rules, group separators that must stand out from border."
            />
            <BorderSwatch
              border="border-border-strong"
              token="border-strong"
              utilities="border-border-strong"
              primitive="neutral/300"
              scopes="SHAPE_FILL · STROKE_COLOR"
              value="#9b9fa5"
              role="Top step of the line ladder — the one line that must dominate (axis, hard cut). Use sparingly."
            />
          </Row>
          <Row>
            <RingSwatch
              ring="ring-ring"
              token="ring"
              utilities="ring-ring · outline-ring"
              primitive="neutral/800"
              scopes="STROKE_COLOR"
              value="#1e2229"
              role="Keyboard-focus indicator on light surfaces — drawn as the focus border of the control plus its ring/50 outline, and it replaces the resting edge for as long as focus lasts. Only for focus: the resting edge stays border or input-border, the selected / active edge is accent-border."
            />
          </Row>
        </Rows>
      </Group>

      <Group name="Fields">
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-input-fill"
              token="input-fill"
              utilities="bg-input-fill"
              primitive="neutral/25"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#f9fcfd"
              role="Resting surface of an editable field — text inputs, selects, check boxes before they are checked. Pairs with ink for the value and input-ink-placeholder for the hint."
              border
            />
            <FillSwatch
              bg="bg-input-fill-high"
              token="input-fill-high"
              utilities="bg-input-fill-high"
              primitive="neutral/400"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#7f848b"
              role="Resting track of a range or toggle control (the unfilled part). The filled / on part is primary-fill. Same tone as input-border so control and edge read as one."
            />
          </Row>
          <Row>
            <BorderSwatch
              border="border-input-border"
              token="input-border"
              utilities="border-input-border"
              primitive="neutral/400"
              scopes="STROKE_COLOR"
              value="#7f848b"
              role="Edge of fields and controls (AA against surface). Deliberately stronger than border; for the focused state add ring."
            />
            <TextSwatch
              text="text-input-ink-placeholder"
              token="input-ink-placeholder"
              utilities="text-input-ink-placeholder"
              primitive="neutral/500"
              scopes="TEXT_FILL"
              value="#656971"
              role="Placeholder / hint text inside a field. The entered value uses ink; helper text outside the field uses muted."
            />
          </Row>
        </Rows>
      </Group>

      <Group name="Floating">
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-dialog-fill"
              token="dialog-fill"
              utilities="bg-dialog-fill"
              primitive="base/white"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#ffffff"
              role="Surface of anything floating above the layout — dialogs, popovers, menus, command palette, tooltips. Pairs with dialog-ink and the Elevation effect. For in-flow panels use card-fill."
              border
            />
            <TextSwatch
              text="text-dialog-ink"
              token="dialog-ink"
              utilities="text-dialog-ink"
              primitive="neutral/900"
              scopes="SHAPE_FILL · TEXT_FILL"
              value="#0d1016"
              role="Default text / icon on dialog-fill."
            />
            <ScrimSwatch
              token="scrim"
              utilities="bg-scrim"
              primitive="neutral/900 × opacity/10"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#0d1016 @ 10%"
              role="Colour of the backdrop that dims the page behind a modal dialog. The strength is already composed in — never add an opacity modifier on top of bg-scrim."
            />
          </Row>
        </Rows>
      </Group>

      <Group name="Dark surfaces">
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-inverse-fill"
              token="inverse-fill"
              utilities="bg-inverse-fill"
              primitive="deep/950"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#00121c"
              role="Dark functional surface — a navigation rail, keycaps, dark chips. Not for brand moments (use brand-fill). Pairs with inverse-ink."
            />
            <TextSwatch
              text="text-inverse-ink"
              token="inverse-ink"
              utilities="text-inverse-ink"
              primitive="neutral/75"
              scopes="TEXT_FILL"
              value="#e4e6eb"
              role="Default text / icon on inverse-fill."
              onFill="bg-inverse-fill"
            />
          </Row>
          <Row>
            <TextSwatch
              text="text-inverse-ink-muted"
              token="inverse-ink-muted"
              utilities="text-inverse-ink-muted"
              primitive="neutral/400"
              scopes="SHAPE_FILL · TEXT_FILL · STROKE_COLOR"
              value="#7f848b"
              role="De-emphasised text / icon on inverse-fill — the dark-surface counterpart of muted."
              onFill="bg-inverse-fill"
            />
            <BorderSwatch
              border="border-inverse-border"
              token="inverse-border"
              utilities="border-inverse-border"
              primitive="deep/900"
              scopes="SHAPE_FILL · STROKE_COLOR"
              value="#0d2531"
              role="Dividers and edges on inverse-fill."
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-inverse-container-low"
              token="inverse-container-low"
              utilities="bg-inverse-container-low"
              primitive="deep/900 @20%"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#0d253133"
              role="Idle / inactive inner panel on inverse-fill."
            />
            <FillSwatch
              bg="bg-inverse-container"
              token="inverse-container"
              utilities="bg-inverse-container"
              primitive="deep/900 @30%"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#0d25314d"
              role="Resting inner panel on inverse-fill (card in the rail)."
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-inverse-container-hover"
              token="inverse-container-hover"
              utilities="bg-inverse-container-hover"
              primitive="deep/900 @70%"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#0d2531b2"
              role="Hovered / active inner panel on inverse-fill."
            />
          </Row>
        </Rows>
      </Group>

      <Group name="Brand">
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-brand-fill"
              token="brand-fill"
              utilities="bg-brand-fill"
              primitive="deep/900"
              scopes="FRAME_FILL · SHAPE_FILL · EFFECT_COLOR"
              value="#0d2531"
              role="Dark surface reserved for brand moments — hero, intro, wordmark panels. Not for functional dark chrome (use inverse-fill). Pairs with brand-ink."
            />
            <TextSwatch
              text="text-brand-ink"
              token="brand-ink"
              utilities="text-brand-ink · bg-brand-ink (shape)"
              primitive="signal/400"
              scopes="SHAPE_FILL · TEXT_FILL · STROKE_COLOR · EFFECT_COLOR"
              value="#009fe3"
              role="Signal-blue text, icon or marker on brand-fill only. On light surfaces use primary. Shape fill only — no frame fill."
              onFill="bg-brand-fill"
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
              primitive="neutral/25"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#f9fcfd"
              role="Surface of the navigation sidebar / rail. Only inside the sidebar; elsewhere use surface or muted-fill."
              border
            />
            <TextSwatch
              text="text-sidebar-ink"
              token="sidebar-ink"
              utilities="text-sidebar-ink"
              primitive="neutral/900"
              scopes="SHAPE_FILL · TEXT_FILL"
              value="#0d1016"
              role="Default text / icon on sidebar-fill."
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-sidebar-primary-fill"
              token="sidebar-primary-fill"
              utilities="bg-sidebar-primary-fill · text-sidebar-primary-fill"
              primitive="deep/900"
              scopes="FRAME_FILL · SHAPE_FILL · TEXT_FILL"
              value="#0d2531"
              role="Surface of the main sidebar action (e.g. the workspace / brand button); also usable as its text / icon colour. Pairs with sidebar-primary-ink."
            />
            <TextSwatch
              text="text-sidebar-primary-ink"
              token="sidebar-primary-ink"
              utilities="text-sidebar-primary-ink"
              primitive="signal/200"
              scopes="SHAPE_FILL · TEXT_FILL"
              value="#7cceff"
              role="Text / icon on sidebar-primary-fill only."
              onFill="bg-sidebar-primary-fill"
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-sidebar-accent-fill"
              token="sidebar-accent-fill"
              utilities="bg-sidebar-accent-fill"
              primitive="deep/50"
              scopes="FRAME_FILL · SHAPE_FILL"
              value="#eaf8ff"
              role="Tint of the active / hovered navigation item. Pairs with sidebar-accent-ink."
            />
            <TextSwatch
              text="text-sidebar-accent-ink"
              token="sidebar-accent-ink"
              utilities="text-sidebar-accent-ink"
              primitive="signal/600"
              scopes="SHAPE_FILL · TEXT_FILL"
              value="#0063bb"
              role="Text / icon on sidebar-accent-fill only."
              onFill="bg-sidebar-accent-fill"
            />
          </Row>
          <Row>
            <BorderSwatch
              border="border-sidebar-border"
              token="sidebar-border"
              utilities="border-sidebar-border"
              primitive="neutral/50"
              scopes="STROKE_COLOR"
              value="#f3f5fa"
              role="Dividers and the sidebar edge."
            />
            <RingSwatch
              ring="ring-sidebar-ring"
              token="sidebar-ring"
              utilities="ring-sidebar-ring"
              primitive="neutral/800"
              scopes="STROKE_COLOR"
              value="#1e2229"
              role="Keyboard-focus indicator inside the sidebar."
            />
          </Row>
        </Rows>
      </Group>

      <Group
        name="Charts"
        note="Five data-series colours in fixed order. No status meaning."
      >
        <Rows>
          <Row>
            <FillSwatch
              bg="bg-chart-1"
              token="chart-1"
              utilities="bg-chart-1 · border-chart-1"
              primitive="warning/700"
              scopes="FRAME_FILL · SHAPE_FILL · STROKE_COLOR"
              value="#753100"
              role="Data-series colour 1 of 5 — assign in order (series 1 → chart-1). Carries no status meaning even where the hue matches a status ramp; for errors use destructive."
            />
            <FillSwatch
              bg="bg-chart-2"
              token="chart-2"
              utilities="bg-chart-2 · border-chart-2"
              primitive="success/600"
              scopes="FRAME_FILL · SHAPE_FILL · STROKE_COLOR"
              value="#298058"
              role="Data-series colour 2 of 5 — assign in order (series 1 → chart-1). Carries no status meaning even where the hue matches a status ramp; for errors use destructive."
            />
            <FillSwatch
              bg="bg-chart-3"
              token="chart-3"
              utilities="bg-chart-3 · border-chart-3"
              primitive="deep/900"
              scopes="FRAME_FILL · SHAPE_FILL · STROKE_COLOR"
              value="#0d2531"
              role="Data-series colour 3 of 5 — assign in order (series 1 → chart-1). Carries no status meaning even where the hue matches a status ramp; for errors use destructive."
            />
          </Row>
          <Row>
            <FillSwatch
              bg="bg-chart-4"
              token="chart-4"
              utilities="bg-chart-4 · border-chart-4"
              primitive="warning/400"
              scopes="FRAME_FILL · SHAPE_FILL · STROKE_COLOR"
              value="#c8923f"
              role="Data-series colour 4 of 5 — assign in order (series 1 → chart-1). Carries no status meaning even where the hue matches a status ramp; for errors use destructive."
            />
            <FillSwatch
              bg="bg-chart-5"
              token="chart-5"
              utilities="bg-chart-5 · border-chart-5"
              primitive="error/500"
              scopes="FRAME_FILL · SHAPE_FILL · STROKE_COLOR"
              value="#c54235"
              role="Data-series colour 5 of 5 — assign in order (series 1 → chart-1). Carries no status meaning even where the hue matches a status ramp; for errors use destructive."
            />
          </Row>
        </Rows>
      </Group>
    </FoundationsPage>
  );
}

export default Colour;
