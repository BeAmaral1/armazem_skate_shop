import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Dados mockados de usuários (simulando banco de dados)
const MOCK_USERS = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    password: '123456',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    avatar: null,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@email.com',
    password: '123456',
    cpf: '987.654.321-00',
    phone: '(21) 99876-5432',
    avatar: null,
    createdAt: '2024-02-20',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Salvar usuário no localStorage
  const saveUserToStorage = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  // Login
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Buscar usuário nos dados mockados
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error('Email ou senha incorretos');
      }

      // Gerar token simulado
      const token = `token_${foundUser.id}_${Date.now()}`;

      // Remover senha do objeto de usuário
      const { password: _, ...userWithoutPassword } = foundUser;

      // Salvar no estado e localStorage
      setUser(userWithoutPassword);
      
      if (rememberMe) {
        saveUserToStorage(userWithoutPassword, token);
      } else {
        // Salvar apenas na sessão
        sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
        sessionStorage.setItem('token', token);
      }

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Cadastro
  const register = async (userData) => {
    try {
      setLoading(true);

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verificar se email já existe
      const emailExists = MOCK_USERS.some((u) => u.email === userData.email);
      if (emailExists) {
        throw new Error('Este email já está cadastrado');
      }

      // Criar novo usuário
      const newUser = {
        id: MOCK_USERS.length + 1,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        cpf: userData.cpf || '',
        phone: userData.phone || '',
        avatar: null,
        createdAt: new Date().toISOString(),
      };

      // Adicionar aos usuários mockados (apenas para esta sessão)
      MOCK_USERS.push(newUser);

      // Gerar token
      const token = `token_${newUser.id}_${Date.now()}`;

      // Remover senha
      const { password: _, ...userWithoutPassword } = newUser;

      // Salvar no estado e localStorage
      setUser(userWithoutPassword);
      saveUserToStorage(userWithoutPassword, token);

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  // Atualizar perfil
  const updateProfile = async (updates) => {
    try {
      setLoading(true);

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser = {
        ...user,
        ...updates,
      };

      setUser(updatedUser);
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        if (localStorage.getItem('token')) {
          saveUserToStorage(updatedUser, token);
        } else {
          sessionStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }

      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Alterar senha
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Verificar senha atual (em produção, isso seria no backend)
      const foundUser = MOCK_USERS.find((u) => u.id === user.id);
      if (!foundUser || foundUser.password !== currentPassword) {
        throw new Error('Senha atual incorreta');
      }

      // Atualizar senha (em produção, isso seria no backend)
      foundUser.password = newPassword;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verificar se está autenticado
  const isAuthenticated = () => {
    return !!user;
  };

  // Recuperar senha (apenas UI - não funcional de verdade)
  const forgotPassword = async (email) => {
    try {
      setLoading(true);

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verificar se email existe
      const userExists = MOCK_USERS.some((u) => u.email === email);
      if (!userExists) {
        throw new Error('Email não encontrado');
      }

      return { 
        success: true, 
        message: 'Email de recuperação enviado! (simulado)' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
