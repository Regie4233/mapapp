'use client';

import { Student, ShiftLocation } from '@/lib/type';
import { useState, useEffect, useMemo } from 'react';
import { StudentCard } from './StudentCard'; // Uses the updated card
import StudentDetailsSheet from './StudentDetailSheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector, useDataFetcher } from '@/lib/hooks';

export default function StudentsView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);

  const allLocations = useAppSelector(state => state.sessions.allLocations);
  const { getAllLocations: fetchAllLocations } = useDataFetcher();

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(true);
        console.error("Failed to fetch students:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!allLocations || allLocations.length === 0) {
      fetchAllLocations();
    }
  }, [fetchAllLocations, allLocations]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  // Memoize the filtered results to avoid re-calculating on every render
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const nameMatch = !searchQuery ||
        `${student.name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const locationMatch = locationFilter === 'all' || (student.expand?.location?.id === locationFilter);

      return nameMatch && locationMatch;
    });
  }, [students, searchQuery, locationFilter]);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Use the new StudentDetailsSheet */}
      <StudentDetailsSheet
        student={selectedStudent}
        open={open}
        onOpenChange={setOpen}
      />

      <div className="max-w-2xl mx-auto p-4">
        {/* Search Control */}
        <div className="mb-6 sticky top-4 z-10 bg-white/80 backdrop-blur-sm p-2 -m-2 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by student name..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by location..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {allLocations.map((loc: ShiftLocation) => (
                  <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conditional Rendering: Loading, Error, or List */}
        {isLoading && <p className="text-center text-gray-500">Loading students...</p>}
        {error && <p className="text-center text-red-500">Error: Could not load students.</p>}

        {!isLoading && !error && (
          <ul className="space-y-3 md:grid md:grid-cols-2 gap-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                // Ensure props match the updated StudentCard component
                <StudentCard
                  key={student.id}
                  student={student}
                  handleSelectStudent={handleStudentSelect}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No students found.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}