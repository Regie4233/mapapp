import { SignUpForm } from '@/components/authentication/SignUpForm';
import Image from 'next/image';

export default function SignUpPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center">
                    <Image
                        src="/logo3.png"
                        alt="Mentor A Promise Logo"
                        width={120}
                        height={120}
                        className="mx-auto border-2 rounded-full"
                        priority
                    />
                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900">
                        Create an Account
                    </h1>
                </div>
                <SignUpForm />
            </div>
        </main>
    );
}