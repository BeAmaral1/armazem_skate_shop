import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Retornaremos em breve.');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
            Entre em Contato
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Tem alguma dúvida? Nossa equipe está pronta para te ajudar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-dark-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-gray-900 mb-2">Endereço</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Av. Atlântica, 1500<br />
                    Copacabana, Rio de Janeiro - RJ<br />
                    CEP: 22021-001
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-dark-600" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900 mb-2">Telefone</h3>
                  <p className="text-gray-600">
                    (21) 3456-7890<br />
                    (21) 98765-4321
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-dark-600" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900 mb-2">E-mail</h3>
                  <p className="text-gray-600">
                    contato@armazemskate.com.br<br />
                    vendas@armazemskate.com.br
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-dark-600" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900 mb-2">Horário</h3>
                  <p className="text-gray-600">
                    Segunda a Sexta: 9h às 19h<br />
                    Sábado: 9h às 14h<br />
                    Domingo: Fechado
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                Envie sua Mensagem
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <select required className="input-field">
                      <option value="">Selecione</option>
                      <option value="duvida">Dúvida sobre produto</option>
                      <option value="pedido">Acompanhamento de pedido</option>
                      <option value="troca">Troca e devolução</option>
                      <option value="sugestao">Sugestão</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Digite sua mensagem aqui..."
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full md:w-auto flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Mapa de Localização</p>
                <p className="text-sm">Av. Atlântica, 1500 - Copacabana, RJ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
