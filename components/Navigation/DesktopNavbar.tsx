
import React, { type JSX } from 'react';
import { useRouter} from 'next/navigation';
import { AuthUser } from '@/lib/type';

interface DesktopNavbarProps {
    viewTags: { tag: string; icon: JSX.Element }[];
    authData: AuthUser | null;
    router: ReturnType<typeof useRouter>;
    pathname: string;
    createQueryString: (name: string, value: string) => string;
    viewTitle: () => string;
}

export default function DesktopNavbar({ viewTags, authData, router, pathname, createQueryString, viewTitle }: DesktopNavbarProps) {
    if (!authData) return null;

    return (
        <nav className="hidden min-h-screen h-full md:flex flex-col justify-between items-center py-12  bg-[#FDC52A]">
            {/* <section className="flex flex-row justify-between gap-5 items-centers">
                <Image src="/PromiseLink-bg-rem.png" alt="Company Logo" width={50} height={50} className="rounded-full" />
                <h2 className="font-semibold text-3xl flex items-center">{viewTitle()}</h2>
            </section> */}
            <ul className="flex flex-col gap-5">
                {
                    viewTags.map((tag, index) => {
                        if (tag.tag === "Mentors" && authData.privilage !== 'admin') return null;
                        if (tag.tag === "Sites" && authData.privilage !== 'admin') return null;
                        return (
                            <li key={index}>
                                <button
                                    className={`flex flex-row gap-2 items-center text-xl hover:text-gray-700 ${viewTitle() === tag.tag && 'font-bold'}`}
                                    onClick={() => router.push(pathname + '?' + createQueryString('view', index.toString()))}
                                >
                                        {tag.icon}
                                    <p>{tag.tag}</p>
                                
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
        </nav>
    );
}