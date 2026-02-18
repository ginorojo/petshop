"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ShoppingCart, PawPrint, MessageCircle, X, Plus, Minus, Heart, Search } from 'lucide-react';
// 1. CORRECCIÓN: Nombre de variable corregido a 'productosData' para coincidir con el resto del código
import productosData from '../data/productos.json'; 

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
}

interface CartItem extends Producto {
  cantidad: number;
}

export default function PetShopLanding() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  // --- CATEGORÍAS ÚNICAS ---
  const categorias = useMemo(() => {
    return ["Todos", ...Array.from(new Set(productosData.map(p => p.categoria)))];
  }, []);

  // --- FILTRADO DINÁMICO ---
  const filteredProducts = useMemo(() => {
    return productosData.filter(p => {
      const matchesSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "Todos" || p.categoria === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // --- LÓGICA DEL CARRITO ---
  const addToCart = (producto: Producto) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === producto.id);
      if (exists) {
        return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.cantidad + delta);
        return { ...item, cantidad: newQty };
      }
      return item;
    }).filter(item => item.cantidad > 0));
  };

  const total = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const checkoutWhatsApp = () => {
    const telefono = "56990000000"; // Reemplaza con tu número
    let mensaje = "¡Hola! Me gustaría comprar los siguientes productos:%0A%0A";
    cart.forEach(item => {
      mensaje += `- ${item.nombre} (x${item.cantidad}): $${(item.precio * item.cantidad).toFixed(2)}%0A`;
    });
    mensaje += `%0A*Total: $${total.toFixed(2)}*`;
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 scroll-smooth">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-600">
            <PawPrint size={32} />
            <span className="text-2xl font-black tracking-tight text-sky-600">PET<span className="text-green-500">HAPPY</span></span>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-sky-50 text-sky-600 rounded-full hover:bg-sky-100 transition-colors"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                {cart.reduce((a, b) => a + b.cantidad, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-12 px-6 bg-linear-to-b from-sky-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 order-2 md:order-1"
          >
            <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
              Lo mejor para tu peludo
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-sky-900 leading-tight">
              Felicidad en cada <br />
              <span className="text-green-500 italic">Miau y Guau.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-md leading-relaxed">
              Encuentra los juguetes más divertidos y el alimento más saludable para los reyes de la casa.
            </p>
            <a href="#catalogo" className="inline-block px-8 py-4 bg-sky-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-200 hover:bg-sky-600 transition-all">
                Explorar Ahora
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative order-1 md:order-2"
          >
            <img 
              src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80" 
              alt="Mascota Feliz" 
              className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500"
            />
          </motion.div>
        </div>
      </section>

      {/* BUSCADOR Y FILTROS */}
      <section id="catalogo" className="py-12 px-6 max-w-7xl mx-auto sticky top-20 bg-white/50 backdrop-blur-md z-30">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300" size={20} />
            <input 
              type="text" 
              placeholder="¿Qué busca tu mascota hoy?"
              className="w-full pl-12 pr-4 py-4 bg-sky-50 border border-sky-100 rounded-2xl focus:outline-none focus:border-sky-400 text-sky-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 no-scrollbar">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all border ${
                  activeCategory === cat 
                  ? "bg-green-500 border-green-500 text-white shadow-lg" 
                  : "bg-white border-sky-100 text-sky-400 hover:border-sky-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRILLA DE PRODUCTOS */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredProducts.map((producto) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={producto.id}
                  whileHover={{ y: -10 }}
                  className="bg-white border border-sky-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-[2px]">{producto.categoria}</span>
                    <h3 className="text-xl font-bold text-sky-900 mt-1 h-14 line-clamp-2">{producto.nombre}</h3>
                    <div className="flex items-center justify-between mt-6">
                      <span className="text-2xl font-black text-green-500">${producto.precio}</span>
                      <button 
                        onClick={() => addToCart(producto)}
                        className="p-3 bg-sky-500 text-white rounded-2xl hover:bg-green-500 transition-colors shadow-lg"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-sky-50 rounded-3xl border-2 border-dashed border-sky-100">
              <Search size={48} className="mx-auto text-sky-200 mb-4" />
              <p className="text-sky-400 font-bold">No encontramos lo que buscas</p>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* CARRITO */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-sky-900">
                    <ShoppingCart />
                    <h2 className="text-2xl font-black">Tu Carrito</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20 opacity-30">
                    <ShoppingCart size={80} className="mx-auto mb-4" />
                    <p className="font-bold">El carrito está vacío</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 items-center bg-sky-50/50 p-4 rounded-2xl">
                      <img src={item.imagen} className="w-16 h-16 rounded-xl object-cover" alt={item.nombre} />
                      <div className="flex-1">
                        <h4 className="font-bold text-sky-900 text-sm">{item.nombre}</h4>
                        <p className="text-green-500 font-black text-sm">${item.precio}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-white border rounded-lg"><Minus size={14} /></button>
                          <span className="font-bold text-sm">{item.cantidad}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-white border rounded-lg"><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-6 border-t mt-6 space-y-4">
                  <div className="flex justify-between text-2xl font-black text-sky-900">
                    <span>Total:</span>
                    <span className="text-green-500">${total.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={checkoutWhatsApp}
                    className="w-full py-4 bg-green-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-green-600 transition-all"
                  >
                    <MessageCircle size={24} />
                    Enviar Pedido por WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="bg-sky-50 py-12 text-center text-sky-300 text-sm font-bold border-t border-sky-100">
        <p>© 2026 PET HAPPY - Tienda de Mascotas Virtual</p>
      </footer>
    </div>
  );
}