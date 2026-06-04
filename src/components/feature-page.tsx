import type { ReactNode } from "react";

export function FeaturePage({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
        </div>
      </header>
      {children}
    </div>
  );
}