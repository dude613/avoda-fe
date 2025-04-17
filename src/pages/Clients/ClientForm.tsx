"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Building, Mail, Phone, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { Client } from "@/types/Client"


interface ClientFormProps {
  client?: Client
  onSubmit: (client: Client) => void
  onCancel: () => void
}

export function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Client>({
    defaultValues: client || {
      name: "",
      email: "",
      phone: "",
      address: "",
      industry: "",
      billingRate: 0,
      notes: "",
      status: "active",
      projects: 0,
    },
  })

  const onFormSubmit = async (data: Client) => {
    setIsSubmitting(true)
    try {
      onSubmit({
        ...data,
        status: client?.status || "active",
        projects: client?.projects || 0,
      })
    } catch (error) {
      toast.error("Failed to save client")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="py-4 space-y-4">
      {/* Client Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          Client Name *
        </Label>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Client name is required" }}
          render={({ field }) => (
            <Input
              id="name"
              placeholder="Enter client name"
              {...field}
              className={errors.name ? "border-destructive" : ""}
            />
          )}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Address *
        </Label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <Input
              id="email"
              type="email"
              placeholder="client@example.com"
              {...field}
              className={errors.email ? "border-destructive" : ""}
            />
          )}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Phone Number
        </Label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => <Input id="phone" placeholder="(123) 456-7890" {...field} />}
        />
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Controller
          name="industry"
          control={control}
          render={({ field }) => <Input id="industry" placeholder="e.g. Technology, Healthcare, Finance" {...field} />}
        />
      </div>

      {/* Billing Rate */}
      <div className="space-y-2">
        <Label htmlFor="billingRate" className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Billing Rate ($/hr) *
        </Label>
        <Controller
          name="billingRate"
          control={control}
          rules={{
            required: "Billing rate is required",
            min: {
              value: 0,
              message: "Billing rate must be a positive number",
            },
          }}
          render={({ field }) => (
            <Input
              id="billingRate"
              type="number"
              placeholder="0.00"
              {...field}
              onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
              className={errors.billingRate ? "border-destructive" : ""}
            />
          )}
        />
        {errors.billingRate && <p className="text-xs text-destructive">{errors.billingRate.message}</p>}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => <Input id="address" placeholder="Client address" {...field} />}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              id="notes"
              placeholder="Additional information about this client"
              className="min-h-[100px]"
              {...field}
            />
          )}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : client ? "Update Client" : "Add Client"}
        </Button>
      </DialogFooter>
    </form>
  )
}
