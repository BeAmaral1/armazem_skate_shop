import React from 'react';
import { Waves, Target, Award, Users } from 'lucide-react';

const About = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[300px] sm:h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1920&q=80"
            alt="About Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark-900/70"></div>
        </div>
        <div className="relative container mx-auto px-4 text-white text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">Nossa História</h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
            Mais de uma década conectando surfistas e skatistas aos melhores produtos
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <Waves className="w-12 h-12 sm:w-16 sm:h-16 text-dark-600 mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-4 sm:mb-6">
                Onde o Asfalto Encontra a Onda
              </h2>
            </div>

            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 space-y-4 sm:space-y-6">
              <p>
                Fundada em 2010, a <strong>Armazem Skate Shop</strong> nasceu da paixão de um grupo de amigos 
                que viviam intensamente a cultura surf e skate. O que começou como um pequeno espaço em Copacabana, 
                Rio de Janeiro, hoje é referência nacional para quem respira a essência do lifestyle board sports.
              </p>
              
              <p>
                Nossa missão sempre foi clara: <strong>oferecer os melhores produtos</strong> das marcas mais 
                renomadas do mercado, com atendimento especializado e preços justos. Acreditamos que surf e skate 
                são mais do que esportes - são formas de expressão, liberdade e conexão com a natureza e a cidade.
              </p>

              <p>
                Ao longo dos anos, expandimos nossa presença para o ambiente digital, mas mantivemos a essência 
                que nos define: <strong>autenticidade, qualidade e paixão</strong>. Cada produto em nossa loja 
                é cuidadosamente selecionado por riders experientes que entendem as necessidades de quem pratica.
              </p>

              <p>
                Seja você um iniciante dando as primeiras remadas ou um profissional em busca do equipamento 
                perfeito, a Armazem Skate Shop é o seu lugar. Aqui, o asfalto encontra a onda, e você encontra 
                tudo o que precisa para viver sua paixão ao máximo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <Target className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Autenticidade
              </h3>
              <p className="text-gray-600">
                Produtos originais das melhores marcas, garantindo qualidade e performance.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <Award className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Excelência
              </h3>
              <p className="text-gray-600">
                Atendimento especializado e comprometimento com a satisfação do cliente.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Comunidade
              </h3>
              <p className="text-gray-600">
                Mais que uma loja, somos uma comunidade unida pela paixão pelo surf e skate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Time de Riders
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nossa equipe é formada por atletas e entusiastas que vivem e respiram a cultura board sports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Lucas Wave',
                role: 'Surfista Profissional',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
              },
              {
                name: 'Marina Coast',
                role: 'Especialista em Surf',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'
              },
              {
                name: 'Pedro Street',
                role: 'Skatista Pro',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'
              },
              {
                name: 'Ana Radical',
                role: 'Lifestyle Advisor',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80'
              }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="aspect-square rounded-full overflow-hidden mb-4 mx-auto">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-dark-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Faça Parte da Nossa História
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Venha fazer parte da comunidade Armazem e descubra os melhores produtos para sua paixão
          </p>
          <a href="/produtos" className="btn-secondary inline-block">
            Explorar Produtos
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
