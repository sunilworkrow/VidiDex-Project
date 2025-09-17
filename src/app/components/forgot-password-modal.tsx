import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

type Props = {
  type: "success" | "error";
  message: string;
  onClose: () => void;
};

export default function Popup({ type, message, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-[#00000080] bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-[350px] text-center shadow-xl">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6
          ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {type === "success" ? (
            <FaCheck className="text-white text-[35px]" />
          ) : (
            <MdCancel className="text-white text-[35px]" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {type === "success" ? "Success!" : "Error!"}
        </h1>
        <p className="text-gray-600 leading-relaxed mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-auto px-10 py-2 bg-white text-gray-800 hover:bg-gray-50 rounded-full border border-gray-300 mt-6 font-semibold"
          style={{ boxShadow: "0px 4px 8px -2px #2c2c2c, 0px 0px 1px 0px rgba(0, 128, 0, 0.5)" }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
