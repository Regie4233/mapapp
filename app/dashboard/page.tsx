'use client';

import { useDispatch } from "react-redux"
import { useEffect } from "react";
import { setAuthUser } from "@/lib/store/states/sessionsSlice";
import CalendarViewer from "@/components/ViewSessions/CalendarViewer";
import ViewController from "@/components/Navigation/ViewController";
import TestNotesDash from "@/components/Notes/TestNotesDash";
import { useAppSelector } from "@/lib/hooks";
import DashboardSkeleton from "@/components/shared/DashboardSkeleton";

export default function DashboardPage() {
    const dispatch = useDispatch();
    const authUser = useAppSelector(state => state.sessions.authUser)
    useEffect(() => {
        const fetcher = async () => {
            const res = await fetch('/api/auth/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                console.error("Error fetching auth user");
                return;
            }
            const data = await res.json();
            const userData = data.userData;
            if (data.record === null) {
                console.error("No auth user found");
                return;
            }
            dispatch(setAuthUser(userData));
        }
        fetcher();
    }, [dispatch])
    if(!authUser) return <DashboardSkeleton />
    return (
        <ViewController>
            <CalendarViewer />
            <TestNotesDash />
        </ViewController>
    );
}