import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { io, Socket } from 'socket.io-client';
import { env } from '@/config/env';

interface ChatMessage {
  userId: string;
  content: string;
  type: 'TEXT';
  createdAt: string;
}

interface LiveChatProps {
  id: string;
}

export const LiveChat: React.FC<LiveChatProps> = ({ id }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('Fetching user and chat room data...');
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${env.API}/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });
        const data = await res.json();
        console.log('User data received:', data);
        if (data?.data?.id) {
          setUserId(data.data.id);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchChatRoomData = async () => {
      try {
        const res = await fetch(`${env.API}/chat/room/article/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });
        const data = await res.json();
        console.log('Chat room data received:', data);
        if (data?.data?.id) {
          setChatRoomId(data.data.id);
        }
      } catch (error) {
        console.error('Error fetching chat room data:', error);
      }
    };

    fetchUserData();
    fetchChatRoomData();
  }, [id]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`${env.API}/chat/messages/${chatRoomId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });
        const data = await res.json();
        console.log('Chat history received:', data);
        if (data?.success && data?.data) {
          // Sort messages from oldest to newest
          const sortedMessages = [...data.data].sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
          setMessages(sortedMessages);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    if (chatRoomId) {
      fetchChatHistory();
    }
  }, [chatRoomId]);

  useEffect(() => {
    console.log('Current state:', { userId, chatRoomId });
    
    if (!userId || !chatRoomId) {
      console.log('Missing required data:', { userId, chatRoomId });
      return;
    }

    console.log('Initializing socket...');
    const newSocket = io(`${env.SOCKET}`, {
      path: '/socket.io'
    });

    setSocket(newSocket);
    setIsConnected(false);

    newSocket.on('connect', () => {
      console.log('Socket connected!');
      setIsConnected(true);
      console.log('Joining room:', { chatRoomId, userId });
      newSocket.emit('join_room', JSON.stringify({
        chatRoomId,
        userId
      }));
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('receive_message', (msg: ChatMessage) => {
      console.log('Received message:', msg);
      // Add new message to the end of the list
      setMessages(prev => {
        const newMessages = [...prev, msg];
        // Sort messages from oldest to newest
        return newMessages.sort((a, b) => {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
      });
    });

    newSocket.on('user_typing', (data: { userId: string }) => {
      console.log('User typing:', data);
      // Handle typing indicator UI
    });

    return () => {
      if (newSocket) {
        console.log('Leaving room and disconnecting socket...');
        newSocket.emit('leave_room', JSON.stringify({ chatRoomId }));
        newSocket.disconnect();
      }
    };
  }, [userId, chatRoomId]);

  const sendMessage = () => {
    if (!message.trim() || !socket || !chatRoomId || !userId || !isConnected) {
      console.log('Cannot send message:', {
        hasMessage: !!message.trim(),
        hasSocket: !!socket,
        hasChatRoomId: !!chatRoomId,
        hasUserId: !!userId,
        isConnected
      });
      return;
    }

    console.log('Sending message:', { chatRoomId, userId, content: message });
    socket.emit('send_message', JSON.stringify({
      chatRoomId,
      userId,
      content: message,
      type: 'TEXT',
      timestamp: new Date().toISOString()
    }));

    setMessage('');
  };

  const handleTyping = () => {
    if (!socket || !chatRoomId || !userId || !isConnected) {
      console.log('Cannot send typing status:', {
        hasSocket: !!socket,
        hasChatRoomId: !!chatRoomId,
        hasUserId: !!userId,
        isConnected
      });
      return;
    }

    socket.emit('typing', JSON.stringify({
      chatRoomId,
      userId,
      isTyping: message.length > 0
    }));
  };

  return (
    <div className="fixed bottom-16 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="sticky top-0 bg-white border-b border-gray-200 pb-2 mb-4">
        <h1 className="text-xl font-semibold px-4">Live Chat</h1>
        <p className="text-gray-600 px-4 text-sm">Chat with our support team</p>
      </div>
      <div className="flex flex-col h-[500px]">
        <div className="flex-1 overflow-y-auto p-4 border-b border-gray-200">
          {messages.map((msg, index) => (
            <div key={index} className="mb-4">
              <p className="text-sm text-gray-500 mb-1">{msg.userId}</p>
              <p className="text-gray-800">{msg.content}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              disabled={!isConnected}
            />
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={sendMessage}
              disabled={!message.trim() || !isConnected}
            >
              {isConnected ? 'Send' : 'Connecting...'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};