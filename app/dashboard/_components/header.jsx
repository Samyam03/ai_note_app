import { UserButton, SignedIn } from "@clerk/nextjs";
import { Menu } from "lucide-react";

function Header({ onMenuClick }) {
  return (
    <header className="flex justify-between items-center bg-white px-4 md:px-6 py-4 shadow-md border-b border-gray-300">
      <div className="flex items-center gap-4">
        {/* Menu button for small screens */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}

export default Header;
