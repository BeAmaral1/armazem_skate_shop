import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    // Validação básica
    if (!email) {
      setError('Por favor, digite seu e-mail');
      setIsSubmitting(false);
      return;
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, digite um e-mail válido');
      setIsSubmitting(false);
      return;
    }

    // Simular envio (por enquanto, sem backend real)
    setTimeout(() => {
      setEmailSent(true);
      setMessage('Um e-mail com instruções para recuperar sua senha foi enviado!');
      setIsSubmitting(false);
    }, 1500);
  };

  if (emailSent) {
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
                E-mail Enviado!
              </h2>
              
              <p className="text-gray-400 mb-6">
                Enviamos um link de recuperação para:
              </p>
              
              <p className="text-white font-semibold mb-8 break-all">
                {email}
              </p>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-400">
                  <strong>Atenção:</strong> Verifique também sua caixa de spam ou lixo eletrônico.
                  O e-mail pode levar alguns minutos para chegar.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full bg-dark-600 hover:bg-dark-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para Login
                </Link>
                
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="w-full text-gray-400 hover:text-white font-medium py-2 transition-colors duration-200"
                >
                  Enviar para outro e-mail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-800 via-dark-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        {/* <div>
          <Link to="/" className="flex justify-center">
            <img
              src="/logo_armazem.png"
              alt="Armazém Skate Shop"
              className="h-20 w-auto"
            />
          </Link>
        </div> */}

        {/* Card */}
        <div className="bg-dark-700/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-dark-600">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-dark-600 mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              Esqueceu sua senha?
            </h2>
            
            <p className="text-gray-400 text-sm">
              Não se preocupe! Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
            </p>
          </div>

          {/* Mensagens */}
          {message && (
            <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 text-sm">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-dark-500 rounded-lg bg-dark-600/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                  placeholder="seu@email.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Enviar Link de Recuperação
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-500"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-700 text-gray-400">ou</span>
              </div>
            </div>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full bg-dark-600 hover:bg-dark-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Login
            </Link>

            <p className="text-center text-sm text-gray-400">
              Não tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium text-white hover:text-gray-300 transition-colors duration-200"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        {/* Info adicional */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Se você não receber o e-mail em alguns minutos, verifique sua pasta de spam
            ou entre em contato com nosso suporte.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
