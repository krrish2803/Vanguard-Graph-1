"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button onClick={reset} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full">
          Try again
        </button>
      </div>
    </div>
  );
}
