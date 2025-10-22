import { useState } from 'react';
import { cakes } from '../data/cakes';
import CakeCard from '../components/CakeCard';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(cakes.map(cake => cake.category)))];

  const filteredCakes = selectedCategory === 'All'
    ? cakes
    : cakes.filter(cake => cake.category === selectedCategory);

  return (
    <div className="products-page">
      <h1>Our Cakes</h1>
      
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="cake-grid">
        {filteredCakes.map(cake => (
          <CakeCard key={cake.id} cake={cake} />
        ))}
      </div>
    </div>
  );
};

export default Products;
