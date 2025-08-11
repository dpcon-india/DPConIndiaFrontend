import React, { useState, useEffect } from 'react';
import useRealTimeBookings from './StaffRealTimeBooking';
import axios from 'axios';
import './StaffDashboard.css';
import tone from './tone.mp3';
import { formDataHeader } from '../config';

const StaffDashboard = () => {
  const bookings = useRealTimeBookings();
  const [feedback, setFeedback] = useState<any>({});
  const [isRinging, setIsRinging] = useState(false);

  const defaultProfileImage =
    'https://www.perfocal.com/blog/content/images/size/w960/2021/01/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg';

  const base64Audio = tone;

  const ringTone = new Audio(base64Audio);

  useEffect(() => {
    if (
      bookings.some(
        (booking: any) => booking?.status === 'pending' && !isRinging,
      )
    ) {
      ringTone.loop = true;
      ringTone.play();
      setIsRinging(true);
    } else {
      ringTone.pause();
      setIsRinging(false);
    }
  }, [bookings]);

  const handleAction = async (id: string, action: any) => {
    const staffName = 'John Doe';
    try {
      const endpoint = `https://bookingapp-tp81.onrender.com/api/bookings/${id}/${action}`;
      await axios.put(endpoint, { staffName }, formDataHeader);
      setFeedback({
        ...feedback,
        [id]: `${action === 'accept' ? 'Accepted' : 'Rejected'} successfully `,
      });
      if (action === 'accept' || action === 'reject') {
        ringTone.pause();
        setIsRinging(false);
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      setFeedback({ ...feedback, [id]: `Failed to ${action} booking` });
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Staff Dashboard</h1>
      <div className="bookings-list">
        {bookings.map((booking: any) => (
          <div className="booking-card" key={booking?._id}>
            <img
              src={booking?.serviseId?.image || defaultProfileImage}
              alt={`${booking?.customer}'s profile`}
              className="profile-image"
            />
            <div className="booking-info">
              <p>
                <strong>Customer:</strong> {booking?.serviceId?.serviceTitle}
              </p>
              <p>
                <strong>Address:</strong> {booking?.location?.address}
                <strong>Locality:</strong> {booking?.location?.locality}
                <strong>pincode:</strong> {booking?.location?.pincode}
              </p>
            </div>
            {feedback[booking?._id] && (
              <div className="feedback-message">{feedback[booking?._id]}</div>
            )}
            {booking?.status === 'pending' && (
              <div className="action-buttons">
                <button
                  className="accept-btn"
                  onClick={() => handleAction(booking?._id, 'accept')}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleAction(booking?._id, 'reject')}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
