import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface DashboardPageHeaderProps {
  actions?: ReactNode
  badge?: ReactNode
  className?: string
  description: ReactNode
  eyebrow?: string
  supporting?: ReactNode
  title: ReactNode
}

export function DashboardPageHeader({
  actions,
  badge,
  className,
  description,
  eyebrow,
  supporting,
  title,
}: DashboardPageHeaderProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/90 px-5 py-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)] backdrop-blur sm:px-6 sm:py-6",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-52 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),transparent_62%)]" />
      <div className="pointer-events-none absolute -bottom-12 left-0 h-24 w-24 rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl space-y-2">
          {eyebrow ? <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p> : null}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">{title}</h1>
            <p className="text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
          </div>
          {supporting ? <div className="pt-1">{supporting}</div> : null}
        </div>

        {(badge || actions) ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            {badge}
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  )
}
