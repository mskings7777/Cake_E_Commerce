import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="order-success">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="order-details">
          <h2>Order Details</h2>
          <div className="detail-row">
            <span>Order ID:</span>
            <span className="detail-value">{order._id}</span>
          </div>
          <div className="detail-row">
            <span>Transaction ID:</span>
            <span className="detail-value">{order.paymentDetails?.transactionId}</span>
          </div>
          <div className="detail-row">
            <span>Total Amount:</span>
            <span className="detail-value">${order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span>Payment Method:</span>
            <span className="detail-value">{order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div className="detail-row">
            <span>Status:</span>
            <span className="status-badge">{order.status}</span>
          </div>
        </div>

        <div className="order-items">
          <h3>Items Ordered</h3>
          {order.items.map((item: any, index: number) => (
            <div key={index} className="order-item-row">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="success-actions">
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
          <Link to="/orders" className="btn-secondary">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
