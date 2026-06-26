export function EsqueletoGrilla({ cantidad = 8 }: { cantidad?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: cantidad }).map((_, i) => (
        <div key={i} className="rounded-[var(--radius-card)] overflow-hidden bg-zinc-100 dark:bg-zinc-800 animate-pulse">
          <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-700" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-1/2 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex justify-between items-center pt-1">
              <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-8 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
