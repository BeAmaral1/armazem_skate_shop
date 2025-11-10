import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, RefreshCw } from 'lucide-react';
import { useFaqs } from '../../hooks/useFaqs';
import { cmsService } from '../../services/api';

const FaqManager = () => {
  const { faqs, loading, refetch } = useFaqs();
  const [showForm, setShowForm] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'geral',
    order: 0,
    active: true
  });

  const categories = [
    { value: 'geral', label: 'Geral' },
    { value: 'envio', label: 'Envio' },
    { value: 'pagamento', label: 'Pagamento' },
    { value: 'produto', label: 'Produtos' },
    { value: 'troca', label: 'Trocas e Devoluções' },
    { value: 'conta', label: 'Minha Conta' }
  ];

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData(faq);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'geral',
      order: 0,
      active: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingFaq) {
        await cmsService.updateFaq(editingFaq.id, formData);
        alert('FAQ atualizada!');
      } else {
        await cmsService.createFaq(formData);
        alert('FAQ criada!');
      }

      handleCancel();
      refetch();
    } catch (err) {
      console.error('Erro ao salvar FAQ:', err);
      alert('Erro ao salvar FAQ');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir esta FAQ?')) return;

    try {
      await cmsService.deleteFaq(id);
      alert('FAQ excluída!');
      refetch();
    } catch (err) {
      console.error('Erro ao excluir FAQ:', err);
      alert('Erro ao excluir FAQ');
    }
  };

  const toggleActive = async (faq) => {
    try {
      await cmsService.updateFaq(faq.id, {
        ...faq,
        active: !faq.active
      });
      refetch();
    } catch (err) {
      console.error('Erro ao atualizar FAQ:', err);
    }
  };

  // Agrupar FAQs por categoria
  const faqsByCategory = faqs.reduce((acc, faq) => {
    const category = faq.category || 'geral';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  // Ordenar FAQs dentro de cada categoria
  Object.keys(faqsByCategory).forEach(category => {
    faqsByCategory[category].sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  const getCategoryLabel = (value) => {
    return categories.find(c => c.value === value)?.label || value;
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
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar FAQs</h1>
          <p className="text-gray-600 mt-1">Crie e organize perguntas frequentes</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-dark-600 rounded-lg hover:bg-dark-700"
          >
            <Plus className="w-4 h-4" />
            Nova FAQ
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 font-medium">Total de FAQs</p>
          <p className="text-2xl font-bold text-gray-900">{faqs.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-green-800 font-medium">Ativas</p>
          <p className="text-2xl font-bold text-green-900">
            {faqs.filter(f => f.active).length}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-800 font-medium">Inativas</p>
          <p className="text-2xl font-bold text-gray-900">
            {faqs.filter(f => !f.active).length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-blue-800 font-medium">Categorias</p>
          <p className="text-2xl font-bold text-blue-900">
            {Object.keys(faqsByCategory).length}
          </p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {editingFaq ? 'Editar FAQ' : 'Nova FAQ'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pergunta *
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                placeholder="Como faço para..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resposta *
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                rows={5}
                placeholder="A resposta é..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
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
                FAQ ativa
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                {editingFaq ? 'Atualizar' : 'Criar'} FAQ
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

      {/* FAQs List by Category */}
      {!showForm && (
        <div className="space-y-6">
          {Object.keys(faqsByCategory).length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800 font-medium">Nenhuma FAQ cadastrada</p>
              <p className="text-yellow-700 text-sm mt-2">
                Clique em "Nova FAQ" para começar
              </p>
            </div>
          ) : (
            Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
              <div key={category} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                      {getCategoryLabel(category)}
                    </h2>
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-full">
                      {categoryFaqs.length} {categoryFaqs.length === 1 ? 'pergunta' : 'perguntas'}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {categoryFaqs.map((faq) => (
                    <div key={faq.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 cursor-move pt-1">
                          <GripVertical className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-base font-semibold text-gray-900">
                              {faq.question}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => toggleActive(faq)}
                                className={`p-2 rounded-lg ${
                                  faq.active
                                    ? 'text-green-600 hover:bg-green-50'
                                    : 'text-gray-400 hover:bg-gray-100'
                                }`}
                                title={faq.active ? 'Ativa' : 'Inativa'}
                              >
                                {faq.active ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEdit(faq)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(faq.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm leading-relaxed">
                            {faq.answer}
                          </p>

                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs text-gray-500">
                              Ordem: {faq.order || 0}
                            </span>
                            {!faq.active && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                Inativa
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Instructions */}
      {!showForm && faqs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Dica:</strong> Use o campo "Ordem" para controlar a sequência de exibição das FAQs.
            Arraste as perguntas (ícone ≡) para reordenar visualmente.
          </p>
        </div>
      )}
    </div>
  );
};

export default FaqManager;
