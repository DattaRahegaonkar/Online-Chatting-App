import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Monitor } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: "#313338" }}>
      <div className="flex h-[calc(100vh-3rem)]">

        {/* Settings sidebar */}
        <div className="w-56 shrink-0 py-6 px-3" style={{ backgroundColor: "#2b2d31" }}>
          <p className="text-xs font-bold uppercase tracking-wider px-2 mb-2" style={{ color: "#87898c" }}>
            App Settings
          </p>
          <button className="w-full text-left px-2 py-1.5 rounded text-sm font-medium flex items-center gap-2"
            style={{ backgroundColor: "#404249", color: "#f2f3f5" }}>
            <Monitor className="w-4 h-4" />
            Appearance
          </button>
        </div>

        {/* Settings content */}
        <div className="flex-1 overflow-y-auto py-10 px-10">
          <h2 className="text-xl font-bold text-white mb-1">Appearance</h2>
          <p className="text-sm mb-8" style={{ color: "#b5bac1" }}>
            Customize how Chatty looks on your device.
          </p>

          {/* Theme section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#b5bac1" }}>
              Color Theme
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: theme === t ? "#404249" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (theme !== t) e.currentTarget.style.backgroundColor = "#35373c";
                  }}
                  onMouseLeave={(e) => {
                    if (theme !== t) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div className="relative h-8 w-full rounded overflow-hidden" data-theme={t}>
                    <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                      <div className="rounded bg-primary" />
                      <div className="rounded bg-secondary" />
                      <div className="rounded bg-accent" />
                      <div className="rounded bg-neutral" />
                    </div>
                  </div>
                  <span className="text-[10px] truncate w-full text-center"
                    style={{ color: theme === t ? "#f2f3f5" : "#87898c" }}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t mb-8" style={{ borderColor: "#3f4147" }} />

          {/* Preview */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#b5bac1" }}>
              Preview
            </h3>
            <div className="rounded-lg overflow-hidden shadow-lg max-w-lg" data-theme={theme}>
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-base-300 bg-base-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-sm">
                  J
                </div>
                <div>
                  <p className="font-semibold text-sm">John Doe</p>
                  <p className="text-xs text-base-content/60">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 bg-base-100 min-h-[160px]">
                {PREVIEW_MESSAGES.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm shadow-sm
                      ${msg.isSent ? "bg-primary text-primary-content" : "bg-base-200"}`}>
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${msg.isSent ? "text-primary-content/60" : "text-base-content/50"}`}>
                        12:00 PM
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-base-300 bg-base-100 flex gap-2">
                <input
                  readOnly
                  value="This is a preview"
                  className="input input-bordered input-sm flex-1 text-sm"
                />
                <button className="btn btn-primary btn-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
