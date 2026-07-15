import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Plus, Smile } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="px-4 pb-6 pt-2 shrink-0 bg-base-100">

      {imagePreview && (
        <div className="mb-2 px-2">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border border-base-300"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center bg-error text-error-content">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage}>
        <div className="flex items-center gap-2 px-4 rounded-lg bg-base-200">

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full hover:bg-base-300 transition-colors shrink-0 text-base-content/60 hover:text-base-content">
            <Plus className="w-5 h-5" />
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <input
            type="text"
            className="flex-1 bg-transparent py-3 text-sm focus:outline-none text-base-content placeholder:text-base-content/40"
            placeholder={`Message @${selectedUser?.fullName || "..."}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            className="p-2 rounded-full hover:bg-base-300 transition-colors shrink-0 text-base-content/60 hover:text-base-content">
            <Smile className="w-5 h-5" />
          </button>

          {(text.trim() || imagePreview) && (
            <button
              type="submit"
              className="p-2 rounded-full hover:bg-base-300 transition-colors shrink-0 text-primary">
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
export default MessageInput;
