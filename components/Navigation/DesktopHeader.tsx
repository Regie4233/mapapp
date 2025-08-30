'use client'
import UserDropdown from "./UserDropdown";
export default function DesktopHeader() {

    return (
        <section className="hidden md:flex flex-row justify-between items-center px-8">
            <h2 className="font-bold">Mentor a Promise</h2>
            <UserDropdown />
        </section>
    )
}
