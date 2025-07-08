import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { v4 as uuidv4 } from 'uuid';

const DiscussionBoard = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newPost, setNewPost] = useState({ title: '', content: '', course_id: '' });
  const [userId, setUserId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  // Get user session and courses
  useEffect(() => {
    const fetchUserAndCourses = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) return;
      setUserId(user.id);

      const { data: courseList } = await supabase
        .from('courses')
        .select('id, title')
        .eq('educator_id', user.id);

      setCourses(courseList || []);
    };
    fetchUserAndCourses();
  }, []);

  // Fetch posts and comments
  useEffect(() => {
    const fetchPostsAndComments = async () => {
      setLoading(true);

      const { data: postList } = await supabase
        .from('discussion_posts')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: commentList } = await supabase
        .from('discussion_comments')
        .select('*')
        .order('created_at', { ascending: true });

      const commentMap = {};
      (commentList || []).forEach((c) => {
        if (!commentMap[c.post_id]) commentMap[c.post_id] = [];
        commentMap[c.post_id].push(c);
      });

      setPosts(postList || []);
      setComments(commentMap);
      setLoading(false);
    };

    fetchPostsAndComments();
  }, []);

  const handleCreatePost = async () => {
    const { title, content, course_id } = newPost;
    if (!title || !content || !course_id || !userId) return;

    const { error } = await supabase.from('discussion_posts').insert({
      id: uuidv4(),
      educator_id: userId,
      course_id,
      title,
      content,
    });

    if (!error) window.location.reload();
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content || !userId) return;

    const { error } = await supabase.from('discussion_comments').insert({
      id: uuidv4(),
      user_id: userId,
      post_id: postId,
      content,
    });

    if (!error) {
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      window.location.reload();
    }
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-900 mb-4">Discussion Board</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">New Discussion Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
          className="mb-2 p-2 w-full border rounded"
        />
        <textarea
          placeholder="Write something about your course topic..."
          value={newPost.content}
          onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
          className="mb-2 p-2 w-full border rounded"
        />
        <select
          value={newPost.course_id}
          onChange={(e) => setNewPost((prev) => ({ ...prev, course_id: e.target.value }))}
          className="mb-2 p-2 w-full border rounded"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleCreatePost}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>

      {loading ? (
        <p>Loading discussions...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-700">No discussions yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-lg font-semibold text-blue-800">{post.title}</h2>
            <p className="text-gray-700 mb-2">{post.content}</p>
            <p className="text-sm text-gray-500">
              Posted on {new Date(post.created_at).toLocaleString()}
            </p>

            <button
              onClick={() =>
                setExpandedPostId((prev) => (prev === post.id ? null : post.id))
              }
              className="text-sm text-blue-700 mt-2"
            >
              {expandedPostId === post.id ? 'Hide Comments' : 'Show Comments'}
            </button>

            {expandedPostId === post.id && (
              <div className="mt-4">
                <div className="space-y-2 mb-3">
                  {(comments[post.id] || []).map((comment) => (
                    <div key={comment.id} className="bg-gray-100 p-2 rounded">
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <textarea
                  placeholder="Write a comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded resize-none mb-2"
                />

                <button
                  onClick={() => handleAddComment(post.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Submit Comment
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DiscussionBoard;
