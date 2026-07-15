import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { theme } = useThemeStore();

  return (
    <div className="flex h-screen pt-12" style={{ backgroundColor: "#313338" }}>
      <Sidebar />
      <main className="flex-1 flex overflow-hidden" data-theme={theme}>
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </main>
    </div>
  );
};
export default HomePage;
