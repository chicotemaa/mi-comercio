"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { getDefaultDurationMinutes } from "@/lib/service-catalog"
import { getServiceCategoryLabel } from "@/lib/business-shared"

import type { ServiceFeedbackState, ServiceFormState, ServiceSummary } from "./service-types"
import { createServiceFormState } from "./service-utils"

function createFeedbackState(title: string, description: string, tone: ServiceFeedbackState["tone"]) {
  return {
    title,
    description,
    tone,
  } satisfies ServiceFeedbackState
}

export function useServicesController(services: ServiceSummary[]) {
  const router = useRouter()
  const [isRefreshing, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [editingService, setEditingService] = useState<ServiceSummary | null>(null)
  const [serviceToDelete, setServiceToDelete] = useState<ServiceSummary | null>(null)
  const [formState, setFormState] = useState<ServiceFormState>(createServiceFormState())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [feedbackState, setFeedbackState] = useState<ServiceFeedbackState | null>(null)

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const normalizedSearch = searchTerm.toLowerCase()
      const matchesSearch =
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.description?.toLowerCase().includes(normalizedSearch) ||
        getServiceCategoryLabel(service.category).toLowerCase().includes(normalizedSearch)

      const matchesCategory = categoryFilter === "all" || service.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [categoryFilter, searchTerm, services])

  const averageTicket =
    services.length > 0 ? services.reduce((total, service) => total + service.price, 0) / services.length : 0

  function resetForm() {
    setEditingService(null)
    setFormState(createServiceFormState())
    setFormError(null)
  }

  function handleFormOpenChange(open: boolean) {
    setIsFormOpen(open)

    if (!open) {
      resetForm()
    }
  }

  function openCreateDialog() {
    resetForm()
    setIsFormOpen(true)
  }

  function openEditDialog(service: ServiceSummary) {
    setEditingService(service)
    setFormState(createServiceFormState(service))
    setFormError(null)
    setIsFormOpen(true)
  }

  function updateFormField<K extends keyof ServiceFormState>(field: K, value: ServiceFormState[K]) {
    setFormState((current) => {
      if (field === "category") {
        const nextCategory = value as ServiceFormState["category"]
        const currentDefault = String(getDefaultDurationMinutes(current.category))
        const nextDefault = String(getDefaultDurationMinutes(nextCategory))

        return {
          ...current,
          category: nextCategory,
          durationMinutes: current.durationMinutes === currentDefault ? nextDefault : current.durationMinutes,
        }
      }

      return {
        ...current,
        [field]: value,
      }
    })
  }

  async function refreshData() {
    startTransition(() => {
      router.refresh()
    })
  }

  async function submitForm() {
    setIsSubmitting(true)
    setFormError(null)

    const endpoint = editingService ? `/api/services/${editingService.id}` : "/api/services"
    const method = editingService ? "PATCH" : "POST"

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          description: formState.description,
          price: Number(formState.price),
          category: formState.category,
          durationMinutes: Number(formState.durationMinutes),
        }),
      })

      const body = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        setFormError(body?.error ?? "No se pudo guardar el servicio.")
        return
      }

      handleFormOpenChange(false)
      setFeedbackState(
        createFeedbackState(
          editingService ? "Servicio actualizado" : "Servicio creado",
          editingService
            ? "El servicio se actualizó correctamente en el catálogo."
            : "El servicio se agregó correctamente al catálogo compartido.",
          "success",
        ),
      )
      await refreshData()
    } catch {
      setFormError("Ocurrió un problema al guardar el servicio.")
    } finally {
      setIsSubmitting(false)
    }
  }

  function openDeleteDialog(service: ServiceSummary) {
    setServiceToDelete(service)
  }

  function closeDeleteDialog() {
    setServiceToDelete(null)
  }

  async function confirmDelete() {
    if (!serviceToDelete) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/services/${serviceToDelete.id}`, { method: "DELETE" })
      const body = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        closeDeleteDialog()
        setFeedbackState(
          createFeedbackState(
            "No se pudo eliminar",
            body?.error ?? "Ocurrió un problema al eliminar el servicio.",
            "error",
          ),
        )
        return
      }

      closeDeleteDialog()
      setFeedbackState(
        createFeedbackState(
          "Servicio eliminado",
          "El servicio se eliminó correctamente del catálogo.",
          "success",
        ),
      )
      await refreshData()
    } catch {
      closeDeleteDialog()
      setFeedbackState(
        createFeedbackState("No se pudo eliminar", "Ocurrió un problema al eliminar el servicio.", "error"),
      )
    } finally {
      setIsDeleting(false)
    }
  }

  function closeFeedbackDialog() {
    setFeedbackState(null)
  }

  return {
    averageTicket,
    categoryFilter,
    closeDeleteDialog,
    closeFeedbackDialog,
    confirmDelete,
    filteredServices,
    formError,
    formState,
    handleFormOpenChange,
    isDeleting,
    isFormOpen,
    isRefreshing,
    isSubmitting,
    openCreateDialog,
    openDeleteDialog,
    openEditDialog,
    feedbackState,
    searchTerm,
    selectedServiceToDelete: serviceToDelete,
    editingService,
    setCategoryFilter,
    setSearchTerm,
    services,
    submitForm,
    updateFormField,
  }
}
