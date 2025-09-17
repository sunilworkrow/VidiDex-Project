
"use client"

import { CiWarning } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

type ModalProps = {
  modalType: "success" | "error" | "warning" | null;
  message: string;
 
  errors?: { [key: string]: string }; // Optional errors object
  onClose: () => void;
  onContinue?: () => void; // Optional continue handler
};

export default function Modal({ modalType, message, errors, onClose, onContinue }: ModalProps) {
  const handleContinue = () => {
    if (onContinue) onContinue();
    onClose(); 
  };

  const ModalContent = () => {
    if (modalType === "success") {
      return (
        <>
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-white text-[35px]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Success!</h1>
          <p className="text-gray-600 leading-relaxed mb-4">{message}</p>
          <button
            onClick={handleContinue}
            className="w-auto px-10 py-2 bg-white text-gray-800 hover:bg-gray-50 rounded-full border border-gray-300 mt-6 font-semibold"
            style={{ boxShadow: "0px 4px 8px -2px #2c2c2c, 0px 0px 1px 0px rgba(0, 128, 0, 0.5)" }} 
          >
            Continue
          </button>
        </>
      );
    } else if (modalType === "error") {
      return (
        <>
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdCancel className="text-white text-[35px]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error!</h1>
          <p className="text-gray-600 leading-relaxed mb-4">{message}</p>
          {errors && Object.keys(errors).length > 0 && ( 
            <div className="text-left text-red-600 mb-4">
              {Object.entries(errors).map(([key, value]) => (
                <p key={key}>- {value}</p> 
              ))}
            </div>
          )}
          <button
            onClick={onClose} 
            className="w-auto px-10 py-2 bg-white text-gray-800 hover:bg-gray-50 rounded-full border border-gray-300 mt-6 font-semibold"
            style={{ boxShadow: "0px 4px 8px -2px #2c2c2c, 0px 0px 1px 0px rgba(255, 0, 0, 0.5)" }} 
          >
            Close
          </button>
        </>
      );
    } else if (modalType === "warning") {
      return (
        <>
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CiWarning className="text-white text-[35px]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Warning!</h1>
          <p className="text-gray-600 leading-relaxed mb-4">{message}</p>
          <button
            onClick={handleContinue} 
            className="w-auto px-10 py-2 bg-white text-gray-800 hover:bg-gray-50 rounded-full border border-gray-300 mt-6 font-semibold"
            style={{ boxShadow: "0px 4px 8px -2px #2c2c2c, 0px 0px 1px 0px rgba(255, 165, 0, 0.5)" }} 
          >
            Continue
          </button>
        </>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <ModalContent />
      </div>
    </div>
  );
}