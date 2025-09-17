"use client";
import { useState } from "react";
import { CiMail } from "react-icons/ci";
import Popup from "../components/forgot-password-modal";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validate = () => {
    const newErrors: { email?: string } = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email format is invalid";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    setPopup(null);
    if (!validate()) return;

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      setPopup({ type: "success", message: data.message });
    } else {
      setPopup({ type: "error", message: data.message });
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center relative overflow-hidden min-h-screen">
      <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/30 rounded-full"></div>
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-blue-400/20 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-600 to-pink-500 rounded-full translate-x-20 translate-y-20"></div>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[30%] mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Forgot Password</h2>
        <div className="mb-2">
          <div className="relative ">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <CiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-12 h-12 rounded-lg w-full bg-[aliceblue] border-l-4 ${errors.email ? "border-l-red-500" : "border-l-blue-500"
                }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-2 pl-2">{errors.email}</p>}
        </div>


        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 text-white p-2 rounded cursor-pointer"
        >
          Submit
        </button>

        <div className="text-center mt-4 text-[14px] text-blue-600 underline">
          <Link href="/login">Back to login page</Link>
        </div>
      </div>

      {/* POPUP */}
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
