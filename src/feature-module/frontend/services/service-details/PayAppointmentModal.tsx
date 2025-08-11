import React, { useState, useEffect } from 'react';
import {
  createPaymentOrder,
  verifyAndCreateAppointment,
} from '../../../../APICalls';

interface AppointmentModalProps {
  show: boolean;
  onClose: () => void;
  serviceId?: string;
}

interface PaymentResponse {
  success: boolean;
  message?: string;
  order?: any;
}

interface FormData {
  name: string;
  date: string;
  time: string;
  serviceDetails: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PayAppointmentModal: React.FC<AppointmentModalProps> = ({
  show,
  onClose,
  serviceId,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    date: '',
    time: '',
    serviceDetails: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRazorpayScript = async () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
      } else {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () =>
          reject(new Error('Failed to load Razorpay script'));
        document.body.appendChild(script);
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?._id) throw new Error('User not logged in');

      // Create payment order
      const response = await createPaymentOrder({
        userId: user._id,
        serviceId,
        name: formData.name,
        date: formData.date,
        time: formData.time,
        serviceDetails: formData.serviceDetails,
        amount: 1000,
      });

      if (!response?.success || !response.order) {
        throw new Error(
          response?.success.message || 'Failed to create payment order',
        );
      }

      // Load Razorpay script
      await loadRazorpayScript();
      if (!window.Razorpay) throw new Error('Razorpay SDK failed to load');

      // Initialize Razorpay payment
      const options = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        key: process.env.REACT_APP_RAZORPAY_KEY_ID!,
        amount: response.order.amount,
        currency: 'INR',
        order_id: response.order.id,
        name: 'DpconIndia',
        prefill: {
          name: formData.name,
          email: user.email || '',
          contact: user.phone || '',
        },
        handler: async (response: any) => {
          try {
            const verification = await verifyAndCreateAppointment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verification.success) {
              onClose();
              setFormData({ name: '', date: '', time: '', serviceDetails: '' });
            } else {
              throw new Error(
                verification.success.message || 'Payment verification failed',
              );
            }
          } catch (error) {
            console.error('Verification error:', error);
            setError(
              error instanceof Error
                ? error.message
                : 'Payment verification failed',
            );
          }
        },
        modal: {
          ondismiss: () => {
            setError(
              'Payment cancelled. Please complete payment to confirm booking.',
            );
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error('Booking error:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to initiate booking',
      );
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
        <h3>Book A Detailed Estimation Survey (₹1000)</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
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
            <input
              type="date"
              name="date"
              className="form-control"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
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
            <textarea
              name="serviceDetails"
              className="form-control"
              placeholder="Enter details"
              value={formData.serviceDetails}
              onChange={handleChange}
              required
            />
          </div>

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
            {loading ? 'Booking...' : 'Pay Now'}
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
      <style>
        {`
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
            z-index: 1050;
          }

          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            position: relative;
            animation: fadeIn 0.3s ease-in-out;
          }

          body.modal-open {
            overflow: hidden;
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
        `}
      </style>
    </div>
  );
};

export default PayAppointmentModal;
