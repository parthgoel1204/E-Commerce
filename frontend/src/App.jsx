// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ModernHeader from './components/ModernHeader';
import ProductGrid from './components/ProductGrid';
import CategorySection from './components/CategorySection';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-900">
            <ModernHeader 
              onCartClick={() => setShowCart(true)}
              onAuthClick={(mode) => {
                setAuthMode(mode);
                setShowAuth(true);
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            
            <main className="w-full flex justify-center">
              <div className="w-full max-w-7xl px-6">
                <CategorySection 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
                
                <ProductGrid 
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                />
              </div>
            </main>

            {showCart && <Cart onClose={() => setShowCart(false)} />}
            
            {showAuth && (
              <AuthModal
                mode={authMode}
                onClose={() => setShowAuth(false)}
                onSwitchMode={setAuthMode}
              />
            )}
          </div>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;