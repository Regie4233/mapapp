import Image from 'next/image';
import Link from 'next/link';

const PromiseLinkLogin = () => {
  return (
    <>
      <main className="flex w-full h-screen p-12 bg-[#FDFCF4] flex-col justify-evenly items-center text-center">
       
        <div className='text-[#273A57] '>
           <Image
            alt="PromiseLink logo"
            src="/PromiseLink-bg-rem.png"
            width={192}
            height={192}
            className="h-48 w-48 object-contain mx-auto w-full"
            priority // Load the logo quickly as it's LCP
          />
          <h1 className="text-4xl font-bold tracking-wide text-navy ">
            PROMISELINK
          </h1>
          <p className="mt-2 mb-12 text-lg text-navy ">
            LINKING PROMISES. IGNITING CHANGE.
          </p>
        </div>

        <div className='text-[#273A57]'>
          <h2 className="mb-4 text-2xl font-semibold text-navy ">Welcome!</h2>
          <p className="mb-10 text-base leading-relaxed text-navy/80 ">
            Welcome to the Mentor A Promise portal. Manage your schedule, connect
            with students, and track progress all in one place.
          </p>
        </div>


        <Link
          href="/login" // Change to your actual login/signup route
          className="inline-block w-full rounded-lg bg-navy py-4 px-8 font-semibold text-white bg-[#273A57] shadow-md transition-colors duration-300 hover:bg-navy/90"
        >
          Login or Sign Up
        </Link>
      </main>

      <footer className="mt-auto py-4 text-center">
        <p className="text-sm text-navy/60">
          © 2024 PromiseLink. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default PromiseLinkLogin;