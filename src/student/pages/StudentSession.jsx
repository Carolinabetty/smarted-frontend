import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const StudentSession = () => {
  const { id: sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };

    getUser();
  }, []);

  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('mentorship_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (!error) setMessages(data);
    };

    fetchMessages();

    // Real-time subscription
    const channel = supabase
      .channel(`messages:session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mentorship_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const { error } = await supabase.from('mentorship_messages').insert({
      session_id: sessionId,
      sender_id: userId,
      content: newMsg.trim(),
    });

    if (!error) {
      setNewMsg('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white rounded shadow p-6 flex flex-col h-[75vh]">
      <h2 className="text-xl font-semibold text-emerald-700 mb-4">Live Mentorship Chat</h2>

      <div className="flex-grow overflow-y-auto space-y-3 border p-4 rounded bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[75%] px-4 py-2 rounded-lg ${
              msg.sender_id === userId
                ? 'bg-emerald-200 self-end text-right'
                : 'bg-gray-200 self-start text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border px-4 py-2 rounded"
        />
        <button
          onClick={handleSend}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default StudentSession;
