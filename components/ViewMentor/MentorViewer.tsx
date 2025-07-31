'use client';

import { UserPool } from '@/lib/type';
import { useState, useEffect, useMemo } from 'react';
import { MentorCard } from './MentorCard';
import MentorDetailsSheet from './MentorDetailsSheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MentorViewer() {
  const [mentors, setMentors] = useState<UserPool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [authorizedFilter, setAuthorizedFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [selectedMentor, setSelectedMentor] = useState<UserPool | null>(null);
  const [open, setOpen] = useState(false);

  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/mentors');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMentors(data.users.items);
      } catch (err) {
        setError(true);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleMentorSelect = (mentor: UserPool) => {
    setSelectedMentor(mentor);
    setOpen(true);
  }

  const handleMentorUpdate = (updatedMentor: UserPool) => {
    // Update the mentor in the main list
    setMentors(prevMentors =>
      prevMentors.map(m => (m.id === updatedMentor.id ? updatedMentor : m))
    );

    // Update the selected mentor if it's the one being edited
    if (selectedMentor && selectedMentor.id === updatedMentor.id) {
      setSelectedMentor(updatedMentor);
    }
  };

  const handleMentorDelete = (mentorId: string) => {
    // Remove the mentor from the main list
    setMentors(prevMentors =>
      prevMentors.filter(m => m.id !== mentorId)
    );
  };

  // Memoize the filtered results to avoid re-calculating on every render
  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const nameMatch = !searchQuery || `${mentor.firstname} ${mentor.lastname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const authorizedMatch = authorizedFilter === 'all' ||
        (authorizedFilter === 'authorized' && mentor.authorized === true) ||
        (authorizedFilter === 'unauthorized' && mentor.authorized === false);

      const verifiedMatch = verifiedFilter === 'all' ||
        (verifiedFilter === 'verified' && mentor.verified === true) ||
        (verifiedFilter === 'unverified' && mentor.verified === false);

      return nameMatch && authorizedMatch && verifiedMatch;
    });
  }, [mentors, searchQuery, authorizedFilter, verifiedFilter]);

  return (
    <div className="bg-white min-h-screen font-sans">
      <MentorDetailsSheet mentor={selectedMentor} open={open} onOpenChange={setOpen} onMentorUpdate={handleMentorUpdate} onMentorDelete={handleMentorDelete} />
      <div className="max-w-2xl mx-auto p-4">
        {/* Filter Controls */}
        <div className="mb-6 sticky top-4 z-10 bg-white/80 backdrop-blur-sm p-2 -m-2 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <Select value={authorizedFilter} onValueChange={setAuthorizedFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by auth status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Auth Statuses</SelectItem>
                <SelectItem value="authorized">Authorized</SelectItem>
                <SelectItem value="unauthorized">Not Authorized</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by verification..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Not Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conditional Rendering: Loading, Error, or List */}
        {isLoading && <p className="text-center text-gray-500">Loading mentors...</p>}
        {error && <p className="text-center text-red-500">Error: Loading mentors</p>}

        {!isLoading && !error && (
          <ul className="space-y-3">
            {filteredMentors.length > 0 ? (
              filteredMentors.map(mentor => (
                <MentorCard key={mentor.id} mentor={mentor} handleSelectMentor={handleMentorSelect} />
              ))
            ) : (
              <p className="text-center text-gray-500">No mentors found.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}