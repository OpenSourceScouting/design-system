import { Fragment, type ReactNode } from "react";
import { Card, CardBody } from "./Card";
import { Heading } from "./Heading";
import { cn } from "../lib/utils/cn";

export type Feature = {
  title: ReactNode;
  description: ReactNode;
  /** Optional inline SVG icon, typically 24-32px. Inherits currentColor. */
  icon?: ReactNode;
};

export type FeatureGridProps = {
  features: Feature[];
  /** Grid column count at large breakpoints. */
  columns?: 2 | 3 | 4;
  className?: string;
  /**
   * Replace the default feature card entirely. Receives each feature and its
   * index, and returns the cell content (e.g. a card with a background image
   * and a "Learn more" link, an icon-only tile, extra metadata). The grid
   * layout (column count and gap) is unchanged; only the per-cell structure is
   * yours. Return a single element per feature so it lands as one grid child.
   * When omitted, the built-in card renders unchanged.
   */
  renderFeature?: (feature: Feature, index: number) => ReactNode;
};

// Container-query column counts (Tailwind v4, no plugin): the grid responds to
// its OWN width, not the viewport, so a <FeatureGrid columns={4}> in a narrow
// sidebar collapses to fewer columns even on a wide screen. The `@container`
// wrapper below establishes the query context; these `@md`/`@2xl`/`@4xl`
// variants query that wrapper. Card target width stays ~210px at every step.
const COLS: Record<NonNullable<FeatureGridProps["columns"]>, string> = {
  2: "@md:grid-cols-2",
  3: "@md:grid-cols-2 @2xl:grid-cols-3",
  4: "@md:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4",
};

export function FeatureGrid({ features, columns = 3, className, renderFeature }: FeatureGridProps) {
  return (
    // The `@container` wrapper is the query context; the inner grid reads its
    // width. Consumer `className` lands on the wrapper (where width/margin
    // belong), so sizing the wrapper drives the column count.
    <div className={cn("@container", className)}>
      <div className={cn("grid grid-cols-1 gap-5", COLS[columns])}>
        {features.map((f, i) =>
          renderFeature ? (
            <Fragment key={i}>{renderFeature(f, i)}</Fragment>
          ) : (
            <Card key={i} variant="outlined" className="h-full">
              <CardBody className="flex flex-col gap-3 h-full">
                {f.icon ? (
                  <div className="flex flex-col gap-2">
                    <span aria-hidden className="text-primary [&>svg]:h-8 [&>svg]:w-8">
                      {f.icon}
                    </span>
                    <span aria-hidden className="h-0 w-8 border-b-rule border-border/70" />
                  </div>
                ) : null}
                <Heading level={3} size={4}>
                  {f.title}
                </Heading>
                <p className="font-body text-sm leading-relaxed text-foreground/80 flex-1">
                  {f.description}
                </p>
              </CardBody>
            </Card>
          ),
        )}
      </div>
    </div>
  );
}
