'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Sparkles, Zap, BookOpen, Search, FileText, Users, Star, CheckCircle } from "lucide-react";

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-ping mx-auto"></div>
          </div>
          <p className="text-slate-600 font-medium">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                NoteGenius
              </span>
            </div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Study Assistant
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                  Your Personal AI
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Study Partner
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Transform scattered thoughts into organized knowledge. Ask questions, get intelligent responses, and instantly create beautiful, editable notes.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-2">
                    <span>Start Learning Today</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>
              </SignedOut>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-slate-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">50K+</div>
                <div className="text-slate-600">Notes Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">99%</div>
                <div className="text-slate-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section - Only for Signed Out Users */}
      <SignedOut>
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Try NoteGenius Now
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Use these demo credentials to explore the app and experience the power of AI-powered note-taking
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    email: "test@email.com",
                    password: "ExploreNow!2025",
                    label: "Demo Account 1"
                  },
                  {
                    email: "sam@gmail.com", 
                    password: "TalentPortal@2025",
                    label: "Demo Account 2"
                  },
                  {
                    email: "view@example.com",
                    password: "TryThisDemo!88", 
                    label: "Demo Account 3"
                  }
                ].map((credential, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-slate-900">{credential.label}</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <div className="bg-white rounded-lg p-3 border border-slate-300 font-mono text-sm text-slate-800 break-all">
                          {credential.email}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="bg-white rounded-lg p-3 border border-slate-300 font-mono text-sm text-slate-800">
                          {credential.password}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-amber-800">
                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      !
                    </div>
                    <span className="text-sm font-medium">
                      These are demo accounts for testing purposes. Your data will be shared with other demo users.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SignedOut>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to excel in your studies
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to enhance your learning experience and boost productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Search,
                title: "Smart Q&A",
                description: "Ask complex questions and get detailed, accurate responses powered by advanced AI",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: FileText,
                title: "Instant Notes",
                description: "Transform any AI response into beautifully formatted, editable notes instantly",
                color: "from-green-500 to-green-600"
              },
              {
                icon: BookOpen,
                title: "Organized Learning",
                description: "Keep all your study materials organized by subjects, topics, and projects",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get answers and create notes in seconds, keeping you in the learning flow",
                color: "from-orange-500 to-orange-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How NoteGenius Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three simple steps to transform your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Ask Your Question",
                description: "Type any question or topic you want to learn about. Our AI understands complex queries and provides comprehensive answers.",
                icon: "💭"
              },
              {
                step: "02",
                title: "Get AI Response",
                description: "Receive detailed, accurate responses powered by advanced language models. Get explanations, examples, and insights.",
                icon: "🤖"
              },
              {
                step: "03",
                title: "Create Beautiful Notes",
                description: "Instantly convert any response into structured, editable notes. Organize, edit, and save for future reference.",
                icon: "📝"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl">{step.icon}</div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Loved by students worldwide
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See what our users are saying about their experience with NoteGenius
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Medical Student",
                content: "NoteGenius has completely transformed how I study. The AI responses are incredibly detailed and the note generation feature saves me hours every week.",
                rating: 5
              },
              {
                name: "Marcus Rodriguez",
                role: "Engineering Student",
                content: "The quality of AI responses is outstanding. I can ask complex technical questions and get comprehensive answers that I can immediately turn into study notes.",
                rating: 5
              },
              {
                name: "Emily Watson",
                role: "Law Student",
                content: "This tool is a game-changer for my research. The organized note-taking system helps me keep track of all my case studies and legal concepts.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to revolutionize your learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using NoteGenius to enhance their study experience and achieve better results.
          </p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-xl flex items-center space-x-2 mx-auto">
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignInButton>
          </SignedOut>
          <p className="text-blue-200 text-sm mt-4">No credit card required • Free forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">NoteGenius</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your AI-powered study partner for smarter learning and better organization.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} NoteGenius. All rights reserved. Built for curious minds.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
