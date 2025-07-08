import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shift } from "@/lib/type";

export default function NoteEditorV2({ shift }: { shift: Shift }) {
    return (
        <main>
            <section>
                <h4 className="font-semibold mb-1">Which students did you mentor today?</h4>
                <Input />
            </section>
            <section>
                <h4 className="font-semibold mb-1">What did you and your students work on today?</h4>
                <p className="mb-2 text-gray-500">Include any challenges they faced and wins they achieved.
                    Our AI will automatically organize your responses into a structured notes for each student
                </p>
                <Textarea className="h-32x" />
            </section>
            <section>
                <h4 className="font-semibold mb-1">Did students struggle with anything?</h4>
                <Textarea className="h-32x" />
            </section>
            <section>
                <h4 className="font-semibold mb-1">Did students have any wins today?</h4>
                <Textarea className="h-32x" />
            </section>
            {
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
            }
        </main>
    )
}
