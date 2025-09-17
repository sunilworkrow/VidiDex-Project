"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CiLock } from "react-icons/ci";
import Popup from "../components/forgot-password-modal"; // ✅ adjust path based on your project

// Create a separate component that uses useSearchParams
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const router = useRouter();

  const validate = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    let isValid = true;

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, newPassword: password }),
    });

    const data = await res.json();

    setPopup({
      type: data.success ? "success" : "error",
      message: data.message,
    });

    if (data.success) {
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-[30%] mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Reset Password</h2>

      {/* New Password */}
      <div className="mb-2">
        <div className="relative ">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <CiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`focus:outline-none pl-12 h-12 rounded-lg w-full bg-[aliceblue] border-l-4 ${errors.password ? "border-l-red-500" : "border-l-blue-500"
              }`}
          />
          
        </div>
        {errors.password && (
            <p className="text-red-500 text-sm mt-2 pl-2">{errors.password}</p>
          )}
      </div>

      {/* Confirm Password */}
      <div className="mt-4">
        <div className="relative ">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <CiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`focus:outline-none pl-12 h-12 rounded-lg w-full bg-[aliceblue] border-l-4 ${errors.confirmPassword ? "border-l-red-500" : "border-l-blue-500"
              }`}
          />
         
        </div>
         {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-2 pl-2">{errors.confirmPassword}</p>
          )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded mt-6 cursor-pointer"
      >
        Submit
      </button>

      {/* Popup Component */}
      {popup && (
        <Popup
          type={popup.type}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}

// Loading component to show while Suspense is loading
function LoadingSpinner() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-[30%] mx-auto">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    </div>
  );
}

// Main component that wraps the form in Suspense
export default function ResetPasswordPage() {
  return (
    <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center relative overflow-hidden min-h-screen">
      <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/30 rounded-full"></div>
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-blue-400/20 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-600 to-pink-500 rounded-full translate-x-20 translate-y-20"></div>

      <Suspense fallback={<LoadingSpinner />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}