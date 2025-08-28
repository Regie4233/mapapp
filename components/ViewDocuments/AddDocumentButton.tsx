import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const AddDocumentButton = ({ setOpen }: { setOpen: (args: boolean) => void }) => {
    return (
        <section className='w-full flex justify-center'>
            <Button onClick={() => setOpen(true)} className='w-11/12 md:w-3/6 h-[50px] bg-[#1d6eb9]'><PlusIcon />Add Document</Button>
        </section>
    )
}