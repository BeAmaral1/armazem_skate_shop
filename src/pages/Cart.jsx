import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-4">
            Seu carrinho está vazio
          </h1>
          <p className="text-gray-600 mb-8">
            Adicione produtos ao carrinho para continuar comprando
          </p>
          <Link to="/produtos" className="btn-primary">
            Explorar Produtos
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal >= 299 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 min-h-screen py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <Link to="/produtos" className="inline-flex items-center gap-2 text-dark-600 hover:text-dark-700 mb-4 sm:mb-6 text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Continuar Comprando</span>
          <span className="sm:hidden">Voltar</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-6 sm:mb-8">
          Carrinho de Compras
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
              {cart.map((item, index) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b last:border-b-0 last:pb-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <Link to={`/produto/${item.id}`} className="text-sm sm:text-base font-semibold text-gray-900 hover:text-dark-600 transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-600 mt-1">
                      {item.selectedSize && <span>Tamanho: {item.selectedSize}</span>}
                      {item.selectedSize && item.selectedColor && <span> • </span>}
                      {item.selectedColor && <span>Cor: {item.selectedColor}</span>}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-dark-600 mt-2">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                        className="w-8 h-8 border-2 border-gray-300 rounded hover:border-dark-600 transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                        className="w-8 h-8 border-2 border-gray-300 rounded hover:border-dark-600 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className={shipping === 0 ? 'text-dark-700 font-semibold' : ''}>
                    {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                {subtotal < 299 && (
                  <div className="text-sm text-gray-500 bg-sand-50 p-3 rounded">
                    Faltam R$ {(299 - subtotal).toFixed(2).replace('.', ',')} para frete grátis
                  </div>
                )}
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-dark-600">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary mb-4"
              >
                Finalizar Compra
              </button>

              <Link to="/produtos" className="block text-center text-dark-600 hover:text-dark-700 font-semibold">
                Adicionar mais produtos
              </Link>

              <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                <div>✓ Parcelamento em até 10x sem juros</div>
                <div>✓ Entrega para todo o Brasil</div>
                <div>✓ Compra 100% segura</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
