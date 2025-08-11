import React, { useEffect, useState } from 'react';
import { CreateOrder } from '../../../../APICalls';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayIntegration = ({
  amount,
  submit,
}: {
  amount: number;
  submit: () => void;
}) => {
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject('Razorpay SDK failed to load');
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      const response = await CreateOrder(amount);
      if (response.status !== 200 || !response.json) {
        alert('Failed to create order. Please try again.');
        return;
      }

      const { orderId } = response.json;

      if (!orderId) {
        alert('Failed to create order. Please try again.');
        return;
      }

      interface RazorpayOptions {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        handler: (response: any) => void;
        prefill: {
          name: string;
          email: string;
          contact: string;
        };
        notes: {
          address: string;
        };
        theme: {
          color: string;
        };
      }

      const options: RazorpayOptions = {
        key: process.env.RAZORPAY_KEY ?? 'rzp_test_2rLW2LnoSMZI7t',
        amount: amount,
        currency: 'INR',
        name: 'DPCON',
        description: 'Payment for service booking',
        order_id: orderId,
        handler: async () => {
          submit();
        },
        prefill: {
          name: user?.name ?? '',
          email: user?.email ?? '',
          contact: user?.number ?? '',
        },
        notes: {
          address: 'dpconindia Corporate Office',
        },
        theme: {
          color: '#1f0e4e',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', () => {
        alert('Payment failed. Please try again.');
      });
    } catch (error) {
      alert('Error initiating payment. Please try again.');
    }
  };

  return (
    <div className="booking-pay">
      <button className="btn btn-dark w-100" onClick={handlePayment}>
      Proceed to Pay ₹{amount}
      </button>
    </div>
  );
};

export default RazorpayIntegration;