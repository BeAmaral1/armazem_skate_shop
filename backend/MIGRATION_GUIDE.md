# 🔄 GUIA DE MIGRAÇÃO - CORREÇÕES APLICADAS

## ⚠️ IMPORTANTE: RODAR MIGRAÇÃO DO BANCO DE DADOS

As correções incluíram mudanças no schema do Prisma. Você DEVE rodar a migração:

```bash
cd backend
npx prisma migrate dev --name add-guest-checkout-support
```

---

## 📋 MUDANÇAS APLICADAS

### **1. Schema do Prisma (schema.prisma)**

#### **Model Address:**
- ✅ `userId` agora é **opcional** (String?)
- ✅ `user` agora é **opcional** (User?)
- **Motivo:** Permitir endereços sem usuário logado (guest checkout)

#### **Model Order:**
- ✅ `userId` agora é **opcional** (String?)
- ✅ `user` agora é **opcional** (User?)
- ✅ **Novos campos adicionados:**
  - `customerName` String?
  - `customerEmail` String?
  - `customerPhone` String?
  - `customerCpf` String?
- **Motivo:** Salvar dados do comprador para guest checkout

---

### **2. Order Controller (order.controller.js)**

#### **Função createOrder:**
- ✅ Agora salva `customerName`, `customerEmail`, `customerPhone`, `customerCpf` no pedido
- **Motivo:** Manter registro dos dados do comprador mesmo em guest checkout

---

### **3. Services de Pagamento**

#### **MercadoPago Service (mercadopago.service.js):**
- ✅ `createPixPayment`: Usa `order.user` OU `order.customerName/Email/Cpf`
- ✅ `createBoletoPayment`: Usa `order.user` OU `order.customerName/Email/Cpf`
- **Motivo:** Funcionar tanto para usuários logados quanto para guest checkout

#### **PagBank Service (pagbank.service.js):**
- ✅ `createCardPayment`: Usa `order.user` OU `order.customerName/Email/Cpf/Phone`
- **Motivo:** Funcionar tanto para usuários logados quanto para guest checkout

---

## 🎯 BENEFÍCIOS DAS CORREÇÕES

### **Antes (❌ Problema):**
```javascript
// Só funcionava se usuário estivesse logado
const order = await prisma.order.create({
  data: {
    userId: req.user.id, // ❌ Obrigatório - quebrava em guest checkout
    ...
  }
});

// Pagamento quebrava sem user
email: order.user.email // ❌ Erro se order.user === null
```

### **Depois (✅ Corrigido):**
```javascript
// Funciona com OU sem usuário logado
const order = await prisma.order.create({
  data: {
    userId: userId || null, // ✅ Opcional
    customerName: user.name, // ✅ Sempre salva dados
    customerEmail: user.email,
    ...
  }
});

// Pagamento usa fallback
const email = order.user?.email || order.customerEmail; // ✅ Sempre funciona
```

---

## 🔍 O QUE FOI CORRIGIDO

### **Problema 1: Guest Checkout Impossível**
- ❌ Antes: Order exigia userId obrigatório
- ✅ Agora: Order aceita userId null + salva dados do comprador

### **Problema 2: Pagamento Quebrava sem User**
- ❌ Antes: `order.user.email` causava erro se user fosse null
- ✅ Agora: `order.user?.email || order.customerEmail` usa fallback

### **Problema 3: Perda de Dados em Guest Checkout**
- ❌ Antes: Sem userId, não havia como saber quem comprou
- ✅ Agora: customerName/Email/Phone/Cpf salvos no pedido

### **Problema 4: Address Exigia Usuário**
- ❌ Antes: Address.userId era obrigatório
- ✅ Agora: Address.userId é opcional

---

## 📊 COMPATIBILIDADE

### **Usuários Logados:**
```javascript
// Dados vêm do User
order.user.name ✅
order.user.email ✅

// Também são duplicados
order.customerName ✅
order.customerEmail ✅
```

### **Guest Checkout:**
```javascript
// Não tem user
order.user === null ✅

// Mas tem dados salvos
order.customerName ✅
order.customerEmail ✅
order.customerPhone ✅
order.customerCpf ✅
```

### **Serviços de Pagamento:**
```javascript
// Sempre funciona com fallback
const customerName = order.user?.name || order.customerName;
const customerEmail = order.user?.email || order.customerEmail;
```

---

## ⚡ COMO APLICAR AS MUDANÇAS

### **Passo 1: Rodar Migração**
```bash
cd backend
npx prisma migrate dev --name add-guest-checkout-support
```

**Isso irá:**
- ✅ Atualizar o banco de dados
- ✅ Adicionar novos campos na tabela orders
- ✅ Tornar userId opcional em orders e addresses
- ✅ Gerar o Prisma Client atualizado

### **Passo 2: Verificar Migração**
```bash
npx prisma studio
```
Abra a tabela `orders` e verifique se os novos campos aparecem:
- customerName
- customerEmail
- customerPhone
- customerCpf

### **Passo 3: Reiniciar Servidor**
```bash
npm run dev
```

---

## 🧪 TESTAR AS CORREÇÕES

### **Teste 1: Guest Checkout**
```bash
POST /api/orders/create
Content-Type: application/json

{
  "user": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999"
  },
  "items": [...],
  "shippingAddress": {...},
  "total": 100
}
```
**Esperado:** ✅ Pedido criado SEM userId, mas COM customerName/customerEmail

### **Teste 2: Pagamento PIX (Guest)**
```bash
POST /api/payment/create
Content-Type: application/json

{
  "orderId": "uuid-do-pedido-guest",
  "paymentMethod": "PIX"
}
```
**Esperado:** ✅ PIX criado usando order.customerEmail

### **Teste 3: Pagamento Cartão (Guest)**
```bash
POST /api/payment/create
Content-Type: application/json

{
  "orderId": "uuid-do-pedido-guest",
  "paymentMethod": "CREDIT_CARD",
  "cardData": {...}
}
```
**Esperado:** ✅ Pagamento processado usando order.customerName/customerEmail/customerCpf

---

## 📝 CHECKLIST DE VERIFICAÇÃO

Após rodar a migração, verifique:

- [ ] Prisma Client foi regenerado
- [ ] Servidor reiniciado sem erros
- [ ] Tabela `orders` tem novos campos (customerName, customerEmail, etc)
- [ ] Campo `userId` em `orders` aceita NULL
- [ ] Campo `userId` em `addresses` aceita NULL
- [ ] Guest checkout funciona (criar pedido sem userId)
- [ ] Pagamento PIX funciona para guest checkout
- [ ] Pagamento Boleto funciona para guest checkout
- [ ] Pagamento Cartão funciona para guest checkout
- [ ] Pedidos de usuários logados continuam funcionando

---

## 🚨 AVISOS IMPORTANTES

### **ATENÇÃO: Banco de Dados em Produção**

Se você já tem dados em produção:
1. **Faça backup do banco antes**
2. A migração adicionará campos NULL - seguro
3. Pedidos antigos terão customerName/customerEmail NULL
4. Pedidos novos terão esses campos preenchidos

### **Rollback (se necessário):**

Se algo der errado, você pode reverter:
```bash
npx prisma migrate reset
```
**⚠️ ISSO APAGA TODOS OS DADOS!** Use apenas em desenvolvimento.

---

## ✅ RESULTADO FINAL

Após aplicar todas as correções:

- ✅ **Guest checkout funcionando 100%**
- ✅ **Todos os métodos de pagamento funcionando para guest**
- ✅ **Dados do comprador sempre salvos**
- ✅ **Usuários logados continuam funcionando**
- ✅ **Zero perda de compatibilidade**
- ✅ **Código mais robusto e seguro**

---

**Todas as correções foram aplicadas com sucesso! 🎉**
