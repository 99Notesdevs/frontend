"use client";

import { useState } from "react";
import { MessageSquare, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/config/env";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

export const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReplyingTo, setIsReplyingTo] = useState<string | null>(null);

  // Placeholder API calls
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`${env.API}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const postComment = async (content: string, parentId?: string) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch(`${env.API}/comments${parentId ? `/${parentId}/replies` : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      // Update local state
      const newComment: Comment = {
        id: Date.now().toString(),
        author: "Anonymous", // TODO: Get from auth
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      };

      if (parentId) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies: [...comment.replies, newComment],
                }
              : comment
          )
        );
      } else {
        setComments((prev) => [...prev, newComment]);
      }

      setNewComment("");
      setIsReplyingTo(null);
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    postComment(newComment, isReplyingTo ?? undefined);
  };

  const handleReplyClick = (commentId: string) => {
    setIsReplyingTo(commentId);
    setNewComment("");
  };

  const renderComment = (comment: Comment, depth = 0) => {
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
                <h3 className="font-medium text-slate-900">{comment.author}</h3>
                <p className="text-sm text-slate-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm text-slate-500 hover:text-slate-700">
                  {comment.likes} Likes
                </button>
                <button
                  onClick={() => handleReplyClick(comment.id)}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Reply
                </button>
              </div>
            </div>
            <div className="mt-2 text-slate-700 whitespace-pre-wrap">
              {comment.content}
            </div>
            {comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map((reply) => renderComment(reply, depth + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Comments</h2>
        <span className="text-sm text-slate-500">{comments.length} comments</span>
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
                isReplyingTo
                  ? "Write your reply..."
                  : "Write a comment..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={isLoading || !newComment.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
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