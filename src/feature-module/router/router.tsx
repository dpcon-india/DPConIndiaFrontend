import React, { useEffect, useRef, useState } from 'react';
import { authRoutes, publicRoutes } from './router.link';
import { Route, Routes } from 'react-router-dom';
import AuthFeature from '../authFeature';
import { Modal } from 'react-bootstrap';
import Feature from '../feature';
import useRealTimeBookings from '../../hooks/StaffRealTimeBooking';
import axios from 'axios';
import { api } from '../../config';
import {
  updateBooking,
  updateBookingStaff,
  updateBookingStatus,
  updateStaff,
} from '../../APICalls';
import './requestingModal.css';
import tone from '../../hooks/tone.mp3';
const AllRoutes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bookings, setBookings } = useRealTimeBookings();
  const [feedback, setFeedback] = useState<any>({});
  const [isRinging, setIsRinging] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const ringToneRef = useRef<HTMLAudioElement>(new Audio(tone));
  const ringTone = ringToneRef.current;
  const closeModal = () => {
    setIsModalOpen(false);
    ringTone.loop = false;
    ringTone.pause();
  };
  useEffect(() => {
    const id = JSON.parse(localStorage.getItem('user') || '{}')?._id;
    const isInBooking = bookings.filter((e: any) => {
      return e.serviceId?.staff.includes(id);
    });
    if (isInBooking.length <= 0) return;
    if (bookings?.length == 0) {
      ringTone.loop = false;
      ringTone.pause();
      setIsRinging(false);
      setIsModalOpen(false);
      return;
    }
    if (bookings?.length > 0) setIsModalOpen(true);
    if (
      bookings?.some(
        (booking: any) => booking?.status === 'pending' && !isRinging,
      )
    ) {
      ringTone.loop = true;
      ringTone.play();
      setIsRinging(true);
    } else {
      ringTone.loop = false;
      ringTone.pause();
      setIsRinging(false);
    }
  }, [bookings]);
  const handleAction = async (id: string, action: any) => {
    try {
      const endpoint = `${api}bookings/${id}/${action}`;
      const updateBook = await updateBookingStatus(action, id);
      const staff = JSON.parse(localStorage.getItem('user') || '{}')?._id;
      const updateBookSTaff = await updateBookingStaff(staff, id);
      const formData = new FormData();
      formData.append('isAssigned', 'assigned');
      // const updateS = await updateStaff(formData, staff);
      setFeedback({
        ...feedback,
        [id]: `${action} successfully `,
      });
      // Update the bookings state
      setBookings((prev: any) =>
        prev.filter((booking: any) => booking._id !== id),
      );
      if (action === 'accepted' || action === 'rejected') {
        ringTone.pause();
        setIsRinging(false);
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      setFeedback({ ...feedback, [id]: `Failed to ${action} booking` });
    }
  };
  const defaultProfileImage =
    'https://www.perfocal.com/blog/content/images/size/w960/2021/01/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg';
  return (
    <>
      <Modal
        show={isModalOpen}
        centered
        size="xl"
        onHide={closeModal}
        className="requesting-modal"
      >
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title">Welcome!</h2>
            <button className="close-btn" onClick={closeModal}>
              ×
            </button>
          </div>
          <div className="modal-body">
            {bookings.map((booking: any) => {
              const id = JSON.parse(localStorage.getItem('user') || '{}')?._id;
              if (!booking.serviceId?.staff.includes(id)) return;
              return (
                <div className="booking-card" key={booking?._id}>
                  <div className="card-header">
                    <img
                      src={
                        booking?.serviceId?.gallery[0] || defaultProfileImage
                      }
                      alt={`${booking?.customer}'s profile`}
                      style={{ height: '150px', width: '150px' }}
                      className="profile-image"
                    />
                    <div className="booking-info">
                      <p className="service-title">
                        <strong>Service:</strong>{' '}
                        {booking?.serviceId?.serviceTitle}
                      </p>
                      <p className="location-info">
                        <strong>Address:</strong> {booking?.location?.address}
                        <br />
                        <strong>Locality:</strong> {booking?.location?.locality}
                        <br />
                        <strong>Pincode:</strong> {booking?.location?.pincode}
                      </p>
                    </div>
                  </div>
                  {feedback[booking?._id] && (
                    <div className="feedback-message">
                      {feedback[booking?._id]}
                    </div>
                  )}
                  {booking?.status === 'pending' && (
                    <div className="action-buttons">
                      <button
                        className="btn accept-btn"
                        onClick={() => handleAction(booking?._id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="btn reject-btn"
                        onClick={() => {
                          // handleAction(booking?._id, 'rejected');
                          setBookings((prev: any) =>
                            prev.filter((b: any) => b._id !== booking?._id),
                          );
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="modal-footer">
            <button className="btn close-modal-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Routes>
        <Route element={<Feature />}>
          {publicRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>
        <Route element={<AuthFeature />}>
          {authRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>
      </Routes>
    </>
  );
};
export default AllRoutes;
