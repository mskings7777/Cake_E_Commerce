import { Link } from 'react-router-dom';
import { cakes } from '../data/cakes';
import CakeCard from '../components/CakeCard';

const Home = () => {
  const featuredCakes = cakes.slice(0, 3);

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Cake Heaven</h1>
        <p>Delicious handcrafted cakes for every occasion</p>
        <Link to="/products" className="btn-primary">
          Shop Now
        </Link>
      </section>

      <section className="featured-section">
        <h2>Featured Cakes</h2>
        <div className="cake-grid">
          {featuredCakes.map(cake => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
