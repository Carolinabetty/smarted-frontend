import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const MentorSession = () => {
  const { id: sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);

  const userId = supabase.auth.getUser()?.id;

  // Fetch previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('mentorship_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (!error) {
        setMessages(data);
      } else {
        console.error('Error loading messages:', error.message);
      }
    };

    fetchMessages();
  }, [sessionId]);

  // Subscribe to new messages
  useEffect(() => {
    const subscription = supabase
      .channel('mentorship_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mentorship_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [sessionId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from('mentorship_messages').insert([
      {
        session_id: sessionId,
        sender_id: userId,
        content: newMessage.trim(),
      },
    ]);

    if (!error) {
      setNewMessage('');
    } else {
      console.error('Send error:', error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-emerald-700">Live Mentorship Session</h2>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-white mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 max-w-xl ${
              msg.sender_id === userId ? 'text-right ml-auto' : 'text-left'
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.sender_id === userId
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg border focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MentorSession;
