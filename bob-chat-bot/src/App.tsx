// App.tsx
import React from 'react';
import ChatBox from './component/ChatBox';

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ChatBox />
    </div>
  );
}

export default App;
