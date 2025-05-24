import { AuthUser, UserPool } from '@/lib/type'
import { getLetterColor } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


export default function UserBadge({ size, user, tooltip = true }: { size: number, user: UserPool | AuthUser | null, tooltip?: boolean }) {
    if (user === null) return;
    return (
        <>
            {
                tooltip ?
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className={`flex flex-row items-center font-semibold justify-center h-${size} w-${size} rounded-full border-2 border-white`} style={{ backgroundColor: getLetterColor(user.lastname[0]) }}>
                                    {user.firstname[0]}{user.lastname[0]}
                                </div></TooltipTrigger>
                            <TooltipContent>
                                {user.firstname} {user.lastname}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider> 
                    :
                    <div className={`flex flex-row items-center font-semibold justify-center h-${size} w-${size} rounded-full border-2 border-white`} style={{ backgroundColor: getLetterColor(user.lastname[0]) }}>
                        {user.firstname[0]}{user.lastname[0]}
                    </div>
            }
        </>



    )
}
