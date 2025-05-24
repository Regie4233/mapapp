'use client'
import React from "react"
import { useSearchParams } from 'next/navigation'
export default function ViewController({ children }: { children: React.ReactNode }) {
    const params = useSearchParams();
    const childIndex = parseInt(params.get('view') || "0");
    const childrenArray = React.Children.toArray(children);
    const selectedChild = childrenArray[childIndex]
    return (
        selectedChild
    )
}
