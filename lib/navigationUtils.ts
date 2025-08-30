// import { LuCalendar, LuScroll, LuUsers } from "react-icons/lu";
// import { Building2, PersonStandingIcon } from "lucide-react";
// import { useSearchParams } from "next/navigation";
// import React from "react";

// export const viewTags = [
//     { tag: "Shifts", icon: <LuCalendar size={26} /> },
//     { tag: "Notes", icon: <LuScroll size={26} /> },
//     { tag: "Students", icon: <PersonStandingIcon size={26} /> },
//     { tag: "Documents", icon: <LuScroll size={26} /> },
//     { tag: "Mentors", icon: <LuUsers size={26} /> },
//     { tag: "Sites", icon: <Building2 size={26} /> },
// ];

// export const viewTitle = () => {
//     // This hook needs to be called inside a functional component
//     const searchParams = useSearchParams();
//     switch (searchParams.get('view')) {
//         case '0':
//             return <span className="flex flex-row gap-2 items-center justify-center">Shifts</span>;
//         case '1':
//             return <span className="flex flex-row gap-2 items-center justify-center">Notes</span>;
//         case '2':
//             return <span className="flex flex-row gap-2 items-center justify-center">Students</span>;
//         case '3':
//             return <span className="flex flex-row gap-2 items-center justify-center">Documents</span>;
//         case '4':
//             return <span className="flex flex-row gap-2 items-center justify-center">Mentor</span>;
//         case '5':
//             return <span className="flex flex-row gap-2 items-center justify-center">Sites</span>;
//         case '6':
//             return <span className="flex flex-row gap-2 items-center justify-center">Account</span>;
//         default:
//             return <span className="flex flex-row gap-2 items-center justify-center">Shifts</span>;
//     }
// };