import { Hash, MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-base-100">
      <div className="text-center space-y-4 max-w-sm px-6">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-base-300">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-base-content">
          No conversation selected
        </h2>
        <p className="text-sm leading-relaxed text-base-content/60">
          Select a friend from the sidebar to start chatting, or find someone new to connect with.
        </p>

        <div className="mt-6 flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-base-200 text-base-content/50">
          <Hash className="w-4 h-4 shrink-0 text-primary" />
          <span>Pick a conversation from the left panel</span>
        </div>
      </div>
    </div>
  );
};
export default NoChatSelected;
