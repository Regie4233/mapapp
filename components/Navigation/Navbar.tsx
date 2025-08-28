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


import { TfiAlignRight } from "react-icons/tfi";
import { LuCalendar, LuScroll, LuUsers } from "react-icons/lu";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
// import { signOut } from "@/lib/server/auth";
// import { clearAuthUser } from "@/lib/store/states/sessionsSlice";
import { Building2, PersonStandingIcon } from "lucide-react";
import Image from "next/image";
import DesktopNavbar from './DesktopNavbar';
import UserDropdown from "./UserDropdown";
// import UserDropdown from './UserDropdown';

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
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])
    // const dispatch = useAppDispatch()
    const authData = useAppSelector(state => state.sessions.authUser);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

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
                return 'Shifts'
            case '1':
                return 'Notes'
            case '2':
                return 'Students'
            case '3':
                return 'Documents'
            case '4':
                return 'Mentor'
            case '5':
                return 'Sites'
            case '6':
                return 'Account'
            default:
                return 'Shifts'
        }
    }

    // const handleLogoff = () => {
    //     dispatch(clearAuthUser());
    //     signOut();
    // }
    if (!isClient || !authData) return null;
    return (
        <nav className="basis-2/12 flex md:block flex-row justify-between items-center w-full">
            {/* Mobile Navigation */}
            <section className="flex flex-row gap-5 px-4 md:hidden">
                <Sheet>
                    <SheetTrigger><TfiAlignRight size={42} className="bg-[#FDC52A] p-2 rounded-md" /></SheetTrigger>
                    <SheetContent side="left" className="w-1/2 md:w-[12%] bg-[#FDC52A]">
                        <SheetHeader>
                            <SheetTitle className="text-2xl"></SheetTitle>
                            <SheetDescription>
                            </SheetDescription>
                        </SheetHeader>
                        <ul className="p-4 text-xl flex flex-col gap-5 my-22">
                            {
                                viewTags.map((tag, index) => {
                                    if (tag.tag === "Mentors" && authData.privilage !== 'admin') return null;
                                    if (tag.tag === "Sites" && authData.privilage !== 'admin') return null;
                                    return (
                                        <SheetClose key={index} className="flex flex-row justify-end gap-2 items-center" onClick={() => router.push(pathname + '?' + createQueryString('view', index.toString()))}>
                                            <p className="flex flex-row gap-2 items-center justify-center">{tag.tag}</p>
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
                            <p className="text-end text-muted-foreground text-xs">1.2</p>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                <h2 className="font-semibold text-3xl flex items-center">{viewTitle()}</h2>
            </section>

            {/* Desktop Navigation */}
            <DesktopNavbar
                viewTags={viewTags}
                authData={authData}
                router={router}
                pathname={pathname}
                createQueryString={createQueryString}
                viewTitle={viewTitle}
            />

            <div className="block md:hidden">
                <UserDropdown  />
            </div>

        </nav>
    )
}
