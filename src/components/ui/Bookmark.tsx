"use client";
import { useState } from "react";
import { Bookmark as BookmarkIcon, BookmarkCheck } from "lucide-react";
import { api } from "@/config/api/route";

interface BookmarkProps {
  articleId: string;
  initialBookmarked?: boolean;
}

const Bookmark: React.FC<BookmarkProps> = ({
  articleId,
  initialBookmarked,
}) => {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  console.log(
    "Bookmark component mounted with articleId:",
    articleId,
    "bookmarked:",
    initialBookmarked
  );

  const handleBookmark = async () => {
    setLoading(true);
    try {
      // Toogle bookmark
      await api.post(`/page/bookmark`, {
        pageId: articleId,
        state: !bookmarked,
      });
      setBookmarked((prev) => !prev);
    } catch (error) {
      console.error("Bookmark error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this article"}
      onClick={handleBookmark}
      disabled={loading}
      className={`transition-colors p-2 rounded-full border border-gray-200 hover:bg-yellow-100 ${
        bookmarked ? "text-yellow-500" : "text-gray-400"
      }`}
      title={bookmarked ? "Remove Bookmark" : "Add to Bookmarks"}
      type="button"
    >
      {bookmarked ? (
        <BookmarkCheck className="w-5 h-5" />
      ) : (
        <BookmarkIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default Bookmark;
