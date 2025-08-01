import { ShieldAlert } from 'lucide-react';

export default function NoAccess() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
                <h1 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Not Authorized
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    You do not have permission to view this resource.
                </p>
            </div>
        </div>
    );
}