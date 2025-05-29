import { useState } from "react";
import { NoteField } from "./NotesField";

export const NotesEditor = ({shiftId, hasNotes}: {shiftId: number, hasNotes: boolean}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            {
                open ?
                    <NoteField shiftId={shiftId} />
                    :
                    <button onClick={() => setOpen(true)} className="bg-slate-700 text-white px-4 py-2 rounded-md m-auto w-full">{hasNotes ? "Update Notes" : "Add Notes"}</button>
            }
        </>

    )
}

