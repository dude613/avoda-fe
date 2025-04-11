"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "../../redux/Store"
import {
  fetchTimerHistory,
  selectTimerHistory,
  selectHistoryLoading,
  selectTimerPagination,
  updateTimerNote,
  deleteTimerNote,
} from "../../redux/slice/Timer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card-b"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ArrowUpDownIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
} from "lucide-react"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { Textarea } from "../ui/textarea"
import { format } from "date-fns"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table"
import toast from "react-hot-toast"
import { FilterPanel } from "../filter/FilterPanel"
import { DateRangeFilter } from "../filter/DateRangeFilter"
import { TextFilter } from "../filter/TextFilter"

type TimerWithOptionalFields = {
  id: string
  task: string
  project?: string
  client?: string
  startTime: string
  endTime?: string
  duration: number
  note?: string
  [key: string]: any // For any other fields
}

export default function TimerHistory() {
  const dispatch = useDispatch<AppDispatch>()
  const timerHistory = useSelector(selectTimerHistory)
  const historyLoading = useSelector(selectHistoryLoading)
  const { totalPages, currentPage } = useSelector(selectTimerPagination)

  // Filter states
  const [startDateFilter, setStartDateFilter] = useState<Date | undefined>(undefined)
  const [endDateFilter, setEndDateFilter] = useState<Date | undefined>(undefined)
  const [projectFilter, setProjectFilter] = useState("")
  const [clientFilter, setClientFilter] = useState("")
  const [taskFilter, setTaskFilter] = useState("")

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>([])

  // Edit note states
  const [editingTimerId, setEditingTimerId] = useState<string | null>(null)
  const [editedNote, setEditedNote] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Deduplicate timer history based on ID
  const uniqueTimerHistory = useMemo(() => {
    const uniqueTimers = new Map<string, TimerWithOptionalFields>()
    timerHistory.forEach((timer) => {
      if (!uniqueTimers.has(timer.id)) {
        uniqueTimers.set(timer.id, timer as TimerWithOptionalFields)
      }
    })
    return Array.from(uniqueTimers.values())
  }, [timerHistory])

  useEffect(() => {
    dispatch(fetchTimerHistory({ page: 1 }))
  }, [dispatch])

  // Focus the textarea when editing starts
  useEffect(() => {
    if (editingTimerId && textareaRef.current) {
      // Focus the textarea and place cursor at the end
      textareaRef.current.focus()
      const length = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [editingTimerId])

  const handlePageChange = (page: number) => {
    dispatch(fetchTimerHistory({ page }))
  }

  const formatDate = (dateString: string | number | Date | undefined) => {
    if (!dateString) return "" // Handle undefined case
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return "00:00:00"

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return [hours, minutes, remainingSeconds].map((val) => val.toString().padStart(2, "0")).join(":")
  }

  const handleEditNote = (timer: TimerWithOptionalFields) => {
    setEditingTimerId(timer.id)
    setEditedNote(timer.note || "")
    // i handled the focus by the useEffect
  }

  const handleSaveNote = async () => {
    if (!editingTimerId) return

    try {
      await dispatch(
        updateTimerNote({
          timerId: editingTimerId,
          note: editedNote,
        }),
      ).unwrap()

      toast.success("Note updated successfully")
      setEditingTimerId(null)
      setEditedNote("")
    } catch (error) {
      toast.error("Failed to update note")
      console.error("Error updating note:", error)
    }
  }

  const handleDeleteNote = async (timerId: string) => {
    try {
      await dispatch(deleteTimerNote(timerId)).unwrap()
      toast.success("Note deleted successfully")
    } catch (error) {
      toast.error("Failed to delete note")
      console.error("Error deleting note:", error)
    }
  }

  const handleCancelEdit = () => {
    setEditingTimerId(null)
    setEditedNote("")
  }

  const handleApplyFilters = () => {
    // Build filter parameters
    const filters: any = {}

    if (startDateFilter) {
      filters.startDate = format(startDateFilter, "yyyy-MM-dd")
    }

    if (endDateFilter) {
      filters.endDate = format(endDateFilter, "yyyy-MM-dd")
    }

    if (projectFilter) {
      filters.project = projectFilter
    }

    if (clientFilter) {
      filters.client = clientFilter
    }

    if (taskFilter) {
      filters.task = taskFilter
    }

    // Reset to first page when applying filters
    dispatch(fetchTimerHistory({ page: 1, filters }))
  }

  const handleClearFilters = () => {
    setStartDateFilter(undefined)
    setEndDateFilter(undefined)
    setProjectFilter("")
    setClientFilter("")
    setTaskFilter("")
    dispatch(fetchTimerHistory({ page: 1 }))
  }

  // Check if any filters are active
  const hasActiveFilters = !!(startDateFilter || endDateFilter || projectFilter || clientFilter || taskFilter)

  // Using columnHelper for better type safety
  const columnHelper = createColumnHelper<TimerWithOptionalFields>()

  const columns = useMemo(
    () => [
      columnHelper.accessor("task", {
        header: ({ column }) => (
          <div className="flex items-center whitespace-nowrap">
            Task
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
          </div>
        ),
        cell: (info) => <div className="whitespace-nowrap">{info.getValue()}</div>,
      }),
      columnHelper.accessor("project", {
        header: ({ column }) => (
          <div className="flex items-center whitespace-nowrap">
            Project
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
          </div>
        ),
        cell: (info) => <div className="whitespace-nowrap">{info.getValue() || "-"}</div>,
      }),
      columnHelper.accessor("client", {
        header: ({ column }) => (
          <div className="flex items-center whitespace-nowrap">
            Client
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
          </div>
        ),
        cell: (info) => <div className="whitespace-nowrap">{info.getValue() || "-"}</div>,
      }),
      columnHelper.accessor("startTime", {
        header: ({ column }) => (
          <div className="flex items-center whitespace-nowrap">
            Start Time
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
          </div>
        ),
        cell: (info) => <div className="whitespace-nowrap">{formatDate(info.getValue())}</div>,
        sortingFn: (a, b) => {
          const dateA = new Date(a.original.startTime).getTime()
          const dateB = new Date(b.original.startTime).getTime()
          return dateA - dateB
        },
      }),
      columnHelper.accessor("endTime", {
        header: ({ column }) => (
          <div className="flex items-center whitespace-nowrap">
            End Time
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
          </div>
        ),
        cell: (info) => {
          const value = info.getValue()
          return <div className="whitespace-nowrap">{value ? formatDate(value) : "Active"}</div>
        },
      }),
      columnHelper.accessor("duration", {
        header: ({ column }) => (
          <div className="flex items-center whitespace-nowrap">
            Duration
            <ArrowUpDownIcon
              className="w-4 h-4 ml-2 cursor-pointer"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            />
          </div>
        ),
        cell: (info) => <div className="whitespace-nowrap">{formatDuration(info.getValue())}</div>,
      }),
      columnHelper.accessor("note", {
        header: "Notes",
        cell: (info) => {
          const timer = info.row.original
          const timerId = timer.id

          if (editingTimerId === timerId) {
            return (
              <div className="flex flex-col gap-2 min-w-[200px]" onClick={(e) => e.stopPropagation()}>
                <Textarea
                  ref={textareaRef}
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  className="min-h-[80px] focus-visible:ring-2"
                  placeholder="Add a note..."
                  autoFocus
                  onFocus={(e) => {
                    // Set cursor at the end of text
                    const value = e.target.value
                    e.target.value = ""
                    e.target.value = value
                  }}
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleSaveNote} className="flex items-center gap-1">
                    <CheckIcon className="w-3 h-3" />
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="flex items-center gap-1">
                    <XIcon className="w-3 h-3" />
                    Cancel
                  </Button>
                </div>
              </div>
            )
          }

          return (
            <div className="flex items-center gap-2 min-w-[200px]">
              <div className="flex-1 break-words">{timer.note || "-"}</div>
              <div className="flex gap-1 shrink-0">
                <Button size="sm" variant="ghost" onClick={() => handleEditNote(timer)} className="w-8 h-8 p-0">
                  <PencilIcon className="w-4 h-4" />
                </Button>
                {timer.note && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteNote(timerId)}
                    className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )
        },
      }),
    ],
    [editingTimerId, editedNote],
  )

  const table = useReactTable({
    data: uniqueTimerHistory,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            Timer History
          </div>
          <div className="flex items-center gap-2">
            <FilterPanel
              title="Filter History"
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            >
              <DateRangeFilter
                startDate={startDateFilter}
                endDate={endDateFilter}
                onStartDateChange={setStartDateFilter}
                onEndDateChange={setEndDateFilter}
              />

              <TextFilter
                value={projectFilter}
                onChange={setProjectFilter}
                label="Project"
                placeholder="Filter by project..."
                className="mt-4"
              />

              <TextFilter
                value={clientFilter}
                onChange={setClientFilter}
                label="Client"
                placeholder="Filter by client..."
                className="mt-4"
              />

              <TextFilter
                value={taskFilter}
                onChange={setTaskFilter}
                label="Task"
                placeholder="Filter by task..."
                className="mt-4"
              />
            </FilterPanel>
          </div>
        </CardTitle>
        <CardDescription>View your past time tracking sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {historyLoading ? (
          <div className="space-y-2">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        ) : uniqueTimerHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <ClockIcon className="w-12 h-12 mb-2" />
            <p>No timer history found</p>
            <p className="text-sm">Start tracking time to see your history here</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border rounded-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b">
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-4 py-3 font-semibold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center py-4 mt-4 space-x-2">
                <div className="inline-flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </Button>
                  <span className="px-2 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}