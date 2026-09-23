import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />;
}

/** One short sentence-case line that introduces a section. No numbers, no markers, no uppercase. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('text-sm font-medium text-ink-soft', className)}>{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  as: Heading = 'h2',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <div className={cn('mb-10 flex flex-wrap items-end justify-between gap-6', className)}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading className={cn('mt-3 font-display', Heading === 'h1' ? 'text-4xl leading-tight sm:text-5xl' : 'text-3xl leading-tight sm:text-4xl')}>{title}</Heading>
        {description && <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-ink-soft">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** The one container style. Never nest a Panel in a Panel (no card-on-card). */
export function Panel({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('rounded-2xl border border-border bg-card p-6 sm:p-8', className)} {...props} />;
}

/** Status as plain text; color only when it needs attention. Never a pill. */
export function StatusText({ children, attention = false }: { children: string; attention?: boolean }) {
  return <span className={cn('text-sm whitespace-nowrap', attention ? 'text-signal' : 'text-ink-soft')}>{children}</span>;
}

/** A quiet figure: label, value, note. No box, no icon, no highlight. */
export function KeyFigure({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="tabular-nums">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="mt-1 text-xl font-medium">{value}</dd>
      {hint && <dd className="mt-1 text-xs text-ink-faint">{hint}</dd>}
    </div>
  );
}

/** Figures laid out by content width, not equal columns. Leave out anything the reader already knows. */
export function KeyFigures({ children, className }: { children: ReactNode; className?: string }) {
  return <dl className={cn('flex flex-wrap gap-x-14 gap-y-6', className)}>{children}</dl>;
}

/** Hairline-separated editorial rows: label left, one sentence right. Use instead of feature cards. */
export function EditorialList({ items, className }: { items: { title: string; body: string }[]; className?: string }) {
  return (
    <dl className={cn('divide-y divide-border border-y border-border', className)}>
      {items.map((item) => (
        <div key={item.title} className="grid grid-cols-1 gap-2 py-6 sm:grid-cols-[0.8fr_1.2fr] sm:gap-10">
          <dt className="text-lg font-semibold">{item.title}</dt>
          <dd className="text-base leading-relaxed text-ink-soft">{item.body}</dd>
        </div>
      ))}
    </dl>
  );
}
