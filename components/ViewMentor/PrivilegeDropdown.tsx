import { useState } from 'react';
import { UserPool } from '@/lib/type';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface PrivilegeDropdownProps {
    mentor: UserPool;
    onMentorUpdate: (updatedMentor: UserPool) => void;
}

export default function PrivilegeDropdown({ mentor, onMentorUpdate }: PrivilegeDropdownProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePrivilegeChange = async (newPrivilege: string) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/mentors', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: mentor.id, privilage: newPrivilege }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update mentor privilege');
            }

            const updatedMentor = await response.json();
            onMentorUpdate(updatedMentor);
            toast.success(`Mentor privilege updated to ${newPrivilege}.`);
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'An error occurred.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Select defaultValue={mentor.privilage || 'limited'} onValueChange={handlePrivilegeChange} disabled={isSubmitting}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select privilege" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
        </Select>
    );
}