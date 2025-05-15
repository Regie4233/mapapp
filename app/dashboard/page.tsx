'use client'
import WeeklyUserCalendar from "@/components/WeeklyUserCalendar"
import { UseDispatch } from "react-redux"
import { useAppSelector } from "@/lib/hooks"
import { redirect } from "next/navigation";
export default function Dashboard() {
    // const dispatch = UseDispatch();
    const authUser = useAppSelector((state) => state.sessions.authUser);
    if(authUser === null) {
        redirect('/login');
    }
    return (
        <main>
            <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
            <p className="text-center mb-4">This is a placeholder please delete this code</p>
         
            {/* <WeeklyUserCalendar /> */}

        </main>
    )
}
