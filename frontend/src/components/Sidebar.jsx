import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users
    .filter((u) => (showOnlineOnly ? onlineUsers.includes(u._id) : true))
    .filter((u) => u.fullName.toLowerCase().includes(search.toLowerCase()));

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col w-60 shrink-0" style={{ backgroundColor: "#2b2d31" }}>

      {/* Server name header */}
      <div className="h-12 flex items-center px-4 shadow-md font-semibold text-white text-sm border-b"
        style={{ borderColor: "#1e1f22" }}>
        <Users className="w-4 h-4 mr-2" style={{ color: "#b5bac1" }} />
        <span style={{ color: "#f2f3f5" }}>Direct Messages</span>
      </div>

      {/* Search */}
      <div className="px-2 pt-3 pb-1">
        <div className="flex items-center gap-2 px-2 py-1 rounded text-sm"
          style={{ backgroundColor: "#1e1f22" }}>
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "#87898c" }} />
          <input
            type="text"
            placeholder="Find or start a conversation"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full text-xs focus:outline-none placeholder:text-xs"
            style={{ color: "#dcddde" }}
          />
        </div>
      </div>

      {/* Online filter */}
      <div className="px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#87898c" }}>
          Direct Messages
        </span>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="w-3 h-3 accent-indigo-500"
          />
          <span className="text-xs" style={{ color: "#87898c" }}>Online</span>
        </label>
      </div>

      {/* User list */}
      <div className="overflow-y-auto flex-1 px-2 space-y-0.5">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSelected = selectedUser?._id === user._id;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className="w-full flex items-center gap-3 px-2 py-1.5 rounded group transition-colors"
              style={{
                backgroundColor: isSelected ? "#404249" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = "#35373c";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {/* Avatar with status dot */}
              <div className="relative shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                  style={{
                    backgroundColor: isOnline ? "#23a55a" : "#80848e",
                    borderColor: "#2b2d31",
                  }}
                />
              </div>

              {/* Name + status */}
              <div className="text-left min-w-0">
                <p className="text-sm font-medium truncate leading-tight"
                  style={{ color: isSelected ? "#f2f3f5" : "#949ba4" }}>
                  {user.fullName}
                </p>
                <p className="text-xs truncate" style={{ color: "#6d6f78" }}>
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <p className="text-xs text-center py-6" style={{ color: "#6d6f78" }}>
            No users found
          </p>
        )}
      </div>

      {/* Current user panel at bottom */}
      <div className="h-14 flex items-center px-2 gap-2 shrink-0"
        style={{ backgroundColor: "#232428", borderTop: "1px solid #1e1f22" }}>
        <div className="relative shrink-0">
          <img
            src={authUser?.profilePic || "/avatar.png"}
            alt="me"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: "#23a55a", borderColor: "#232428" }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate text-white leading-tight">
            {authUser?.fullName}
          </p>
          <p className="text-xs" style={{ color: "#87898c" }}>Online</p>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
