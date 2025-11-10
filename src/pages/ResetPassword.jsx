import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);

  // Validar token ao carregar
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setError('Token inválido ou expirado');
        return;
      }

      // Simular validação de token (por enquanto)
      setTimeout(() => {
        setIsValidToken(true);
      }, 500);
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validações
    if (!password) {
      setError('Por favor, digite sua nova senha');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      setIsSubmitting(false);
      return;
    }

    // Simular reset de senha
    setTimeout(() => {
      setSuccess(true);
      setIsSubmitting(false);
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1500);
  };

  // Tela de sucesso
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-800 via-dark-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link to="/" className="flex justify-center">
              <img
                src="/logo_armazem.png"
                alt="Armazém Skate Shop"
                className="h-20 w-auto"
              />
            </Link>
          </div>

          <div className="bg-dark-700/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-dark-600">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                Senha Redefinida!
              </h2>
              
              <p className="text-gray-400 mb-6">
                Sua senha foi alterada com sucesso. Você será redirecionado para a página de login...
              </p>
              
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Redirecionando...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Token inválido
  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-800 via-dark-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link to="/" className="flex justify-center">
              <img
                src="/logo_armazem.png"
                alt="Armazém Skate Shop"
                className="h-20 w-auto"
              />
            </Link>
          </div>

          <div className="bg-dark-700/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-dark-600">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-4">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                Link Inválido ou Expirado
              </h2>
              
              <p className="text-gray-400 mb-6">
                Este link de recuperação de senha é inválido ou já expirou. 
                Por favor, solicite um novo link.
              </p>
              
              <div className="space-y-3">
                <Link
                  to="/esqueceu-senha"
                  className="block w-full bg-white hover:bg-gray-100 text-black font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Solicitar Novo Link
                </Link>
                
                <Link
                  to="/login"
                  className="block w-full bg-dark-600 hover:bg-dark-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Voltar para Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading token validation
  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-800 via-dark-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-10 h-10 text-white animate-spin" />
          <p className="text-gray-400">Verificando link...</p>
        </div>
      </div>
    );
  }

  // Formulário de redefinição
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-800 via-dark-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div>
          <Link to="/" className="flex justify-center">
            <img
              src="/logo.png"
              alt="Armazém Skate Shop"
              className="h-20 w-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-dark-700/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-dark-600">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-dark-600 mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              Redefinir Senha
            </h2>
            
            <p className="text-gray-400 text-sm">
              Digite sua nova senha abaixo
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nova Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-dark-500 rounded-lg bg-dark-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                  placeholder="Mínimo 6 caracteres"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-dark-500 rounded-lg bg-dark-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                  placeholder="Digite a senha novamente"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Requisitos de senha */}
            <div className="bg-dark-600/30 border border-dark-500 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2">Sua senha deve ter:</p>
              <ul className="space-y-1">
                <li className={`text-xs flex items-center gap-2 ${password.length >= 6 ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                  No mínimo 6 caracteres
                </li>
                <li className={`text-xs flex items-center gap-2 ${password && confirmPassword && password === confirmPassword ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${password && confirmPassword && password === confirmPassword ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                  Senhas conferem
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Redefinindo...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Redefinir Senha
                </>
              )}
            </button>
          </form>

          {/* Link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              Voltar para Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
