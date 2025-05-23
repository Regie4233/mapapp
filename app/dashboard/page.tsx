'use client';

import { useDispatch } from "react-redux"
import { useEffect } from "react";
import { setAuthUser } from "@/lib/store/states/sessionsSlice";
import TestUserInfo from "@/components/test_userinfo/TestUserInfo";
import CalendarViewer from "@/components/ViewSessions/CalendarViewer";

export default function DashboardPage() {
    const dispatch = useDispatch();

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

    return (
        <div className="">
            
          <TestUserInfo />
          <CalendarViewer />
        </div>
    );
}