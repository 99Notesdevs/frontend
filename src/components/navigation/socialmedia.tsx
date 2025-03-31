import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';

const SocialMedia = () => {
  const socialLinks = [
    {
      icon: <FaFacebook className="w-6 h-6" />,
      url: "https://www.facebook.com/99NotesIAS",
      color: "hover:bg-blue-600",
    },
    {
      icon: <FaInstagram className="w-6 h-6" />,
      url: "https://www.instagram.com/99notes_studysmart/",
      color: "hover:bg-pink-600",
    },
    {
      icon: <FaLinkedin className="w-6 h-6" />,
      url: "https://www.linkedin.com/company/99notes-ias/",
      color: "hover:bg-blue-700",
    },
    {
      icon: <FaTwitter className="w-6 h-6" />,
      url: "https://twitter.com/99Notes_UPSC",
      color: "hover:bg-blue-400",
    },
    {
      icon: <FaYoutube className="w-6 h-6" />,
      url: "https://www.youtube.com/@99NotesIAS",
      color: "hover:bg-red-600",
    },
  ];

  return (
    <div className="flex items-center justify-between w-full">
      {socialLinks.map((social, index) => (
        <a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 rounded-lg transition-all duration-300 
            ${social.color} hover:text-white bg-gray-50/80 
            hover:shadow-lg transform hover:-translate-y-1 
            border border-gray-100 hover:border-transparent 
            flex items-center justify-center`}
          aria-label={`Visit our ${social.url.split('.com/')[1]} page`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;
