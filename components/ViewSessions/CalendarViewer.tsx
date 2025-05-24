'use client'
import React from 'react'
import { CVTabs, CVTabsContent, CVTabsList, CVTabsTrigger } from '../ui/cvtabs'
import WeekSelector from './WeekSelector'
import ShiftRenderer from './ShiftRenderer'
export default function CalendarViewer() {
    
    return (
        <>
            <CVTabs defaultValue="upcoming" className="gap-0">
                <CVTabsList className='w-full rounded-none bg-white'>
                    <CVTabsTrigger value="upcoming">Upcoming</CVTabsTrigger>
                    <CVTabsTrigger value="scheduled">Scheduled(0)</CVTabsTrigger>
                    <CVTabsTrigger value="pastsession">Past Sessions</CVTabsTrigger>
                </CVTabsList>
                <CVTabsContent value="upcoming">
                    <WeekSelector />
                    <ShiftRenderer/>
                </CVTabsContent>
                <CVTabsContent value="scheduled">
                    Change your password here.
                </CVTabsContent>
                <CVTabsContent value="pastsession">
                    Change your password here.
                </CVTabsContent>
            </CVTabs>

        </>
    )
}
