'use client';

import { useDispatch } from "react-redux"
import { Suspense, useEffect } from "react";
import { setAuthUser } from "@/lib/store/states/sessionsSlice";
import ShiftsViewer from "@/components/ViewSessions/Upcoming/ShiftsViewer";
import ViewController from "@/components/Navigation/ViewController";
import { useAppSelector } from "@/lib/hooks";
import DashboardSkeleton from "@/components/shared/DashboardSkeleton";
import NotesViewer from "@/components/ViewNotes/NotesViewer";
import MentorViewer from "@/components/ViewMentor/MentorViewer";
import StudentsViewer from "@/components/ViewStudents/StudentsViewer";
import SitesViewer from "@/components/ViewSites/SiteViewer";
import AccountView from "@/components/ViewAccount/AccountView";
import NotAuthorized from "@/components/authentication/NotAuthorized";
import NoAccess from "@/components/authentication/NoAccess";

export default function DashboardPage() {
    const dispatch = useDispatch();
    const authUser = useAppSelector(state => state.sessions.authUser)

    // NEED TO FETCH AUTH USER ONCE ~ maybe using a custom hook?
    useEffect(() => {
        (async () => {
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
        })();

    }, [dispatch])



    if (!authUser) return <DashboardSkeleton />
    if (!authUser.authorized) return <NotAuthorized />

    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <ViewController>
                <ShiftsViewer />
                <NotesViewer />
                <StudentsViewer />
                {authUser.privilage === 'admin' ? <MentorViewer /> : <NoAccess />}
                {authUser.privilage === 'admin' ? <SitesViewer /> : <NoAccess />}
                <AccountView />
            </ViewController>
        </Suspense>
    );
}