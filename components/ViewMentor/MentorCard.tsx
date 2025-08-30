import { UserPool } from '@/lib/type';
import UserBadge from '../ViewSessions/UserBadge';
import { ChevronRight } from 'lucide-react';


export const MentorCard = ({ mentor, handleSelectMentor }: { mentor: UserPool, handleSelectMentor: (mentor: UserPool) => void }) => (
  <li className="bg-[#F5F7F8] hover:bg-gray-100 transition-colors duration-200 p-4 rounded-xl flex flex-col gap-3 cursor-pointer relative" onClick={() => handleSelectMentor(mentor)}>
    <div className="flex items-center justify-between">
      <div className='flex flex-row items-center gap-4'>
        <UserBadge size={40} initials={[mentor.firstname[0], mentor.lastname[0]]} person={mentor} tooltip={false} />
        <div>
          <p className="font-semibold text-gray-900">{mentor.firstname} {mentor.lastname}</p>
          <p className="text-sm text-gray-600">{mentor.email}</p>
        </div>
      </div>
    </div>
    <section className="flex items-center gap-4">
      {
        mentor.authorized ? (
          <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Authorized</span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Not Authorized</span>
        )
      }
      {
        mentor.verified ? (
          <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Verified</span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">Not Verified</span>
        )
      }

    </section>
    <ChevronRight size={28} className='text-gray-400 absolute right-2 top-10'/>
  </li>
);