import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Upload, Palette, Globe, ShoppingCart, Code } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { cmsService } from '../../services/api';

const SettingsPage = () => {
  const { settings, loading, refetch } = useSiteSettings();
  const [activeTab, setActiveTab] = useState('visual');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Identidade Visual
    site_name: '',
    site_logo: '',
    site_favicon: '',
    primary_color: '#1a1a1a',
    secondary_color: '#f97316',
    accent_color: '#10b981',
    
    // Informações Gerais
    site_email: '',
    site_phone: '',
    site_whatsapp: '',
    site_address: '',
    site_cnpj: '',
    site_hours: '',
    
    // Redes Sociais
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    tiktok_url: '',
    youtube_url: '',
    
    // SEO
    meta_title: '',
    meta_description: '',
    google_analytics: '',
    facebook_pixel: '',
    custom_scripts: '',
    
    // E-commerce
    free_shipping_above: '',
    default_shipping_fee: '',
    max_installments: '',
    empty_cart_message: '',
    out_of_stock_message: ''
  });

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      // Flatten settings
      const flat = {};
      Object.values(settings).forEach(group => {
        Object.assign(flat, group);
      });
      setFormData(prev => ({ ...prev, ...flat }));
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Salvar cada configuração
      const promises = Object.entries(formData).map(([key, value]) => {
        return cmsService.updateSetting(key, value);
      });

      await Promise.all(promises);

      alert('Configurações salvas com sucesso!');
      refetch();
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'visual', label: 'Identidade Visual', icon: Palette },
    { id: 'general', label: 'Informações Gerais', icon: Globe },
    { id: 'social', label: 'Redes Sociais', icon: Globe },
    { id: 'seo', label: 'SEO & Scripts', icon: Code },
    { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart }
  ];

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Configurações do Site</h1>
          <p className="text-gray-600 mt-1">Personalize seu e-commerce</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar Todas
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-dark-600 text-dark-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Identidade Visual */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Loja *
                </label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="Armazém Skate Shop"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL do Logo
                  </label>
                  <input
                    type="url"
                    value={formData.site_logo}
                    onChange={(e) => setFormData({ ...formData, site_logo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    placeholder="https://..."
                  />
                  {formData.site_logo && (
                    <img src={formData.site_logo} alt="Logo" className="mt-2 h-12 object-contain" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL do Favicon
                  </label>
                  <input
                    type="url"
                    value={formData.site_favicon}
                    onChange={(e) => setFormData({ ...formData, site_favicon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor Primária
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-16 h-10 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor Secundária
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="w-16 h-10 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor de Destaque
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="w-16 h-10 rounded border border-gray-300"
                    />
                    <input
                      type="text"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Dica:</strong> As cores serão aplicadas em todo o site. Use o seletor de cores para ver em tempo real.
                </p>
              </div>
            </div>
          )}

          {/* Informações Gerais */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Contato *
                  </label>
                  <input
                    type="email"
                    value={formData.site_email}
                    onChange={(e) => setFormData({ ...formData, site_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    placeholder="contato@loja.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.site_phone}
                    onChange={(e) => setFormData({ ...formData, site_phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    placeholder="(11) 1234-5678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp (com DDD)
                  </label>
                  <input
                    type="tel"
                    value={formData.site_whatsapp}
                    onChange={(e) => setFormData({ ...formData, site_whatsapp: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    placeholder="11999999999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={formData.site_cnpj}
                    onChange={(e) => setFormData({ ...formData, site_cnpj: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço Completo
                </label>
                <textarea
                  value={formData.site_address}
                  onChange={(e) => setFormData({ ...formData, site_address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  rows={3}
                  placeholder="Rua Exemplo, 123 - Bairro - Cidade/UF - CEP 00000-000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário de Funcionamento
                </label>
                <input
                  type="text"
                  value={formData.site_hours}
                  onChange={(e) => setFormData({ ...formData, site_hours: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="Segunda a Sexta: 9h às 18h"
                />
              </div>
            </div>
          )}

          {/* Redes Sociais */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={formData.facebook_url}
                  onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="https://facebook.com/suapagina"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="https://instagram.com/seuuser"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter/X
                </label>
                <input
                  type="url"
                  value={formData.twitter_url}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="https://twitter.com/seuuser"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok
                </label>
                <input
                  type="url"
                  value={formData.tiktok_url}
                  onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="https://tiktok.com/@seuuser"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="https://youtube.com/@seucanal"
                />
              </div>
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="Armazém Skate Shop - Os melhores produtos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  rows={3}
                  placeholder="Descrição do seu site para mecanismos de busca"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={formData.google_analytics}
                  onChange={(e) => setFormData({ ...formData, google_analytics: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  value={formData.facebook_pixel}
                  onChange={(e) => setFormData({ ...formData, facebook_pixel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="000000000000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scripts Customizados (HTML)
                </label>
                <textarea
                  value={formData.custom_scripts}
                  onChange={(e) => setFormData({ ...formData, custom_scripts: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600 font-mono text-sm"
                  rows={6}
                  placeholder="<script>...</script>"
                />
              </div>
            </div>
          )}

          {/* E-commerce */}
          {activeTab === 'ecommerce' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frete Grátis Acima de (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.free_shipping_above}
                    onChange={(e) => setFormData({ ...formData, free_shipping_above: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    placeholder="150.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taxa de Frete Padrão (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.default_shipping_fee}
                    onChange={(e) => setFormData({ ...formData, default_shipping_fee: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    placeholder="15.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parcelamento Máximo
                </label>
                <input
                  type="number"
                  value={formData.max_installments}
                  onChange={(e) => setFormData({ ...formData, max_installments: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  placeholder="12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem de Carrinho Vazio
                </label>
                <textarea
                  value={formData.empty_cart_message}
                  onChange={(e) => setFormData({ ...formData, empty_cart_message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  rows={2}
                  placeholder="Seu carrinho está vazio. Adicione produtos para continuar."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem de Produto Esgotado
                </label>
                <textarea
                  value={formData.out_of_stock_message}
                  onChange={(e) => setFormData({ ...formData, out_of_stock_message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  rows={2}
                  placeholder="Este produto está temporariamente indisponível."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
