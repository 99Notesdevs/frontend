"use client";

import { Button } from "./button";

interface WhatsAppPdfProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export function WhatsAppPdf({ 
  phoneNumber = "+1234567890", // Default phone number, replace with actual number
  message = "Hello, I'd like to get the PDF notes.",
  className = ""
}: WhatsAppPdfProps) {
  const handleClick = () => {
    // Format the phone number (remove any non-numeric characters)
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    // Create the WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    // Open the URL in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button 
      onClick={handleClick}
      className={`bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-2 px-4 rounded-md shadow-sm ${className}`}
    >
      <svg 
        className="w-5 h-5 mr-2" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.498 14.382v-.002c-.301-.15-1.767-.867-2.04-.966-.274-.1-.473-.15-.675.149-.193.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.484-.888-.795-1.484-1.761-1.66-2.06-.173-.3-.02-.465.13-.614.136-.135.301-.345.451-.523.146-.18.194-.301.296-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.01-.571-.01-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.065 2.865 1.215 3.075c.15.195 2.105 3.195 5.1 4.485.71.3 1.26.489 1.694.626.712.226 1.36.195 1.871.118.571-.09 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016a9.87 9.87 0 01-5.031-1.379l-.36-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.496 0 .16 5.335.157 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.723 1.465h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Get your PDF
    </Button>
  );
}