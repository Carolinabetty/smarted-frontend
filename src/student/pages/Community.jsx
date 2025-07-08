import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FaUserCircle, FaPaperPlane } from 'react-icons/fa';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState(''); // Changed from caption to postContent
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select('id, content, created_at, user_id') // Explicitly list columns
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to post');
      }

      const { error: insertError } = await supabase
        .from('posts')
        .insert({ 
          content: postContent, // Changed to match your column name
          user_id: user.id 
        });

      if (insertError) throw insertError;
      
      setPostContent('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message || 'Failed to create post');
    }
  };

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('realtime_posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          setPosts(prevPosts => [payload.new, ...prevPosts]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 min-h-screen">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button 
            type="submit" 
            className="self-end px-6 py-3 rounded-lg text-white font-medium transition-all duration-200
            bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-900
            shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
            disabled={loading}
          >
            <FaPaperPlane className="mr-2" />
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      {loading && posts.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaUserCircle className="text-gray-400 text-3xl" />
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-line">{post.content}</p> {/* Changed from caption to content */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}