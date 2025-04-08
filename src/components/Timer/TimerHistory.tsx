"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch } from "../../redux/Store"
import {
  fetchTimerHistory,
  selectTimerHistory,
  selectHistoryLoading,
  selectTimerPagination,
} from "../../redux/slice/Timer"
import type { Timer } from "../../service/timerApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from 'lucide-react'
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, type ColumnDef } from "@tanstack/react-table"

export default function TimerHistory() {
  const dispatch = useDispatch<AppDispatch>()
  const timerHistory = useSelector(selectTimerHistory)
  const historyLoading = useSelector(selectHistoryLoading)
  const { totalPages, currentPage } = useSelector(selectTimerPagination)

  useEffect(() => {
    dispatch(fetchTimerHistory(1))
  }, [dispatch]) // Added dispatch to dependency array

  const handlePageChange = (page: number) => {
    dispatch(fetchTimerHistory(page))
  }

  const formatDate = (dateString: string | number | Date | undefined) => {
    if (!dateString) return ""; // Handle undefined case
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

  // Define the Timer interface explicitly to ensure type safety
  type TimerWithOptionalFields = {
    task: string;
    project?: string;
    client?: string;
    startTime: string;
    endTime?: string;
    duration: number;
    [key: string]: any; // For any other fields
  }

  // Using columnHelper for better type safety
  const columnHelper = createColumnHelper<TimerWithOptionalFields>()

  const columns = useMemo(() => [
    columnHelper.accessor("task", {
      header: "Task",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("project", {
      header: "Project",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("client", {
      header: "Client",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("startTime", {
      header: "Start Time",
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor("endTime", {
      header: "End Time",
      cell: (info) => {
        const value = info.getValue();
        return value ? formatDate(value) : "Active";
      },
    }),
    columnHelper.accessor("duration", {
      header: "Duration",
      cell: (info) => formatDuration(info.getValue()),
    }),
  ], [])

  const table = useReactTable({
    data: timerHistory as TimerWithOptionalFields[],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClockIcon className="mr-2 h-5 w-5" />
          Timer History
        </CardTitle>
        <CardDescription>View your past time tracking sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {historyLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : timerHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <ClockIcon className="mb-2 h-12 w-12" />
            <p>No timer history found</p>
            <p className="text-sm">Start tracking time to see your history here</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <table className="w-full text-left border-collapse">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b">
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="py-3 px-4 font-semibold">
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
                        <td key={cell.id} className="py-3 px-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 py-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}