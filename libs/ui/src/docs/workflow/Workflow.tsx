import * as React from 'react';

import { TokenChip } from '../foundations/foundations-kit';
import { PROSE } from '../prose';

/*
  AI Workflow — the report page.

  Renders design-docs/ai-workflow-report-v2.md as a Storybook page: how the
  Agentport DS was built with Claude Code agents, with numbers. Every figure
  that comes from the repo names the command or file it was counted from; what
  cannot be verified is marked as an estimate. Data state: 2026-09-07.

  Token discipline (tokens-reference.md §1): semantic tokens only; `primary`
  and `ink` are text/stroke tokens, never a frame fill. Geometry stays numeric.
*/

// ── Page kit ─────────────────────────────────────────────────────────────────

// Mono micro-label opening a section; the leading tick is a stroke line.
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-md text-format-eyebrow uppercase text-muted">
      <span aria-hidden className="h-px w-6 bg-border-strong" />
      {children}
    </span>
  );
}

// A report section: number + title, optional lead, then its content.
function Section({
  id,
  number,
  title,
  lead,
  children,
}: {
  id: string;
  number?: string;
  title: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex flex-col gap-2xl border-t border-border-emphasis pt-2xl first:border-t-0 first:pt-0"
    >
      <div className="flex flex-col gap-md">
        {number && <Eyebrow>{number}</Eyebrow>}
        <h2 className="text-format-heading text-ink text-balance">{title}</h2>
        {lead && (
          <p className={`max-w-[48rem] ${PROSE} text-ink text-pretty`}>
            {lead}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

// A sub-group inside a section (the rework tables are grouped by subject).
function Group({
  name,
  note,
  children,
}: {
  name: string;
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h3 className="flex items-center gap-md text-format-heading-sm text-ink">
          <span aria-hidden className="h-px w-6 bg-border-strong" />
          {name}
        </h3>
        {note && (
          <p className={`max-w-[48rem] ${PROSE} text-ink text-pretty`}>
            {note}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className={`flex max-w-[48rem] flex-col gap-lg ${PROSE} text-ink text-pretty`}>
      {children}
    </div>
  );
}

// Inline code: a path, a command, a token name.
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="corner-sm bg-muted-fill px-xs py-2xs text-format-data-md text-muted-ink">
      {children}
    </code>
  );
}

// A data table with real header cells. First column reads as a label.
function Table({
  caption,
  head,
  rows,
  firstColWidth = '12rem',
}: {
  caption: string;
  head: string[];
  rows: React.ReactNode[][];
  firstColWidth?: string;
}) {
  return (
    <div className="overflow-x-auto corner-lg border border-border">
      <table className="w-full border-collapse text-left text-format-body text-ink">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-muted-fill">
            {head.map((h, i) => (
              <th
                key={h}
                scope="col"
                style={i === 0 ? { minWidth: firstColWidth } : undefined}
                className="px-lg py-md text-format-label-sm text-muted-ink align-top"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-t border-border align-top">
              {row.map((cell, c) =>
                c === 0 ? (
                  <th
                    key={c}
                    scope="row"
                    className="px-lg py-md text-format-body-strong text-ink"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={c} className="px-lg py-md text-pretty">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// A stat tile for the summary strip: label, headline, detail.
function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex flex-col gap-sm corner-lg border border-border bg-surface px-xl py-lg">
      <span className="text-format-eyebrow uppercase text-muted">{label}</span>
      <span className="text-format-title text-ink">{value}</span>
      <span className="text-format-body text-ink text-pretty">{detail}</span>
    </div>
  );
}

// A horizontal bar list: share per item, labelled. Used for commit types,
// prompt kinds and prompt topics. Bars are frame fills (accent-fill), the
// track is a muted fill; numbers sit in mono next to the label.
function Bars({
  caption,
  items,
  max = 100,
}: {
  caption: string;
  items: { label: string; value: number; display: string; note?: string }[];
  max?: number;
}) {
  return (
    <dl aria-label={caption} className="flex flex-col gap-md">
      {items.map((it) => (
        <div
          key={it.label}
          className="grid items-center gap-x-lg gap-y-2xs sm:grid-cols-[14rem_1fr_5rem]"
        >
          <dt className="text-format-body text-ink">
            {it.label}
            {it.note && (
              <span className="block text-format-data-md text-muted">
                {it.note}
              </span>
            )}
          </dt>
          <dd className="h-2 w-full overflow-hidden corner-full bg-muted-fill">
            <div
              aria-hidden
              className="h-full corner-full bg-primary-fill"
              style={{ width: `${Math.min(100, (it.value / max) * 100)}%` }}
            />
          </dd>
          <dd className="text-format-data-md text-ink sm:text-right">
            {it.display}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ── Summary ──────────────────────────────────────────────────────────────────

const SUMMARY = [
  {
    label: 'Result',
    value: '22 components',
    detail: 'Each one exists three times: Figma set, React code, Storybook story.',
  },
  {
    label: 'Code gate',
    value: '157 + 150 green',
    detail:
      '157 story tests in Chromium with an accessibility check, 150 unit specs.',
  },
  {
    label: 'Figma docs',
    value: '25 sections',
    detail:
      'Checked against set, catalog and code: 1 755 + 3 049 single checks, scripts in the repo.',
  },
  {
    label: 'Pipeline',
    value: '12 skills · 51 runs',
    detail:
      'Documented agent runs, plus two catalogs as the contract between sessions.',
  },
  {
    label: 'Rework',
    value: '120 of 441 commits',
    detail:
      'Correction commits, fix and refine; 4 Figma modelling runs for overlays, 8 open deviations in the catalog.',
  },
  {
    label: 'Open',
    value: 'No CI',
    detail:
      'Deploy without a gate, 15 deferred skill findings.',
  },
  {
    label: 'Period',
    value: 'Jun 4 – Sep 7, 2026',
    detail: '32 days with commits, 47 days with prompts.',
  },
];

// ── 1 · Principles ───────────────────────────────────────────────────────────

const PRINCIPLES: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Context lives in files, not in the chat.',
    body:
      'Two catalogs, one handoff document and the project instructions give every session its state. The rule to read the catalog first is written down; the 2 343 prompts have a median length of 48 characters.',
  },
  {
    title: 'The catalogs are the truth.',
    body:
      'The token reference and the component reference hold the current state. Figma and code are checked against them. Deviations live as an open field in the catalog, currently 8 entries, not in anyone’s head.',
  },
  {
    title: 'A script before a claim.',
    body:
      'A run is done when a script is green and its output is in the record. For code that is the check gate, for Figma sets the verify skill, for the Figma docs the two audit scripts. Section 5 says what each one checks and what it does not.',
  },
  {
    title: 'Mistakes become instructions.',
    body:
      '77 findings from 23 runs document where a skill had a gap. Every finding that caused an error is worked in; 15 findings that were solved on the spot are deferred in the handoff.',
  },
  {
    title: 'Parallel only with a contract.',
    body:
      'Three background agents built at the same time on June 22; the single Figma connection was serialised through a lock file. In the September audit rounds: one agent per component family in its own worktree, one independent reviewer, shared files touched only by delta.',
  },
  {
    title: 'The human decides.',
    body:
      'What gets built, what gets discarded, what gets merged, which rule applies. Decisions are dated in the changelogs and in the handoff.',
  },
];

// ── 2 · What was built ───────────────────────────────────────────────────────

const ARTEFACTS: React.ReactNode[][] = [
  [
    'Components',
    '22, all on the same shadcn style base, radix-nova',
    <Code>ls libs/ui/src/components/ui/</Code>,
  ],
  [
    'Tests',
    '157 story tests in Chromium with axe in 41 files, 150 jsdom specs in 25 files',
    <>
      <Code>npm run test:stories</Code>, <Code>npm run test:unit</Code>
    </>,
  ],
  [
    'Code',
    '~15 300 lines of TSX / TS / CSS',
    <>
      <Code>wc -l</Code> over <Code>libs/ui/src</Code>
    </>,
  ],
  [
    'Token layer',
    '262 distinct variables, exported from Figma into CSS and bridged to Tailwind',
    <Code>libs/ui/src/styles/tokens.css</Code>,
  ],
  [
    'Figma file',
    '25 documentation sections, linked from every Storybook page',
    '“View in Figma” on every Autodocs page',
  ],
  [
    'Catalogs',
    <>
      <Code>tokens-reference.md</Code> 522 lines,{' '}
      <Code>components-reference.md</Code> 1 637 lines
    </>,
    <Code>design-docs/design-system/</Code>,
  ],
];

// ── 3 · Timeline ─────────────────────────────────────────────────────────────

const STATIONS: { when: string; station: string; tooling: React.ReactNode }[] =
  [
    {
      when: 'Jun 4 – 5',
      station: 'Scaffold and token bridge',
      tooling:
        'Five token analyses, a Figma export with 167 variables, the Tailwind bridge in seven steps, first ports: Button and Input.',
    },
    {
      when: 'Jun 6 – 26',
      station: 'Port phase',
      tooling:
        'One orchestrator skill per direction: the port skill builds new, the sync skill pulls a Figma change into code. Skill feedback from June 7. 24 port runs, 24 sync runs, plus 4 Figma-only runs for the overlay models of Popover and Tooltip.',
    },
    {
      when: 'Jun 16 – 20',
      station: 'Storybook as the test bench',
      tooling:
        'Stories run as browser tests with axe; one story pattern; prop tables generated from the code; Foundations pages rendered from the tokens.',
    },
    {
      when: 'Jul 8',
      station: 'Self-analysis',
      tooling:
        'Two agents evaluated 113 transcripts. Finding: discipline present, nothing enforced by machine. Twelve recommendations.',
    },
    {
      when: 'Jul – Aug',
      station: 'Skill consolidation',
      tooling:
        'Skills made project-neutral, project values moved to one config file, one sentence of responsibility per skill.',
    },
    {
      when: 'Aug 31 – Sep 7',
      station: 'Figma docs and audits',
      tooling:
        'The Figma file as component documentation, one section per component. Three audit rounds with scripts, worker and reviewer agents. Two new skills: coverage and compose.',
    },
  ];

// ── 4 · Where it went wrong ──────────────────────────────────────────────────

const CASES: { title: string; when: string; body: React.ReactNode }[] = [
  {
    title: 'Popover without an accessible name',
    when: 'Jun 22',
    body:
      'The agent built the Popover correctly, but the panel content carried a dialog role without a name. The axe check in the story test failed on every open story. The code fix was an aria-label. The finding is recorded in the run’s feedback file as one that caused an error, but the rule is still not in the port skill. The error is fixed, the lesson is not codified.',
  },
  {
    title: 'Two components built and deleted',
    when: 'Jun 22 – 24',
    body:
      'Toggle and Toggle Group were ported, Figma set and code, and removed completely two days later because the Figma design was to be redone. Cost: one port run and one co-port. Lesson, now in the handoff: design decision before the port, not after.',
  },
  {
    title: 'Ported twice',
    when: 'Jun 10',
    body:
      'InputGroup was ported twice because the procedure for composite components was missing from the skill. It has since lived in the port skill’s composites reference. The Figma rebuilds of Popover and Tooltip in case 6 were not a repeated port but modelling work in Figma.',
  },
  {
    title: 'Cloning loses slot bindings',
    when: 'Jun 12',
    body:
      'When cloning a set member with a slot, the clone kept the slot but lost the reference to it; in the Field set the error slot went dead. Noticed while assembling the examples. Since then the build skill says: after cloning, rebind the slot reference.',
  },
  {
    title: 'Token column with 146 errors',
    when: 'Sep 4',
    body:
      'The first Figma dump walked into foreign instances and attributed their bindings to the component. The check script showed 146 errors in 22 of 25 sections. Three dump iterations later the ownership boundary was defined: the dump stops at embedded foreign instances. Rule and exception are in the dump script.',
  },
  {
    title: 'Overlays in Figma: from a fixed offset to an anchor',
    when: 'Jun 22 – 24',
    body:
      'Popover and Tooltip open; Figma has no notion of “open”. The first port placed the panel next to the trigger with fixed offsets, so a wider trigger or a longer panel made them overlap. Four Figma runs replaced that with an anchored model: state, side and alignment as axes, the panel as an absolutely positioned child with constraints, and a two-stage anchor so the panel both follows the trigger and grows in the right direction. Five findings from this went into the build skill. One error remained: mirroring the Tooltip model onto its siblings rebuilt the template and wiped human-set overrides on one instance. That finding is open.',
  },
];

// ── 5 · Checks ───────────────────────────────────────────────────────────────

const CHECKS: React.ReactNode[][] = [
  [
    <>
      Code gate
      <span className="block text-format-data-md text-muted">
        npm run check
      </span>
    </>,
    'Lint, typecheck, 150 unit specs, 157 stories in real Chromium incl. axe; a violation is a failure',
    'Appearance, Figma',
    'Locally, before every merge',
  ],
  [
    <>
      Visual check
      <span className="block text-format-data-md text-muted">
        npm run shoot -- &lt;storyId&gt;
      </span>
    </>,
    'A screenshot of a story from the running Storybook via Playwright; the agent looks at the PNG itself and compares with Figma',
    'Nothing by machine; an eye, not a script',
    'The screenshot script; a rule in the project instructions and a fixed step in the port and docgen skills',
  ],
  [
    <>
      Figma set check
      <span className="block text-format-data-md text-muted">
        /figma-verify
      </span>
    </>,
    'Vectors instead of images, clipping, overlap, visibility in the built set',
    'Semantics, token bindings',
    'Before every Figma handoff',
  ],
  [
    <>
      Figma docs audits
      <span className="block text-format-data-md text-muted">
        npm run audit:api · npm run audit:tokens
      </span>
    </>,
    'The 25 documentation sections of the Figma file against set, catalog and code: anatomy pins, the properties block with 1 755 checks, the token column with 3 049 checks',
    'The components themselves',
    'Scripts in the tools folder, runs in the run notes',
  ],
  [
    <>
      Token description audit
      <span className="block text-format-data-md text-muted">
        npm run audit:descriptions
      </span>
    </>,
    'The 82 role sentences and the 50 scope lines on the Storybook pages, character-identical to the token catalog',
    'Figma; the sentence on the variable is read back through the Figma MCP in the audit rounds',
    'After every change to a token sentence or a Foundations page',
  ],
];

// ── 6 · Rework ───────────────────────────────────────────────────────────────

const COMMIT_TYPES = [
  { label: 'docs', value: 32, display: '140 · 32 %' },
  { label: 'refine', value: 19, display: '83 · 19 %' },
  { label: 'feat', value: 16, display: '70 · 16 %' },
  { label: 'chore', value: 14, display: '62 · 14 %' },
  { label: 'refactor', value: 10, display: '46 · 10 %' },
  { label: 'fix', value: 8, display: '37 · 8 %' },
];

type Round = { round: string; when: string; scope: string; measure: React.ReactNode };

const ROUNDS: { group: string; note?: string; rows: Round[] }[] = [
  {
    group: 'Components',
    rows: [
      {
        round: 'Follow Figma changes',
        when: 'Jun 9 – Aug 31',
        scope: '24 runs, 15 components',
        measure:
          'When a colour, a spacing or a font changes in Figma, the code has to follow. A run reads the set’s bindings, compares with the code, applies the difference. 14 runs fell on June 17 after the colour system was renamed, 5 of them without a change.',
      },
      {
        round: 'Ported twice',
        when: 'Jun 10',
        scope: '1 run, InputGroup',
        measure: 'See section 4, case 3.',
      },
      {
        round: 'Model overlays in Figma',
        when: 'Jun 22 – 24',
        scope: '4 runs, Popover and Tooltip, 5 codified findings',
        measure:
          'See section 4, case 6. Figma-only runs after the port: the set is rebuilt, the code stays.',
      },
    ],
  },
  {
    group: 'Token system',
    note: 'The named colours, spacings, radii and fonts everything is built from.',
    rows: [
      {
        round: 'Setup',
        when: 'Jun 4 – 5',
        scope: '5 analyses, 167 variables, 7 bridge steps',
        measure:
          'No token file at the start but one analysis per category: which values the Figma system needs and what they are called. From that the export and the Tailwind bridge. Primary colour darkened to AA contrast.',
      },
      {
        round: 'Colours by role',
        when: 'Jun 17',
        scope: 'all colour tokens, 18 components, 32 commits',
        measure: (
          <>
            Colours were named after their look, not their use. Each got a
            role suffix: fill, ink or border.
          </>
        ),
      },
      {
        round: 'Additions',
        when: 'Jun 19, Jul 1',
        scope:
          'secondary fills, a brand pair, one colour family for dark surfaces, two text formats',
        measure:
          'Gaps that only became visible while porting. Every addition first in Figma, then in code via the export.',
      },
      {
        round: 'One sentence per token',
        when: 'Aug 31 – Sep 7',
        scope: '82 descriptions',
        measure:
          'Every token got a sentence on when to use it. A script checks that it reads the same in Figma, catalog and Storybook.',
      },
    ],
  },
  {
    group: 'Storybook',
    note: 'The surface where the components are shown and tested.',
    rows: [
      {
        round: 'Stories as tests',
        when: 'Jun 16 – 17',
        scope: 'all stories',
        measure:
          'Every story runs as a browser test with an accessibility check. Violations break the test run.',
      },
      {
        round: 'One pattern',
        when: 'Jun 17',
        scope: '14 story files, 18 components',
        measure:
          'Every component has the same three pages: a playground with controls, usage examples, a states gallery.',
      },
      {
        round: 'Prop table from the code',
        when: 'Jun 18 – 20',
        scope: '10 refactorings, 20 components, 6 families in sub-pages',
        measure: (
          <>
            The props table was empty or wrong. Components rewritten so the
            table is generated from the code. The docgen-props skill came out
            of it.
          </>
        ),
      },
      {
        round: 'Descriptions',
        when: 'Sep 2',
        scope: '22 components, 18 sub-pages',
        measure:
          'Every description rewritten: what the component is, when to use it. A “View in Figma” link on every page.',
      },
    ],
  },
  {
    group: 'Docs and catalogs',
    rows: [
      {
        round: 'Catalogs = current state',
        when: 'Aug 31',
        scope: '2 catalogs, 25 entries',
        measure:
          'The catalogs mixed state and history. History moved to changelogs, catalogs hold only the current state with fixed fields.',
      },
      {
        round: 'Figma docs, three audit rounds',
        when: 'Sep 2 – 4',
        scope: '25 sections, 4 804 checks',
        measure:
          'See section 5. Procedure: brief, script first, one agent per family, independent reviewer, merge.',
      },
    ],
  },
  {
    group: 'Skills',
    note: 'The working instructions for the agent.',
    rows: [
      {
        round: 'Findings from runs',
        when: 'June',
        scope: '77 findings in 23 files',
        measure:
          'Every run logs where the instruction had a gap: what was missing, which error it caused, how the instruction should read. Class A worked in, 15 class B deferred. No feedback files since July; the September audit rounds keep findings in their reviews.',
      },
      {
        round: 'Self-analysis',
        when: 'Jul 8',
        scope: '113 transcripts, 1 226 prompts',
        measure:
          'Two agents evaluated the way of working. Twelve recommendations, most of them for scripts instead of model judgement. Done: the audit scripts. Not done: CI.',
      },
    ],
  },
];

// ── 7 · Human and agent ──────────────────────────────────────────────────────

const PROMPT_KINDS = [
  { label: 'Instruction', value: 44, display: '44 %' },
  { label: 'Objection or correction', value: 19, display: '19 %' },
  { label: 'Question', value: 16, display: '16 %' },
  { label: 'Slash command', value: 13, display: '13 %' },
  { label: 'Short approval', value: 9, display: '9 %' },
];

const AGENT_SIDE: React.ReactNode[][] = [
  ['Prompts', '479'],
  ['Model calls', '6 922'],
  ['Tool calls', '7 378'],
  ['Subagent runs', '111'],
  ['Model time', '48.6 hours'],
];

// ── 8 · Skills ───────────────────────────────────────────────────────────────

const SKILLS: React.ReactNode[][] = [
  [
    <TokenChip>shadcn-component-port</TokenChip>,
    'Orchestrator',
    'Bring a shadcn component into the system: read its anatomy, build the Figma set, write the code, stories, gate.',
  ],
  [
    <TokenChip>component-sync</TokenChip>,
    'Orchestrator',
    'Pull a Figma change into the code; reads Figma, never writes it.',
  ],
  [
    <TokenChip>figma-build-rules</TokenChip>,
    'Craft',
    'How a Figma set is built: variant matrix, variable bindings, slots, states as an axis, composite components.',
  ],
  [
    <TokenChip>docgen-props</TokenChip>,
    'Craft',
    'Annotate the code so the props table in Storybook is generated automatically.',
  ],
  [
    <TokenChip>storybook-rules</TokenChip>,
    'Craft',
    'The story pattern: three pages per component, tests in the story, accessibility.',
  ],
  [
    <TokenChip>figma-create-section</TokenChip>,
    'Craft',
    'Helper: the frame a build is placed into in Figma.',
  ],
  [
    <TokenChip>figma-verify</TokenChip>,
    'Check',
    'Mechanical check of a built Figma set before handoff.',
  ],
  [
    <TokenChip>figma-status</TokenChip>,
    'Check',
    'Is Figma Desktop connected to the agent.',
  ],
  [
    <TokenChip>figma-coverage</TokenChip>,
    'Application',
    'Check any draft against the system: what exists already, what is missing.',
  ],
  [
    <TokenChip>figma-compose</TokenChip>,
    'Application',
    'Compose a screen from existing components without building new ones.',
  ],
  [
    <TokenChip>skill-feedback</TokenChip>,
    'Meta',
    'Note gaps in a skill during a run without changing it mid-run.',
  ],
  [
    <TokenChip>handoff</TokenChip>,
    'Meta',
    'Write the state down so a new session continues without the chat history.',
  ],
];

// ── 9 · Tools ───────────────────────────────────────────────────────────────

const SERVERS: React.ReactNode[][] = [
  [
    'Figma Plugin MCP, official',
    'Build Figma nodes, bind variables, read screenshots. In ten days: 1 507 write and 350 screenshot calls.',
  ],
  ['shadcn MCP', 'Read a component’s anatomy from the shadcn registry.'],
  ['Storybook MCP', 'Query stories and docs from the running Storybook.'],
  ['Figma Console MCP, Remix Icon MCP', 'Only on explicit request.'],
];

// ── Prompts by topic (section 8) ─────────────────────────────────────────────

const TOPICS = [
  { label: 'Skills, agents, handoffs, tooling', value: 20, display: '20 %', note: 'skill, agent, worker, reviewer, handoff, memory, mcp' },
  { label: 'Code and ports', value: 17, display: '17 %', note: 'port, component, props, tsx, radix, shadcn, tailwind' },
  { label: 'Git, gate, tests', value: 15, display: '15 %', note: 'commit, merge, branch, ff, worktree, check, lint, test' },
  { label: 'Figma', value: 14, display: '14 %', note: 'figma, variant, variable, node, section, binding, instance' },
  { label: 'Docs and catalogs', value: 13, display: '13 %', note: 'docs, catalog, reference, changelog, notes, readme' },
  { label: 'Tokens', value: 9, display: '9 %', note: 'token, colour, palette, spacing, radius, corner, shadow' },
  { label: 'Storybook and stories', value: 7, display: '7 %', note: 'storybook, story, autodocs, argstable, controls, mdx' },
  { label: 'Visual check, measurements, screenshots', value: 6, display: '6 %', note: 'screenshot, shoot, px, spacing, size, exact, compare' },
  { label: 'Short approvals, follow-ups without a keyword', value: 31, display: '31 %', note: 'yes, go on, no, why, ok' },
];

const SOURCES: React.ReactNode[][] = [
  [
    'Git, agent-runs/, tools/, catalogs, changelogs',
    'complete',
    '—',
  ],
  ['Claude Code prompt history', 'all prompts, Jun 4 – Sep 7', 'inputs only'],
  [
    'Session transcripts',
    'Aug 28 – Sep 7, 38 sessions + 111 subagent files',
    'older ones deleted',
  ],
  [
    'Activity cache',
    'messages and tool calls until Jul 18',
    'counts every project on the machine',
  ],
  ['Self-analysis of Jul 8', '113 transcripts, Jun 4 – Jul 2', 'a snapshot'],
];

// ── Page ─────────────────────────────────────────────────────────────────────

export function Workflow() {
  // Ligatures off page-wide: the mono face turns "--" into one glyph and eats
  // the space before a CLI flag.
  return (
    <div className="bg-surface text-ink text-format-body [font-variant-ligatures:none]">
      <header className="border-b border-border px-2xl py-4xl md:px-4xl">
        <div className="mx-auto max-w-[72rem]">
          <Eyebrow>Report · state 2026-09-07</Eyebrow>
          <h1 className="mt-lg text-format-display text-ink text-[clamp(2.25rem,5vw,3.25rem)] leading-[0.95]">
            How this system was built with agents
          </h1>
          <p className={`mt-xl max-w-[48rem] ${PROSE} text-ink text-pretty`}>
            The Agentport DS was built with Claude Code: skills as working
            instructions, agents that build in Figma and in code, scripts that
            decide when a run is done. This page shows the numbers. Data basis:
            the repo with its Git history, run notes, tools, catalogs and
            changelogs, the Claude Code prompt history, the session transcripts
            of the last ten days and a self-analysis from July 8.
            Every number that comes from the repo names the command or file it
            was counted from.
          </p>
        </div>
      </header>

      <div className="mx-auto flex max-w-[72rem] flex-col gap-4xl px-2xl py-4xl md:px-4xl">
        {/* Summary */}
        <Section id="summary" title="In short">
          <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
            {SUMMARY.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </Section>

        {/* 1 */}
        <Section id="principles" number="1 · Working principles" title="Six rules">
          <div className="grid gap-x-2xl gap-y-xl lg:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="flex flex-col gap-sm">
                <h3 className="text-format-title text-ink">{p.title}</h3>
                <p className={`${PROSE} text-ink text-pretty`}>{p.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 2 */}
        <Section
          id="built"
          number="2 · What was built"
          title="A shadcn/ui set on its own token layer"
          lead="Built through a Figma ↔ code pipeline. The value is not the speed at which 22 components appeared, that can be done by hand. It is that Figma set, code and docs agree in the same places, and that the agreement is checked, not claimed."
        >
          <Table
            caption="Artefacts, their scope, and how to verify each"
            head={['Artefact', 'Scope', 'Verify']}
            rows={ARTEFACTS}
          />
          <Prose>
            <p>
              What does not agree is in the catalog: 7 components with one open
              Figma-to-code deviation each, among them the unbound Button focus
              colour and a SelectTrigger placeholder bound to the wrong token,
              plus one entry at file level.
            </p>
          </Prose>
        </Section>

        {/* 3 */}
        <Section id="timeline" number="3 · Timeline" title="Six stations">
          <Table
            caption="Timeline: when, which station, what was new in the tooling"
            head={['When', 'Station', 'What was new in the tooling']}
            rows={STATIONS.map((s) => [s.when, s.station, s.tooling])}
            firstColWidth="8rem"
          />
          <Prose>
            <p>
              The shift across the stations: from “the agent builds, the human
              checks by eye” to “the human writes the brief and the check script,
              agents work separately, a reviewer agent reads against, the script
              decides”. Not done is the recommendation of July 8 to enforce the
              gate by machine.
            </p>
          </Prose>
        </Section>

        {/* 4 */}
        <Section
          id="failures"
          number="4 · Where it went wrong"
          title="Six cases from the repo"
          lead="For each: what the agent got wrong, how it was noticed, what came of it."
        >
          <ol className="flex flex-col">
            {CASES.map((c, i) => (
              <li
                key={c.title}
                className="grid gap-lg border-t border-border py-2xl lg:grid-cols-[14rem_1fr]"
              >
                <div className="flex flex-col gap-sm">
                  <h3 className="text-format-title text-ink">
                    <span className="text-muted">{i + 1} · </span>
                    {c.title}
                  </h3>
                  <span className="text-format-data-md text-muted">{c.when}</span>
                </div>
                <p className={`max-w-[42rem] ${PROSE} text-ink text-pretty`}>
                  {c.body}
                </p>
              </li>
            ))}
          </ol>
          <Prose>
            <p>
              What the agent was not good at, in one sentence: telling semantic
              truth apart. Whether a binding belongs to the component or to an
              embedded instance, whether an overlay needs a name, whether a role
              was read from the code or from the set, whether a template may be
              touched. Every time a script, a reviewer or the human found it by
              looking.
            </p>
          </Prose>
        </Section>

        {/* 5 */}
        <Section
          id="checks"
          number="5 · Checks"
          title="What checks what"
          lead="Five separate test benches. Each checks something the others do not."
        >
          <Table
            caption="Test benches: what each checks, what it does not, where it runs"
            head={['Test bench', 'Checks', 'Does not check', 'Where']}
            rows={CHECKS}
            firstColWidth="14rem"
          />
        </Section>

        {/* 6 */}
        <Section
          id="rework"
          number="6 · Rework"
          title="What was reworked"
          lead="Rework in numbers, from the Git log. A quarter of all commits is correction, fix and refine. A third is docs, and most of that is follow-up too: the same truth lives in Figma, catalog and code, and after every change the catalog is brought back in line by hand."
        >
          <Bars caption="Commits by type" items={COMMIT_TYPES} max={35} />
          <div className="flex flex-col gap-3xl">
            {ROUNDS.map((g) => (
              <Group key={g.group} name={g.group} note={g.note}>
                <Table
                  caption={`${g.group}: rework rounds`}
                  head={['Round', 'When', 'Scope', 'Problem and measure']}
                  rows={g.rows.map((r) => [r.round, r.when, r.scope, r.measure])}
                />
              </Group>
            ))}
          </div>
        </Section>

        {/* 7 */}
        <Section id="human-agent" number="7 · Human and agent" title="Who did what, how often">
          <div className="grid gap-2xl lg:grid-cols-2">
            <div className="flex flex-col gap-lg">
              <h3 className="text-format-heading-sm text-ink">Human side</h3>
              <p className={`${PROSE} text-ink text-pretty`}>
                2 343 prompts on 47 days, median 48 characters. By wording, a
                heuristic:
              </p>
              <Bars caption="Prompts by kind" items={PROMPT_KINDS} max={50} />
              <p className={`${PROSE} text-ink text-pretty`}>
                Every fifth prompt is about the tooling itself, skills, agents
                and handoffs, not the product. The July self-analysis counted 46
                prompts demanding a root cause instead of a point fix, 34 image
                reviews and 101 prompts about pixel precision.
              </p>
            </div>
            <div className="flex flex-col gap-lg">
              <h3 className="text-format-heading-sm text-ink">Agent side</h3>
              <p className={`${PROSE} text-ink text-pretty`}>
                Documented for the last ten days:
              </p>
              <Table
                caption="Agent side, last ten days"
                head={['Measure', 'Count']}
                rows={AGENT_SIDE}
              />
            </div>
          </div>
          <Prose>
            <p>
              Models by role: orchestration on the strongest model, workers on
              Sonnet, the reviewer on Opus.
            </p>
          </Prose>
          <div className="flex flex-col gap-lg">
            <h3 className="text-format-heading-sm text-ink">Prompts by topic</h3>
            <p className={`max-w-[48rem] ${PROSE} text-ink text-pretty`}>
              2 343 prompts, sorted by keyword. A prompt can hit several topics,
              so the sum is above 100 %. A heuristic over the wording, not a
              hand classification.
            </p>
            <Bars caption="Prompts by topic" items={TOPICS} max={35} />
          </div>
          <p className="max-w-[48rem] border-t border-border pt-lg text-format-data-md text-muted text-pretty">
            Note: Claude Code keeps session transcripts for 30 days only.
            Older agent-side values in this report come from the self-analysis.
          </p>
        </Section>

        {/* 8 */}
        <Section
          id="skills"
          number="8 · Skills"
          title="Twelve skills, 1 852 lines"
        >
          <Table
            caption="Skills by level, each in one sentence"
            head={['Skill', 'Level', 'In one sentence']}
            rows={SKILLS}
            firstColWidth="14rem"
          />
          <Prose>
            <p>
              The orchestrators call the craft skills and carry only the project
              values: Figma file, page, font. The craft skills are
              project-neutral. On top come third-party plugins: superpowers for
              planning, executing with subagents and verification before “done”,
              the official Figma plugin, and skill-creator.
            </p>
          </Prose>
        </Section>

        {/* 9 */}
        <Section id="tools" number="9 · Tools" title="What the agent reaches">
          <Table
            caption="MCP servers and what they are used for"
            head={['Server', 'Used for']}
            rows={SERVERS}
            firstColWidth="16rem"
          />
          <Prose>
            <p>
              Scripts in the repo: the code gate, the screenshot script whose
              output the agent looks at itself, the token-sentence parity check,
              and the two Figma docs audits. Memory across
              sessions: handoff, catalogs, changelogs, 51 run folders with
              notes, memory entries for pitfalls.
            </p>
          </Prose>
        </Section>

        {/* 10 */}
        <Section id="limits" number="10 · Limits" title="What this does not cover">
          <ul className={`flex max-w-[48rem] flex-col gap-lg ${PROSE} text-ink text-pretty`}>
            <li>
              <strong className="font-[var(--ap-sys-body-strong-weight)]">
                Transcripts live 30 days.
              </strong>{' '}
              There are no agent numbers over the full stretch; the June values
              come from the July self-analysis and an activity cache that counts
              every project.
            </li>
            <li>
              <strong className="font-[var(--ap-sys-body-strong-weight)]">
                The catalog scales with the reviewer.
              </strong>{' '}
              It is the truth as long as a human reads it. The audit scripts
              check it against Figma and code, but not against intent.
            </li>
            <li>
              <strong className="font-[var(--ap-sys-body-strong-weight)]">Nothing enforced.</strong>{' '}
              No CI and no Git hooks. The checks run because the rules demand
              them before every merge, and every gate number is self-reported.
            </li>
          </ul>
        </Section>

        <Section id="sources" number="Data basis" title="Where the numbers come from">
          <Table
            caption="Sources, coverage and limitation"
            head={['Source', 'Covers', 'Limitation']}
            rows={SOURCES}
            firstColWidth="16rem"
          />
        </Section>
      </div>
    </div>
  );
}

export default Workflow;
