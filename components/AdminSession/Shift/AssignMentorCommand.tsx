import { useAppSelector } from "@/lib/hooks";
import { UserPool } from "@/lib/type";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";


export default function AssignMentorCommand({ assignedMentors, setAssignedMentors }: { assignedMentors: UserPool[], setAssignedMentors: (mentors: UserPool[]) => void }) {
    const mentors = useAppSelector(state => state.sessions.allMentors);
    const [searchQuery, setSearchQuery] = useState("");
    const unassignedMentors = mentors.filter(m => !assignedMentors.some(am => am.id === m.id));
    const singleSelect = true;
    return (
        <Command className="mb-12">
            <CommandInput placeholder="Search for a mentor to assign..." value={searchQuery} onValueChange={setSearchQuery} />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {searchQuery.length > 0 &&
                        unassignedMentors.map((mentor) => (
                            <CommandItem
                                key={mentor.id}
                                value={mentor.firstname}
                                className="p-2 mb-2 bg-white border border-gray-200/80 rounded-xl shadow-sm"
                                onSelect={(currentValue) => {
                                    const mentorToAdd = unassignedMentors.find((m) => m.firstname === currentValue);
                                    if (mentorToAdd) {
                                        if(singleSelect) {
                                            setAssignedMentors([mentorToAdd]);
                                            setSearchQuery("");
                                            return;
                                        }
                                        setAssignedMentors([...assignedMentors, mentorToAdd]);
                                        setSearchQuery("");
                                    }
                                }}
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    <AvatarPlaceholder />
                                    <span className="font-medium">{mentor.firstname} {mentor.lastname}</span>
                                </div>
                            </CommandItem>
                        ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}


const AvatarPlaceholder = () => (
  <div className="h-10 w-10 rounded-full bg-gray-200" />
);