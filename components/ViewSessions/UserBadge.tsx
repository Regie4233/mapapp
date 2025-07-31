import { getLetterColor } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from 'next/image';
import { AuthUser, Student, UserPool } from '@/lib/type';

export default function UserBadge({ size, initials, person, tooltip = true }: { size: number, initials: string[], person: AuthUser | Student | UserPool, tooltip?: boolean }) {

    // const imageSource = avatarUrl ? process.env.NEXT_PUBLIC_PB_IMAGE_URL + avatarUrl : '';
    const imageSource = person.avatar ? process.env.NEXT_PUBLIC_PB_IMAGE_URL + person.id + '/' + person.avatar : '';
    return (
        <>
            {
                tooltip ?
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className={`flex flex-row items-center font-semibold justify-center rounded-full `} style={{ height: `${size}px`, width: `${size}px`, backgroundColor: getLetterColor(initials[0]) }}>
                                    {
                                         imageSource.length > 0 ?
                                        <Image src={imageSource} alt="User Avatar" width={size} height={size} className="rounded-full object-cover" priority/>
                                            :
                                        initials.map((initial, index) => (
                                            <span key={index} className="text-white text-lg">{initial}</span>
                                        ))
                                    }
                                </div></TooltipTrigger>
                            <TooltipContent>
                                {
                                    initials.map((initial, index) => (
                                        <span key={index} className="text-white text-lg">{initial}</span>
                                    ))
                                }
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    :
                    <div className={`flex flex-row items-center font-semibold justify-center h-[${size}px] w-[${size}px] rounded-full `} style={{ height: `${size}px`, width: `${size}px`, backgroundColor: getLetterColor(initials[0]) }}>
                        {
                             imageSource.length > 0 ?
                                <Image src={imageSource} alt="User Avatar" width={size} height={size} className="rounded-full object-cover" priority/>
                                :
                            initials.map((initial, index) => (
                                <span key={index} className="text-white text-lg">{initial}</span>
                            ))
                        }
                    </div>
            }
        </>



    )
}
