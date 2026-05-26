import { SignIn } from "@clerk/nextjs";
import DemoCredentials from "@/components/DemoCredentials";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6">
      <div className="flex flex-col items-center max-w-5xl mx-auto">
        <SignIn />
        <DemoCredentials />
      </div>
    </div>
  );
}
