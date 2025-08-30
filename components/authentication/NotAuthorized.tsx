'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/lib/hooks";
import { signOut } from "@/lib/server/auth";
import { clearAuthUser } from "@/lib/store/states/sessionsSlice";
import { LockIcon } from "lucide-react";

export default function NotAuthorized() {
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    // Clear the user from the Redux store and call the server action to sign out
    dispatch(clearAuthUser());
    signOut();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md text-center p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-4 w-fit">
            <LockIcon className="h-12 w-12 text-yellow-500 dark:text-yellow-400" />
          </div>
          <CardTitle className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Account Pending Approval
          </CardTitle>
          <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
            Your account has been created successfully, but it needs to be authorized by an administrator before you can access the dashboard.
            <br /><br />
            Please check back later or contact your administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignOut} className="w-full mt-4">Sign Out</Button>
        </CardContent>
      </Card>
    </div>
  )
}
