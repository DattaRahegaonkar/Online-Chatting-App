import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Calendar, Shield } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: "#313338" }}>
      <div className="max-w-2xl mx-auto p-6">

        {/* Profile Card */}
        <div className="rounded-lg overflow-hidden shadow-xl" style={{ backgroundColor: "#232428" }}>

          {/* Banner */}
          <div className="h-24 w-full" style={{ backgroundColor: "#5865f2" }} />

          {/* Avatar + name row */}
          <div className="px-6 pb-4">
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4"
                  style={{ borderColor: "#232428" }}
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-90 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                  style={{ backgroundColor: "#5865f2" }}>
                  <Camera className="w-3.5 h-3.5 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>

              <div className="mb-1 px-4 py-1.5 rounded text-sm font-medium"
                style={{ backgroundColor: "#5865f2", color: "white" }}>
                Edit Profile
              </div>
            </div>

            <h2 className="text-xl font-bold text-white">{authUser?.fullName}</h2>
            <p className="text-sm" style={{ color: "#b5bac1" }}>{authUser?.email}</p>
          </div>

          {/* Divider */}
          <div className="mx-6 border-t" style={{ borderColor: "#3f4147" }} />

          {/* Info section */}
          <div className="px-6 py-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "#b5bac1" }}>
              About Me
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#2b2d31" }}>
                <User className="w-4 h-4 shrink-0" style={{ color: "#87898c" }} />
                <div>
                  <p className="text-xs" style={{ color: "#87898c" }}>Display Name</p>
                  <p className="text-sm text-white font-medium">{authUser?.fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#2b2d31" }}>
                <Mail className="w-4 h-4 shrink-0" style={{ color: "#87898c" }} />
                <div>
                  <p className="text-xs" style={{ color: "#87898c" }}>Email</p>
                  <p className="text-sm text-white font-medium">{authUser?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#2b2d31" }}>
                <Calendar className="w-4 h-4 shrink-0" style={{ color: "#87898c" }} />
                <div>
                  <p className="text-xs" style={{ color: "#87898c" }}>Member Since</p>
                  <p className="text-sm text-white font-medium">
                    {authUser.createdAt?.split("T")[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#2b2d31" }}>
                <Shield className="w-4 h-4 shrink-0" style={{ color: "#23a55a" }} />
                <div>
                  <p className="text-xs" style={{ color: "#87898c" }}>Account Status</p>
                  <p className="text-sm font-medium" style={{ color: "#23a55a" }}>Active</p>
                </div>
              </div>
            </div>
          </div>

          {isUpdatingProfile && (
            <div className="px-6 pb-4">
              <p className="text-xs text-center" style={{ color: "#87898c" }}>
                Uploading profile picture...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
