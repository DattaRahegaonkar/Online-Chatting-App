import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto py-4 space-y-0.5">

        {/* Channel intro */}
        <div className="px-4 pb-4 mb-2 border-b border-base-300">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold">{selectedUser.fullName}</h2>
          <p className="text-sm mt-1 text-base-content/60">
            This is the beginning of your direct message history with{" "}
            <strong className="text-base-content">@{selectedUser.fullName}</strong>.
          </p>
        </div>

        {messages.map((message, idx) => {
          const isMine = message.senderId === authUser._id;
          const sender = isMine ? authUser : selectedUser;
          const prevMsg = messages[idx - 1];
          const isGrouped =
            prevMsg &&
            prevMsg.senderId === message.senderId &&
            new Date(message.createdAt) - new Date(prevMsg.createdAt) < 5 * 60 * 1000;

          return (
            <div
              key={message._id}
              className="flex items-start gap-4 px-4 py-0.5 group hover:bg-base-200/50 transition-colors"
              style={{ minHeight: isGrouped ? "1.375rem" : "2.75rem" }}
            >
              {/* Avatar — only on first of group */}
              <div className="w-10 shrink-0 mt-0.5">
                {!isGrouped ? (
                  <img
                    src={sender.profilePic || "/avatar.png"}
                    alt={sender.fullName}
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  <span className="text-[10px] leading-5 text-right w-full block opacity-0 group-hover:opacity-100 select-none text-base-content/40">
                    {formatMessageTime(message.createdAt)}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name + timestamp — only on first of group */}
                {!isGrouped && (
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-base-content hover:underline cursor-pointer">
                      {sender.fullName}
                    </span>
                    <span className="text-[11px] text-base-content/40">
                      {formatMessageTime(message.createdAt)}
                    </span>
                  </div>
                )}

                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-xs rounded-lg mt-1 mb-1"
                  />
                )}

                {message.text && (
                  <p className="text-sm leading-relaxed break-words text-base-content">
                    {message.text}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
