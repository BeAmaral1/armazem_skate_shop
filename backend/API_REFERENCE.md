# 📡 API REFERENCE - ARMAZÉM SKATE SHOP

Documentação completa de todas as APIs disponíveis.

**Base URL:** `http://localhost:5000/api`

---

## 🔐 AUTENTICAÇÃO

Todas as rotas protegidas requerem token JWT no header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

### **POST /auth/register**
Registrar novo usuário.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123",
  "name": "João Silva",
  "phone": "(11) 99999-9999"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "João Silva",
    "role": "CUSTOMER"
  }
}
```

### **POST /auth/login**
Login de usuário.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "João Silva",
    "role": "CUSTOMER"
  }
}
```

### **POST /auth/admin/login**
Login de administrador.

**Request:**
```json
{
  "email": "admin@armazemskate.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login admin realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@armazemskate.com",
    "name": "Administrador",
    "role": "SUPER_ADMIN"
  }
}
```

### **GET /auth/profile** 🔒
Obter perfil do usuário autenticado.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": "João Silva",
    "phone": "(11) 99999-9999",
    "role": "CUSTOMER",
    "_count": {
      "orders": 5,
      "wishlist": 3
    }
  }
}
```

### **PUT /auth/profile** 🔒
Atualizar perfil.

**Request:**
```json
{
  "name": "João Pedro Silva",
  "phone": "(11) 98888-8888",
  "cpf": "123.456.789-00"
}
```

### **PUT /auth/password** 🔒
Alterar senha.

**Request:**
```json
{
  "currentPassword": "senha123",
  "newPassword": "novaSenha456"
}
```

---

## 👨‍💼 ADMIN - DASHBOARD

**Requer:** Admin ou Super Admin

### **GET /admin/dashboard** 🔒👑
Estatísticas gerais do dashboard.

**Response:**
```json
{
  "success": true,
  "stats": {
    "users": 150,
    "products": 45,
    "orders": 320,
    "revenue": 45000.50,
    "pendingOrders": 12,
    "ordersLast30Days": 85,
    "revenueLast30Days": 12500.00
  },
  "recentOrders": [...]
}
```

### **GET /admin/analytics?period=30** 🔒👑
Análise de vendas.

**Query Params:**
- `period`: Número de dias (padrão: 30)

**Response:**
```json
{
  "success": true,
  "analytics": {
    "salesByDay": [
      {
        "date": "2024-01-15",
        "orders": 12,
        "revenue": 1500.00
      }
    ],
    "topProducts": [
      {
        "productId": "uuid",
        "product": {
          "name": "Prancha Surf Pro",
          "price": 1200.00
        },
        "_sum": {
          "quantity": 25,
          "subtotal": 30000.00
        }
      }
    ],
    "paymentMethods": [
      {
        "paymentMethod": "PIX",
        "_count": { "paymentMethod": 50 },
        "_sum": { "total": 15000.00 }
      }
    ]
  }
}
```

---

## 👥 ADMIN - USUÁRIOS

### **GET /admin/users** 🔒👑
Listar todos os usuários.

**Query Params:**
- `page`: Página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `search`: Buscar por nome ou email
- `role`: Filtrar por role (CUSTOMER, ADMIN, SUPER_ADMIN)

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "email": "usuario@example.com",
      "name": "João Silva",
      "phone": "(11) 99999-9999",
      "role": "CUSTOMER",
      "active": true,
      "emailVerified": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "_count": {
        "orders": 5
      }
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

### **PATCH /admin/users/:userId/status** 🔒👑
Ativar/desativar usuário.

**Request:**
```json
{
  "active": false
}
```

### **DELETE /admin/users/:userId** 🔒👑
Deletar usuário (não pode deletar super admin).

---

## 📦 ADMIN - PEDIDOS

### **GET /admin/orders** 🔒👑
Listar todos os pedidos.

**Query Params:**
- `page`: Página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `status`: Filtrar por status (PENDING, CONFIRMED, etc)
- `paymentStatus`: Filtrar por status de pagamento

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "uuid",
      "orderNumber": "ORD-20240115-001",
      "total": 1500.00,
      "status": "CONFIRMED",
      "paymentStatus": "APPROVED",
      "paymentMethod": "PIX",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "user": {
        "name": "João Silva",
        "email": "usuario@example.com"
      },
      "items": [...]
    }
  ],
  "pagination": {...}
}
```

### **PATCH /admin/orders/:orderId/status** 🔒👑
Atualizar status do pedido.

**Request:**
```json
{
  "status": "SHIPPED",
  "trackingCode": "BR123456789"
}
```

Status disponíveis:
- `PENDING` - Aguardando pagamento
- `CONFIRMED` - Pagamento confirmado
- `PROCESSING` - Em preparação
- `SHIPPED` - Enviado
- `DELIVERED` - Entregue
- `CANCELLED` - Cancelado
- `REFUNDED` - Reembolsado

---

## 📊 ADMIN - LOGS

### **GET /admin/logs/payments** 🔒👑
Logs de pagamentos.

**Query Params:**
- `page`: Página (padrão: 1)
- `limit`: Itens por página (padrão: 50)
- `gateway`: Filtrar por gateway (mercadopago, pagbank)
- `orderId`: Filtrar por pedido

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "id": "uuid",
      "orderId": "uuid",
      "gateway": "mercadopago",
      "method": "pix",
      "event": "created",
      "status": "pending",
      "request": {...},
      "response": {...},
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {...}
}
```

### **GET /admin/logs/system** 🔒👑
Logs do sistema.

**Query Params:**
- `page`, `limit`
- `level`: Filtrar por nível (INFO, WARN, ERROR, DEBUG)
- `module`: Filtrar por módulo (payment, order, auth, etc)

### **GET /admin/logs/webhooks** 🔒👑
Logs de webhooks.

**Query Params:**
- `page`, `limit`
- `source`: Filtrar por origem (mercadopago, pagbank)
- `processed`: Filtrar por processado (true, false)

---

## 💳 PAGAMENTOS

### **POST /payment/create**
Criar pagamento.

**Request PIX:**
```json
{
  "orderId": "uuid-do-pedido",
  "paymentMethod": "PIX"
}
```

**Response PIX:**
```json
{
  "success": true,
  "payment": {
    "paymentId": "123456",
    "qrCode": "00020126...",
    "qrCodeBase64": "data:image/png;base64...",
    "expirationDate": "2024-01-20T23:59:59Z",
    "status": "pending",
    "gateway": "mercadopago",
    "method": "pix"
  }
}
```

**Request Cartão:**
```json
{
  "orderId": "uuid-do-pedido",
  "paymentMethod": "CREDIT_CARD",
  "cardData": {
    "number": "4111111111111111",
    "holderName": "JOAO SILVA",
    "expMonth": "12",
    "expYear": "2025",
    "cvv": "123",
    "installments": 1
  }
}
```

**Response Cartão:**
```json
{
  "success": true,
  "payment": {
    "orderId": "ORDER_123",
    "status": "PAID",
    "approved": true,
    "authorizationCode": "ABC123",
    "gateway": "pagbank",
    "method": "credit_card"
  }
}
```

### **GET /payment/status/:orderId**
Verificar status do pagamento.

### **GET /payment/installments?amount=500**
Calcular parcelas disponíveis.

### **GET /payment/fees**
Obter taxas dos gateways.

### **POST /payment/webhook/mercadopago**
Webhook do Mercado Pago (automático).

### **POST /payment/webhook/pagbank**
Webhook do PagBank (automático).

---

## 🛍️ PRODUTOS

### **GET /products**
Listar produtos.

**Query Params:**
- `page`, `limit`
- `category`: Filtrar por categoria
- `search`: Buscar por nome
- `featured`: Apenas destaques (true/false)

### **GET /products/:id**
Detalhes do produto.

### **POST /products** 🔒👑
Criar produto (apenas admin).

### **PUT /products/:id** 🔒👑
Atualizar produto (apenas admin).

### **DELETE /products/:id** 🔒👑
Deletar produto (apenas admin).

---

## 🔒 LEGENDAS

- 🔒 = Requer autenticação
- 👑 = Requer permissão de Admin

---

## ⚠️ CÓDIGOS DE ERRO

```
200 - OK
201 - Created
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
500 - Internal Server Error
```

---

## 📝 NOTAS

1. Todos os timestamps estão em ISO 8601 (UTC)
2. Valores monetários em centavos (ex: 1500 = R$ 15,00)
3. UUIDs no formato: `550e8400-e29b-41d4-a716-446655440000`
4. Tokens JWT expiram em 7 dias (usuários) ou 12h (admins)

---

**Para mais detalhes, consulte o código fonte dos controllers em `backend/src/controllers/`**
