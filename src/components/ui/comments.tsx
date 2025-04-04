"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/config/env";
import Cookies from "js-cookie";

interface Comment {
  id: string;
  userId: string;
  content: string;
  commentId: number | null;
  parentSlug: string | null;
  createdAt: string;
  replies: Comment[] | null; // Initially null, fetched dynamically
  user: {
    firstName: string;
    lastName?: string; // Optional if needed
  };
}

export const Comments = ({ parentId }: { parentId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReplyingTo, setIsReplyingTo] = useState<string | null>(null);
  const [loadingReplies, setLoadingReplies] = useState<string | null>(null); // Tracks which comment's replies are being loaded
  const [visibleReplies, setVisibleReplies] = useState<Set<string>>(new Set()); // Tracks visible replies
  const token = Cookies.get("token");

  // Fetch comments for the page
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const parentSlug = parentId.replace(/\//g, " ");
      const response = await fetch(`${env.API}/comments/page/${parentSlug}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const { data } = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch replies for a specific comment
  const fetchReplies = async (commentId: string) => {
    try {
      setLoadingReplies(commentId);
      const response = await fetch(`${env.API}/comments/reply/${commentId}`);
      if (!response.ok) throw new Error("Failed to fetch replies");
      const { data } = await response.json();
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, replies: data } : comment
        )
      );
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setLoadingReplies(null);
    }
  };

  // Post a new comment or reply
  const postComment = async (content: string, parentId: string) => {
    try {
      setIsLoading(true);
      const type = isReplyingTo ? "Reply" : "Comment";
      const response = await fetch(`${env.API}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          type,
          parent: parentId,
        }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const newComment: Comment = (await response.json()).data.data;

      if (isReplyingTo) {
        // Add the reply to the parent comment
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === isReplyingTo
              ? {
                  ...comment,
                  replies: comment.replies
                    ? [...comment.replies, newComment]
                    : [newComment],
                }
              : comment
          )
        );
      } else {
        // Add the new comment to the top-level comments
        setComments((prev) => [...prev, newComment]);
      }

      setNewComment("");
      setIsReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submitting a new comment or reply
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    postComment(newComment, isReplyingTo ? isReplyingTo : parentId);
    setNewComment("");
  };

  // Handle reply button click
  const handleReplyClick = (commentId: string) => {
    setIsReplyingTo(commentId);
    setNewComment("");
  };

  // Toggle visibility of replies
  const toggleRepliesVisibility = (commentId: string) => {
    setVisibleReplies((prev) => {
      const newVisibleReplies = new Set(prev);
      if (newVisibleReplies.has(commentId)) {
        newVisibleReplies.delete(commentId); // Hide replies
      } else {
        newVisibleReplies.add(commentId); // Show replies
        fetchReplies(commentId); // Fetch replies if they are not already loaded
      }
      return newVisibleReplies;
    });
  };

  // Render a single comment and its replies
  const renderComment = (comment: Comment, depth = 0) => {
    if (!comment) return null;

    return (
      <div key={comment.id} className={`mb-4 pl-${depth * 4}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500">
                  {comment?.user?.firstName} {comment?.user?.lastName} - {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
              {depth === 0 && ( // Only show buttons for top-level comments
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReplyClick(comment.id)}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => toggleRepliesVisibility(comment.id)}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    {visibleReplies.has(comment.id)
                      ? "Hide Replies"
                      : "View Replies"}
                  </button>
                </div>
              )}
            </div>
            <div className="mt-2 text-slate-700 whitespace-pre-wrap">
              {comment.content}
            </div>
            {visibleReplies.has(comment.id) &&
              comment.replies &&
              comment.replies.length > 0 && (
                <div className="mt-4">
                  {comment.replies.map((reply) =>
                    renderComment(reply, depth + 1)
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchComments();
  }, [parentId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Comments</h2>
        <span className="text-sm text-slate-500">
          {comments.length} comments
        </span>
      </div>

      <form onSubmit={handleCommentSubmit} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Input
              type="text"
              placeholder={
                isReplyingTo ? "Write your reply..." : "Write a comment..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={isLoading || !newComment.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
};
