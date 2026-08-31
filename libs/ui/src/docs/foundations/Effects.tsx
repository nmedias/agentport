import { FoundationsPage, Group } from './foundations-kit';

/*
  Foundations / Effects — the two DS shadows (tokens-reference §5). Glow is the
  brand focus/active accent (signal/400 @ 50%); elevation is the raised-overlay
  drop shadow (neutral/900 @ 18%). The system is otherwise flat: depth is implied,
  not stacked — all stock shadow-xs/sm/md/lg are dead.
*/

export function Effects() {
  return (
    <FoundationsPage
      eyebrow="Foundations · Effects"
      title="Effects"
      intro="Two shadows, each a single utility. Depth is implied, not stacked — the system is otherwise flat, and the stock shadow-xs/sm/md/lg utilities are dead. Use glow only on brand focus/active accents; use elevation only on raised overlays and menus."
    >
      <Group name="Shadows">
        <div className="grid gap-2xl sm:grid-cols-2">
          {/* glow */}
          <div className="flex flex-col gap-lg">
            <div className="flex h-40 items-center justify-center corner-xl border border-border bg-surface">
              <span className="corner-md bg-card-fill px-2xl py-lg text-format-data-sm text-ink shadow-glow">
                shadow-glow
              </span>
            </div>
            <div className="flex flex-col gap-2xs">
              <span className="text-format-data-sm text-ink">shadow-glow</span>
              <span className="text-format-data-sm text-muted-ink">
                0 0 4px 0 · signal/400 @ 50%
              </span>
              <span className="mt-2xs text-format-body text-ink text-pretty">
                Glow on brand markers (focus / active accent).
              </span>
            </div>
          </div>

          {/* elevation */}
          <div className="flex flex-col gap-lg">
            <div className="flex h-40 items-center justify-center corner-xl border border-border bg-card-fill">
              <span className="corner-md bg-surface px-2xl py-lg text-format-data-sm text-ink shadow-elevation">
                shadow-elevation
              </span>
            </div>
            <div className="flex flex-col gap-2xs">
              <span className="text-format-data-sm text-ink">shadow-elevation</span>
              <span className="text-format-data-sm text-muted-ink">
                0 14px 36px -6px · neutral/900 @ 18%
              </span>
              <span className="mt-2xs text-format-body text-ink text-pretty">
                Drop shadow for raised overlays / menus.
              </span>
            </div>
          </div>
        </div>
      </Group>
    </FoundationsPage>
  );
}

export default Effects;
