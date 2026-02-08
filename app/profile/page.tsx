"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { LogOut, User as UserIcon, Mail } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-green-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4 overflow-hidden">
                {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <UserIcon className="w-10 h-10 text-green-600" />
                )}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user.displayName || "Farmer"}</h2>
            <div className="flex items-center gap-2 text-gray-500 mt-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
            </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 transition-colors text-left"
            >
                <div className="p-2 bg-red-100 rounded-lg">
                    <LogOut className="w-5 h-5" />
                </div>
                <span className="font-medium">Log Out</span>
            </button>
        </div>

        <div className="text-center text-xs text-gray-400 mt-8">
            <p>FarmerLedger v1.0.0</p>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
