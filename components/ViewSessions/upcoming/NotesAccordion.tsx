'use client'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateNote } from "@/lib/store/states/sessionsSlice";
import { Shift } from "@/lib/type";
import { useState } from "react";

export default function NotesAccordion({ shift }: { shift: Shift }) {
    const [editMode, setEditMode] = useState(false);
    // usestates for the textareas changes
    const [students, setStudents] = useState(shift.expand.notes.students);
    const [workedOnToday, setWorkedOnToday] = useState(shift.expand.notes.worked_on_today);
    const [struggleWithAnything, setStruggleWithAnything] = useState(shift.expand.notes.struggle_with_anything);
    const [anyWinsToday, setAnyWinsToday] = useState(shift.expand.notes.any_wins_today);
    const authUser = useAppSelector(state => state.sessions.authUser);

    const dispatch = useAppDispatch();


    // a handler that creates a formdata based on the textareas
    const handleSubmit = async () => {

        try {
            const formData = new FormData();
            formData.append('shift_id', shift.id.toString())
            formData.append('students', students);
            formData.append('worked_on_today', workedOnToday);
            formData.append('struggle_with_anything', struggleWithAnything);
            formData.append('any_wins_today', anyWinsToday);
            formData.append('noteId', shift.expand.notes.id);
            shift.approved.forEach(element => {
                formData.append('mentors', element);
            });
            // if the shift has no notes, create a new note     
            if (shift.expand.notes.id === undefined || shift.expand.notes.id === null || shift.expand.notes.id === "") {
                formData.append('shiftId', shift.id.toString());
                formData.append('noteId', '0');
            } else {
                formData.append('shiftId', shift.id.toString());
                formData.append('noteId', shift.expand.notes.id);
            }
            dispatch(updateNote(formData))
            setEditMode(false);
        } catch (error) {
            console.log("Failed to submit notes", error);
        }
    }

    if (authUser === null) return <p className="text-red-500">You must be logged in to view notes.</p>
    return (
        <Accordion type="single" dir="rtl" collapsible className="w-full">
            <AccordionItem value="item-1" className="place-self-center w-full">
                <AccordionContent className="flex flex-col gap-6">
                    <section>
                        <h4 className="font-bold mb-1">Which students did you mentor today?</h4>
                        <p>
                            {
                                !editMode ?
                                    students || "No notes available for this shift."
                                    :
                                    <Textarea className="w-full" value={students} onChange={(e) => setStudents(e.target.value)} />
                            }
                        </p>
                    </section>
                    <section>
                        <h4 className="font-bold mb-1">What did you and your students work on today?</h4>
                        {
                            editMode && <p className="mb-2 text-gray-500">Include any challenges they faced and wins they achieved.
                                Our AI will automatically organize your responses into a structured notes for each student
                            </p>
                        }
                        <p>
                            {
                                !editMode ?
                                    workedOnToday || "No notes available for this shift."
                                    :
                                    <Textarea className=" w-full" value={workedOnToday} onChange={(e) => setWorkedOnToday(e.target.value)} />
                            }
                        </p>
                    </section>
                    <section>
                        <h4 className="font-bold mb-1">Did students struggle with anything?</h4>
                        {
                            !editMode ?
                                <p>
                                    {struggleWithAnything || "No notes available for this shift."}
                                </p>
                                :
                                <Textarea className="w-full" value={struggleWithAnything} onChange={(e) => setStruggleWithAnything(e.target.value)} />
                            // <textarea className="h-32x w-full" defaultValue={shift.expand.notes.struggle_with_anything} />
                        }

                    </section>
                    <section>
                        <h4 className="font-bold mb-1">Did students have any wins today?</h4>
                        <p>
                            {
                                !editMode ?
                                   anyWinsToday|| "No notes available for this shift."
                                    :
                                    <Textarea className="w-full" value={anyWinsToday} onChange={(e) => setAnyWinsToday(e.target.value)} />
                            }
                        </p>
                    </section>
                    {/* {
                        shift.expand.notes?.id === undefined || shift.expand.notes?.id === null || shift.expand.notes?.id === "" ?
                            <p className="text-gray-500">No notes available for this shift.</p>
                            :
                            <section >
                                <p className="">{shift.expand.notes.summarized.keyNotes}</p>
                                <ul>
                                    {
                                        shift.expand.notes.summarized.students.map((student, index) => {
                                            return (
                                                <li key={index} className="mb-2 border-b pb-2">
                                                    <strong>{student.name}</strong>
                                                    <p>Strengths: {student.strengths.join(', ')}</p>
                                                    <p>Challenges: {student.challenges.join(', ')}</p>
                                                    <p>Notes: {student.notes.join(', ')}</p>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </section>
                    } */}
                    {
                        // logic if owned by user
                        (shift.approved.includes(authUser?.id.toString())) && (
                            !editMode ?
                                <Button onClick={() => setEditMode(!editMode)} className="bg-[#0A5FA3] py-5">Edit Session Notes</Button>
                                :

                                <Button onClick={() => handleSubmit()} className="bg-[#0A5FA3] py-5">Finish Editing</Button>
                        )
                    }
                </AccordionContent>
                <AccordionTrigger className="border bg-[#E2E8F0] py-3">View Session Notes</AccordionTrigger>
            </AccordionItem>
        </Accordion>
    )
}
