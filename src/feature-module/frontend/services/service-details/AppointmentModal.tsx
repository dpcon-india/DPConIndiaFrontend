import React, { useState, useEffect } from 'react';
import { bookAppointment } from '../../../../APICalls';

interface AppointmentModalProps {
  show: boolean;
  onClose: () => void;
  serviceId?: string; // Ensure parent passes this
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  show,
  onClose,
  serviceId,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    serviceDetails: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('User not logged in. Please log in first.');
      setLoading(false);
      return;
    }

    const user = JSON.parse(userData);
    const userId = user._id;

    if (!serviceId) {
      alert('Service ID is missing. Please select a service.');
      setLoading(false);
      return;
    }

    try {
      const response = await bookAppointment({
        ...formData,
        userId,
        serviceId,
      });
      alert(response?.message || 'Appointment booked successfully!');
      onClose();
      setFormData({ name: '', date: '', time: '', serviceDetails: '' });
    } catch (error) {
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [show]);

  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Book Service</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            {/* <label>Name:</label> */}
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            {/* <label>Date:</label> */}
            <input
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]} // 👈 This sets the minimum date to today
              required
            />
          </div>
          <div className="mb-3">
            {/* <label>Time:</label> */}
            <input
              type="time"
              name="time"
              className="form-control"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            {/* <label>Service Details:</label> */}
            <textarea
              name="serviceDetails"
              className="form-control"
              placeholder="Enter details"
              value={formData.serviceDetails}
              onChange={handleChange}
              required
            />
          </div>
          {/* <button type="submit" className="btn btn-#011339 w-100" disabled={loading}>
            {loading ? "Booking..." : "Submit"}
          </button>
          <button type="button" className="btn btn-#cf832c w-100 mt-2" onClick={onClose}>
            Close
          </button> */}
          <button
            type="submit"
            className="btn w-100"
            style={{
              background: '#011339',
              border: 'none',
              color: '#fff',
            }}
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Submit'}
          </button>

          <button
            type="button"
            className="btn w-100 mt-2"
            style={{
              background: '#cf832c',
              border: 'none',
              color: '#fff',
            }}
            onClick={onClose}
          >
            Close
          </button>
        </form>
      </div>

      <style>{`
        .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Must be higher than Swiper */
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 10000; /* Higher than overlay */
}

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AppointmentModal;
