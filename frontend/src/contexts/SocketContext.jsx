import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useUser } from './UserContext'; // Assuming this is where login/logout is handled

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, logout } = useUser(); // Get user state from your UserContext

  useEffect(() => {
    // Only connect if the user is logged in
    if (user && !socket) {
      const token = localStorage.getItem('token');
      
      if (token) {
        const newSocket = io('http://localhost:5000', {
          auth: {
            token: token
          }
        });

        newSocket.on('connect', () => {
          console.log('✅ Socket connected:', newSocket.id);
          setSocket(newSocket);
        });

        newSocket.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
          // If token is invalid, log the user out
          if (err.message.includes('Invalid token')) {
            logout(); // Assuming you have a logout function
          }
        });

        setSocket(newSocket);
      }
    } else if (!user && socket) {
      // If user logs out, disconnect the socket
      socket.disconnect();
      setSocket(null);
      console.log('Socket disconnected due to logout');
    }

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, socket, logout]); // Re-run on user or socket state change

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
