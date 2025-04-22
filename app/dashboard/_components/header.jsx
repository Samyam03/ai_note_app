import { UserButton, SignedIn } from "@clerk/nextjs";

function Header() {
  return (
    <div className="flex justify-between items-center bg-white shadow-sm px-6 py-4 border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

export default Header;