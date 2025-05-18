'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  // Redirect if signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setRedirecting(true);
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  if (redirecting) {
    // Classic loader screen
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-800">
        <div className="text-center">
          <div className="loader mb-4 mx-auto"></div>
          <p className="text-sm">Redirecting to your dashboard...</p>
        </div>
        <style jsx>{`
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100 text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 pt-16 pb-20 text-center flex flex-col items-center">
        <div className="max-w-4xl">
          <Image
            src="/logo.svg"
            alt="App Logo"
            width={56}
            height={56}
            className="mx-auto mb-4 opacity-90"
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Your Personal AI Study Partner
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-2 leading-relaxed">
            Tired of scattered study notes and half-baked AI answers? <strong>NoteGenius</strong> is your all-in-one tool to ask questions, get smart AI responses, and instantly turn them into clean, editable notes.
          </p>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Whether you’re a student, researcher, or lifelong learner — NoteGenius helps you absorb knowledge, stay organized, and never lose a thought again.
          </p>
          <div className="mt-6">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-md text-sm shadow transition">
                  Login to Get Started
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-12 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "🧠 Ask Smarter Questions",
              color: "text-blue-700",
              desc: "Skip the fluff. Our AI understands complex prompts and gives detailed, actionable responses across a wide range of topics.",
            },
            {
              title: "📝 Generate Notes Instantly",
              color: "text-green-700",
              desc: "Turn any AI response into a structured, editable note. Save, organize, and revisit your material effortlessly.",
            },
            {
              title: "📚 Stay Effortlessly Organized",
              color: "text-purple-700",
              desc: "Group questions and notes by subject or topic. Quickly search and access past content anytime.",
            },
            {
              title: "⚡ Designed for Speed",
              color: "text-rose-700",
              desc: "Fast input, instant output. From question to note in seconds — designed to keep you in the learning flow.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-slate-50 p-5 rounded-xl shadow-sm hover:shadow transition border"
            >
              <h3 className={`text-lg font-semibold mb-2 ${feature.color}`}>
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 md:px-10 lg:px-16 py-6 text-center text-xs text-gray-500 border-t border-gray-200 mt-auto">
        &copy; {new Date().getFullYear()} NoteGenius. Built for curious minds.
      </footer>
    </div>
  );
}
