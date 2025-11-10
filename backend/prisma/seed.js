import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para criar slug a partir do nome
function createSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Função para gerar SKU único
function generateSKU(category, index) {
  const prefix = category.substring(0, 3).toUpperCase();
  return `${prefix}-${String(index).padStart(5, '0')}`;
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // Produtos do frontend
  const products = [
    {
      name: 'Prancha Fish 5\'8" "Sunset Rider"',
      category: 'Surf',
      subcategory: 'Pranchas',
      price: 2500.00,
      oldPrice: 3000.00,
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
        'https://images.unsplash.com/photo-1621967423002-8246a36a5b5a?w=800&q=80'
      ],
      description: 'Prancha tipo Fish perfeita para ondas médias. Construída com espuma de alta densidade e fibra de vidro de qualidade premium. Design retrô que combina performance e estilo. Ideal para surfistas intermediários a avançados.',
      sizes: ['5\'6"', '5\'8"', '6\'0"'],
      colors: ['Azul', 'Branco', 'Coral'],
      brand: 'Ocean Soul',
      featured: true,
      active: true
    },
    {
      name: 'Shape Maple "Urban Wave" 8.25"',
      category: 'Skate',
      subcategory: 'Shapes',
      price: 350.00,
      oldPrice: 450.00,
      stock: 3,
      images: [
        'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
        'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80'
      ],
      description: 'Shape profissional de 7 lâminas de madeira maple canadense. Concave médio para controle perfeito. Gráfico exclusivo inspirado nas ondas urbanas. Durabilidade garantida para manobras pesadas.',
      sizes: ['7.75"', '8.0"', '8.25"', '8.5"'],
      colors: ['Natural', 'Preto', 'Azul'],
      brand: 'Street Surf Co.',
      featured: true,
      active: true
    },
    {
      name: 'Camiseta "Salty Air" Algodão Orgânico',
      category: 'Vestuário',
      subcategory: 'Camisetas',
      price: 120.00,
      oldPrice: 150.00,
      stock: 0,
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'
      ],
      description: '100% algodão orgânico de alta qualidade. Estampa exclusiva com arte surf/skate. Modelagem confortável e moderna. Sustentável e estilosa para o dia a dia.',
      sizes: ['P', 'M', 'G', 'GG'],
      colors: ['Branco', 'Preto', 'Azul Marinho', 'Areia'],
      brand: 'Armazem',
      featured: false,
      active: true
    },
    {
      name: 'Óculos de Sol Polarizados "Pipeline"',
      category: 'Acessórios',
      subcategory: 'Óculos',
      price: 280.00,
      oldPrice: 350.00,
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80'
      ],
      description: 'Lentes polarizadas com proteção UV400. Armação resistente e leve. Design moderno inspirado nas praias do Havaí. Perfeito para surf, skate e lifestyle.',
      sizes: ['Único'],
      colors: ['Preto Fosco', 'Tartaruga', 'Azul Espelhado'],
      brand: 'Wave Vision',
      featured: false,
      active: true
    },
    {
      name: 'Prancha Longboard 9\'0" "Classic Soul"',
      category: 'Surf',
      subcategory: 'Pranchas',
      price: 3200.00,
      oldPrice: 3800.00,
      stock: 8,
      images: [
        'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80',
        'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80'
      ],
      description: 'Longboard clássico para soul surfing. Single fin setup. Perfeita estabilidade e fluidez. Design vintage com performance moderna.',
      sizes: ['8\'6"', '9\'0"', '9\'6"'],
      colors: ['Natural', 'Azul Vintage', 'Verde Água'],
      brand: 'Ocean Soul',
      featured: false,
      active: true
    },
    {
      name: 'Truck Independent Stage 11 149mm',
      category: 'Skate',
      subcategory: 'Trucks',
      price: 450.00,
      oldPrice: 550.00,
      stock: 12,
      images: [
        'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80',
        'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80'
      ],
      description: 'Par de trucks Independent profissionais. Geometria Stage 11 para maior estabilidade. Liga de alumínio de alta resistência. O clássico que nunca sai de moda.',
      sizes: ['139mm', '144mm', '149mm', '159mm'],
      colors: ['Prata', 'Preto', 'Raw'],
      brand: 'Independent',
      featured: false,
      active: true
    },
    {
      name: 'Moletom "Wave Rider" Premium',
      category: 'Vestuário',
      subcategory: 'Moletons',
      price: 280.00,
      oldPrice: 350.00,
      stock: 18,
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'
      ],
      description: 'Moletom premium com capuz. Tecido 80% algodão e 20% poliéster. Forro interno macio. Estampa bordada de alta qualidade. Conforto e estilo para os dias frios.',
      sizes: ['P', 'M', 'G', 'GG', 'XG'],
      colors: ['Preto', 'Cinza Mescla', 'Azul Marinho', 'Verde Militar'],
      brand: 'Armazem',
      featured: true,
      active: true
    },
    {
      name: 'Mochila Impermeável "Ocean Pack"',
      category: 'Acessórios',
      subcategory: 'Mochilas',
      price: 320.00,
      oldPrice: 400.00,
      stock: 10,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=800&q=80'
      ],
      description: 'Mochila 100% impermeável para suas aventuras. Capacidade de 30L. Compartimento para laptop. Alças acolchoadas. Perfeita para praia, skate e viagens.',
      sizes: ['30L'],
      colors: ['Preto', 'Azul Ocean', 'Cinza'],
      brand: 'Wave Gear',
      featured: false,
      active: true
    },
    {
      name: 'Rodas Spitfire Formula Four 52mm',
      category: 'Skate',
      subcategory: 'Rodas',
      price: 280.00,
      oldPrice: 320.00,
      stock: 20,
      images: [
        'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800&q=80',
        'https://images.unsplash.com/photo-1564982752979-3f7bc974c9a5?w=800&q=80'
      ],
      description: 'Conjunto com 4 rodas Spitfire Formula Four. Uretano de alta performance. Não desgastam flat spots. Grip e velocidade perfeitos.',
      sizes: ['51mm', '52mm', '53mm', '54mm'],
      colors: ['Branco', 'Verde', 'Vermelho'],
      brand: 'Spitfire',
      featured: false,
      active: true
    },
    {
      name: 'Bermuda Boardshort "Tropical Vibes"',
      category: 'Vestuário',
      subcategory: 'Bermudas',
      price: 180.00,
      oldPrice: 220.00,
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1519235624215-85175d5e4249?w=800&q=80',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'
      ],
      description: 'Boardshort de secagem rápida. Tecido stretch com elastano. Cordão ajustável. Estampa tropical exclusiva. Ideal para surf e praia.',
      sizes: ['P', 'M', 'G', 'GG'],
      colors: ['Azul Tropical', 'Verde Folhagem', 'Laranja Sunset'],
      brand: 'Armazem',
      featured: false,
      active: true
    },
    {
      name: 'Parafina Eco "Ocean Wax"',
      category: 'Acessórios',
      subcategory: 'Parafinas',
      price: 25.00,
      oldPrice: null,
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
        'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80'
      ],
      description: 'Parafina ecológica biodegradável. Fórmula especial para águas tropicais. Aderência máxima. Amiga do meio ambiente.',
      sizes: ['Único'],
      colors: ['Natural'],
      brand: 'Eco Surf',
      featured: false,
      active: true
    },
    {
      name: 'Boné Trucker "Asphalt Ocean"',
      category: 'Acessórios',
      subcategory: 'Bonés',
      price: 85.00,
      oldPrice: 110.00,
      stock: 22,
      images: [
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
        'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80'
      ],
      description: 'Boné estilo trucker com tela traseira. Ajustável snapback. Bordado frontal de alta qualidade. Estilo casual surf/skate.',
      sizes: ['Único'],
      colors: ['Preto/Branco', 'Azul/Branco', 'Cinza/Preto'],
      brand: 'Armazem',
      featured: false,
      active: true
    }
  ];

  // Criar produtos
  console.log('📦 Criando produtos...\n');
  let createdCount = 0;

  for (const [index, productData] of products.entries()) {
    const slug = createSlug(productData.name);
    const sku = generateSKU(productData.category, index + 1);

    try {
      const product = await prisma.product.create({
        data: {
          ...productData,
          slug,
          sku,
          metaTitle: productData.name,
          metaDescription: productData.description.substring(0, 160)
        }
      });

      createdCount++;
      console.log(`✅ ${product.name} (${product.sku})`);
    } catch (error) {
      console.error(`❌ Erro ao criar ${productData.name}:`, error.message);
    }
  }

  console.log(`\n🎉 Seed concluído! ${createdCount}/${products.length} produtos criados.\n`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
