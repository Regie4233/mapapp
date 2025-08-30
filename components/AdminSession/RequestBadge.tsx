
const StatusBadge = ({ count, showFull }: { count: number, showFull?: boolean }) => {
    return (
        <div>

            <div className="text-sm font-semibolds bg-[#FEE190] rounded-full w-fit px-2 flex flex-row gap-1 items-center">
                {
                    showFull ?
                        <p>Full</p>
                        :
                        <p>{count} Requests</p>
                }
            </div>
        </div>
    );
};

export default StatusBadge;