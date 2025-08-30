import { ShiftLocation } from '@/lib/type';
import { ChevronRight, MapPin } from 'lucide-react';

interface SiteCardProps {
  site: ShiftLocation;
  handleSelectSite: (site: ShiftLocation) => void;
}

export const SiteCard = ({ site, handleSelectSite }: SiteCardProps) => (
  <li
    className="bg-[#F5F7F8] hover:bg-gray-200/70 transition-colors duration-200 p-3 rounded-xl flex items-center justify-between cursor-pointer shadow-sm"
    onClick={() => handleSelectSite(site)}
  >
    <div className='flex flex-row items-center gap-4'>
      <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gray-200 flex items-center justify-center">
        <MapPin className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <p className="font-semibold text-gray-800">{site.name}</p>
        <p className="text-sm text-gray-500">{site.address}</p>
      </div>
    </div>
    <ChevronRight size={20} className='text-gray-400' />
  </li>
);