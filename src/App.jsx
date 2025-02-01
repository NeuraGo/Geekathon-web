import { useState, useRef, useEffect } from 'react';
import { FiSend, FiTrash2, FiMenu, FiX, FiLogIn, FiMessageSquare, FiMail, FiGrid, FiSun, FiMoon, FiPaperclip } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // This function will be connected to the backend API
  const sendMessageToBackend = async (message, files) => {
    // This is where we'll make the API call
    // For now, we'll simulate a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          role: 'assistant',
          content: 'Backend integration pending. This is a placeholder response.',
        });
      }, 1000);
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      attachments: attachments.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToBackend(input, attachments);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
      }]);
    } finally {
      setIsLoading(false);
      setAttachments([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth login here
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowProfileMenu(false);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    setShowProfileMenu(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const baseTheme = isDarkTheme ? 'bg-gray-900' : 'bg-gray-100';
  const sidebarTheme = isDarkTheme ? 'bg-gray-800' : 'bg-white';
  const textTheme = isDarkTheme ? 'text-white' : 'text-gray-900';
  const buttonTheme = isDarkTheme ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300';

  return (
    <div className={`flex h-screen ${baseTheme} transition-colors duration-200`}>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg ${buttonTheme} ${textTheme} transition-colors cursor-pointer`}
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 ${sidebarTheme} transition-all duration-300 ease-in-out z-40 shadow-lg`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-center mb-8 mt-12">
            <h1 className={`text-2xl font-bold ${textTheme}`}>Neurago</h1>
          </div>

          <div className="flex-grow space-y-2">
            <button
              onClick={clearChat}
              className={`w-full flex items-center gap-2 px-4 py-3 ${buttonTheme} ${textTheme} rounded-lg transition-colors cursor-pointer hover:scale-105 transform duration-200`}
            >
              <FiMessageSquare /> New Chat
            </button>
            <button
              className={`w-full flex items-center gap-2 px-4 py-3 ${buttonTheme} ${textTheme} rounded-lg transition-colors cursor-pointer hover:scale-105 transform duration-200`}
            >
              <FiMail /> Contact Us
            </button>
            <button
              className={`w-full flex items-center gap-2 px-4 py-3 ${buttonTheme} ${textTheme} rounded-lg transition-colors cursor-pointer hover:scale-105 transform duration-200`}
            >
              <FiGrid /> Services
            </button>
          </div>

          <div className="relative">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-full flex items-center justify-center"
                >
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  />
                </button>
                {showProfileMenu && (
                  <div className={`absolute bottom-full left-0 w-full mb-2 ${sidebarTheme} rounded-lg shadow-lg p-2 space-y-2`}>
                    <button
                      onClick={toggleTheme}
                      className={`w-full flex items-center gap-2 px-4 py-2 ${buttonTheme} ${textTheme} rounded-lg transition-colors cursor-pointer`}
                    >
                      {isDarkTheme ? <FiSun /> : <FiMoon />} Change Theme
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-2 px-4 py-2 ${buttonTheme} ${textTheme} rounded-lg transition-colors cursor-pointer`}
                    >
                      <FiLogIn /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className={`w-full flex items-center gap-2 px-4 py-2 ${buttonTheme} ${textTheme} rounded-lg transition-colors cursor-pointer hover:scale-105 transform duration-200`}
              >
                <FiLogIn /> Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${sidebarTheme} rounded-lg p-6 w-96 shadow-xl`}>
            <h2 className={`text-xl font-bold mb-4 ${textTheme}`}>Sign In</h2>
            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Sign in with Google
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className={`w-full px-4 py-2 ${buttonTheme} ${textTheme} rounded-lg transition-colors cursor-pointer`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className={`text-center mt-20 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                <h2 className={`text-2xl font-bold mb-2 ${textTheme}`}>Welcome to Neurago Chat</h2>
                <p>Start a conversation by typing a message below.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : `${buttonTheme} ${textTheme}`
                    }`}
                  >
                    <ReactMarkdown className="message-content">
                      {message.content}
                    </ReactMarkdown>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm opacity-80">Attachments:</p>
                        {message.attachments.map((file, i) => (
                          <div key={i} className="text-sm opacity-90 flex items-center gap-2">
                            <FiPaperclip className="inline" />
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`max-w-[80%] rounded-lg p-4 ${buttonTheme} ${textTheme}`}>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className={`border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'} ${sidebarTheme} p-4`}>
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="space-y-2">
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className={`${buttonTheme} ${textTheme} px-3 py-1 rounded-full text-sm flex items-center gap-2`}
                    >
                      <FiPaperclip className="inline" />
                      {file.name}
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="hover:text-red-500"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className={`flex-1 ${buttonTheme} ${textTheme} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary`}
                    disabled={isLoading}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 ${buttonTheme} ${textTheme} rounded-lg hover:bg-opacity-80 transition-colors`}
                    disabled={isLoading}
                  >
                    <FiPaperclip size={20} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FiSend />
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;