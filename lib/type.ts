export interface Shift {
    booked: boolean;
    booked_by: number;
    created_at: Date;
    id: number;
    location: string;
    notes: [];
    pending_boolean: boolean;
    requested_by: number;
    shift_date: string;
    shift_id: number;
    time_start: string;
    time_end: string;
    updated_at: Date;
}