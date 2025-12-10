import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();

  // Function to check if a link is active
  const isActive = (path) => router.pathname === path ? "bg-purple-100 text-purple-600 font-semibold" : "text-gray-700 hover:bg-gray-100";

  return (
    <div className="fixed left-0 w-[18vw] h-[60vh] bg-white mx-2  shadow-lg p-5 rounded-lg">
      {/* Logo Section */}
      <h1 className="text-xl font-bold mb-6">⚡ Gramconnect</h1>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
        <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/")}`}>
          <span>🏠</span> <span className="text-lg">Home</span>
        </Link>

        <Link href="/initiative" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/initiative")}`}>
          <span>🔍</span> <span className="text-lg">Initiative</span>
        </Link>

        <Link href="/scheme" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/scheme")}`}>
          <span>ℹ️</span> <span className="text-lg">Schemes</span>
        </Link>

        <Link href="/issue" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/issue")}`}>
          <span>📄</span> <span className="text-lg">Issues</span>
        </Link>
        <Link href="/projects" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive("/projects")}`}>
          <span>📄</span> <span className="text-lg">Projects</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
