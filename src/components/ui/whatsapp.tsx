"use client";

import { FaWhatsapp } from "react-icons/fa";

const WhatsApp: React.FC = () => {
  return (
    <div className="bg-green-500 text-white p-4 rounded-lg flex items-center gap-2">
      <FaWhatsapp className="w-6 h-6" />
      Get your pdf
    </div>
  );
};

export default WhatsApp;