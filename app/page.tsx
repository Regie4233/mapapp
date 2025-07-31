import Link from 'next/link';
import { ArrowRight, Users, Calendar, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden md:grid md:grid-cols-2">
          {/* Content Section */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              Guiding the Future, One Promise at a Time.
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Welcome to the Mentor A Promise portal. Manage your schedule,
              connect with students, and track progress all in one place.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              Login to Your Dashboard
              <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </Link>
          </div>

          {/* Visual/Feature Section */}
          <div className="bg-blue-50 dark:bg-gray-700 p-8 md:p-12">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Key Features
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Shift Management
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Easily view and manage your upcoming mentorship shifts.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Connect & Collaborate
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Access information about your mentees and fellow mentors.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Track Progress
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Keep notes and monitor the progress of your students.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Mentor A Promise. All rights
          reserved.
        </p>
      </footer>
    </main>
  );
}
