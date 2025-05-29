import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch } from "@/lib/hooks";
import { createNotes } from "@/lib/store/states/sessionsSlice";
import { useState } from "react";

export const NoteField = ({shiftId, setOpen}: {shiftId: number, setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [notes, setNotes] = useState("");
    const dispatch = useAppDispatch()
    const handleSubmit = () => {
        // Handle the submission of notes here
        console.log("Notes submitted:", notes.replace(/[\n\r]+/g, ''));
        // Reset the notes field after submission
        dispatch(createNotes({ notes: notes.replace(/[\n\r]+/g, ''), shiftId: shiftId.toString() })); // Replace with actual shift ID
        setNotes("");
        setOpen(false);
    }
    return (
        <>
            <ol className="font-semibold flex flex-col list-decimal gap-1 mx-4 mb-2">
                <li>What did you work on with each student today?</li>
                <li>Did each student struggle with anything</li>
                <li>Did each student have any wins?</li>
                <li>Are there any other notes would you like to add about your shift?</li>
            </ol>
            <Textarea className="w-full h-[330px]" placeholder="Type your message here." onChange={(e) => setNotes(e.target.value)} value={notes} />
            <button className="bg-slate-700 text-white px-4 py-2 rounded-md m-auto w-full mt-2" onClick={handleSubmit}>Submit Notes</button>
        </>
    )
}