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
import { Building2, PersonStandingIcon } from "lucide-react";
import Image from "next/image";

const viewTags = [
    { tag: "Shifts", icon: <LuCalendar size={26} /> },
    { tag: "Notes", icon: <LuScroll size={26} /> },
    { tag: "Students", icon: <PersonStandingIcon size={26} /> },
      { tag: "Documents", icon: <LuScroll size={26} /> },
    { tag: "Mentors", icon: <LuUsers size={26} /> },
    { tag: "Sites", icon: <Building2 size={26} /> },
  

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
    const viewTitle = () => {
        switch (searchParams.get('view')) {
            case '0':
                return <span className="flex flex-row gap-2 items-center justify-center">Shifts</span>
            case '1':
                return <span className="flex flex-row gap-2 items-center justify-center">Notes</span>
            case '2':
                return <span className="flex flex-row gap-2 items-center justify-center">Students</span>
            case '3':
                return <span className="flex flex-row gap-2 items-center justify-center">Documents</span>
            case '4':
                return <span className="flex flex-row gap-2 items-center justify-center">Mentor</span>
            case '5':
                return <span className="flex flex-row gap-2 items-center justify-center">Sites</span>
            case '6':
                return <span className="flex flex-row gap-2 items-center justify-center">Account</span>
            default:
                return <span className="flex flex-row gap-2 items-center justify-center">Shifts</span>
        }
    }

    const handleLogoff = () => {
        dispatch(clearAuthUser());
        signOut();
    }
    if (!authData) return;
    return (
        <nav className="flex flex-row justify-between items-center">
            <section className="flex flex-row gap-5 px-4">
                <Sheet>
                    <SheetTrigger><TfiAlignRight size={42} className="bg-[#FDC52A] p-2 rounded-md" /></SheetTrigger>
                    <SheetContent side="left" className="w-1/2 bg-[#FDC52A]">
                        <SheetHeader>
                            <SheetTitle className="text-2xl"></SheetTitle>
                            <SheetDescription>
                            </SheetDescription>
                        </SheetHeader>
                        <ul className="p-4 text-2xl flex flex-col gap-5 my-22">
                            {
                                viewTags.map((tag, index) => {
                                    if (tag.tag === "Mentors" && authData.privilage !== 'admin') return null;
                                    if (tag.tag === "Sites" && authData.privilage !== 'admin') return null;
                                    return (
                                        <SheetClose key={index} className="flex flex-row justify-end gap-2 items-center" onClick={() => router.push(pathname + '?' + createQueryString('view', index.toString()))}>
                                            <p>{tag.tag}</p>
                                            {tag.icon}
                                        </SheetClose>
                                    )
                                })
                            }
                        </ul>
                        {/*  */}
                        <SheetFooter>
                            <div className="flex flex-col ">
                                <Image src="/PromiseLink-bg-rem.png" alt="Company Logo" width={50} height={50} className="rounded-full mb-2" />

                            </div>
                            <p className="text-end text-muted-foreground text-xs">1.0</p>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                <h2 className="font-semibold text-3xl flex items-center">{viewTitle()}</h2>
            </section>
            <section>
                <DropdownMenu>
                    <DropdownMenuTrigger className="p-4">
                        {
                            authData &&
                            <UserBadge size={50} initials={[authData.firstname[0], authData.lastname[0]]} person={authData} tooltip={false} />
                        }
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="-my-10 mx-12">
                        <DropdownMenuLabel>{authData?.firstname} {authData?.lastname}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(pathname + '?' + createQueryString('view', '5'))}>Account</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleLogoff()}>Sign Out</DropdownMenuItem>
                    </DropdownMenuContent>

                </DropdownMenu>
            </section>
        </nav>
    )
}
