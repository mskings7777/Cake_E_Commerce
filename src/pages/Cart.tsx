import { Link, Outlet, useLocation } from 'react-router-dom';

const Cart = () => {
  const location = useLocation();
  const isCurrentCart = location.pathname === '/cart' || location.pathname === '/cart/current';
  const isOrderHistory = location.pathname === '/cart/orders';

  return (
    <div className="cart-page">
      <div className="cart-tabs">
        <Link 
          to="/cart/current" 
          className={`cart-tab ${isCurrentCart ? 'active' : ''}`}
        >
          Current Cart
        </Link>
        <Link 
          to="/cart/orders" 
          className={`cart-tab ${isOrderHistory ? 'active' : ''}`}
        >
          Order History
        </Link>
      </div>

      <div className="cart-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Cart;
