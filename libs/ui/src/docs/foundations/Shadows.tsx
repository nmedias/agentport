import { FoundationsPage, Group } from './foundations-kit';

/*
  Foundations / Shadows — the two DS shadows (tokens-reference §5). The role
  texts below are the canonical `use` sentences from tokens-reference; the
  reference-layer parts they compose are on the Reference page.
*/

export function Shadows() {
  return (
    <FoundationsPage
      eyebrow="Foundations · Shadows"
      title="Shadows"
      intro="Two shadows, one utility each — the system is otherwise flat, and depth is implied rather than stacked."
    >
      <Group name="Shadows">
        <div className="grid gap-2xl sm:grid-cols-2">
          {/* glow */}
          <div className="flex flex-col gap-lg">
            <div className="flex h-40 items-center justify-center corner-xl border border-border bg-surface">
              <span className="corner-md bg-card-fill px-2xl py-lg text-format-data-md text-ink shadow-glow">
                shadow-glow
              </span>
            </div>
            <div className="flex flex-col gap-2xs">
              <span className="text-format-data-md text-ink">shadow-glow</span>
              <span className="text-format-data-md text-muted">
                0 0 4px 0 · signal/400 @ 50%
              </span>
              <span className="mt-md text-format-body text-ink text-pretty">
                Halo on an emphasised marker — focus / active halo on small shapes. Not a depth cue.
              </span>
            </div>
          </div>

          {/* elevation */}
          <div className="flex flex-col gap-lg">
            <div className="flex h-40 items-center justify-center corner-xl border border-border bg-card-fill">
              <span className="corner-md bg-surface px-2xl py-lg text-format-data-md text-ink shadow-elevation">
                shadow-elevation
              </span>
            </div>
            <div className="flex flex-col gap-2xs">
              <span className="text-format-data-md text-ink">shadow-elevation</span>
              <span className="text-format-data-md text-muted">
                0 14px 36px -6px · neutral/900 @ 18%
              </span>
              <span className="mt-md text-format-body text-ink text-pretty">
                Drop shadow of surfaces floating above the layout (dialog-fill). The only depth cue in the system — everything else stays flat.
              </span>
            </div>
          </div>
        </div>
      </Group>
    </FoundationsPage>
  );
}

export default Shadows;
