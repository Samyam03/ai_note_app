import { UserButton, SignedIn } from "@clerk/nextjs";
import { Menu } from "lucide-react";

function Header({ onMenuClick }) {
  return (
    <header className="flex justify-between items-center bg-white px-4 md:px-6 py-3 shadow-sm border-b border-gray-200">
      <div className="flex items-center gap-3">
        {/* Menu button visible only on small screens */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 transition"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        <h1 className="text-lg md:text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}

export default Header;
