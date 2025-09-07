// frontend/src/components/CategorySection.jsx
import React from 'react';

const CategorySection = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'sports', name: 'Sports & Fitness' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'books', name: 'Books' },
  ];

  return (
    <div className="py-20 w-full">
      <div className="w-full">
        <h2 className="text-3xl font-bold text-white mb-16 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 w-full mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-6 py-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-center w-full ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
