import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust path if your shadcn/ui setup is different
import { Input } from "@/components/ui/input"; // Adjust path if your shadcn/ui setup is different

// Define interfaces for Student and Note
interface Student {
  id: string;
  name: string;
}

interface Note {
  id: string;
  date: string; // Expected format: "YYYY-MM-DD"
  title: string;
  content: string;
  students: Student[];
}

// Mock data for demonstration
// In a real app, this would likely come from props, context, or an API call
const mockStudents: Student[] = [
  { id: 's1', name: 'Alice Wonderland' },
  { id: 's2', name: 'Bob The Builder' },
  { id: 's3', name: 'Charlie Brown' },
  { id: 's4', name: 'Diana Prince' },
];

const mockNotes: Note[] = [
  {
    id: 'n1',
    date: '2023-10-26',
    title: 'Math Session Review',
    content: 'Reviewed algebra basics and upcoming test materials. Covered polynomials and quadratic equations.',
    students: [mockStudents[0], mockStudents[1]], // Alice, Bob
  },
  {
    id: 'n2',
    date: '2023-10-27',
    title: 'History Lecture Notes',
    content: 'Covered the French Revolution period, key figures, and major events.',
    students: [mockStudents[2]], // Charlie
  },
  {
    id: 'n3',
    date: '2023-10-27',
    title: 'Science Lab Report Prep',
    content: 'Experiment on photosynthesis. Outlined report structure and data collection methods.',
    students: [mockStudents[0], mockStudents[3]], // Alice, Diana
  },
  {
    id: 'n4',
    date: '2023-10-28',
    title: 'Book Club Discussion Points',
    content: 'Discussed "To Kill a Mockingbird", focusing on themes of justice and prejudice.',
    students: [mockStudents[1], mockStudents[2], mockStudents[3]], // Bob, Charlie, Diana
  },
];

export default function NotesView() {
  const [searchTerm, setSearchTerm] = useState('');
  // In a real app, 'notes' would likely be passed as a prop or fetched.
  const [notes, setNotes] = useState<Note[]>(mockNotes);

  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) {
      return notes;
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase();

    return notes.filter(note => {
      const dateMatches = note.date.includes(lowercasedSearchTerm);
      const studentMatches = note.students.some(student =>
        student.name.toLowerCase().includes(lowercasedSearchTerm)
      );
      return dateMatches || studentMatches;
    });
  }, [notes, searchTerm]);

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString + 'T00:00:00'); // Ensure correct parsing as local date
    return dateObj.toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">View Notes</h1>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by date (YYYY-MM-DD) or student name..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="max-w-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px] text-gray-600">Date</TableHead>
            <TableHead className="text-gray-600">Title</TableHead>
            <TableHead className="text-gray-600">Content Snippet</TableHead>
            <TableHead className="text-gray-600">Students Involved</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <TableRow key={note.id} className="hover:bg-gray-50">
                <TableCell className="text-gray-700">{formatDate(note.date)}</TableCell>
                <TableCell className="font-medium text-gray-900">{note.title}</TableCell>
                <TableCell className="text-gray-600">{note.content.substring(0, 70)}{note.content.length > 70 ? '...' : ''}</TableCell>
                <TableCell className="text-gray-600">
                  {note.students.map(student => student.name).join(', ')}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-10">
                No notes found matching your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}