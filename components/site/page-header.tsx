import { cn } from '@/lib/utils';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-navy-950 pt-32 pb-16 text-white sm:pt-36 sm:pb-20',
        className
      )}
    >
      <div className="bg-grid-dark absolute inset-0 opacity-40" />
      <div className="absolute -right-20 -top-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {eyebrow && (
          <span className="animate-fade-up text-sm font-semibold uppercase tracking-wider text-orange-400">
            {eyebrow}
          </span>
        )}
        <h1
          className="animate-fade-up mt-3 font-barlow text-4xl font-bold sm:text-5xl"
          style={{ animationDelay: '0.06s' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="animate-fade-up mt-4 max-w-2xl text-lg text-navy-200"
            style={{ animationDelay: '0.12s' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
