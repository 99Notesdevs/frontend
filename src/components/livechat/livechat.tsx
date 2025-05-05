"use client";
import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { io, Socket } from 'socket.io-client';
import { env } from '@/config/env';

interface ChatMessage {
  userId: string;
  content: string;
  type: 'TEXT';
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }
}

interface LiveChatProps {
  id: string;
}

export const LiveChat: React.FC<LiveChatProps> = ({ id }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null); 
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
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
        if (data?.success && data?.data) {
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
    if (!userId || !chatRoomId) {
      return;
    }

    const newSocket = io(`${env.SOCKET}`, {
      path: '/socket.io'
    });

    setSocket(newSocket);
    setIsConnected(false);

    newSocket.on('connect', () => {
      setIsConnected(true);
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
      setIsConnected(false);
    });

    newSocket.on('receive_message', (msg: ChatMessage) => {
      setMessages(prev => {
        const newMessages = [...prev, msg];
        return newMessages.sort((a, b) => {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
      });
    });

    newSocket.on('user_typing', (data: { userId: string }) => {
      // Handle typing indicator UI
    });

    return () => {
      if (newSocket) {
        newSocket.emit('leave_room', JSON.stringify({ chatRoomId }));
        newSocket.disconnect();
      }
    };
  }, [userId, chatRoomId]);

  const sendMessage = () => {
    if (!message.trim() || !socket || !chatRoomId || !userId || !isConnected) {
      return;
    }

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
      return;
    }

    socket.emit('typing', JSON.stringify({
      chatRoomId,
      userId,
      isTyping: message.length > 0
    }));
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed right-4 bottom-[14vh] h-[70vh] md:h-[65vh] w-[90%] md:w-[400px] bg-white shadow-2xl z-max flex flex-col rounded-lg">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 z-[99999] rounded-t-2xl">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-lg font-semibold">Live Chat</h1>
            <p className="text-gray-600 text-xs">Chat with our support team</p>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="h-2 w-2 rounded-full bg-green-500 animate-pulse" 
              title={isConnected ? "Connected" : "Connecting..."}
            />
            <button
              onClick={() => {
                const chatEvent = new CustomEvent('toggleChat', { detail: { isOpen: false } });
                window.dispatchEvent(chatEvent);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-3 py-2 bg-gray-50"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-4 ${
                  msg.userId === userId 
                    ? 'ml-auto max-w-[80%]' 
                    : 'mr-auto max-w-[80%]'
                }`}
              >
                <div className={`rounded-2xl p-3 ${
                  msg.userId === userId 
                    ? 'bg-blue-500 text-white ml-auto' 
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  <p className={`text-xs mb-1 ${
                    msg.userId === userId 
                      ? 'text-blue-100' 
                      : 'text-gray-500'
                  }`}>
                    {`${msg.user.firstName} ${msg.user.lastName}`}
                  </p>
                  <p>{msg.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-white border-t border-gray-200 rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={!isConnected}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={sendMessage}
              disabled={!message.trim() || !isConnected}
            >
              <span>{isConnected ? "Send" : "Connecting..."}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};