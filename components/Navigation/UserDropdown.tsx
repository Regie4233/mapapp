'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserBadge from "../ViewSessions/UserBadge";
import { signOut } from "@/lib/server/auth";
import { clearAuthUser } from "@/lib/store/states/sessionsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function UserDropdown() {
    const dispatch = useAppDispatch();
       const handleLogoff = () => {
        dispatch(clearAuthUser());
        signOut();
    }
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
    return (
        <section>
            <DropdownMenu>
                <DropdownMenuTrigger className="p-3">
                    {
                        authData &&
                        <UserBadge size={33} initials={[authData.firstname[0], authData.lastname[0]]} person={authData} tooltip={false} />
                    }
                </DropdownMenuTrigger>
                <DropdownMenuContent className="-my-10 mx-12">
                    <DropdownMenuLabel>{authData?.firstname} {authData?.lastname}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(pathname + '?' + createQueryString('view', '6'))}>Account</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleLogoff()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </section>
    );
}
