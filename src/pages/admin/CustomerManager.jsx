import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  Mail,
  Download,
  Search,
  Filter,
  UserCheck,
  UserX,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  X,
  RefreshCw,
  MapPin,
  Calendar
} from 'lucide-react';
import { adminService } from '../../services/api';

const CustomerManager = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Carregar clientes da API
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const [usersResp, ordersResp] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllOrders({ limit: 1000 })
      ]);

      const orders = ordersResp.orders || [];
      const totalsByUser = new Map();
      const lastByUser = new Map();

      for (const o of orders) {
        const uid = o.userId || (o.user && o.user.id) || null;
        if (!uid) continue;
        totalsByUser.set(uid, (totalsByUser.get(uid) || 0) + (o.total || 0));
        const d = new Date(o.createdAt).getTime();
        const prev = lastByUser.get(uid) || 0;
        if (d > prev) lastByUser.set(uid, d);
      }

      const mapped = (usersResp.users || []).map(u => ({
        ...u,
        status: u.active ? 'active' : 'inactive',
        joinDate: u.createdAt,
        totalOrders: u._count?.orders || 0,
        lastOrder: lastByUser.has(u.id) ? new Date(lastByUser.get(u.id)).toISOString() : null,
        totalSpent: totalsByUser.get(u.id) || 0,
        addresses: [],
        orders: []
      }));

      setCustomers(mapped);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar clientes. Tente novamente.');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (customerId, currentActive) => {
    try {
      const newActive = !currentActive;
      await adminService.updateUserStatus(customerId, newActive);
      alert('Status atualizado com sucesso!');
      loadCustomers(); // Recarregar lista
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError('Erro ao atualizar status. Tente novamente.');
      alert('Erro ao atualizar status!');
    }
  };

  const sendEmail = (customer) => {
    alert(`Email enviado para ${customer.email}`);
  };

  const exportCustomers = () => {
    alert('Exportando clientes...');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      (customer.cpf && customer.cpf.includes(searchTerm));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? customer.active : !customer.active);

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalOrdersCount = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0);
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.active).length,
    inactive: customers.filter(c => !c.active).length,
    totalRevenue,
    avgOrders: customers.length ? totalOrdersCount / customers.length : 0,
    avgSpent: customers.length ? totalRevenue / customers.length : 0
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Clientes</h1>
          <p className="text-gray-600 mt-1">Visualize e gerencie seus clientes</p>
        </div>

        <button
          onClick={exportCustomers}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-green-800 font-medium">Ativos</p>
          <p className="text-2xl font-bold text-green-900">{stats.active}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-red-800 font-medium">Inativos</p>
          <p className="text-2xl font-bold text-red-900">{stats.inactive}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-blue-800 font-medium">Receita Total</p>
          <p className="text-lg font-bold text-blue-900">R$ {stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-purple-800 font-medium">Média Pedidos</p>
          <p className="text-2xl font-bold text-purple-900">{stats.avgOrders.toFixed(1)}</p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow-sm p-4">
          <p className="text-sm text-orange-800 font-medium">Ticket Médio</p>
          <p className="text-lg font-bold text-orange-900">R$ {stats.avgSpent.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
              placeholder="Buscar por nome, email, telefone ou CPF..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cadastro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pedidos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Gasto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Nenhum cliente encontrado'
                      : 'Nenhum cliente cadastrado'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(customer.joinDate)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{customer.totalOrders}</p>
                        <p className="text-xs text-gray-500">
                          Último: {formatDate(customer.lastOrder)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-green-600">
                        R$ {customer.totalSpent.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(customer.id, customer.active)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          customer.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {customer.status === 'active' ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3" />
                            Inativo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => sendEmail(customer)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Enviar email"
                        >
                          <Mail className="w-4 h-4" />
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

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Detalhes do Cliente</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">Informações Pessoais</h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nome</p>
                    <p className="font-medium">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CPF</p>
                    <p className="font-medium">{selectedCustomer.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p className="font-medium">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data de Nascimento</p>
                    <p className="font-medium">{formatDate(selectedCustomer.birthdate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cliente desde</p>
                    <p className="font-medium">{formatDate(selectedCustomer.joinDate)}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">Estatísticas</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">{selectedCustomer.totalOrders}</p>
                    <p className="text-sm text-blue-800">Pedidos</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xl font-bold text-green-900">R$ {selectedCustomer.totalSpent.toFixed(2)}</p>
                    <p className="text-sm text-green-800">Total Gasto</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-purple-900">{formatDate(selectedCustomer.lastOrder)}</p>
                    <p className="text-sm text-purple-800">Último Pedido</p>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">Endereços</h3>
                {selectedCustomer.addresses.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhum endereço cadastrado</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.addresses.map((address, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div>
                            <p className="font-medium">{address.street}</p>
                            <p className="text-sm text-gray-600">
                              {address.city} - {address.state}, CEP {address.zipCode}
                            </p>
                            {address.default && (
                              <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                Principal
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">Histórico de Pedidos</h3>
                <div className="space-y-2">
                  {(selectedCustomer.orders || []).map((order, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                      <div>
                        <p className="font-semibold">{order.code}</p>
                        <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R$ {order.total.toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'delivered' ? 'Entregue' :
                           order.status === 'shipped' ? 'Enviado' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManager;
