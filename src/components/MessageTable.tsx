import React, { useState } from 'react'
import { Message } from '@/model/User'
import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    columnFilteringFeature,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    filterFn_includesString,
    flexRender,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    tableFeatures,
    useTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Alert } from './DeleteAlert'
import { MoreHorizontal, ReplyIcon, ArrowUpDown, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from './ui/input'

const features = tableFeatures({
    columnFilteringFeature,
    rowSortingFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filterFns: { includesString: filterFn_includesString },
    sortFns: { alphanumeric: sortFn_alphanumeric },
})

type MessageTableProp = {
    data: Message[]
    onMessageDelete: (messageId: string) => void
}

function MessageTable({ data, onMessageDelete }: MessageTableProp) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns: ColumnDef<typeof features, Message>[] = [
        {
            accessorKey: "content",
            filterFn: "includesString",
            sortFn: "alphanumeric",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Content
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "createdAt",
            sortFn: "alphanumeric",
            header: ({ column }) => {
                return (
                    <div className='text-right'>
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Received
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const dateString = new Date(row.getValue("createdAt"))
                    .toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hour12: true
                    })
                return <div className="text-right">{dateString}</div>
            }
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const message = row.original
                return (
                    <Alert message={message} onMessageDelete={onMessageDelete} />
                    // <DropdownMenu>
                    //     <DropdownMenuTrigger asChild>
                    //         <Button variant="ghost" className="h-8 w-8 p-0">
                    //             <span className="sr-only">Open menu</span>
                    //             <MoreHorizontal className="h-4 w-4" />
                    //         </Button>
                    //     </DropdownMenuTrigger>
                    //     <DropdownMenuContent align="end">
                    //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    //         <Alert message={message} onMessageDelete={onMessageDelete} />
                    //         <DropdownMenuItem>
                    //             <ReplyIcon />
                    //         </DropdownMenuItem>
                    //     </DropdownMenuContent>
                    // </DropdownMenu>
                )

            }
        }
    ]

    const table = useTable({
        features,
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
    })

    return (
        <div>
            <div className="flex flex-row py-4 gap-2">
                <Input
                    placeholder="Search messages..."
                    value={(table.getColumn("content")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("content")?.setFilterValue(event.target.value)
                    }
                    className="flex-1 max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No Messages
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex'>
                <div className="flex-1 text-sm text-muted-foreground mt-1">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} message(s) selected.
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MessageTable