'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/comments?postId=${postId}`);
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments || []);
      } else {
        console.error('Error fetching comments:', data.error);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!authorName.trim() || !content.trim()) {
      setError('Name and comment are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim() || null,
          content: content.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setAuthorName('');
        setAuthorEmail('');
        setContent('');
        // Refresh comments list
        fetchComments();
      } else {
        setError(data.error || 'Failed to submit comment');
      }
    } catch (err) {
      setError('Failed to submit comment. Please try again.');
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-16 pt-8 border-t-2 border-black">
      <h2 className="text-3xl font-black text-black mb-6 uppercase" style={{ fontFamily: 'Georgia, serif' }}>
        Comments
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12 pb-8 border-b-2 border-black">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="authorName" className="block text-sm font-bold text-black mb-2 uppercase">
                Name *
              </label>
              <input
                type="text"
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-2 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label htmlFor="authorEmail" className="block text-sm font-bold text-black mb-2 uppercase">
                Email (optional)
              </label>
              <input
                type="email"
                id="authorEmail"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-bold text-black mb-2 uppercase">
              Comment *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-black resize-y"
              required
            />
          </div>
          {error && (
            <div className="text-red-600 font-bold text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 font-bold text-sm">
              Comment submitted successfully!
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-600">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="pb-6 border-b-2 border-black last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-black text-black text-lg uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                    {comment.author_name}
                  </h3>
                  <time className="text-xs text-gray-600" dateTime={comment.created_at}>
                    {formatDate(comment.created_at)}
                  </time>
                </div>
              </div>
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Georgia, serif' }}>
                {comment.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
