# 🛹 Armazém Skate Shop - Backend API

Backend completo para e-commerce com integração de pagamentos.

---

## 🚀 TECNOLOGIAS

- **Node.js** + **Express** - Server
- **PostgreSQL** + **Prisma ORM** - Database
- **Mercado Pago** - PIX + Boleto (0,99%)
- **PagBank** - Cartão de Crédito (3,19%)
- **Winston** - Logs
- **JWT** - Autenticação

---

## 📦 INSTALAÇÃO

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Database (usar Supabase, Railway ou Render - grátis)
DATABASE_URL="postgresql://usuario:senha@host:5432/armazem_skate"

# JWT
JWT_SECRET="seu_secret_super_seguro_aqui"

# Mercado Pago
MP_ACCESS_TOKEN_SANDBOX="TEST-sua_token_sandbox"
MP_PUBLIC_KEY_SANDBOX="TEST-sua_public_key_sandbox"

# PagBank
PAGBANK_TOKEN_SANDBOX="seu_token_sandbox_pagbank"

# URLs
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:5000"
```

### 3. Configurar banco de dados

```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio
npx prisma studio
```

### 4. Iniciar servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

Servidor rodando em: **http://localhost:5000**

---

## 🔑 OBTER CREDENCIAIS DOS GATEWAYS

### **Mercado Pago (PIX + Boleto)**

1. Acesse: https://www.mercadopago.com.br/developers
2. Crie uma aplicação
3. Copie o **Access Token** e **Public Key**
4. Para testes, use as credenciais de **Teste**

**Documentação:** https://www.mercadopago.com.br/developers/pt/docs

### **PagBank (Cartão)**

1. Acesse: https://pagseguro.uol.com.br/
2. Vá em: **Integrações > Gerar Token**
3. Copie o **Token de Integração**
4. Para testes, use ambiente **Sandbox**

**Documentação:** https://dev.pagseguro.uol.com.br/reference/

---

## 📡 ENDPOINTS

### **Pagamentos**

```http
POST /api/payment/create
Content-Type: application/json

{
  "orderId": "uuid-do-pedido",
  "paymentMethod": "PIX | BOLETO | CREDIT_CARD",
  "cardData": { // Apenas para cartão
    "number": "4111111111111111",
    "holderName": "NOME NO CARTAO",
    "expMonth": "12",
    "expYear": "2025",
    "cvv": "123",
    "installments": 1
  }
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

---

### **Verificar Status**

```http
GET /api/payment/status/:orderId
```

---

### **Calcular Parcelas**

```http
GET /api/payment/installments?amount=500
```

**Response:**
```json
{
  "success": true,
  "installments": [
    {
      "quantity": 1,
      "installmentAmount": 500,
      "totalAmount": 500,
      "interestFree": true,
      "label": "À vista - R$ 500,00"
    },
    {
      "quantity": 2,
      "installmentAmount": 250,
      "totalAmount": 500,
      "interestFree": true,
      "label": "2x de R$ 250,00 sem juros"
    }
  ]
}
```

---

### **Obter Taxas**

```http
GET /api/payment/fees
GET /api/payment/fees?amount=100&paymentMethod=PIX
```

---

### **Webhooks** (Automáticos)

```http
POST /api/payment/webhook/mercadopago
POST /api/payment/webhook/pagbank
```

---

## 📊 LOGS

Os logs são salvos em:

- **Console** - Todos os logs em tempo real
- **logs/combined.log** - Todos os logs
- **logs/error.log** - Apenas erros
- **Banco de Dados** - Logs estruturados

### Consultar logs de pagamento:

```sql
SELECT * FROM payment_logs ORDER BY created_at DESC LIMIT 10;
```

### Consultar webhooks:

```sql
SELECT * FROM webhook_logs WHERE processed = false;
```

---

## 🧪 TESTAR PAGAMENTOS

### **PIX (Mercado Pago Sandbox)**

1. Use Access Token de **Teste**
2. Crie pagamento
3. QR Code será gerado
4. Use app Mercado Pago em modo teste
5. Status atualiza via webhook

### **Cartão (PagBank Sandbox)**

Números de teste:

```
Aprovado:  4111 1111 1111 1111
Negado:    4000 0000 0000 0002
CVV:       123
Validade:  12/2025
```

---

## 🔒 SEGURANÇA

- ✅ Dados de cartão **nunca salvos** no banco
- ✅ Comunicação via HTTPS (em produção)
- ✅ Webhooks assinados
- ✅ Logs de todas transações
- ✅ Validações em todas rotas

---

## 🐛 TROUBLESHOOTING

### Erro de conexão com banco

```bash
# Verificar conexão
npx prisma db push

# Resetar banco (CUIDADO: apaga tudo!)
npx prisma migrate reset
```

### Webhook não está chegando

1. Use **ngrok** para expor localhost:
```bash
ngrok http 5000
```

2. Configure URL do webhook com URL do ngrok:
```
https://abc123.ngrok.io/api/payment/webhook/mercadopago
```

### Pagamento não aprova

1. Verifique logs em: `logs/combined.log`
2. Consulte `payment_logs` no banco
3. Confirme credenciais corretas no `.env`

---

## 📚 ESTRUTURA

```
backend/
├── src/
│   ├── config/
│   │   └── database.js        # Prisma config
│   ├── controllers/
│   │   └── payment.controller.js
│   ├── routes/
│   │   └── payment.routes.js
│   ├── services/
│   │   └── payment/
│   │       ├── mercadopago.service.js
│   │       ├── pagbank.service.js
│   │       └── payment.factory.js
│   ├── utils/
│   │   └── logger.js
│   └── server.js
├── prisma/
│   └── schema.prisma
├── logs/
├── .env
└── package.json
```

---

## 🚀 DEPLOY

### **Render (Backend)**

1. Crie conta em: https://render.com
2. New > Web Service
3. Conecte repositório
4. Build Command: `npm install && npx prisma generate`
5. Start Command: `npm start`
6. Adicione Environment Variables

### **Supabase (Database)**

1. Crie conta em: https://supabase.com
2. New Project
3. Copie Connection String
4. Cole em `DATABASE_URL`

**Custo: R$ 0 (plano gratuito)**

---

## 📞 SUPORTE

- **Mercado Pago:** https://www.mercadopago.com.br/ajuda
- **PagBank:** https://dev.pagseguro.uol.com.br/

---

## ✅ CHECKLIST DE PRODUÇÃO

Antes de ir para produção:

- [ ] Mudar credenciais para **produção**
- [ ] `NODE_ENV=production`
- [ ] `MP_MODE=production`
- [ ] `PAGBANK_SANDBOX=false`
- [ ] Configurar domínio com HTTPS
- [ ] Atualizar URLs de webhook
- [ ] Testar todos fluxos de pagamento
- [ ] Configurar backup do banco
- [ ] Configurar monitoramento (Sentry, etc)

---

**🎉 Backend pronto para receber pagamentos! 💰**
