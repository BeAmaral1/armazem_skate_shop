import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, RefreshCw, Percent, DollarSign, Truck } from 'lucide-react';
import { cmsService } from '../../services/api';

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'PERCENTAGE',
    value: 0,
    minValue: null,
    maxUses: null,
    maxUsesPerUser: 1,
    active: true,
    expiresAt: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await cmsService.getCoupons();
      setCoupons(response.coupons || []);
    } catch (err) {
      console.error('Erro ao buscar cupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      ...coupon,
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      type: 'PERCENTAGE',
      value: 0,
      minValue: null,
      maxUses: null,
      maxUsesPerUser: 1,
      active: true,
      expiresAt: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        value: parseFloat(formData.value),
        minValue: formData.minValue ? parseFloat(formData.minValue) : null,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        maxUsesPerUser: formData.maxUsesPerUser ? parseInt(formData.maxUsesPerUser) : null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
      };

      if (editingCoupon) {
        await cmsService.updateCoupon(editingCoupon.id, data);
        alert('Cupom atualizado!');
      } else {
        await cmsService.createCoupon(data);
        alert('Cupom criado!');
      }

      handleCancel();
      fetchCoupons();
    } catch (err) {
      console.error('Erro ao salvar cupom:', err);
      alert(err.response?.data?.error || 'Erro ao salvar cupom');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este cupom?')) return;

    try {
      await cmsService.deleteCoupon(id);
      alert('Cupom excluído!');
      fetchCoupons();
    } catch (err) {
      console.error('Erro ao excluir cupom:', err);
      alert('Erro ao excluir cupom');
    }
  };

  const toggleActive = async (coupon) => {
    try {
      await cmsService.updateCoupon(coupon.id, {
        ...coupon,
        active: !coupon.active
      });
      fetchCoupons();
    } catch (err) {
      console.error('Erro ao atualizar cupom:', err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PERCENTAGE':
        return <Percent className="w-4 h-4" />;
      case 'FIXED':
        return <DollarSign className="w-4 h-4" />;
      case 'FREE_SHIPPING':
        return <Truck className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'PERCENTAGE':
        return 'Porcentagem';
      case 'FIXED':
        return 'Valor Fixo';
      case 'FREE_SHIPPING':
        return 'Frete Grátis';
      default:
        return type;
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
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Cupons</h1>
          <p className="text-gray-600 mt-1">Crie cupons de desconto para seus clientes</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-dark-600 rounded-lg hover:bg-dark-700"
          >
            <Plus className="w-4 h-4" />
            Novo Cupom
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600 uppercase"
                  placeholder="BEMVINDO10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                >
                  <option value="PERCENTAGE">Porcentagem</option>
                  <option value="FIXED">Valor Fixo (R$)</option>
                  <option value="FREE_SHIPPING">Frete Grátis</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                rows={2}
                placeholder="Cupom de boas-vindas para novos clientes"
              />
            </div>

            {formData.type !== 'FREE_SHIPPING' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor * {formData.type === 'PERCENTAGE' ? '(%)' : '(R$)'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Mínimo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minValue || ''}
                    onChange={(e) => setFormData({ ...formData, minValue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Usos
                  </label>
                  <input
                    type="number"
                    value={formData.maxUses || ''}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                    placeholder="Ilimitado"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo por Usuário
                </label>
                <input
                  type="number"
                  value={formData.maxUsesPerUser || ''}
                  onChange={(e) => setFormData({ ...formData, maxUsesPerUser: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Expiração
                </label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
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
                Cupom ativo
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                {editingCoupon ? 'Atualizar' : 'Criar'} Cupom
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

      {/* Coupons List */}
      {!showForm && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      Nenhum cupom cadastrado
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-mono font-bold text-dark-600">{coupon.code}</p>
                        {coupon.description && (
                          <p className="text-sm text-gray-500">{coupon.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(coupon.type)}
                          <span className="text-sm text-gray-900">{getTypeLabel(coupon.type)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {coupon.type === 'PERCENTAGE' && `${coupon.value}%`}
                        {coupon.type === 'FIXED' && `R$ ${coupon.value.toFixed(2)}`}
                        {coupon.type === 'FREE_SHIPPING' && '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {coupon.usedCount}/{coupon.maxUses || '∞'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleActive(coupon)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            coupon.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {coupon.active ? (
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
                            onClick={() => handleEdit(coupon)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
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

export default CouponManager;
