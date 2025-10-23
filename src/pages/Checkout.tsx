import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: ''
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          cakeId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: getCartTotal() + 5.99,
        shippingCost: 5.99,
        paymentMethod,
        paymentDetails: {
          cardHolderName: paymentDetails.cardHolderName,
          cardNumber: paymentMethod === 'credit_card' || paymentMethod === 'debit_card' ? paymentDetails.cardNumber.slice(-4) : undefined,
          upiId: paymentMethod === 'upi' ? paymentDetails.upiId : undefined,
          bankName: paymentMethod === 'net_banking' ? paymentDetails.bankName : undefined,
          transactionId: 'TXN' + Date.now()
        },
        shippingAddress
      };

      const response = await axios.post('http://localhost:5001/api/orders', orderData);
      
      clearCart();
      navigate('/order-success', { state: { order: response.data } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-form">
          <section className="form-section">
            <h2>Shipping Address</h2>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={shippingAddress.fullName}
                onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <textarea
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                required
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Credit Card</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  value="debit_card"
                  checked={paymentMethod === 'debit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Debit Card</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>UPI</span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  value="net_banking"
                  checked={paymentMethod === 'net_banking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Net Banking</span>
              </label>
            </div>

            {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
              <div className="payment-details">
                <div className="form-group">
                  <label>Card Holder Name *</label>
                  <input
                    type="text"
                    value={paymentDetails.cardHolderName}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardHolderName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Card Number *</label>
                  <input
                    type="text"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input
                      type="text"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input
                      type="text"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                      placeholder="123"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="payment-details">
                <div className="form-group">
                  <label>UPI ID *</label>
                  <input
                    type="text"
                    value={paymentDetails.upiId}
                    onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})}
                    placeholder="yourname@upi"
                    required
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'net_banking' && (
              <div className="payment-details">
                <div className="form-group">
                  <label>Bank Name *</label>
                  <select
                    value={paymentDetails.bankName}
                    onChange={(e) => setPaymentDetails({...paymentDetails, bankName: e.target.value})}
                    required
                  >
                    <option value="">Select Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="Axis">Axis Bank</option>
                    <option value="Kotak">Kotak Mahindra Bank</option>
                  </select>
                </div>
              </div>
            )}
          </section>

          <button type="submit" className="btn-place-order" disabled={loading}>
            {loading ? 'Processing...' : `Pay $${(getCartTotal() + 5.99).toFixed(2)}`}
          </button>
        </form>

        <div className="order-summary-sidebar">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>$5.99</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(getCartTotal() + 5.99).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
