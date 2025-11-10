import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Phone, CreditCard, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado dos formulários
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    phone: '',
  });

  // Validações
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateLoginForm = () => {
    const newErrors = {};

    if (!loginData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!loginData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};

    if (!registerData.name) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!registerData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!registerData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!validatePassword(registerData.password)) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;

    setLoading(true);
    const result = await login(loginData.email, loginData.password, rememberMe);
    setLoading(false);

    if (result.success) {
      setToast({
        type: 'surf',
        message: {
          title: `🌊 Bem-vindo, ${result.user.name}!`,
          description: 'Login realizado com sucesso. Preparado para pegar aquela onda?'
        }
      });

      // Redirecionar para página anterior ou home
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }, 1500);
    } else {
      setToast({
        type: 'error',
        message: {
          title: '❌ Erro no Login',
          description: result.error || 'Não foi possível fazer login'
        }
      });
    }
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;

    setLoading(true);
    const result = await register(registerData);
    setLoading(false);

    if (result.success) {
      setToast({
        type: 'skate',
        message: {
          title: `⚡ Bem-vindo, ${result.user.name}!`,
          description: 'Cadastro realizado com sucesso. Aproveite nossa loja!'
        }
      });

      // Redirecionar
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }, 1500);
    } else {
      setToast({
        type: 'error',
        message: {
          title: '❌ Erro no Cadastro',
          description: result.error || 'Não foi possível criar sua conta'
        }
      });
    }
  };

  // Alternar entre login e cadastro
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setLoginData({ email: '', password: '' });
    setRegisterData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      cpf: '',
      phone: '',
    });
  };

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-dark-900 rounded-full mb-4">
              <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2">
              {isLogin ? 'Bem-vindo de volta!' : 'Criar Conta'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {isLogin ? 'Entre com sua conta para continuar' : 'Cadastre-se para começar'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            {/* Tab Toggle */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={toggleMode}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  isLogin ? 'bg-dark-900 text-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={toggleMode}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  !isLogin ? 'bg-dark-900 text-white shadow' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cadastrar
              </button>
            </div>

            {/* LOGIN FORM */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="seu@email.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-dark-900 border-gray-300 rounded focus:ring-dark-600"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700">Lembrar-me</span>
                  </label>
                  <Link to="/esqueceu-senha" className="text-sm text-dark-700 hover:text-dark-900 font-medium">
                    Esqueci a senha
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </button>

                {/* Demo Info */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                  <p className="font-semibold mb-1">📝 Conta de teste:</p>
                  <p>Email: joao@email.com</p>
                  <p>Senha: 123456</p>
                </div>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="João Silva"
                      disabled={loading}
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
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="seu@email.com"
                      disabled={loading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* CPF & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={registerData.cpf}
                        onChange={(e) => setRegisterData({ ...registerData, cpf: e.target.value })}
                        className="input-field pl-10"
                        placeholder="000.000.000-00"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        className="input-field pl-10"
                        placeholder="(00) 00000-0000"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Ao se cadastrar, você concorda com nossos{' '}
                  <Link to="/termos-uso" className="text-dark-700 hover:text-dark-900 font-medium">
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link to="/politica-privacidade" className="text-dark-700 hover:text-dark-900 font-medium">
                    Política de Privacidade
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
