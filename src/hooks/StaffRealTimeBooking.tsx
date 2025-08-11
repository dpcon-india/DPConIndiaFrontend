import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { api, BaseApi } from '../config';

const useRealTimeBookings = () => {
  const [bookings, setBookings] = useState<any>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socketInstance: any = io(BaseApi, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on('connected', (message: string) => {
      console.log(message);
    });

    socketInstance.on('newBooking', (booking: any) => {
      toast.info(`New Booking: ${booking?.details}`);
      setBookings((prev: any) => [...prev, booking]);
    });

    socketInstance.on('bookingAccepted', (updatedBooking: any) => {
      setBookings((prev: any) =>
        prev?.filter((booking: any) => booking._id !== updatedBooking._id),
      );
    });

    socketInstance.on('bookingRejected', (updatedBooking: any) => {
      setBookings((prev: any) =>
        prev?.filter((booking: any) => booking._id !== updatedBooking._id),
      );
    });

    socketInstance.on('disconnect', (reason: any) => {
      console.warn('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        socketInstance.connect();
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { bookings, setBookings };
};

export default useRealTimeBookings;
