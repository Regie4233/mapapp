import UserBadge from '@/components/ViewSessions/UserBadge';
import { UserPool } from '@/lib/type';
import React, { useState, useEffect } from 'react';



const AnimatedBadgeRow = ({ users = [] }: { users: UserPool[] }) => {
    // State to track if the badges are spread apart
    const [isSpread, setIsSpread] = useState(false);

    // State to hold the timeout ID, so we can clear it if needed
    const [closeTimeoutId, setCloseTimeoutId] = useState<NodeJS.Timeout | null>(null);

    // This function handles the click event
    const handleSpreadClick = () => {
        // If it's already spread, do nothing to prevent re-triggering the timeout
        if (isSpread) {
            return;
        }

        // Set the state to spread the badges
        setIsSpread(true);

        // Set a timer to automatically close the badges after 2 seconds
        const timeoutId = setTimeout(() => {
            setIsSpread(false);
        }, 2000);

        setCloseTimeoutId(timeoutId);
    };

    // This is a cleanup effect. If the component unmounts while the
    // timeout is still pending, we clear it to prevent memory leaks.
    useEffect(() => {
        return () => {
            if (closeTimeoutId) {
                clearTimeout(closeTimeoutId);
            }
        };
    }, [closeTimeoutId]);

    // --- Configuration for the animation ---
    const overlapAmount = 20; // in pixels. The initial overlap for each badge.
    const spreadAmount = 5; // in pixels. The final gap between each badge when spread.
    const badgeSize = 30; // The width of your UserBadge.

    return (
        <main
            className="grid grid-cols-6 cursor-pointer" // Added h-10 for click area
            onClick={handleSpreadClick}
            onMouseOver={handleSpreadClick}
            // Set a minimum width to contain the badges when spreadgg
            style={{ minWidth: `${users.length * (badgeSize + spreadAmount)}px` }}>
            <ul className='relative col-span-1'>
                {users.length > 0 &&
                    users.map((mentor, index) => {
                        // Calculate the position for both states
                        const overlappedPosition = index * (badgeSize - overlapAmount);
                        const spreadPosition = index * (badgeSize + spreadAmount);

                        // Determine which position to use based on the `isSpread` state
                        const xPosition = isSpread ? spreadPosition : overlappedPosition;

                        return (
                            <li
                                key={mentor.id}
                                className="absolute transition-transform duration-500 ease-in-out"
                                style={{
                                    // We use `transform` for animation as it's more performant than `left`.
                                    transform: `translateX(${xPosition}px)`,
                                    // z-index ensures the badges stack correctly from left to right
                                    zIndex: index,
                                }} >
                                <UserBadge
                                    size={badgeSize}
                                    initials={[mentor.firstname[0], mentor.lastname[0]]}
                                    person={mentor}
                                    tooltip={false}/>
                            </li>
                        );
                    })}
            </ul>

            <ul className={`flex flex-row gap-2 items-center text-muted-foreground col-span-5 flex-wrap`}>
                {users.length > 0 &&
                    users.map((mentor, index) => (
                        <li key={mentor.id} className="text-sm">
                            {mentor.firstname} {mentor.lastname}{index + 1 === users.length ? '' : ', '}
                        </li>
                    ))}
            </ul>
        </main>
    );
};

export default AnimatedBadgeRow;