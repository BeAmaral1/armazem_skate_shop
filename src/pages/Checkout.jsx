import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Smartphone, Barcode } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCoupons } from '../context/CouponsContext';
import CouponInput from '../components/CouponInput';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { appliedCoupon, calculateDiscount, isFreeShipping, markCouponAsUsed, removeCoupon } = useCoupons();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit');

  const subtotal = getCartTotal();
  const discount = calculateDiscount(subtotal);
  const shipping = isFreeShipping() || subtotal >= 299 ? 0 : 25;
  const total = subtotal - discount + shipping;

  if (cart.length === 0) {
    navigate('/carrinho');
    return null;
  }

  const handleFinishPurchase = (e) => {
    e.preventDefault();
    // Marcar cupom como usado se aplicado
    if (appliedCoupon) {
      markCouponAsUsed(appliedCoupon.code);
    }
    // Simulate successful purchase
    clearCart();
    removeCoupon();
    navigate('/pedido-confirmado');
  };

  const StepIndicator = ({ stepNumber, title, active, completed }) => (
    <div className="flex items-center">
      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-sm sm:text-base ${
        completed ? 'bg-dark-700 text-white' :
        active ? 'bg-dark-600 text-white' :
        'bg-gray-200 text-gray-500'
      }`}>
        {completed ? <Check className="w-4 h-4 sm:w-6 sm:h-6" /> : stepNumber}
      </div>
      <div className="ml-2 sm:ml-3">
        <div className={`text-xs sm:text-sm font-semibold ${active ? 'text-dark-600' : completed ? 'text-dark-700' : 'text-gray-500'}`}>
          <span className="hidden sm:inline">{title}</span>
          <span className="sm:hidden">{title.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-6 sm:mb-8">
          Finalizar Compra
        </h1>

        {/* Steps Indicator */}
        <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            <StepIndicator stepNumber={1} title="Dados Pessoais" active={step === 1} completed={step > 1} />
            <div className={`flex-1 h-1 mx-2 sm:mx-4 ${step > 1 ? 'bg-dark-700' : 'bg-gray-200'}`}></div>
            <StepIndicator stepNumber={2} title="Endereço" active={step === 2} completed={step > 2} />
            <div className={`flex-1 h-1 mx-2 sm:mx-4 ${step > 2 ? 'bg-dark-700' : 'bg-gray-200'}`}></div>
            <StepIndicator stepNumber={3} title="Pagamento" active={step === 3} completed={false} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleFinishPurchase} className="bg-white rounded-xl p-4 sm:p-6">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                    Dados Pessoais
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input type="text" required className="input-field" placeholder="João Silva" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF *
                      </label>
                      <input type="text" required className="input-field" placeholder="000.000.000-00" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <input type="email" required className="input-field" placeholder="joao@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <input type="tel" required className="input-field" placeholder="(11) 99999-9999" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-primary w-full md:w-auto"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                    Endereço de Entrega
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CEP *
                      </label>
                      <input type="text" required className="input-field" placeholder="00000-000" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço *
                      </label>
                      <input type="text" required className="input-field" placeholder="Rua, Avenida..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número *
                      </label>
                      <input type="text" required className="input-field" placeholder="123" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complemento
                      </label>
                      <input type="text" className="input-field" placeholder="Apto, Bloco..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro *
                      </label>
                      <input type="text" required className="input-field" placeholder="Centro" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input type="text" required className="input-field" placeholder="São Paulo" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <select required className="input-field">
                        <option value="">Selecione</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        {/* Add more states */}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-outline"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="btn-primary"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                    Forma de Pagamento
                  </h2>

                  <div className="space-y-3">
                    {/* Credit Card */}
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'credit' ? 'border-dark-600 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="credit"
                        checked={paymentMethod === 'credit'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-dark-600"
                      />
                      <CreditCard className="w-6 h-6 ml-3 text-gray-700" />
                      <span className="ml-3 font-semibold text-gray-900">Cartão de Crédito</span>
                      <span className="ml-auto text-sm text-gray-600">Em até 10x sem juros</span>
                    </label>

                    {/* Pix */}
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'pix' ? 'border-dark-600 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="pix"
                        checked={paymentMethod === 'pix'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-dark-600"
                      />
                      <Smartphone className="w-6 h-6 ml-3 text-gray-700" />
                      <span className="ml-3 font-semibold text-gray-900">Pix</span>
                      <span className="ml-auto text-sm text-dark-700 font-semibold">5% de desconto</span>
                    </label>

                    {/* Boleto */}
                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === 'boleto' ? 'border-dark-600 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="boleto"
                        checked={paymentMethod === 'boleto'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-dark-600"
                      />
                      <Barcode className="w-6 h-6 ml-3 text-gray-700" />
                      <span className="ml-3 font-semibold text-gray-900">Boleto Bancário</span>
                      <span className="ml-auto text-sm text-gray-600">Vencimento em 3 dias</span>
                    </label>
                  </div>

                  {paymentMethod === 'credit' && (
                    <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número do Cartão *
                        </label>
                        <input type="text" required className="input-field" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Validade *
                          </label>
                          <input type="text" required className="input-field" placeholder="MM/AA" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input type="text" required className="input-field" placeholder="123" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome no Cartão *
                        </label>
                        <input type="text" required className="input-field" placeholder="JOÃO SILVA" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parcelas *
                        </label>
                        <select required className="input-field">
                          <option>1x de R$ {total.toFixed(2).replace('.', ',')}</option>
                          <option>2x de R$ {(total / 2).toFixed(2).replace('.', ',')}</option>
                          <option>3x de R$ {(total / 3).toFixed(2).replace('.', ',')}</option>
                          <option>10x de R$ {(total / 10).toFixed(2).replace('.', ',')}</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-outline"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      Finalizar Compra
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</div>
                      <div className="text-xs text-gray-600">Qtd: {item.quantity}</div>
                      <div className="text-sm font-bold text-dark-600">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cupom de Desconto */}
              <div className="mb-6 pb-6 border-b">
                <CouponInput cartTotal={subtotal} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Desconto</span>
                    <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className={shipping === 0 ? 'text-dark-700 font-semibold' : ''}>
                    {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                  <span>Total</span>
                  <span className="text-dark-600">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
