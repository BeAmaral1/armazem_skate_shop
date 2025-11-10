import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, ArrowLeft, RefreshCw, Shield } from 'lucide-react';
import SEO from '../components/SEO';

const ReturnsPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO 
        title="Trocas e Devoluções - Armazém Skate Shop"
        description="Política de trocas e devoluções. Garantia de satisfação em todas as compras."
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-2 text-dark-600 hover:text-dark-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar para Home</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-dark-100 rounded-full flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-dark-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-dark-900">Trocas e Devoluções</h1>
              <p className="text-gray-600">Sua satisfação é nossa prioridade</p>
            </div>
          </div>
        </div>

        {/* Prazo */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <Clock className="w-12 h-12 text-dark-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">30 Dias</h3>
            <p className="text-sm text-gray-600">Prazo para trocas e devoluções</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <Package className="w-12 h-12 text-dark-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">Frete Grátis</h3>
            <p className="text-sm text-gray-600">Na primeira troca</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <Shield className="w-12 h-12 text-dark-600 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-2">100% Seguro</h3>
            <p className="text-sm text-gray-600">Garantia de reembolso</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Política de Troca */}
          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-dark-600" />
              Política de Troca
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Prazo:</strong> Você tem até 30 dias após o recebimento para solicitar a troca.
              </p>
              <p>
                <strong>Condições:</strong> O produto deve estar em perfeito estado, sem uso, com etiquetas originais e na embalagem original.
              </p>
              <p>
                <strong>Motivos aceitos:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Tamanho incorreto</li>
                <li>Cor diferente do pedido</li>
                <li>Defeito de fabricação</li>
                <li>Produto danificado no transporte</li>
                <li>Arrependimento da compra</li>
              </ul>
            </div>
          </section>

          {/* Como Solicitar */}
          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">Como Solicitar</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-dark-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Acesse sua conta</h3>
                  <p className="text-gray-600 text-sm">Entre na sua conta e vá em "Meus Pedidos"</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-dark-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Selecione o pedido</h3>
                  <p className="text-gray-600 text-sm">Escolha o produto que deseja trocar ou devolver</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-dark-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Informe o motivo</h3>
                  <p className="text-gray-600 text-sm">Conte-nos o motivo da troca ou devolução</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-dark-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Envie o produto</h3>
                  <p className="text-gray-600 text-sm">Gere a etiqueta de devolução e envie pelos Correios</p>
                </div>
              </div>
            </div>
          </section>

          {/* Devolução e Reembolso */}
          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">Devolução e Reembolso</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Após recebermos o produto devolvido e confirmarmos que está em perfeito estado, processaremos o reembolso em até 5 dias úteis.
              </p>
              <p>
                <strong>Formas de reembolso:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Cartão de crédito:</strong> Estorno na fatura em 1-2 ciclos</li>
                <li><strong>PIX:</strong> Reembolso em até 24 horas</li>
                <li><strong>Boleto:</strong> Depósito em conta em até 5 dias úteis</li>
              </ul>
            </div>
          </section>

          {/* Produtos não aceitos */}
          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">Produtos Não Aceitos para Troca</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Produtos com sinais de uso ou desgaste</li>
                <li>Produtos sem etiqueta ou embalagem original</li>
                <li>Produtos personalizados sob encomenda</li>
                <li>Produtos de higiene pessoal (ex: protetores bucais)</li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-dark-100 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-dark-900 mb-3">Precisa solicitar uma troca?</h3>
            <p className="text-gray-600 mb-4">Acesse sua conta para iniciar o processo</p>
            <Link 
              to="/pedidos"
              className="inline-flex items-center gap-2 bg-dark-900 text-white px-6 py-3 rounded-lg hover:bg-dark-950 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Ir para Meus Pedidos
            </Link>
          </div>
        </div>

        {/* Dúvidas */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold text-dark-900 mb-4">Ainda tem dúvidas?</h2>
          <p className="text-gray-600 mb-4">
            Nossa equipe está pronta para ajudar! Entre em contato:
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
            <p><strong>Email:</strong> trocas@armazemskate.com.br</p>
            <p><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;
