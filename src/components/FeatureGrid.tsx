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

const COLS: Record<NonNullable<FeatureGridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function FeatureGrid({ features, columns = 3, className, renderFeature }: FeatureGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-5", COLS[columns], className)}>
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
  );
}
