import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, User, MessageCircle } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed w-full top-0 z-40 h-12 flex items-center px-4 shadow-md"
      style={{ backgroundColor: "#1e1f22", borderBottom: "1px solid #111214" }}>
      <div className="flex items-center justify-between w-full">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#5865f2" }}>
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-base tracking-wide">Online Chatting</span>
        </Link>

        {/* Nav Actions */}
        <div className="flex items-center gap-1">
          <Link to="/settings"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium hover:bg-white/10 transition-colors"
            style={{ color: "#b5bac1" }}>
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {authUser && (
            <>
              <Link to="/profile"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium hover:bg-white/10 transition-colors"
                style={{ color: "#b5bac1" }}>
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium hover:bg-red-500/20 transition-colors"
                style={{ color: "#b5bac1" }}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
