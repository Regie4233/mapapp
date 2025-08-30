// components/AddShiftButton.tsx

import type { FC } from 'react';

/**
 * SVG Plus Icon Component
 */
const PlusIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
);

/**
 * Props for the AddShiftButton component.
 * It extends standard button attributes for full flexibility.
 */
// interface AddShiftButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   // You can add any other custom props here if needed
// }

/**
 * A reusable button component styled to match the "Add a shift" design.
 */
export const AddShiftButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <section className='w-full fixed bottom-0 bg-white py-5 border-t-2 border-[#E2E8F0]'>
      <button
        onClick={onClick}
        className="
        flex w-11/12 items-center justify-center rounded-md
        bg-[#1d6eb9] px-8 py-3 m-auto
        text-base font-medium text-white 
        transition-colors hover:bg-[#175896] 
        focus:outline-none focus:ring-2 focus:ring-[#1d6eb9] focus:ring-offset-2
        
      "

      >
        <PlusIcon />
        <span>Add a shift</span>
      </button>
    </section>

  );
};




export default AddShiftButton;