import React, { useState } from 'react';
import { Save, RefreshCw, Eye, Edit2 } from 'lucide-react';
import { usePageContent } from '../../hooks/usePageContent';
import { cmsService } from '../../services/api';

const ContentEditor = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  
  const { content, loading, error, refetch } = usePageContent(selectedPage);

  const pages = [
    { value: 'home', label: 'Home' },
    { value: 'about', label: 'Sobre Nós' },
    { value: 'contact', label: 'Contato' },
    { value: 'footer', label: 'Footer' }
  ];

  const handleEdit = () => {
    // Converter content para formato editável
    const flatData = {};
    Object.entries(content).forEach(([section, fields]) => {
      Object.entries(fields).forEach(([key, data]) => {
        flatData[`${section}.${key}`] = data.value;
      });
    });
    setFormData(flatData);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Converter formData de volta para formato da API
      const contents = [];
      Object.entries(formData).forEach(([fullKey, value]) => {
        const [section, key] = fullKey.split('.');
        contents.push({
          page: selectedPage,
          section,
          key,
          value,
          type: content[section]?.[key]?.type || 'TEXT'
        });
      });

      await cmsService.saveBulkContent(contents);
      
      alert('Conteúdo salvo com sucesso!');
      setEditing(false);
      refetch();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar conteúdo');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (section, key, data) => {
    const fullKey = `${section}.${key}`;
    const value = editing ? (formData[fullKey] ?? data.value) : data.value;

    if (editing) {
      if (data.type === 'TEXTAREA' || data.type === 'HTML') {
        return (
          <textarea
            value={value}
            onChange={(e) => setFormData({ ...formData, [fullKey]: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600 focus:border-transparent"
            rows={4}
          />
        );
      }

      return (
        <input
          type="text"
          value={value}
          onChange={(e) => setFormData({ ...formData, [fullKey]: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600 focus:border-transparent"
        />
      );
    }

    return <p className="text-gray-700">{value}</p>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Carregando conteúdo...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        Erro ao carregar conteúdo: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editor de Conteúdo</h1>
          <p className="text-gray-600 mt-1">Edite os textos do site sem mexer no código</p>
        </div>

        <div className="flex items-center gap-3">
          {!editing ? (
            <>
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                Visualizar Site
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-dark-600 rounded-lg hover:bg-dark-700"
              >
                <Edit2 className="w-4 h-4" />
                Editar Conteúdo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
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
                    Salvar Alterações
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Page Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecione a Página:
        </label>
        <select
          value={selectedPage}
          onChange={(e) => {
            setSelectedPage(e.target.value);
            setEditing(false);
            setFormData({});
          }}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600 focus:border-transparent"
        >
          {pages.map(page => (
            <option key={page.value} value={page.value}>
              {page.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {Object.entries(content).length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">Nenhum conteúdo encontrado para esta página.</p>
            <p className="text-yellow-700 text-sm mt-2">
              Adicione conteúdo via API ou crie manualmente.
            </p>
          </div>
        ) : (
          Object.entries(content).map(([section, fields]) => (
            <div key={section} className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 capitalize">
                  {section.replace(/_/g, ' ')}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {Object.entries(fields).map(([key, data]) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}
                      <span className="ml-2 text-xs text-gray-500">({data.type})</span>
                    </label>
                    {renderField(section, key, data)}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Instructions */}
      {!editing && Object.entries(content).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Dica:</strong> Clique em "Editar Conteúdo" para modificar os textos. 
            As alterações serão salvas no banco de dados e aparecerão no site imediatamente!
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
