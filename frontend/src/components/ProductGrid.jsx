// frontend/src/components/ProductGrid.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from './LoadingSpinner';

const ProductGrid = ({ searchQuery, selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart: addItemToCart } = useCart();

  const handleAddToCart = async (product) => {
    const result = await addItemToCart(product._id, 1, product);
    if (!result.success) {
      console.error('Failed to add to cart:', result.error);
    }
  };

  // Sample products for demonstration
  const sampleProducts = [
    {
      _id: '1',
      title: 'Wireless Headphones',
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1612858249937-1cc0852093dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'electronics',
      description: 'Premium wireless headphones with noise cancellation'
    },
    {
      _id: '2',
      title: 'Smart Watch',
      name: 'Smart Watch',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'electronics',
      description: 'Advanced fitness tracking and notifications'
    },
    {
      _id: '3',
      title: 'Coffee Maker',
      name: 'Coffee Maker',
      price: 149.99,
      image: 'https://plus.unsplash.com/premium_photo-1661722983090-11783531c332?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'home',
      description: 'Programmable coffee maker with thermal carafe'
    },
    {
      _id: '4',
      title: 'Running Shoes',
      name: 'Running Shoes',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1585944672394-4c58a015c1fb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'sports',
      description: 'Comfortable running shoes for daily training'
    },
    {
      _id: '5',
      title: 'Backpack',
      name: 'Backpack',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'accessories',
      description: 'Durable backpack for everyday use'
    },
    {
      _id: '6',
      title: 'Desk Lamp',
      name: 'Desk Lamp',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      category: 'home',
      description: 'Adjustable LED desk lamp'
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = '/items';
        const params = new URLSearchParams();
        
        if (selectedCategory && selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await api.get(url);
        setProducts(response.data.length > 0 ? response.data : sampleProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const filteredProducts = products.filter(product => {
    const productName = product.title || product.name || '';
    const matchesSearch = !searchQuery || productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = async (productId) => {
    try {
      await api.post('/api/cart', { itemId: productId, quantity: 1 });
      // Show success message or update cart count
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="large" color="blue" />
          <div className="text-white text-xl">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center max-w-6xl mx-auto">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border border-gray-700 hover:border-gray-600 w-full max-w-sm"
            >
              <div className="relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <button className="bg-black bg-opacity-60 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-opacity-80 transition-all duration-200">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-white font-bold text-xl mb-3 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-white">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:shadow-blue-600/25"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                      />
                    </svg>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No products found</div>
          <div className="text-gray-500 text-sm mt-2">Try adjusting your search or category filter</div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
