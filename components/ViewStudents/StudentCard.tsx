import { Student } from '@/lib/type';
import UserBadge from '../ViewSessions/UserBadge';
import { ChevronRight } from 'lucide-react';

/**
 * A simple card component that displays a student's basic information.
 * Styled to match the provided single-line design.
 */
export const StudentCard = ({ student, handleSelectStudent }: { student: Student, handleSelectStudent: (student: Student) => void }) => (
  <li
    className="bg-[#F5F7F8] hover:bg-gray-200/70 transition-colors duration-200 p-3 rounded-xl flex items-center justify-between cursor-pointer shadow-sm"
    onClick={() => handleSelectStudent(student)}
  >
    <div className='flex flex-row items-center gap-4'>
      <UserBadge size={40} initials={[student.name[0]]} tooltip={false} />
      <div>
        <p className="font-semibold text-gray-800">{student.name}</p>
        <p className="text-sm text-gray-500">{student.expand.location.name}</p>
      </div>
    </div>
    <ChevronRight size={20} className='text-gray-400' />
  </li>
);