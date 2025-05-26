import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

function ViewSessionSkeleton() {

    return (
        <main className="px-4 flex flex-col gap-3 border-b-[1.2px] py-8 border-b-gray-200 bg-white">
            <section className="flex flex-row justify-between">
                <h2 className=" text-lg font-semibold"><Skeleton className="h-4 w-[100px]" /></h2>
                <div className="flex flex-row gap-2"><IoIosArrowBack size={22}/> <IoIosArrowForward size={22} /></div>
            </section>
            <section className="grid grid-cols-7 gap-2">
                <Skeleton className="h-14 w-[250px]s" />
                <Skeleton className="h-14 w-[250px]s" />
                <Skeleton className="h-14 w-[250px]s" />
                <Skeleton className="h-14 w-[250px]s" />
                <Skeleton className="h-14 w-[250px]s" />
                <Skeleton className="h-14 w-[250px]s" />
                <Skeleton className="h-14 w-[250px]s" />

            </section>
        </main >
    )
}

export default ViewSessionSkeleton
