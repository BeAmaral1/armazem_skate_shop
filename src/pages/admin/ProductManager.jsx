import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, Search, X, Upload, Image as ImageIcon } from 'lucide-react';
import { productService } from '../../services/api';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    stock: '',
    sku: '',
    category: '',
    subcategory: '',
    brand: '',
    images: [],
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Preto', 'Branco'],
    metaTitle: '',
    metaDescription: '',
    featured: false,
    active: true
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Carregar produtos da API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productService.getAll({ includeInactive: true, limit: 200 });
      setProducts(response.products || []);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      setError('Erro ao carregar produtos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      stock: product.stock || '',
      sku: product.sku || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      images: product.images || [],
      sizes: product.sizes || ['P', 'M', 'G', 'GG'],
      colors: product.colors || ['Preto', 'Branco'],
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      featured: product.featured || false,
      active: product.active !== undefined ? product.active : true
    });
    setImagePreview(product.images || []);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      stock: '',
      sku: '',
      category: '',
      subcategory: '',
      brand: '',
      images: [],
      sizes: ['P', 'M', 'G', 'GG'],
      colors: ['Preto', 'Branco'],
      metaTitle: '',
      metaDescription: '',
      featured: false,
      active: true
    });
    setImageFiles([]);
    setImagePreview([]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      // Validações
      if (!formData.name || !formData.description || !formData.price || !formData.sku || !formData.category || !formData.brand) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      // Preparar dados (converter strings para números)
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku.trim(),
        category: formData.category.trim(),
        subcategory: formData.subcategory ? formData.subcategory.trim() : null,
        brand: formData.brand.trim(),
        images: imagePreview.length > 0 ? imagePreview : [],
        sizes: formData.sizes || [],
        colors: formData.colors || [],
        metaTitle: formData.metaTitle || formData.name,
        metaDescription: formData.metaDescription || formData.description,
        featured: formData.featured || false,
        active: formData.active !== undefined ? formData.active : true
      };

      if (editingProduct) {
        await productService.update(editingProduct.id, productData);
        alert('✅ Produto atualizado com sucesso!');
      } else {
        await productService.create(productData);
        alert('✅ Produto criado com sucesso!');
      }

      handleCancel();
      await loadProducts();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Erro ao salvar produto';
      setError(errorMsg);
      alert('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;
    
    try {
      setLoading(true);
      setError('');
      await productService.delete(id);
      alert('Produto excluído com sucesso!');
      loadProducts(); // Recarregar lista
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      setError('Erro ao deletar produto. Tente novamente.');
      alert('Erro ao deletar produto!');
    } finally {
      setLoading(false);
    }
  };

  // Upload de imagens local
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Gerenciar tamanhos
  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const addCustomSize = (newSize) => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize]
      }));
    }
  };

  // Gerenciar cores
  const toggleColor = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const addCustomColor = (newColor) => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor]
      }));
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !showForm) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Produtos</h1>
          <p className="text-gray-600 mt-1">Adicione e edite produtos do catálogo</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-dark-600 rounded-lg hover:bg-dark-700"
          >
            <Plus className="w-4 h-4" />
            Novo Produto
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-900">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    required
                  />
                </div>

                

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    rows={4}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Preço e Estoque */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-900">Preço e Estoque</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço Antigo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estoque *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Categorias */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-900">Categorização</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Shapes">Shapes</option>
                    <option value="Trucks">Trucks</option>
                    <option value="Rodas">Rodas</option>
                    <option value="Rolamentos">Rolamentos</option>
                    <option value="Roupas">Roupas</option>
                    <option value="Calçados">Calçados</option>
                    <option value="Acessórios">Acessórios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategoria
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Upload de Imagens */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-900">Imagens do Produto</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-10 h-10 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Clique para selecionar imagens
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP (múltiplas imagens)
                    </p>
                  </div>
                </label>
              </div>

              {/* Preview das Imagens */}
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreview.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* Tamanhos e Cores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanhos (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.sizes.join(', ')}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="P, M, G, GG"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cores (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.colors.join(', ')}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map(c => c.trim()) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="Preto, Branco, Azul"
                />
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-900">SEO</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  rows={2}
                />
              </div>
            </div>

            {/* Configurações */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-dark-600 rounded focus:ring-dark-600"
                />
                <span className="text-sm text-gray-700">Produto em destaque</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-dark-600 rounded focus:ring-dark-600"
                />
                <span className="text-sm text-gray-700">Produto ativo</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                {editingProduct ? 'Atualizar' : 'Criar'} Produto
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {!showForm && (
        <>
          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                placeholder="Buscar produtos..."
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estoque</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">R$ {product.price.toFixed(2)}</p>
                            {product.oldPrice && (
                              <p className="text-sm text-gray-500 line-through">R$ {product.oldPrice.toFixed(2)}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10 ? 'bg-green-100 text-green-800' :
                            product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock} un.
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {product.category}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {product.active ? (
                              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                <Eye className="w-3 h-3" />
                                Ativo
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                <EyeOff className="w-3 h-3" />
                                Inativo
                              </span>
                            )}
                            {product.featured && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                Destaque
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductManager;
