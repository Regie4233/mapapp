import { AuthRecord } from "pocketbase";

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

export interface WorkingDays {
    work_day: Date;
    shifts: Array<Shift>;
    location: string;
}

export interface PocketBaseUser {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    privilage: string;
    phone: string;
}

export interface AuthData {
    token: string;
    record: AuthRecord;
}