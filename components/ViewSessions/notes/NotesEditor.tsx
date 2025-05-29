import { useState } from "react";
import { NoteField } from "./NotesField";
import { Progress } from "@/components/ui/progress"
import { useAppSelector } from "@/lib/hooks";

export const NotesEditor = ({shiftId, hasNotes}: {shiftId: number, hasNotes: boolean}) => {
    const [open, setOpen] = useState(false);
    const loadingState = useAppSelector(state => state.sessions.loading);
    if(loadingState !== "Idle") return (
        <>
    <Progress value={loadingState === "Idle" ? 33 : loadingState === "Pending State" ? 66: loadingState === "Fulfilled State" ? 83.33 : 100} />
    <p className="text-muted-foreground">Loading Please wait...</p>
    </>)
    return (
        <>
            {
                open ?
                    <NoteField shiftId={shiftId} setOpen={setOpen} />
                    :
                    <button onClick={() => setOpen(true)} className="bg-slate-700 text-white px-4 py-2 rounded-md m-auto w-full">{hasNotes ? "Update Notes" : "Add Notes"}</button>
            }
        </>

    )
}

