import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ backgroundColor: "#313338" }}>

      {/* Left — Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "#5865f2" }}>
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
            <p className="text-sm mt-1" style={{ color: "#b5bac1" }}>
              We're so excited to see you again!
            </p>
          </div>

          {/* Card */}
          <div className="rounded-lg p-8 shadow-xl" style={{ backgroundColor: "#2b2d31" }}>
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "#b5bac1" }}>
                  Email or Phone Number <span style={{ color: "#ed4245" }}>*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#87898c" }} />
                  <input
                    type="email"
                    className="w-full pl-9 pr-4 py-2.5 rounded text-sm focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "#1e1f22",
                      color: "#dcddde",
                      border: "1px solid #1e1f22",
                      focusRingColor: "#5865f2",
                    }}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "#b5bac1" }}>
                  Password <span style={{ color: "#ed4245" }}>*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#87898c" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-9 pr-10 py-2.5 rounded text-sm focus:outline-none focus:ring-2"
                    style={{ backgroundColor: "#1e1f22", color: "#dcddde", border: "1px solid #1e1f22" }}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#87898c" }}
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Link to="#" className="text-xs mt-1 inline-block hover:underline"
                  style={{ color: "#00a8fc" }}>
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded font-medium text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: "#5865f2" }}>
                {isLoggingIn ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</>
                ) : "Log In"}
              </button>
            </form>

            <p className="text-sm mt-4" style={{ color: "#87898c" }}>
              Need an account?{" "}
              <Link to="/signup" className="hover:underline" style={{ color: "#00a8fc" }}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right — Pattern */}
      <AuthImagePattern
        title="So glad you're back!"
        subtitle="Sign in to continue your conversations and catch up with your messages."
      />
    </div>
  );
};
export default LoginPage;
