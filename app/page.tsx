
export default async function Home() {
 
  return (
    // create simple landing page with tailwindcss
    <main className="flex flex-col items-center justify-center min-h-screen ">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome</h1>
        <p className="text-center mb-4">This is a placeholder please delete this code</p>
        <a href="/login" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-center block mt-4">Login</a>
      </div>
     
    </main>
  );
}
