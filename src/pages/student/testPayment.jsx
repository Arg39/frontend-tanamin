import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payment = () => {
  useEffect(() => {
    // Dynamically load the Midtrans Snap script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'SB-Mid-client-WY2U1jxilnBKKapa');
    script.async = true;
    script.onload = () => {
      console.log('Midtrans Snap script loaded successfully!');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const createOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buat order di backend
      const response = await axios.post('http://localhost:8001/api/orders', {
        name: 'Budi',
        email: 'budi@example.com',
        amount: 150000,
      });

      // Simpan order dari response
      setOrder(response.data.order);

      // Panggil Midtrans Snap dengan token
      const snapToken = response.data.snap_token;

      const snap = window.snap;
      snap.pay(snapToken, {
        onSuccess: function (result) {
          console.log('Payment Success:', result);
          updatePaymentStatus(result);
        },
        onPending: function (result) {
          console.log('Payment Pending:', result);
        },
        onError: function (result) {
          console.log('Payment Error:', result);
        },
      });
    } catch (err) {
      setError('Failed to create order or initiate payment.');
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentResult) => {
    try {
      // Kirim status pembayaran ke backend
      await axios.post('http://localhost:8000/api/midtrans/webhook', paymentResult);
    } catch (err) {
      console.error('Failed to update payment status', err);
    }
  };

  return (
    <div>
      <h1>Payment Page</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!order && <button onClick={createOrder}>Create Order and Pay</button>}
      {order && (
        <div>
          <p>Order Code: {order.order_code}</p>
          <p>Total Amount: {order.amount}</p>
        </div>
      )}
    </div>
  );
};

export default Payment;
