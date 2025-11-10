import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle, Mail, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900">
                Política de Privacidade
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-900">
              Sua privacidade é importante para nós. Esta política explica como coletamos, usamos e protegemos 
              seus dados pessoais em conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018).
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1. Introdução */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              1. Introdução
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                A <strong>Armazém Skate Shop</strong> está comprometida em proteger e respeitar sua privacidade. 
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e compartilhamos suas 
                informações pessoais em conformidade com a LGPD.
              </p>
            </div>
          </section>

          {/* 2. Dados Coletados */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-600" />
              2. Dados que Coletamos
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Dados de Cadastro:</strong> Nome, CPF, e-mail, telefone, endereço</li>
                <li><strong>Dados de Pagamento:</strong> Informações de cartão (processadas por gateway seguro)</li>
                <li><strong>Dados de Navegação:</strong> IP, navegador, páginas visitadas</li>
                <li><strong>Cookies:</strong> Para melhorar sua experiência</li>
              </ul>
            </div>
          </section>

          {/* 3. Finalidade */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-purple-600" />
              3. Como Usamos Seus Dados
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">🛒 Processamento</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Confirmar pedidos</li>
                    <li>• Processar pagamentos</li>
                    <li>• Gerenciar entregas</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">📧 Comunicação</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Confirmações de pedido</li>
                    <li>• Atualizações de entrega</li>
                    <li>• Suporte ao cliente</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Segurança */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-red-600" />
              4. Segurança dos Dados
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>Implementamos medidas técnicas e organizacionais:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Criptografia SSL/TLS</li>
                <li>Firewalls e monitoramento 24/7</li>
                <li>Acesso restrito aos dados</li>
                <li>Backups regulares</li>
              </ul>
            </div>
          </section>

          {/* 5. Seus Direitos */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-green-600" />
              5. Seus Direitos (LGPD)
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>Você tem direito a:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Acesso:</strong> Confirmar se tratamos seus dados</li>
                <li><strong>Correção:</strong> Atualizar dados incorretos</li>
                <li><strong>Eliminação:</strong> Excluir dados desnecessários</li>
                <li><strong>Portabilidade:</strong> Transferir dados para outro fornecedor</li>
                <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
              </ul>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="font-semibold text-green-900">Como Exercer:</p>
                <p className="text-sm text-green-800 mt-1">
                  Entre em contato: <a href="mailto:privacidade@armazemskate.com" className="underline">privacidade@armazemskate.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* 6. Cookies */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              6. Uso de Cookies
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>Utilizamos cookies para melhorar sua experiência:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Essenciais:</strong> Funcionamento básico do site</li>
                <li><strong>Desempenho:</strong> Análise de uso</li>
                <li><strong>Funcionalidade:</strong> Lembrar preferências</li>
              </ul>
            </div>
          </section>

          {/* 7. DPO */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-dark-700" />
              7. Encarregado de Dados (DPO)
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>E-mail:</strong> <a href="mailto:dpo@armazemskate.com" className="text-dark-700 hover:underline">dpo@armazemskate.com</a></p>
                <p><strong>Privacidade:</strong> <a href="mailto:privacidade@armazemskate.com" className="text-dark-700 hover:underline">privacidade@armazemskate.com</a></p>
                <p><strong>Telefone:</strong> <a href="tel:+5511987654321" className="text-dark-700 hover:underline">(11) 98765-4321</a></p>
              </div>
            </div>
          </section>

          {/* Footer Links */}
          <div className="bg-green-600 text-white rounded-xl shadow-md p-6 text-center">
            <p className="mb-4">Leia também:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/termos-uso" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <FileText className="w-4 h-4" />
                Termos de Uso
              </Link>
              <Link 
                to="/contato" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
              >
                <Mail className="w-4 h-4" />
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
