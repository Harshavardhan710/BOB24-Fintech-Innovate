import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import sendIcon from './send.svg';
import botIcon from './zyra.png';
import Modal from 'react-modal';

// Configure react-modal
Modal.setAppElement('#root');

const ChatBox: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Check login status and set modal visibility
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsModalOpen(true);
    }
  }, []);

  // Determine greeting based on current time
  useEffect(() => {
    const currentHour = new Date().getHours();
    let greetingMessage = '';
    if (currentHour < 12) {
      greetingMessage = 'Good Morning';
    } else if (currentHour < 18) {
      greetingMessage = 'Good Afternoon';
    } else {
      greetingMessage = 'Good Evening';
    }
    setGreeting(greetingMessage);
  }, []);

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            console.error('Error getting location:', error);
            reject({ latitude: 0, longitude: 0 });
          }
        );
      } else {
        reject({ latitude: 0, longitude: 0 });
      }
    });
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    setIsLoading(true);
    const userMessage = message;
    const token = localStorage.getItem('token');

    getCurrentLocation().then(location => {
      setChatHistory([...chatHistory, { user: userMessage, bot: '...' }]);
      setMessage('');

      axios.post('http://127.0.0.1:8000/api/bob-genai', {
        message: userMessage,
        location: location, // Include location data
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const botMessage = response.data.answer;
        setChatHistory(prevHistory =>
          prevHistory.map((entry, index) =>
            index === prevHistory.length - 1 ? { ...entry, bot: botMessage } : entry
          )
        );
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setChatHistory(prevHistory =>
          prevHistory.map((entry, index) =>
            index === prevHistory.length - 1 ? { ...entry, bot: 'Error fetching response' } : entry
          )
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
    });
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scroll({ top: chatContainer.scrollHeight, behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleLogin = () => {
    axios.post('http://127.0.0.1:8000/login/token', new URLSearchParams({
      'username': username,
      'password': password,
    }))
    .then(response => {
      localStorage.setItem('token', response.data.access_token);
      setIsModalOpen(false);
    })
    .catch(error => {
      console.error('Error logging in:', error);
      alert('Login failed. Please check your credentials.');
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsModalOpen(true); // Show the login modal again
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen w-4/5 max-h-80">
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {}}
        contentLabel="Login Modal"
        className="modal"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded-lg p-2 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg p-2 mb-2 w-full"
        />
        <button onClick={handleLogin} className="p-2 bg-tahiti-500 text-white rounded-lg w-full">Login</button>
      </Modal>
      
      {!isModalOpen && (
        <>
          <div className="flex items-center justify-center w-full mb-4">
            <h3 className="text-lg font-semibold text-tahiti-500">Zyra Customer Service</h3>
          </div>
          <div className="flex flex-col border border-tahiti-500 rounded-lg overflow-hidden h-screen w-4/5 min-h-80">
            <div className="p-4 font-semibold text-center bg-tahiti-500 text-white flex items-center">
              <img src={botIcon} alt="Bot Icon" className="w-12 h-12 mr-4" />
              <div className="flex flex-col items-center justify-center w-full">
                <div>{greeting}</div>
                <div>Welcome to the Bank of Baroda, this is Zyra your AI assistant</div>
                
              </div>
              <button onClick={handleLogout} className="text-white font-semibold">
                Logout
              </button>
            </div>
            <div
              className="chat-background flex-1 overflow-y-auto p-4"
              ref={chatContainerRef}
            >
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-center mb-4">
                    <p className="text-xl">नमस्कार 🙏🏻, बैंक ऑफ़ बड़ौदा के चैटबॉट Zyra की तरफ से आपका हार्दिक स्वागत !</p>
                    <p className="text-xl">Greetings 🙏🏻, Welcome to Bank of Baroda Zyra!</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((entry, index) => (
                  <div key={index} className="mb-4 overflow-y-auto p-4">
                    <div className="flex justify-end mb-2">
                      <div className="rounded-lg p-2 max-w-xs bg-tahiti-500 text-white break-words">{entry.user}</div>
                    </div>
                    <div className="flex justify-start items-start">
                      <img src={botIcon} alt="Bot Icon" className="w-8 h-8 mr-2" />
                      {entry.bot === '...' ? (
                        <div className="bot-spinner">
                          <div className="spinner"></div>
                        </div>
                      ) : (
                        <pre className="bg-tahiti-300 rounded-lg p-2 max-w-xs overflow-x-auto whitespace-pre-wrap break-words">{entry.bot}</pre>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center p-4">
              <input
                type="text"
                className="flex-1 border border-tahiti-500 rounded-lg p-2 mr-2"
                placeholder="Ask Zyra here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                autoFocus
              />
              <button
                onClick={handleSendMessage}
                className="rounded-lg p-2 text-tahiti-500"
                disabled={isLoading}
              >
                {isLoading ? <div className="spinner"></div> : <img src={sendIcon} alt="Send" className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
