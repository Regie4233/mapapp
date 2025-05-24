'use client'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { TfiAlignRight } from "react-icons/tfi";
import { LuCalendar, LuScroll, LuUsers } from "react-icons/lu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import UserBadge from "../ViewSessions/UserBadge";
import { signOut } from "@/lib/server/auth";
import { clearAuthUser } from "@/lib/store/states/sessionsSlice";
const viewTags = [
    { tag: "Shifts", icon: <LuCalendar /> },
    { tag: "Notes", icon: <LuScroll /> },
    { tag: "Mentors", icon: <LuUsers /> },
    // {tag: "Settings", icon: <LuScroll /> }
]



export default function Navbar() {
    const dispatch = useAppDispatch()
    const authData = useAppSelector(state => state.sessions.authUser);
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    const handleLogoff = () => {
        dispatch(clearAuthUser());
        signOut();
    }

    return (
        <nav className="flex flex-row justify-between items-center">
            <DropdownMenu>
                <DropdownMenuTrigger className="p-4">
                    {
                        authData &&
                        <UserBadge size={12} user={authData} tooltip={false} />
                    }
                </DropdownMenuTrigger>
                <DropdownMenuContent className="-my-10 mx-12">
                    <DropdownMenuLabel>{authData?.firstname} {authData?.lastname}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleLogoff()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>
            <section className="flex flex-row gap-5 p-4">
                <h2 className="font-semibold text-xl">Shifts</h2>
                <Sheet>
                    <SheetTrigger><TfiAlignRight size={24} /></SheetTrigger>
                    <SheetContent side="right" className="w-1/2 bg-slate-200">
                        <SheetHeader>
                            <SheetTitle className="text-2xl"></SheetTitle>
                            <SheetDescription>
                            </SheetDescription>
                        </SheetHeader>
                        <ul className="p-4 text-3xl flex flex-col gap-5 my-22">
                            {
                                viewTags.map((tag, index) => {
                                    return (
                                        <SheetClose key={index} className="flex flex-row justify-end gap-2 items-center" onClick={() => router.push(pathname + '?' + createQueryString('view', index.toString()))}>
                                            <p >{tag.tag}</p>
                                            {tag.icon}
                                        </SheetClose>
                                    )
                                })
                            }
                        </ul>
                        {/*  */}
                        <SheetFooter>
                            <div className="h-15 w-15 rounded-full bg-amber-300 flex items-center justify-center text-xl">
                                Ic
                            </div>
                        </SheetFooter>
                    </SheetContent>

                </Sheet>
            </section>
        </nav>
    )
}
