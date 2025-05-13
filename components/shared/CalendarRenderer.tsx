import { Shift } from '@/lib/type';
import React from 'react'

export default function CalendarRenderer({data}: {data: Shift[], limit: number}) {
    if (!data) return null;
    return (
        <div>CalendarRenderer</div>
    )
}
