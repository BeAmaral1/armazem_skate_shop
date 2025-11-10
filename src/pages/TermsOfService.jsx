import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, AlertCircle, CheckCircle, Mail, Package, Zap } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-dark-900 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900">
                Termos de Uso
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              Ao utilizar nossa plataforma, você concorda com estes termos. Leia atentamente antes de prosseguir.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1. Aceitação dos Termos */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              1. Aceitação dos Termos
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Bem-vindo à <strong>Armazém Skate Shop</strong>. Ao acessar e usar nosso site, você concorda 
                em cumprir e estar vinculado aos seguintes termos e condições de uso.
              </p>
              <p>
                Se você não concordar com qualquer parte destes termos, não utilize nossos serviços.
              </p>
              <div className="bg-gray-50 border-l-4 border-dark-900 p-4 rounded">
                <p className="font-semibold text-gray-900">Importante:</p>
                <p className="text-sm mt-2">
                  Estes termos podem ser atualizados periodicamente. É sua responsabilidade revisá-los 
                  regularmente. O uso continuado do site após alterações constitui aceitação dos novos termos.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Uso do Site */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              2. Uso do Site
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Você concorda em usar o site apenas para fins legais e de maneira que não infrinja os 
                direitos de terceiros ou restrinja ou iniba o uso e aproveitamento do site por qualquer outra pessoa.
              </p>
              <h3 className="font-semibold text-gray-900 text-lg mt-6">É proibido:</h3>
              <ul className="list-none space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Usar o site de qualquer maneira que possa danificar, desabilitar, sobrecarregar ou prejudicar o servidor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Obter ou tentar obter acesso não autorizado a qualquer parte do site</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Usar bots, scrapers ou qualquer ferramenta automatizada sem autorização</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Publicar conteúdo difamatório, obsceno, ofensivo ou ilegal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Violar direitos de propriedade intelectual de terceiros</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Cadastro e Conta */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              3. Cadastro e Conta de Usuário
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Para realizar compras, você deve criar uma conta fornecendo informações verdadeiras, 
                precisas, atuais e completas.
              </p>
              <h3 className="font-semibold text-gray-900 text-lg mt-6">Responsabilidades do Usuário:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Manter a confidencialidade de sua senha</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta</li>
                <li>Ser responsável por todas as atividades realizadas em sua conta</li>
                <li>Garantir que suas informações de contato estejam atualizadas</li>
                <li>Não compartilhar sua conta com terceiros</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="font-semibold text-yellow-900">Atenção:</p>
                <p className="text-sm text-yellow-800 mt-1">
                  Contas com informações falsas ou que violem nossos termos podem ser suspensas ou encerradas.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Compras e Pagamentos */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              4. Compras e Pagamentos
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <h3 className="font-semibold text-gray-900 text-lg">4.1 Preços e Disponibilidade</h3>
              <p>
                Todos os preços estão em Reais (R$) e podem ser alterados sem aviso prévio. Fazemos 
                todos os esforços para garantir a precisão dos preços, mas erros podem ocorrer.
              </p>
              <p>
                A disponibilidade dos produtos está sujeita a estoque. Reservamo-nos o direito de 
                limitar a quantidade de produtos vendidos por pessoa, domicílio ou pedido.
              </p>

              <h3 className="font-semibold text-gray-900 text-lg mt-6">4.2 Formas de Pagamento</h3>
              <p>Aceitamos:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Cartões de crédito (Visa, Mastercard, Elo, American Express)</li>
                <li>Cartões de débito</li>
                <li>PIX (confirmação instantânea)</li>
                <li>Boleto bancário (confirmação em até 3 dias úteis)</li>
              </ul>

              <h3 className="font-semibold text-gray-900 text-lg mt-6">4.3 Confirmação do Pedido</h3>
              <p>
                Um pedido só é considerado confirmado após a aprovação do pagamento. Você receberá 
                um e-mail de confirmação com os detalhes do pedido.
              </p>

              <h3 className="font-semibold text-gray-900 text-lg mt-6">4.4 Cancelamento</h3>
              <p>
                Reservamo-nos o direito de recusar ou cancelar qualquer pedido por razões que incluam, 
                mas não se limitam a: disponibilidade de produto, erros de preço, suspeita de fraude.
              </p>
            </div>
          </section>

          {/* 5. Entrega */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              5. Entrega e Envio
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Os prazos de entrega são estimativas e começam a contar após a confirmação do pagamento. 
                Não nos responsabilizamos por atrasos causados por transportadoras ou eventos fora de nosso controle.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Frete Grátis
                  </h4>
                  <p className="text-sm">Disponível para compras acima de R$ 299,00 para regiões selecionadas.</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Entrega Expressa
                  </h4>
                  <p className="text-sm">Opção disponível para capitais e regiões metropolitanas.</p>
                </div>
              </div>
              <p className="mt-4">
                É responsabilidade do cliente fornecer um endereço de entrega válido e estar disponível 
                para receber a encomenda. Reenvios por endereços incorretos podem gerar custos adicionais.
              </p>
            </div>
          </section>

          {/* 6. Trocas e Devoluções */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              6. Política de Trocas e Devoluções
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Você tem <strong>7 dias</strong> a partir do recebimento do produto para solicitar 
                troca ou devolução, conforme o Código de Defesa do Consumidor (CDC).
              </p>
              <h3 className="font-semibold text-gray-900 text-lg mt-6">Condições para Troca/Devolução:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Produto sem uso, com etiquetas originais</li>
                <li>Embalagem original preservada</li>
                <li>Nota fiscal incluída</li>
                <li>Comprovante de compra</li>
              </ul>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="font-semibold text-green-900">Como Solicitar:</p>
                <p className="text-sm text-green-800 mt-1">
                  Entre em contato pelo e-mail <a href="mailto:trocas@armazemskate.com" className="underline">trocas@armazemskate.com</a> ou 
                  pelo telefone (11) 98765-4321 com o número do pedido.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Propriedade Intelectual */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              7. Propriedade Intelectual
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Todo o conteúdo do site, incluindo mas não se limitando a textos, gráficos, logotipos, 
                ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade 
                da <strong>Armazém Skate Shop</strong> ou de seus fornecedores de conteúdo e é protegido 
                por leis de direitos autorais.
              </p>
              <p>
                Você não pode reproduzir, distribuir, modificar, criar trabalhos derivados, exibir 
                publicamente, executar publicamente, republicar, baixar, armazenar ou transmitir qualquer 
                material de nosso site sem autorização prévia por escrito.
              </p>
            </div>
          </section>

          {/* 8. Limitação de Responsabilidade */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              8. Limitação de Responsabilidade
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Na extensão máxima permitida por lei, a Armazém Skate Shop não será responsável por 
                quaisquer danos indiretos, incidentais, especiais, consequentes ou punitivos, ou qualquer 
                perda de lucros ou receitas.
              </p>
              <p>
                Não garantimos que o site estará disponível ininterruptamente ou livre de erros. Podemos 
                suspender, retirar ou restringir a disponibilidade de todo ou qualquer parte do site 
                por motivos comerciais e operacionais.
              </p>
            </div>
          </section>

          {/* 9. Lei Aplicável */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
              9. Lei Aplicável e Jurisdição
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Estes termos serão regidos e interpretados de acordo com as leis do Brasil. Qualquer 
                disputa decorrente destes termos será submetida à jurisdição exclusiva dos tribunais 
                brasileiros.
              </p>
              <p>
                Para questões relacionadas ao consumidor, aplicam-se as disposições do Código de Defesa 
                do Consumidor (Lei nº 8.078/90).
              </p>
            </div>
          </section>

          {/* 10. Contato */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-dark-700" />
              10. Entre em Contato
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>E-mail:</strong> <a href="mailto:contato@armazemskate.com" className="text-dark-700 hover:underline">contato@armazemskate.com</a></p>
                <p><strong>Telefone:</strong> <a href="tel:+5511987654321" className="text-dark-700 hover:underline">(11) 98765-4321</a></p>
                <p><strong>Endereço:</strong> Rua das Ondas, 123 - São Paulo, SP - CEP 01234-567</p>
                <p><strong>Horário de Atendimento:</strong> Segunda a Sexta, 9h às 18h</p>
              </div>
            </div>
          </section>

          {/* Footer Links */}
          <div className="bg-dark-950 text-white rounded-xl shadow-md p-6 text-center">
            <p className="mb-4">Leia também:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/politica-privacidade" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-dark-900 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <Shield className="w-4 h-4" />
                Política de Privacidade
              </Link>
              <Link 
                to="/contato" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors font-medium"
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

export default TermsOfService;
