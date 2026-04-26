"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    removeItem, 
    updateQuantity, 
    getCartTotal, 
    getCartSubtotal, 
    getDeliveryCharges, 
    getDiscount 
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Routes to secure checkout (shipping + payment)
  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      alert("You must be logged in to access the secure vault.");
      setIsOpen(false);
      router.push('/login');
      return;
    }

    setCheckoutLoading(true);
    try {
      setIsOpen(false);
      router.push('/checkout');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error during checkout: ${message}`);
      console.error(err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-serif text-white tracking-widest uppercase flex items-center gap-2">
                <ShoppingBag size={20} className="text-[var(--color-gold)]" strokeWidth={1.5} />
                Your Cart
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-[var(--color-gold)] transition-colors p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="uppercase tracking-[0.2em] text-xs">Your collection is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="w-20 h-24 bg-black border border-white/5 rounded flex-shrink-0 p-2 flex items-center justify-center mix-blend-screen relative">
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.1)_0%,transparent_70%)]" />
                       <img src={item.imageUrl} alt={item.name} className="h-full object-contain filter drop-shadow-md relative z-10" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-serif text-white text-lg">{item.name}</h3>
                      <p className="text-[var(--color-gold-light)] text-sm tracking-widest">{item.displayPrice}</p>
                      
                      {/* Quantity Controller */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-white/10 rounded-sm">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-gray-400 hover:text-white transition-colors"><Minus size={14} /></button>
                          <span className="text-sm w-6 text-center text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-400 hover:text-white transition-colors"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-[10px] text-gray-500 hover:text-red-400 tracking-[0.2em] uppercase underline-offset-4 hover:underline transition-all">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
                


                <div className="space-y-2 mb-6 border-b border-white/5 pb-4">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
                    <span>Subtotal</span>
                    <span>PKR {getCartSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500">
                    <span>Delivery</span>
                    <span className={getDeliveryCharges() === 0 ? "text-green-500" : ""}>
                      {getDeliveryCharges() === 0 ? 'FREE' : `PKR ${getDeliveryCharges().toFixed(2)}`}
                    </span>
                  </div>
                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-green-500">
                      <span>Discount (10% OFF)</span>
                      <span>-PKR {getDiscount().toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm uppercase tracking-[0.2em] text-gray-400">Total</span>
                  <span className="text-2xl font-serif text-white tracking-widest">PKR {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button size="lg" className="w-full" onClick={handleCheckout} disabled={checkoutLoading}>
                  {checkoutLoading ? 'Opening Checkout…' : 'Secure Checkout'}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setIsOpen(false);
                      router.push(isAuthenticated ? '/orders' : '/login');
                    }}
                  >
                    My Orders
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
