import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { cmsService } from '../../services/api';
import { useBanners } from '../../hooks/useBanners';

const BannerManager = () => {
  const { banners, loading, refetch } = useBanners();
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    imageAlt: '',
    buttonText: '',
    buttonLink: '',
    position: 'home_hero',
    order: 0,
    active: true
  });

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData(banner);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      imageAlt: '',
      buttonText: '',
      buttonLink: '',
      position: 'home_hero',
      order: 0,
      active: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBanner) {
        await cmsService.updateBanner(editingBanner.id, formData);
        alert('Banner atualizado!');
      } else {
        await cmsService.createBanner(formData);
        alert('Banner criado!');
      }

      handleCancel();
      refetch();
    } catch (err) {
      console.error('Erro ao salvar banner:', err);
      alert('Erro ao salvar banner');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este banner?')) return;

    try {
      await cmsService.deleteBanner(id);
      alert('Banner excluído!');
      refetch();
    } catch (err) {
      console.error('Erro ao excluir banner:', err);
      alert('Erro ao excluir banner');
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await cmsService.updateBanner(banner.id, {
        ...banner,
        active: !banner.active
      });
      refetch();
    } catch (err) {
      console.error('Erro ao atualizar banner:', err);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Banners</h1>
          <p className="text-gray-600 mt-1">Crie e edite banners do carousel</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-dark-600 rounded-lg hover:bg-dark-700"
          >
            <Plus className="w-4 h-4" />
            Novo Banner
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {editingBanner ? 'Editar Banner' : 'Novo Banner'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posição *
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                >
                  <option value="home_hero">Home - Hero</option>
                  <option value="category_top">Categoria - Topo</option>
                  <option value="product_top">Produto - Topo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo
              </label>
              <textarea
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL da Imagem *
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                placeholder="https://..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto do Botão
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link do Botão
                </label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="/produtos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordem
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-dark-600 rounded focus:ring-dark-600"
              />
              <label htmlFor="active" className="text-sm text-gray-700">
                Banner ativo
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                {editingBanner ? 'Atualizar' : 'Criar'} Banner
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

      {/* Banners List */}
      {!showForm && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {banners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Nenhum banner cadastrado
                    </td>
                  </tr>
                ) : (
                  banners.map((banner) => (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{banner.title}</p>
                            {banner.subtitle && (
                              <p className="text-sm text-gray-500">{banner.subtitle}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {banner.position}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {banner.order}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(banner)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            banner.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {banner.active ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Inativo
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(banner)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
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
      )}
    </div>
  );
};

export default BannerManager;
