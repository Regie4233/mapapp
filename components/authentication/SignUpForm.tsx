'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { toast } from "sonner";

export function SignUpForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);

        try {
            const response = await fetch('/api/auth/user', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                // PocketBase often returns validation errors in `data`
                if (result.data) {
                    const fieldErrors = Object.values(result.data).map((err: any) => err.message).join('\n');
                    throw new Error(fieldErrors || result.message || 'An unknown error occurred.');
                }
                throw new Error(result.message || 'Failed to create account.');
            }
            
            toast.success("Account created successfully! Please sign in.");
            router.push('/login');

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
                <CardDescription className="text-center">
                    Enter your details to create a new account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstname">First Name</Label>
                            <Input id="firstname" name="firstname" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input id="lastname" name="lastname" placeholder="Doe" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="passwordConfirm">Confirm Password</Label>
                        <Input id="passwordConfirm" name="passwordConfirm" type="password" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" type="tel" />
                    </div>
                    {/* Short description about you */}
                    <div className="space-y-2">
                        <Label htmlFor="shortDescription">Short Description</Label>
                        <textarea
                            id="shortDescription"
                            name="shortDescription"
                            rows={4}
                            placeholder="Tell us a bit about yourself"
                            className="w-full p-2 border rounded"
                        ></textarea>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center pt-4">
                <Link href="/login" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                    Already have an account? Sign In
                </Link>
            </CardFooter>
        </Card>
    );
}