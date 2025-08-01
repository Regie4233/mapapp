'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Shift, ListResult } from '@/lib/type';
import NotesCard from './NotesCard';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { useAppSelector, useDataFetcher } from '@/lib/hooks';
import { Label } from '../ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter, X } from 'lucide-react';
import NotesDetailSheet from './NotesDetailSheet';
import { toast } from 'sonner';

// Skeleton component for loading state, styled to match NotesCard
const NotesCardSkeleton = () => (
    <div className="m-4 p-6 bg-gray-50 rounded-xl flex flex-col gap-6 animate-pulse">
        <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-3/4 bg-gray-200" />
            <Skeleton className="h-4 w-1/2 bg-gray-200" />
        </div>
        <div className="flex flex-row gap-16 items-center">
            <div className="relative flex">
                <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
                <Skeleton className="h-8 w-8 rounded-full -ml-2 bg-gray-200" />
            </div>
            <Skeleton className="h-4 w-24 bg-gray-200" />
        </div>
    </div>
);

export default function NotesRenderer() {
    const [data, setData] = useState<ListResult<Shift> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [filters, setFilters] = useState({ notesOnly: true, location: '' });
    const [sort, setSort] = useState('newest');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [isDeleting, setIsDeleting] = useState(false)

    const allLocations = useAppSelector(state => state.sessions.allLocations);
    const { getAllLocations: fetchAllLocations } = useDataFetcher();

    useEffect(() => {
        if (!allLocations || allLocations.length === 0) {
            fetchAllLocations();
        }
    }, [fetchAllLocations, allLocations]);

    const fetchShiftsWithNotes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                perPage: perPage.toString(),
                sort: sort,
            });
            if (filters.notesOnly) {
                params.append('notesOnly', 'true');
            }
            if (filters.location) {
                params.append('location', filters.location);
            }
            const response = await fetch(`/api/calendar/shift/allshifts?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch shifts with notes');
            }
            const result = await response.json();
            setData(result.shifts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, perPage, filters, sort]);

    const handleDeleteNote = async (shift: Shift) => {
        if (!shift?.expand?.notes?.id || !shift?.id) {
            toast.error("Cannot delete: Missing note or shift information.");
            toast.dismiss();
            return;
        }
        console.log(shift.expand.notes.id, shift.id);

        setIsDeleting(true);
        const toastId = toast.loading("Deleting note...");
        setOpenDetails(false); // Close the sheet
        try {
            const response = await fetch('/api/notes/noai', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ noteId: shift.expand.notes.id, shiftId: shift.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete note.");
            }

            toast.success("Note deleted successfully.", { id: toastId });
            // go through the usestate data and remove the deleted note
            setData(prevData => {
                if (!prevData) return null;
                const newData = { ...prevData };
                newData.items = prevData.items.filter(item => item.id !== shift.id);
                return newData;
            });



            // Optionally dispatch a Redux action to remove the note from the state

        } catch (error) {
            if (error instanceof Error) {
  toast.error(error.message, { id: toastId });
            }
          
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchShiftsWithNotes();
    }, [fetchShiftsWithNotes]);

    const totalPages = data ? Math.ceil(data.totalItems / data.perPage) : 0;

    const handlePerPageChange = (value: string) => {
        setPerPage(parseInt(value, 10));
        setPage(1); // Reset to first page
    };

    const handleFilterChange = (key: keyof typeof filters, value: boolean | string) => {
        setPage(1); // Reset to first page on any filter change
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    const handleOpenSheet = (shift: Shift) => {
        setSelectedShift(shift);
        setOpenDetails(true);
    };


    const getLocationName = (locationId: string) => {
        return allLocations.find(loc => loc.id === locationId)?.name || 'Unknown Location';
    }

    return (
        <main className="p-4 md:p-6">
            <NotesDetailSheet shift={selectedShift} isOpen={openDetails} setIsOpen={setOpenDetails} isDeleting={isDeleting} handleDeleteNote={handleDeleteNote} />
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    {/* Filter Modal */}
                    <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filter</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Filter Notes</DialogTitle></DialogHeader>
                            <div className="py-4 grid gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={filters.notesOnly} onChange={(e) => handleFilterChange('notesOnly', e.target.checked)} />
                                    <span>Show only shifts with notes</span>
                                </label>
                                <div className="grid gap-2">
                                    <Label htmlFor="location-filter">Location</Label>
                                    <Select
                                        value={filters.location || 'all'}
                                        onValueChange={(value) => handleFilterChange('location', value === 'all' ? '' : value)}
                                    >
                                        <SelectTrigger id="location-filter">
                                            <SelectValue placeholder="Select a location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Locations</SelectItem>
                                            {allLocations.map((loc) => (
                                                <SelectItem key={loc.id} value={loc.id}>
                                                    {loc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    {/* Active Filter Badge */}
                    {filters.notesOnly && (
                        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Notes Only <button onClick={() => handleFilterChange('notesOnly', false)}><X className="h-3 w-3" /></button>
                        </div>
                    )}
                    {filters.location && (
                        <div className="flex items-center gap-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {getLocationName(filters.location)} <button onClick={() => handleFilterChange('location', '')}><X className="h-3 w-3" /></button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {/* Sort Select */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Sort by:</span>
                        <Select value={sort} onValueChange={(value) => { setSort(value); setPage(1); }}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest to Oldest</SelectItem>
                                <SelectItem value="oldest">Oldest to Newest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Per Page Select */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Show:</span>
                        <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue placeholder={perPage} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: perPage }).map((_, i) => <NotesCardSkeleton key={i} />)}
                </div>
            ) : error ? (
                <p className="text-center text-red-500 mt-10">{error}</p>
            ) : data && data.items.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {data.items.map((shift) => (
                        <NotesCard data={shift} key={shift.id} handleOpenSheet={handleOpenSheet} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted-foreground mt-10">No notes found matching your criteria.</p>
            )}

            {/* Pagination Controls */}
            {data && totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                    <Button onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
                        Previous
                    </Button>
                    <span className="text-sm font-medium">
                        Page {page} of {totalPages}
                    </span>
                    <Button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
                        Next
                    </Button>
                </div>
            )}
        </main>
    );
}
