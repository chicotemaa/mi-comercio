import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface DashboardPageShellProps {
  children: ReactNode
  className?: string
}

export function DashboardPageShell({ children, className }: DashboardPageShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] space-y-6 px-4 py-5 sm:px-6 sm:py-6 lg:px-8", className)}>
      {children}
    </div>
  )
}
