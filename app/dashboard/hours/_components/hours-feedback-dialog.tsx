"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { HoursFeedbackState } from "../hours-types"

interface HoursFeedbackDialogProps {
  feedback: HoursFeedbackState | null
  onOpenChange: (open: boolean) => void
}

export function HoursFeedbackDialog({ feedback, onOpenChange }: HoursFeedbackDialogProps) {
  return (
    <Dialog open={Boolean(feedback)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{feedback?.title}</DialogTitle>
          <DialogDescription>{feedback?.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className={feedback?.tone === "error" ? "bg-rose-600 hover:bg-rose-700" : undefined}
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
