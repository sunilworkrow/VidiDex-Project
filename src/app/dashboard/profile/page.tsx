"use client";

import { useState, useRef } from "react";
import {
  CiUser,
  CiMail,
  CiCamera,
  CiSaveDown2,
  CiCalendar,
} from "react-icons/ci";
import Modal from "@/app/components/login-modal";
import { useUser } from "@/app/context/UserContext";
import Image from "next/image";

export default function ProfileForm() {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastName: "",
    dateOfBirth: "",
    bio: "",
    image: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [modalType, setModalType] = useState<"success" | "warning" | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) newErrors.name = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setModalType("warning");
        setModalMessage("You are not logged in.");
        setIsSaving(false);
        return;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          dob: formData.dateOfBirth,
          description: formData.bio,
          image: formData.image || "https://example.com/default.jpg",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setModalType("success");
        setModalMessage("Profile updated successfully!");
      } else {
        setModalType("warning");
        setModalMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      setModalType("warning");
      setModalMessage("Something went wrong.");
    }

    setIsSaving(false);
  };

  const tabs = [{ id: "personal", label: "Personal Information" }];

  return (
    <div className="max-w-4xl mx-auto">
      {modalType && (
        <Modal
          modalType={modalType}
          message={modalMessage}
          errors={{}}
          onClose={() => setModalType(null)}
        />
      )}

      {/* Profile Card */}
      <div className="rounded-lg p-6 mb-6 border bg-[#1a1a1a] border-gray-800">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                  width={60}
                  height={60}
                />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <button
              className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <CiCamera className="text-white" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              hidden
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-400">Administrator</p>
            <p className="text-sm text-gray-500 mt-1">Member since January 2024</p>
          </div>
        </div>
      </div>

      {/* Tabs + Form */}
      <div className="rounded-lg border mb-6 border-gray-800 bg-[#1a1a1a]">
        <div className="flex border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <CiUser className="inline mr-2" />
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <CiUser className="inline mr-2" />
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <CiCalendar size={16} className="inline mr-2" />
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
                  )}
                </div>

                {/* Email (Disabled) */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <CiMail className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-3 py-2 rounded-lg border text-[#909090] bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border bg-[#252525] border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-700">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-6 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CiSaveDown2 />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
