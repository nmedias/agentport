import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Table — scrollable data table root. Wraps a native `<table>` in an
 * overflow-x container; carries the DS body typography. Compose with
 * `TableHeader` / `TableBody` / `TableFooter` / `TableRow` / `TableHead` /
 * `TableCell` / `TableCaption`.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-format-body", className)}
        {...props}
      />
    </div>
  )
}

/** Table header region (`<thead>`); its rows carry a bottom rule. */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

/** Table body region (`<tbody>`); the last row drops its bottom rule. */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

/**
 * Table footer region (`<tfoot>`) — a quiet summary band (muted fill, top
 * rule, label-weight text) for totals and aggregates.
 */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted-fill/50 text-format-label [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Table row (`<tr>`). Tints on hover with a neutral wash; a selected row
 * (`data-state="selected"`) carries the accent selection tint.
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted-fill/50 has-aria-expanded:bg-muted-fill/50 data-[state=selected]:bg-accent-fill",
        className
      )}
      {...props}
    />
  )
}

/**
 * Table header cell (`<th>`) — label-weight, ink, left-aligned by default.
 * Add `text-right` / `text-center` to align a column.
 */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-md text-left align-middle text-format-label whitespace-nowrap text-ink [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Table data cell (`<td>`). Inherits the table's body typography; add
 * `text-right` / `text-center` to align a column.
 */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-md align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

/** Table caption (`<caption>`) — muted secondary text below the table. */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-xl text-format-body text-muted-ink", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
