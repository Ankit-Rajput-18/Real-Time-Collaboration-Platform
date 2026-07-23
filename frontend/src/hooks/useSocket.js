import { useEffect, useState } from 'react';
import { connectSocket, getSocket } from '../services/socket';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socketInstance = connectSocket();
      setSocket(socketInstance);

      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        socketInstance.emit('user-login', user.id);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      return () => {
        socketInstance.off('connect');
        socketInstance.off('disconnect');
      };
    }
  }, [user]);

  return { socket: getSocket(), connected };
};
