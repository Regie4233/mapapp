// This is now a Server Component. No 'use client' directive.
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from '@/lib/server/auth'; // Assuming this is your server action
import Image from "next/image";
import Link from "next/link";

// The Zod schema can still be useful for validation within your `signIn` server action.
// import * as z from 'zod';
// const signInSchema = z.object({
//   email: z.string().email({ message: "Invalid email address." }),
//   password: z.string().min(1, { message: "Password is required." }),
// });

// The component accepts searchParams to display errors passed via URL

/**
 * Maps known error codes from searchParams to user-friendly messages.
 * Your `signIn` server action should redirect with these error codes on failure.
 * e.g., redirect('/login?error=CredentialsSignin')
 */


export async function SignInForm() {

    // For a pending state on the button (e.g., "Signing In..."),
    // you would typically create a small client component that uses `useFormStatus`
    // from `react-dom` and use it in place of the current <Button>.
    // Example:
    // function SubmitButton() {
    //   const { pending } = useFormStatus();
    //   return <Button type="submit" className="w-full mt-6" disabled={pending}>{pending ? "Signing In..." : "Sign In"}</Button>;
    // }
    // Then in the form: <SubmitButton />

    return (
        <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="text-center">
                    <Image
                        src="/logo3.png" // Make sure you have a logo in your `public` folder
                        alt="Mentor A Promise Logo"
                        width={120}
                        height={120}
                        className="mx-auto border-2 rounded-full"
                        priority
                    />
                </div>
            <Card className="w-full max-w-sm"> {/* max-w-sm for better responsiveness */}
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to access your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* The form action directly calls your server action */}
                    <form action={signIn} className="space-y-6">
                        <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email" // Crucial for FormData
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    // For server components, aria-invalid might be set based on error messages
                                    // passed back for specific fields, if your server action supports that.
                                />
                            </div>
                        <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password" // Crucial for FormData
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                        

                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2 pt-4">
                    {/* <a href="/forgot-password" className="text-sm text-blue-600 hover:underline dark:text-blue-400"> Forgot Password? </a> */}
                    <Link href="/signup"
                       className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                        Don&apos;t have an account? Sign Up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
