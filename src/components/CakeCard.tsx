import type { Cake } from '../types';
import { useCart } from '../context/CartContext';

interface CakeCardProps {
  cake: Cake;
}

const CakeCard = ({ cake }: CakeCardProps) => {
  const { addToCart } = useCart();

  return (
    <div className="cake-card">
      <img src={cake.image} alt={cake.name} className="cake-image" />
      <div className="cake-info">
        <h3>{cake.name}</h3>
        <p className="cake-description">{cake.description}</p>
        <div className="cake-footer">
          <span className="cake-price">${cake.price.toFixed(2)}</span>
          <button onClick={() => addToCart(cake)} className="btn-add-cart">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CakeCard;
