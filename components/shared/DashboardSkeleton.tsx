import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar Skeleton */}
      <div className="hidden h-full w-64 flex-col border-r bg-muted p-4 md:flex">
        <Skeleton className="mb-4 h-10 w-3/4" /> {/* Logo/Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-5/6" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="mt-auto space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex flex-1 flex-col">
        {/* Header Skeleton */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 md:hidden" /> {/* Mobile Menu Icon */}
            <Skeleton className="h-6 w-40" /> {/* Page Title Skeleton */}
          </div>
          <Skeleton className="h-10 w-10 rounded-full" /> {/* User Avatar Skeleton */}
        </header>

        {/* Dashboard Content Skeleton */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mb-6">
            <Skeleton className="mb-2 h-7 w-1/4" /> {/* Section Title */}
            <Skeleton className="h-4 w-1/2" /> {/* Section Subtitle/Description */}
          </div>

          {/* Grid for Cards/Widgets */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="mb-4 h-10 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-5/6" />
            </div>
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="mb-4 h-10 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-5/6" />
            </div>
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm md:col-span-2 lg:col-span-1">
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="mb-4 h-10 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-5/6" />
            </div>
             <div className="hidden rounded-lg border bg-card p-4 text-card-foreground shadow-sm xl:block">
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="mb-4 h-10 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-5/6" />
            </div>
          </div>

          <div className="mt-6 grid gap-6">
            <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
              <Skeleton className="mb-4 h-7 w-1/3" /> {/* Table/List Title */}
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-5 w-2/5" />
                    <Skeleton className="h-5 w-1/5" />
                    <Skeleton className="h-5 w-1/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
