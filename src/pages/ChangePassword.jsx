import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, Save, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';
import Toast from '../components/Toast';

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme a nova senha';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'A nova senha deve ser diferente da atual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    const result = await changePassword(formData.currentPassword, formData.newPassword);
    setLoading(false);

    if (result.success) {
      setToast({
        type: 'success',
        message: {
          title: '✅ Senha Alterada!',
          description: 'Sua senha foi atualizada com sucesso.',
        },
      });

      // Limpar formulário
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setTimeout(() => {
        navigate('/perfil');
      }, 1500);
    } else {
      setToast({
        type: 'error',
        message: {
          title: '❌ Erro ao Alterar Senha',
          description: result.error || 'Não foi possível alterar a senha.',
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

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const passwordStrength = (password) => {
    if (!password) return null;
    if (password.length < 6) return { level: 'weak', label: 'Fraca', color: 'bg-red-500' };
    if (password.length < 10) return { level: 'medium', label: 'Média', color: 'bg-yellow-500' };
    return { level: 'strong', label: 'Forte', color: 'bg-green-500' };
  };

  const strength = passwordStrength(formData.newPassword);

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
              Alterar Senha
            </h1>
            <p className="text-gray-600">Mantenha sua conta segura atualizando sua senha regularmente</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
                {/* Security Tips */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-dark-700" />
                    Dicas de Segurança
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1 ml-7">
                    <li>• Use no mínimo 6 caracteres</li>
                    <li>• Misture letras maiúsculas e minúsculas</li>
                    <li>• Inclua números e símbolos especiais</li>
                    <li>• Não use informações pessoais óbvias</li>
                    <li>• Não reutilize senhas de outros sites</li>
                  </ul>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        disabled={loading}
                        className={`input-field pl-10 pr-10 ${
                          errors.currentPassword ? 'border-red-500' : ''
                        }`}
                        placeholder="Digite sua senha atual"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPassword('current')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        disabled={loading}
                        className={`input-field pl-10 pr-10 ${
                          errors.newPassword ? 'border-red-500' : ''
                        }`}
                        placeholder="Digite sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPassword('new')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.newPassword}
                      </p>
                    )}
                    {/* Password Strength */}
                    {strength && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Força da senha:</span>
                          <span className={`text-xs font-medium ${
                            strength.level === 'weak' ? 'text-red-600' :
                            strength.level === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${strength.color}`}
                            style={{
                              width:
                                strength.level === 'weak' ? '33%' :
                                strength.level === 'medium' ? '66%' :
                                '100%',
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nova Senha *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        className={`input-field pl-10 pr-10 ${
                          errors.confirmPassword ? 'border-red-500' : ''
                        }`}
                        placeholder="Confirme sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowPassword('confirm')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </p>
                    )}
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
                          Alterando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Alterar Senha
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

export default ChangePassword;
