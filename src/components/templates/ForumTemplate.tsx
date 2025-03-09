import React from 'react';
import { BaseTemplate, BaseTemplateProps } from './BaseTemplate';

interface Comment {
  id: string;
  content: React.ReactNode;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  replies?: Comment[];
}

interface ForumTemplateProps extends Omit<BaseTemplateProps, 'children'> {
  content: React.ReactNode;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  publishDate: string;
  category: string;
  tags?: string[];
  comments?: Comment[];
  onAddComment?: (content: string, parentId?: string) => void;
  onLike?: () => void;
  likesCount?: number;
  isLiked?: boolean;
  viewsCount?: number;
}

const CommentComponent: React.FC<{
  comment: Comment;
  onReply: (content: string, parentId: string) => void;
}> = ({ comment, onReply }) => {
  const [isReplying, setIsReplying] = React.useState(false);
  const [replyContent, setReplyContent] = React.useState('');

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {comment.author.avatar ? (
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            {comment.author.name[0]}
          </div>
        )}
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.author.name}</span>
            <span className="text-gray-500 text-sm">
              {new Date(comment.date).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-2 text-gray-700">{comment.content}</div>
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="mt-2 text-blue-600 text-sm hover:underline"
          >
            Reply
          </button>
        </div>
      </div>

      {isReplying && (
        <div className="ml-14">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Write your reply..."
            rows={3}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                onReply(replyContent, comment.id);
                setReplyContent('');
                setIsReplying(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={!replyContent.trim()}
            >
              Submit
            </button>
            <button
              onClick={() => setIsReplying(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-14 space-y-4">
          {comment.replies.map((reply) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ForumTemplate: React.FC<ForumTemplateProps> = ({
  content,
  author,
  publishDate,
  category,
  tags = [],
  comments = [],
  onAddComment,
  onLike,
  likesCount = 0,
  isLiked = false,
  viewsCount = 0,
  ...baseProps
}) => {
  const [newComment, setNewComment] = React.useState('');

  return (
    <BaseTemplate {...baseProps}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <header className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  {author.name[0]}
                </div>
              )}
              <div>
                <div className="font-semibold">{author.name}</div>
                {author.role && (
                  <div className="text-sm text-gray-500">{author.role}</div>
                )}
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{baseProps.title}</h1>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <time dateTime={publishDate}>
                {new Date(publishDate).toLocaleDateString()}
              </time>
              <span>•</span>
              <a
                href={`/category/${category.toLowerCase()}`}
                className="text-blue-600 hover:underline"
              >
                {category}
              </a>
              <span>•</span>
              <span>{viewsCount} views</span>
            </div>
          </header>

          <div className="prose max-w-none mb-6">{content}</div>

          <div className="flex items-center justify-between border-t border-b py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isLiked
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill={isLiked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                <span>{likesCount}</span>
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/tags/${tag.toLowerCase()}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">
              Comments ({comments.length})
            </h2>
            {onAddComment && (
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-4 border rounded-lg"
                  placeholder="Write your comment..."
                  rows={4}
                />
                <button
                  onClick={() => {
                    onAddComment(newComment);
                    setNewComment('');
                  }}
                  className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={!newComment.trim()}
                >
                  Post Comment
                </button>
              </div>
            )}
            <div className="space-y-6">
              {comments.map((comment) => (
                <CommentComponent
                  key={comment.id}
                  comment={comment}
                  onReply={onAddComment!}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>
  );
}; 