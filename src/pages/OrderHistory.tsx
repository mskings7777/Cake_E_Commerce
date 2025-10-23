import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface OrderItem {
  cakeId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupOrdersByDate = () => {
    const grouped: { [key: string]: Order[] } = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const dateKey = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(order);
    });

    return grouped;
  };

  if (loading) {
    return <div className="loading">Loading order history...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-cart">
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet. Start shopping!</p>
      </div>
    );
  }

  const groupedOrders = groupOrdersByDate();

  return (
    <div className="order-history">
      <h2>Order History</h2>
      {Object.entries(groupedOrders).map(([date, dateOrders]) => (
        <div key={date} className="order-date-group">
          <h3 className="order-date-header">{date}</h3>
          {dateOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className={`order-status status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <span className="order-total">${order.totalAmount.toFixed(2)}</span>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-info">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p className="order-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod.replace('_', ' ').toUpperCase()}
                </p>
                <p>
                  <strong>Shipping:</strong> ${order.shippingCost.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
