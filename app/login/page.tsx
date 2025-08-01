
import { SignInForm } from '@/components/authentication/SiginForm';

export default async function Login({ searchParams,}: {searchParams?: Promise<{ error?: string;}>}) {
    const params = await searchParams;
  // You can now directly check if the 'error' property exists on searchParams.
  if (params?.error) {
    // You can add logic here to handle the error, like displaying a message.
    // For now, we'll just log it to the server console.
    console.log("Login page error:", params.error);
  }

  // It's good practice to pass the error down to the form component
  // so it can display a relevant message to the user.
  return <SignInForm error={params?.error} />;
}
