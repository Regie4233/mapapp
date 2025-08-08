import { Button } from "@/components/ui/button";

export const AddDocumentButton = ({ setOpen }: { setOpen: (args: boolean) => void }) => {
    return (
        <section className='w-full flex justify-center'>
            <Button onClick={() => setOpen(true)} className='w-[90%]'>Add Document</Button>
        </section>
    )
}