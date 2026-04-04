interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-muted-foreground text-base">{description}</p>
      )}
    </div>
  );
}
