"use client"

import { useState, useEffect } from "react"
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaLock, FaCamera, FaSave } from "react-icons/fa"

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
  darkMode: boolean
}

export default function UserProfile({ isOpen, onClose, darkMode }: UserProfileProps) {
  const [formData, setFormData] = useState({
    name: "Hank Jingga",
    email: "hank.jingga@storeshop.com",
    phone: "+1 (555) 123-4567",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: "Hank Jingga",
      email: "hank.jingga@storeshop.com",
      phone: "+1 (555) 123-4567",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setIsEditing(false)
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`
        fixed top-0 right-0 h-full w-full sm:w-96 lg:w-[28rem] 
        ${darkMode ? "bg-[#1a1a1a] text-white" : "bg-white text-black"}
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        border-l ${darkMode ? "border-gray-800" : "border-gray-200"}
        overflow-y-auto
      `}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">Profile Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#252525] rounded-lg transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">HJ</span>
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                  <FaCamera size={16} className="text-white" />
                </button>
              )}
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{formData.name}</h3>
              <p className="text-sm text-gray-400">Administrator</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <FaUser className="inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                className={`
                  w-full px-3 py-2 rounded-lg border transition-colors
                  ${darkMode ? "bg-[#252525] border-gray-700" : "bg-gray-50 border-gray-300"}
                  ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <FaEnvelope className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className={`
                  w-full px-3 py-2 rounded-lg border transition-colors
                  ${darkMode ? "bg-[#252525] border-gray-700" : "bg-gray-50 border-gray-300"}
                  ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <FaPhone className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                className={`
                  w-full px-3 py-2 rounded-lg border transition-colors
                  ${darkMode ? "bg-[#252525] border-gray-700" : "bg-gray-50 border-gray-300"}
                  ${!isEditing ? "opacity-60 cursor-not-allowed" : ""}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
              />
            </div>

            {isEditing && (
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <h4 className="font-medium flex items-center">
                  <FaLock className="inline mr-2" />
                  Change Password
                </h4>

                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                    placeholder="Enter current password"
                    className={`
                      w-full px-3 py-2 rounded-lg border transition-colors
                      ${darkMode ? "bg-[#252525] border-gray-700" : "bg-gray-50 border-gray-300"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
                    placeholder="Enter new password"
                    className={`
                      w-full px-3 py-2 rounded-lg border transition-colors
                      ${darkMode ? "bg-[#252525] border-gray-700" : "bg-gray-50 border-gray-300"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                    className={`
                      w-full px-3 py-2 rounded-lg border transition-colors
                      ${darkMode ? "bg-[#252525] border-gray-700" : "bg-gray-50 border-gray-300"}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-700">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className={`
                    flex-1 py-2 px-4 rounded-lg transition-colors font-medium border
                    ${darkMode ? "border-gray-600 hover:bg-[#252525]" : "border-gray-300 hover:bg-gray-50"}
                  `}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"} space-y-1`}>
            <p>• Last login: Today at 2:30 PM</p>
            <p>• Account created: January 15, 2024</p>
            <p>• Two-factor authentication: Enabled</p>
          </div>
        </div>
      </div>
    </>
  )
}
