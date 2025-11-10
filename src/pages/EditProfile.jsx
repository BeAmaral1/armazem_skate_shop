import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, CreditCard, Save, ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import Toast from '../components/Toast';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const result = await updateProfile(formData);
    setLoading(false);

    if (result.success) {
      setToast({
        type: 'success',
        message: {
          title: '✅ Perfil Atualizado!',
          description: 'Suas informações foram salvas com sucesso.',
        },
      });

      setTimeout(() => {
        navigate('/perfil');
      }, 1500);
    } else {
      setToast({
        type: 'error',
        message: {
          title: '❌ Erro ao Atualizar',
          description: result.error || 'Não foi possível salvar as alterações.',
        },
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/perfil')}
              className="flex items-center gap-2 text-gray-600 hover:text-dark-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2">
              Editar Perfil
            </h1>
            <p className="text-gray-600">Atualize suas informações pessoais</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                        className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="seu@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone & CPF */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={loading}
                          className="input-field pl-10"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="cpf"
                          value={formData.cpf}
                          onChange={handleChange}
                          disabled={loading}
                          className="input-field pl-10"
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Salvar Alterações
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/perfil')}
                      disabled={loading}
                      className="btn-outline"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
