import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="h-12 flex items-center justify-between px-4 shrink-0 bg-base-100 border-b border-base-300 shadow-sm">

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-base-100"
            style={{ backgroundColor: isOnline ? "#23a55a" : "#80848e" }}
          />
        </div>

        <div>
          <h3 className="font-semibold text-sm text-base-content leading-tight">
            {selectedUser.fullName}
          </h3>
          <p className="text-xs" style={{ color: isOnline ? "#23a55a" : "#80848e" }}>
            {isOnline ? "● Online" : "● Offline"}
          </p>
        </div>
      </div>

      <button
        onClick={() => setSelectedUser(null)}
        className="p-1.5 rounded hover:bg-base-200 transition-colors text-base-content/60 hover:text-base-content">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
export default ChatHeader;
