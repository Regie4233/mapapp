import { getLetterColor } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


export default function UserBadge({ size, initials, tooltip = true }: { size: number, initials: string[], tooltip?: boolean }) {
    
    return (
        <>
            {
                tooltip ?
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className={`flex flex-row items-center font-semibold justify-center rounded-full `} style={{ height: `${size}px`, width: `${size}px`, backgroundColor: getLetterColor(initials[0]) }}>
                                    {
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
                            initials.map((initial, index) => (
                                <span key={index} className="text-white text-lg">{initial}</span>
                            ))
                        }
                    </div>
            }
        </>



    )
}
