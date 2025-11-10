import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Check, ArrowLeft, Heart, Share2, RotateCw, Grid3x3, MessageCircle, AlertTriangle } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import ProductCard from '../components/ProductCard';
import WishlistButton from '../components/WishlistButton';
import ReviewsSection from '../components/ReviewsSection';
import Image360Viewer from '../components/Image360Viewer';
import SEO from '../components/SEO';
import { has360View, generate360Images } from '../utils/generate360Images';
import useSwipe from '../hooks/useSwipe';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addProduct } = useRecentlyViewed();
  
  const product = products.find(p => p.id === parseInt(id));
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [view360, setView360] = useState(false);
  
  // Hook de swipe para navegar entre imagens
  const nextImage = () => {
    if (product && product.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };
  
  const previousImage = () => {
    if (product && product.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };
  
  const swipeRef = useSwipe(nextImage, previousImage, 50);
  
  // Verificar estoque
  const isOutOfStock = product?.stock === 0;
  const isLowStock = product?.stock > 0 && product?.stock <= 5;
  
  // Verificar se produto tem visualização 360°
  const has360 = product ? has360View(product.id) : false;
  const images360 = has360 && product ? generate360Images(product.id, product.images[0]) : [];

  // Adicionar produto ao histórico quando a página carregar
  useEffect(() => {
    if (product) {
      addProduct(product);
    }
  }, [product?.id]); // Dependência no ID para atualizar se mudar de produto

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-heading font-bold mb-4">Produto não encontrado</h1>
        <Link to="/produtos" className="btn-primary">
          Voltar para Produtos
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 1) {
      alert('Por favor, selecione um tamanho');
      return;
    }
    if (!selectedColor && product.colors.length > 1) {
      alert('Por favor, selecione uma cor');
      return;
    }

    const size = selectedSize || product.sizes[0];
    const color = selectedColor || product.colors[0];

    for (let i = 0; i < quantity; i++) {
      addToCart(product, size, color);
    }

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `${product.name} - R$ ${product.price.toFixed(2)}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        // Se o navegador suporta Web Share API (principalmente mobile)
        await navigator.share(shareData);
      } else {
        // Fallback: copiar link para clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } catch (err) {
      // Se o usuário cancelar ou der erro
      if (err.name !== 'AbortError') {
        console.error('Erro ao compartilhar:', err);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-4 sm:py-8">
      <SEO 
        title={product.name}
        description={product.description || `${product.name} - ${product.category}. ${product.inStock ? 'Em estoque' : 'Fora de estoque'}. ${product.brand ? `Marca: ${product.brand}` : ''}`}
        image={product.images?.[0] || product.image || '/og-image.jpg'}
        type="product"
        price={product.price}
        product={product}
      />
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-8 overflow-x-auto">
          <Link to="/" className="hover:text-dark-600 whitespace-nowrap">Início</Link>
          <span>/</span>
          <Link to="/produtos" className="hover:text-dark-600 whitespace-nowrap">Produtos</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-16">
          {/* Images Gallery */}
          <div>
            {/* Toggle 360° / Gallery */}
            {has360 && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setView360(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    !view360
                      ? 'bg-dark-900 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                  Galeria
                </button>
                <button
                  onClick={() => setView360(true)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    view360
                      ? 'bg-dark-900 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <RotateCw className="w-5 h-5" />
                  360°
                </button>
              </div>
            )}

            {/* 360° Viewer or Normal Gallery */}
            {view360 && has360 ? (
              <Image360Viewer images={images360} productName={product.name} />
            ) : (
              <>
                <div ref={swipeRef} className="bg-white rounded-xl overflow-hidden mb-4 aspect-square select-none">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-dark-600 ring-2 ring-gray-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl p-8">
              <div className="text-sm text-dark-600 uppercase tracking-wide mb-2">
                {product.category}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-gray-500 text-gray-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">
                    {product.rating} ({product.reviews.length} avaliações)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6 pb-6 border-b">
                {product.oldPrice && (
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg text-gray-400 line-through">
                      R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="bg-gray-100 text-dark-700 px-3 py-1 rounded-full text-sm font-bold">
                      -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </span>
                  </div>
                )}
                <div className="text-3xl sm:text-4xl font-bold text-dark-600">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Em até 10x de R$ {(product.price / 10).toFixed(2).replace('.', ',')} sem juros
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Size Selection */}
              {product.sizes.length > 1 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Tamanho</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                          selectedSize === size
                            ? 'border-dark-600 bg-gray-50 text-dark-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 1 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Cor</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                          selectedColor === color
                            ? 'border-dark-600 bg-gray-50 text-dark-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Quantidade</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-dark-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-dark-600 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Alertas de Estoque */}
              {isOutOfStock && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">Produto Fora de Estoque</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    Este produto está temporariamente indisponível. Entre em contato conosco para consultar previsão de reposição.
                  </p>
                </div>
              )}

              {isLowStock && !isOutOfStock && (
                <div className="mb-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">Últimas Unidades!</span>
                  </div>
                  <p className="text-sm text-orange-600 mt-1">
                    {product.stock} {product.stock === 1 ? 'unidade disponível' : 'unidades disponíveis'} em estoque.
                  </p>
                </div>
              )}

              {/* Add to Cart Button ou WhatsApp Button */}
              <div className="space-y-3">
                {isOutOfStock ? (
                  <a
                    href={`https://wa.me/5511987654321?text=${encodeURIComponent(
                      `Olá! Gostaria de saber quando o produto "${product.name}" (ID: ${product.id}) estará disponível novamente.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white"
                  >
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span className="truncate">Consultar Disponibilidade no WhatsApp</span>
                  </a>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      addedToCart
                        ? 'bg-dark-700 hover:bg-dark-800 text-white'
                        : 'bg-dark-600 hover:bg-dark-700 text-white'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-6 h-6" />
                        Adicionado ao Carrinho!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-6 h-6" />
                        Adicionar ao Carrinho
                      </>
                    )}
                  </button>
                )}

                <div className="flex gap-2">
                  <div className="flex-1">
                    <WishlistButton product={product} size="lg" showLabel={true} />
                  </div>
                  <button 
                    onClick={handleShare}
                    className="flex-1 btn-outline flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4"
                    title="Compartilhar produto"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="hidden sm:inline text-sm sm:text-base">Compartilhar</span>
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 pt-6 border-t space-y-2 text-sm">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">Produto Fora de Estoque</span>
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Estoque Limitado - {product.stock} {product.stock === 1 ? 'unidade' : 'unidades'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-dark-700">
                    <Check className="w-5 h-5" />
                    <span>Em estoque - Envio imediato</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5" />
                  <span>Frete grátis acima de R$ 299</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5" />
                  <span>Troca e devolução em até 30 dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <ReviewsSection productId={product.id} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
