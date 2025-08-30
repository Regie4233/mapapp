import React, { useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Shift } from "@/lib/type";
import { convertTo12HourFormat, formatDateToMonthYear } from "@/lib/utils";
import ShiftDetails from "@/components/ViewSessions/Upcoming/ShiftDetails";
import UserBadge from "../ViewSessions/UserBadge";
import StatusBadge from "./RequestBadge";

interface AdminShiftTableProps {
    data: Shift[];
}

export const AdminShiftTable: React.FC<AdminShiftTableProps> = ({ data }) => {
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);

   

    const columns: ColumnDef<Shift>[] = [
        {
            accessorKey: "title",
            header: "Shift Title",
            cell: ({ row }) => row.original.title || "Session",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => row.original.spots <= 0 ? <StatusBadge count={0} showFull={true}/>  :<StatusBadge count={row.original.pending_approval.length} showFull={false}/>,
        },
        {
            accessorKey: "shift_date",
            header: "Date",
            cell: ({ row }) => formatDateToMonthYear(new Date(row.original.shift_date), true),
        },
        {
            accessorKey: "shift_time",
            header: "Time",
            cell: ({ row }) => `${convertTo12HourFormat(row.original.shift_start)} - ${convertTo12HourFormat(row.original.shift_end)}`,
        },
        {
            accessorKey: "location",
            header: "Location",
            cell: ({ row }) => row.original.expand?.location?.name || "N/A",
        },
        {
            accessorKey: "approved_mentors",
            header: "Mentors",
            cell: ({ row }) => (
                <ul className="flex flex-wrap gap-x-2 text-sm">
                    {row.original.expand?.approved && row.original.expand.approved.length > 0 ? (
                        row.original.expand.approved.map(mentor => (
                            <li key={mentor.id}> <UserBadge size={33} initials={[mentor.firstname[0], mentor.lastname[0]]} person={mentor} tooltip={false} />
                                {/* {mentor.firstname} {mentor.lastname} */}
                            </li>
                        ))
                    ) : (
                        <li>No mentors</li>
                    )}
                </ul>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleRowClick = (shift: Shift) => {
        setSelectedShift(shift);
        setIsDetailsSheetOpen(true);
    };

    return (
        <div className="rounded-md border col-span-full m-4">
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
                                );
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
                                onClick={() => handleRowClick(row.original)}
                                className="cursor-pointer"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {selectedShift && (
                <ShiftDetails
                    shift={selectedShift}
                    open={isDetailsSheetOpen}
                    setOpen={setIsDetailsSheetOpen}
                />
            )}
        </div>
    );
};