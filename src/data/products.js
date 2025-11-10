export const products = [
  {
    id: 1,
    name: 'Prancha Fish 5\'8" "Sunset Rider"',
    category: 'Surf',
    price: 2500.00,
    oldPrice: 3000.00,
    stock: 15,  // Em estoque
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
      'https://images.unsplash.com/photo-1621967423002-8246a36a5b5a?w=800&q=80',
      'https://images.unsplash.com/photo-1621967423002-8246a36a5b5a?w=800&q=80'
    ],
    description: 'Prancha tipo Fish perfeita para ondas médias. Construída com espuma de alta densidade e fibra de vidro de qualidade premium. Design retrô que combina performance e estilo. Ideal para surfistas intermediários a avançados.',
    sizes: ['5\'6"', '5\'8"', '6\'0"'],
    colors: ['Azul', 'Branco', 'Coral'],
    brand: 'Ocean Soul',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: [
      { id: 1, author: 'Carlos Silva', rating: 5, comment: 'Prancha incrível! Muito estável e rápida nas ondas.', date: '2024-01-15' },
      { id: 2, author: 'Marina Costa', rating: 5, comment: 'Melhor prancha que já tive. Design lindo e performance top.', date: '2024-01-10' },
      { id: 3, author: 'Rafael Santos', rating: 4, comment: 'Muito boa, só achei um pouco pesada.', date: '2024-01-05' }
    ]
  },
  {
    id: 2,
    name: 'Shape Maple "Urban Wave" 8.25"',
    category: 'Skate',
    price: 350.00,
    oldPrice: 450.00,
    stock: 3,  // Estoque baixo
    image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
      'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80',
      'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80'
    ],
    description: 'Shape profissional de 7 lâminas de madeira maple canadense. Concave médio para controle perfeito. Gráfico exclusivo inspirado nas ondas urbanas. Durabilidade garantida para manobras pesadas.',
    sizes: ['7.75"', '8.0"', '8.25"', '8.5"'],
    colors: ['Natural', 'Preto', 'Azul'],
    brand: 'Street Surf Co.',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: [
      { id: 1, author: 'Pedro Oliveira', rating: 5, comment: 'Shape top! Muito resistente e com pop excelente.', date: '2024-01-20' },
      { id: 2, author: 'Lucas Mendes', rating: 5, comment: 'Melhor custo-benefício. Recomendo!', date: '2024-01-18' },
      { id: 3, author: 'Thiago Alves', rating: 4, comment: 'Bom shape, mas o gráfico desgasta rápido.', date: '2024-01-12' }
    ]
  },
  {
    id: 3,
    name: 'Camiseta "Salty Air" Algodão Orgânico',
    category: 'Vestuário',
    price: 120.00,
    oldPrice: 150.00,
    stock: 0,  // Fora de estoque - Mostrará botão WhatsApp
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'
    ],
    description: '100% algodão orgânico de alta qualidade. Estampa exclusiva com arte surf/skate. Modelagem confortável e moderna. Sustentável e estilosa para o dia a dia.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Branco', 'Preto', 'Azul Marinho', 'Areia'],
    brand: 'Armazem',
    inStock: false,  // Corrigido: produto está fora de estoque
    featured: false,  // Removido destaque pois está esgotado
    rating: 4.7,
    reviews: [
      { id: 1, author: 'Ana Paula', rating: 5, comment: 'Tecido muito macio e confortável!', date: '2024-01-22' },
      { id: 2, author: 'Felipe Costa', rating: 4, comment: 'Bonita e de qualidade, mas um pouco cara.', date: '2024-01-19' },
      { id: 3, author: 'Juliana Lima', rating: 5, comment: 'Adorei! A estampa é linda.', date: '2024-01-14' }
    ]
  },
  {
    id: 4,
    name: 'Óculos de Sol Polarizados "Pipeline"',
    category: 'Acessórios',
    price: 280.00,
    oldPrice: 350.00,
    stock: 25,  // Em estoque
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80'
    ],
    description: 'Lentes polarizadas com proteção UV400. Armação resistente e leve. Design moderno inspirado nas praias do Havaí. Perfeito para surf, skate e lifestyle.',
    sizes: ['Único'],
    colors: ['Preto Fosco', 'Tartaruga', 'Azul Espelhado'],
    brand: 'Wave Vision',
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: [
      { id: 1, author: 'Roberto Dias', rating: 5, comment: 'Qualidade excepcional! Vale cada centavo.', date: '2024-01-21' },
      { id: 2, author: 'Camila Souza', rating: 4, comment: 'Lindo e funcional, mas poderia vir com estojo melhor.', date: '2024-01-16' }
    ]
  },
  {
    id: 5,
    name: 'Prancha Longboard 9\'0" "Classic Soul"',
    category: 'Surf',
    price: 3200.00,
    oldPrice: 3800.00,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80',
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80'
    ],
    description: 'Longboard clássico para soul surfing. Single fin setup. Perfeita estabilidade e fluidez. Design vintage com performance moderna.',
    sizes: ['8\'6"', '9\'0"', '9\'6"'],
    colors: ['Natural', 'Azul Vintage', 'Verde Água'],
    brand: 'Ocean Soul',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: [
      { id: 1, author: 'João Pedro', rating: 5, comment: 'Prancha dos sonhos! Perfeita para cross-stepping.', date: '2024-01-17' }
    ]
  },
  {
    id: 6,
    name: 'Truck Independent Stage 11 149mm',
    category: 'Skate',
    price: 450.00,
    oldPrice: 550.00,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80',
      'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
      'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80'
    ],
    description: 'Par de trucks Independent profissionais. Geometria Stage 11 para maior estabilidade. Liga de alumínio de alta resistência. O clássico que nunca sai de moda.',
    sizes: ['139mm', '144mm', '149mm', '159mm'],
    colors: ['Prata', 'Preto', 'Raw'],
    brand: 'Independent',
    inStock: true,
    featured: true,
    rating: 5.0,
    reviews: [
      { id: 1, author: 'Gustavo Lima', rating: 5, comment: 'Os melhores trucks do mercado!', date: '2024-01-13' }
    ]
  },
  {
    id: 7,
    name: 'Moletom "Wave Rider" Premium',
    category: 'Vestuário',
    price: 280.00,
    oldPrice: 350.00,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'
    ],
    description: 'Moletom premium com capuz. Tecido 80% algodão e 20% poliéster. Forro interno macio. Estampa bordada de alta qualidade. Conforto e estilo para os dias frios.',
    sizes: ['P', 'M', 'G', 'GG', 'XG'],
    colors: ['Preto', 'Cinza Mescla', 'Azul Marinho', 'Verde Militar'],
    brand: 'Armazem',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: [
      { id: 1, author: 'Beatriz Almeida', rating: 5, comment: 'Muito confortável e quentinho!', date: '2024-01-11' }
    ]
  },
  {
    id: 8,
    name: 'Mochila Impermeável "Ocean Pack"',
    category: 'Acessórios',
    price: 320.00,
    oldPrice: 400.00,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&q=80',
      'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&q=80'
    ],
    description: 'Mochila 100% impermeável para suas aventuras. Capacidade de 30L. Compartimento para laptop. Alças acolchoadas. Perfeita para praia, skate e viagens.',
    sizes: ['30L'],
    colors: ['Preto', 'Azul Ocean', 'Cinza'],
    brand: 'Wave Gear',
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: [
      { id: 1, author: 'André Ferreira', rating: 5, comment: 'Muito útil! Realmente não entra água.', date: '2024-01-09' }
    ]
  },
  {
    id: 9,
    name: 'Rodas Spitfire Formula Four 52mm',
    category: 'Skate',
    price: 280.00,
    oldPrice: 320.00,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
      'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80',
      'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80'
    ],
    description: 'Conjunto com 4 rodas Spitfire Formula Four. Uretano de alta performance. Não desgastam flat spots. Grip e velocidade perfeitos.',
    sizes: ['51mm', '52mm', '53mm', '54mm'],
    colors: ['Branco', 'Verde', 'Vermelho'],
    brand: 'Spitfire',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: [
      { id: 1, author: 'Diego Martins', rating: 5, comment: 'Rodas incríveis! Muito rápidas.', date: '2024-01-08' }
    ]
  },
  {
    id: 10,
    name: 'Bermuda Boardshort "Tropical Vibes"',
    category: 'Vestuário',
    price: 180.00,
    oldPrice: 220.00,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1519235624215-85175d5e4249?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1519235624215-85175d5e4249?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'
    ],
    description: 'Boardshort de secagem rápida. Tecido stretch com elastano. Cordão ajustável. Estampa tropical exclusiva. Ideal para surf e praia.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Azul Tropical', 'Verde Folhagem', 'Laranja Sunset'],
    brand: 'Armazem',
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: [
      { id: 1, author: 'Marcos Vieira', rating: 4, comment: 'Boa bermuda, mas o tecido é um pouco fino.', date: '2024-01-07' }
    ]
  },
  {
    id: 11,
    name: 'Parafina Eco "Ocean Wax"',
    category: 'Acessórios',
    price: 25.00,
    oldPrice: null,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
      'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80',
      'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80'
    ],
    description: 'Parafina ecológica biodegradável. Fórmula especial para águas tropicais. Aderência máxima. Amiga do meio ambiente.',
    sizes: ['Único'],
    colors: ['Natural'],
    brand: 'Eco Surf',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: []
  },
  {
    id: 12,
    name: 'Boné Trucker "Asphalt Ocean"',
    category: 'Acessórios',
    price: 85.00,
    oldPrice: 110.00,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80'
    ],
    description: 'Boné estilo trucker com tela traseira. Ajustável snapback. Bordado frontal de alta qualidade. Estilo casual surf/skate.',
    sizes: ['Único'],
    colors: ['Preto/Branco', 'Azul/Branco', 'Cinza/Preto'],
    brand: 'Armazem',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: []
  },
  {
    id: 13,
    name: 'Prancha Longboard 9\'0" "Classic Ride"',
    category: 'Surf',
    price: 3200.00,
    oldPrice: null,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
      'https://images.unsplash.com/photo-1621967423002-8246a36a5b5a?w=800&q=80',
      'https://images.unsplash.com/photo-1621967423002-8246a36a5b5a?w=800&q=80'
    ],
    description: 'Longboard clássico perfeito para iniciantes. Grande estabilidade e fácil remada. Ideal para ondas pequenas e médias.',
    sizes: ['8\'6"', '9\'0"', '9\'6"'],
    colors: ['Azul Claro', 'Verde Água', 'Branco'],
    brand: 'Ocean Soul',
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: []
  },
  {
    id: 14,
    name: 'Shape Street 8.0" "City Lines"',
    category: 'Skate',
    price: 320.00,
    oldPrice: 400.00,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
      'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80',
      'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80'
    ],
    description: 'Shape perfeito para street. Maple canadense 7 lâminas. Pop explosivo e durabilidade extrema.',
    sizes: ['7.75"', '8.0"', '8.25"'],
    colors: ['Preto', 'Natural', 'Vermelho'],
    brand: 'Street Surf Co.',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: []
  },
  {
    id: 15,
    name: 'Camiseta Básica "Wave Logo"',
    category: 'Vestuário',
    price: 89.00,
    oldPrice: 120.00,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'
    ],
    description: 'Camiseta 100% algodão. Logo bordado no peito. Conforto e estilo para o dia a dia.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Branco', 'Azul Marinho'],
    brand: 'Armazem',
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: []
  },
  {
    id: 16,
    name: 'Mochila Impermeável "Ocean Pack"',
    category: 'Acessórios',
    price: 280.00,
    oldPrice: null,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
    ],
    description: 'Mochila impermeável 30L. Compartimento para laptop. Ideal para praia e viagens. Material resistente.',
    sizes: ['Único'],
    colors: ['Preto', 'Azul', 'Cinza'],
    brand: 'Wave Gear',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: []
  },
  {
    id: 17,
    name: 'Prancha Shortboard 6\'2" "Performance Pro"',
    category: 'Surf',
    price: 2800.00,
    oldPrice: 3200.00,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
      'https://images.unsplash.com/photo-1621967423002-8246a36a5b5a?w=800&q=80',
      'https://images.unsplash.com/photo-1621967423002-8246a36a5b5a?w=800&q=80'
    ],
    description: 'Shortboard de alta performance. Para surfistas avançados. Manobras radicais e velocidade.',
    sizes: ['5\'10"', '6\'0"', '6\'2"'],
    colors: ['Branco', 'Preto', 'Amarelo'],
    brand: 'Wave Vision',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: []
  },
  {
    id: 18,
    name: 'Cruiser Completo "Beach Rider"',
    category: 'Skate',
    price: 450.00,
    oldPrice: null,
    stock: 9,
    image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
      'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80',
      'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80'
    ],
    description: 'Cruiser completo para passeio. Rodas macias 60mm. Ideal para calçadão e cidade.',
    sizes: ['27"', '29"', '32"'],
    colors: ['Azul Tropical', 'Laranja', 'Verde'],
    brand: 'Street Surf Co.',
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: []
  },
  {
    id: 19,
    name: 'Jaqueta Corta Vento "Wind Breaker"',
    category: 'Vestuário',
    price: 280.00,
    oldPrice: 350.00,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'
    ],
    description: 'Jaqueta leve e impermeável. Proteção contra vento e chuva. Capuz ajustável.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Azul Navy', 'Verde Militar'],
    brand: 'Armazem',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: []
  },
  {
    id: 20,
    name: 'Óculos de Sol "UV Protection"',
    category: 'Acessórios',
    price: 220.00,
    oldPrice: 280.00,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'
    ],
    description: 'Óculos polarizado UV400. Lentes anti-reflexo. Armação resistente e leve. Estilo surf/skate.',
    sizes: ['Único'],
    colors: ['Preto/Fumê', 'Tartaruga/Verde', 'Azul/Espelhado'],
    brand: 'Wave Vision',
    inStock: true,
    featured: true,
    rating: 4.5,
    reviews: []
  },
  {
    id: 21,
    name: 'Calça Jeans "Street Style"',
    category: 'Vestuário',
    price: 280.00,
    oldPrice: null,
    stock: 16,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'
    ],
    description: 'Jeans com stretch para mobilidade. Corte skate fit. Resistente e confortável.',
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['Azul Escuro', 'Preto', 'Azul Médio'],
    brand: 'Armazem',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: []
  },
  {
    id: 22,
    name: 'Deck Longboard "Downhill Master"',
    category: 'Skate',
    price: 580.00,
    oldPrice: 680.00,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
      'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80',
      'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80'
    ],
    description: 'Longboard drop-through para downhill. Estabilidade em alta velocidade. Construção reforçada.',
    sizes: ['38"', '40"', '42"'],
    colors: ['Natural', 'Preto', 'Grafite'],
    brand: 'Street Surf Co.',
    inStock: true,
    featured: false,
    rating: 4.8,
    reviews: []
  },
  {
    id: 23,
    name: 'Leash Premium "Never Break"',
    category: 'Acessórios',
    price: 120.00,
    oldPrice: null,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
      'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80',
      'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80'
    ],
    description: 'Leash de alta resistência. Cabo de 7mm. Swivel duplo giratório. Velcro reforçado.',
    sizes: ['6ft', '7ft', '8ft', '9ft'],
    colors: ['Preto', 'Azul', 'Verde'],
    brand: 'Ocean Soul',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: []
  },
  {
    id: 24,
    name: 'Moletom Canguru "Wave Life"',
    category: 'Vestuário',
    price: 220.00,
    oldPrice: 280.00,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'
    ],
    description: 'Moletom confortável com capuz. Algodão peluciado interno. Bolso canguru. Estampa frontal.',
    sizes: ['P', 'M', 'G', 'GG', 'XGG'],
    colors: ['Preto', 'Cinza Mescla', 'Azul Marinho'],
    brand: 'Armazem',
    inStock: true,
    featured: false,
    rating: 4.8,
    reviews: []
  }
];

export const categories = ['Todos', 'Surf', 'Skate', 'Vestuário', 'Acessórios'];

export const brands = ['Todos', 'Armazem', 'Ocean Soul', 'Street Surf Co.', 'Wave Vision', 'Independent', 'Spitfire', 'Wave Gear', 'Eco Surf'];

// SISTEMA DE DROPS/COLEÇÕES
export const drops = [
  {
    id: 1,
    dropNumber: '01',
    title: 'Ocean Soul',
    subtitle: 'Premium Surf Collection',
    description: 'Pranchas artesanais de alta performance para surfistas que buscam qualidade e estilo.',
    image: '/logo_1.jpg',
    brand: 'Ocean Soul',
    releaseDate: '05/11/2024',
    category: 'Surf',
    itemCount: 2,
    startPrice: 2500.00,
    status: 'Disponível', // Disponível, Em Breve, Esgotado
    featured: true,
    relatedProducts: [1, 5], // IDs dos produtos desta coleção
    colorTheme: 'blue', // Para o badge
    slug: 'ocean-soul-premium-surf'
  },
  {
    id: 2,
    dropNumber: '02',
    title: 'Independent',
    subtitle: 'Stage 11 Series',
    description: 'Os trucks mais confiáveis do mundo. Performance profissional para skatistas exigentes.',
    image: '/logo_2.jpg',
    brand: 'Independent',
    releaseDate: '03/11/2024',
    category: 'Skate',
    itemCount: 1,
    startPrice: 450.00,
    status: 'Disponível',
    featured: true,
    relatedProducts: [6],
    colorTheme: 'orange',
    slug: 'independent-stage-11'
  },
  {
    id: 3,
    dropNumber: '03',
    title: 'Wave Vision',
    subtitle: 'Summer Shades',
    description: 'Óculos polarizados premium para surf e lifestyle. Proteção UV400 e design exclusivo.',
    image: '/logo_3.jpg',
    brand: 'Wave Vision',
    releaseDate: '01/11/2024',
    category: 'Acessórios',
    itemCount: 1,
    startPrice: 280.00,
    status: 'Disponível',
    featured: true,
    relatedProducts: [4],
    colorTheme: 'green',
    slug: 'wave-vision-summer'
  },
  {
    id: 4,
    dropNumber: '04',
    title: 'Armazém',
    subtitle: 'Salty Air Collection',
    description: 'Vestuário sustentável com algodão orgânico. Estilo autêntico para surfistas e skatistas.',
    image: '/logo_4.jpg',
    brand: 'Armazem',
    releaseDate: '30/10/2024',
    category: 'Vestuário',
    itemCount: 1,
    startPrice: 120.00,
    status: 'Esgotado', // Produto fora de estoque
    featured: false,
    relatedProducts: [3],
    colorTheme: 'purple',
    slug: 'armazem-salty-air'
  },
  {
    id: 5,
    dropNumber: '05',
    title: 'Street Surf Co.',
    subtitle: 'Urban Wave Series',
    description: 'Shapes profissionais de maple canadense. Durabilidade e pop excepcional para street.',
    image: '/logo_5.jpg',
    brand: 'Street Surf Co.',
    releaseDate: '28/10/2024',
    category: 'Skate',
    itemCount: 1,
    startPrice: 350.00,
    status: 'Últimas Unidades', // Estoque baixo
    featured: false,
    relatedProducts: [2],
    colorTheme: 'orange',
    slug: 'street-surf-urban-wave'
  },
  {
    id: 6,
    dropNumber: '06',
    title: 'Verão 2024',
    subtitle: 'Coming Soon',
    description: 'Nova coleção de verão chegando em breve. Pranchas, shapes e vestuário exclusivos.',
    image: '/logo_1.jpg',
    brand: 'Armazem',
    releaseDate: '15/12/2024',
    category: 'Todos',
    itemCount: 8,
    startPrice: 99.00,
    status: 'Em Breve',
    featured: false,
    relatedProducts: [],
    colorTheme: 'blue',
    slug: 'verao-2024'
  },
  {
    id: 7,
    dropNumber: '07',
    title: 'Spitfire',
    subtitle: 'Formula Four Collection',
    description: 'As rodas mais rápidas e duráveis do mercado. Performance inigualável para street e park.',
    image: '/logo_2.jpg',
    brand: 'Spitfire',
    releaseDate: '20/10/2024',
    category: 'Skate',
    itemCount: 1,
    startPrice: 280.00,
    status: 'Disponível',
    featured: false,
    relatedProducts: [9],
    colorTheme: 'orange',
    slug: 'spitfire-formula-four'
  },
  {
    id: 8,
    dropNumber: '08',
    title: 'Wave Gear',
    subtitle: 'Adventure Pack',
    description: 'Mochilas e acessórios impermeáveis para suas aventuras. Qualidade premium e design moderno.',
    image: '/logo_3.jpg',
    brand: 'Wave Gear',
    releaseDate: '15/10/2024',
    category: 'Acessórios',
    itemCount: 2,
    startPrice: 280.00,
    status: 'Disponível',
    featured: false,
    relatedProducts: [8, 16],
    colorTheme: 'green',
    slug: 'wave-gear-adventure'
  }
];

// Manter blogPosts para uso futuro (caso queira blog também)
export const blogPosts = [];
