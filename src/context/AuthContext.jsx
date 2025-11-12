import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Função para carregar usuário do storage (fora do componente para ser síncrona)
const loadUserFromStorageSync = () => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  
  if (storedUser && storedToken) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('isTemporarySession');
      return null;
    }
  }
  
  return null;
};

export const AuthProvider = ({ children }) => {
  // Carregar user IMEDIATAMENTE de forma síncrona
  const [user, setUser] = useState(() => loadUserFromStorageSync());
  const [loading, setLoading] = useState(false); // Não precisa loading se já carregou

  // Função para recarregar usuário do storage
  const loadUserFromStorage = () => {
    const loadedUser = loadUserFromStorageSync();
    setUser(loadedUser);
  };

  // Função para forçar recarga do storage (simplificada)
  const reloadUserFromStorage = () => {
    loadUserFromStorage();
  };

  // Salvar usuário no localStorage
  const saveUserToStorage = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  // Login
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);

      // Chamar API real
      const response = await authService.login({ email, password });
      
      if (!response.success) {
        throw new Error(response.message || 'Erro ao fazer login');
      }

      const { token, user: userData } = response;

      // Salvar no estado
      setUser(userData);
      
      // SEMPRE salvar no localStorage (mais estável que sessionStorage)
      // Se não marcou "lembrar-me", adicionar flag para limpar ao fechar navegador
      saveUserToStorage(userData, token);
      
      if (!rememberMe) {
        // Adicionar flag para indicar que é sessão temporária
        localStorage.setItem('isTemporarySession', 'true');
      } else {
        localStorage.removeItem('isTemporarySession');
      }

      return { success: true, user: userData };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.response?.data?.message || error.message || 'Erro ao fazer login' };
    } finally {
      setLoading(false);
    }
  };

  // Cadastro
  const register = async (userData) => {
    try {
      setLoading(true);

      // Chamar API real
      const response = await authService.register(userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Erro ao criar conta');
      }

      const { token, user: newUser } = response;

      // Salvar no estado e localStorage
      setUser(newUser);
      saveUserToStorage(newUser, token);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: error.response?.data?.message || error.message || 'Erro ao criar conta' };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isTemporarySession');
  };

  // Atualizar perfil
  const updateProfile = async (updates) => {
    try {
      setLoading(true);

      const response = await authService.updateProfile(updates);
      const updatedUser = response.user || { ...user, ...updates };

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
      return { success: false, error: error.response?.data?.message || error.message };
    } finally {
      setLoading(false);
    }
  };

  // Alterar senha
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      const response = await authService.changePassword(currentPassword, newPassword);
      if (!response.success) {
        throw new Error(response.message || 'Erro ao alterar senha');
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
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
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { 
        success: true, 
        message: 'Se existir uma conta com este email, enviaremos instruções.' 
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
    reloadUserFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
