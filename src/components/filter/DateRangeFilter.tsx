"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface DateRangeFilterProps {
  startDate: Date | undefined
  endDate: Date | undefined
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
  startDateLabel?: string
  endDateLabel?: string
  startDatePlaceholder?: string
  endDatePlaceholder?: string
  className?: string
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startDateLabel = "Start Date",
  endDateLabel = "End Date",
  startDatePlaceholder = "Select start date",
  endDatePlaceholder = "Select end date",
  className,
}: DateRangeFilterProps) {
  return (
    <div className={className}>
      <div className="space-y-2">
        <label className="text-sm font-medium">{startDateLabel}</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start w-full font-normal text-left">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {startDate ? format(startDate, "MMM dd, yyyy") : startDatePlaceholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              className="border-none shadow-none"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium">{endDateLabel}</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start w-full font-normal text-left">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {endDate ? format(endDate, "MMM dd, yyyy") : endDatePlaceholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              className="border-none shadow-none"
              fromDate={startDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
