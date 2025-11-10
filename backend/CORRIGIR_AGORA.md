# 🚨 AÇÕES OBRIGATÓRIAS - EXECUTE AGORA!

## ⚡ COMANDOS PARA RODAR (EM ORDEM)

### **1. Entre na pasta backend**
```bash
cd c:\xampp\htdocs\armazem_skate_shop2.0\backend
```

### **2. Instale as dependências (se ainda não instalou)**
```bash
npm install
```

### **3. Configure o arquivo .env**
```bash
# Copie o .env.example
copy .env.example .env

# Edite o .env e configure:
# - DATABASE_URL (PostgreSQL)
# - JWT_SECRET
# - MP_ACCESS_TOKEN (Mercado Pago)
# - PAGBANK_TOKEN (PagBank)
```

### **4. RODAR MIGRAÇÃO DO BANCO (OBRIGATÓRIO)** 🔴
```bash
npx prisma migrate dev --name add-guest-checkout-support
```

**O que isso faz:**
- Cria as tabelas no banco
- Adiciona campos novos (customerName, customerEmail, etc)
- Torna userId opcional
- Gera o Prisma Client

### **5. Verificar se migração funcionou**
```bash
npx prisma studio
```
Isso abre uma interface web para ver o banco. Verifique se as tabelas foram criadas.

### **6. Iniciar o servidor**
```bash
npm run dev
```

**Esperado:**
```
✓ Database connected
✓ Server running on port 5000
```

---

## 🧪 TESTAR SE FUNCIONOU

### **Teste 1: Health Check**
```bash
curl http://localhost:5000/health
```
**Esperado:** `{"status":"ok","database":"connected"}`

### **Teste 2: Criar Pedido (Guest Checkout)**
```bash
curl -X POST http://localhost:5000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "name": "João Silva",
      "email": "joao@teste.com",
      "phone": "11999999999"
    },
    "items": [
      {
        "productId": "produto-teste",
        "name": "Produto Teste",
        "price": 100,
        "quantity": 1,
        "image": "https://via.placeholder.com/150",
        "sku": "SKU123"
      }
    ],
    "shippingAddress": {
      "zipCode": "01310100",
      "street": "Av Paulista",
      "number": "1000",
      "neighborhood": "Bela Vista",
      "city": "São Paulo",
      "state": "SP"
    },
    "subtotal": 100,
    "shipping": 25,
    "discount": 0,
    "total": 125
  }'
```

**Esperado:** 
```json
{
  "success": true,
  "message": "Pedido criado com sucesso",
  "order": {
    "id": "...",
    "orderNumber": "ORD-20240115-0001",
    "total": 125,
    "customerName": "João Silva",
    "customerEmail": "joao@teste.com"
  }
}
```

---

## ❌ SE DER ERRO

### **Erro: "Cannot find module '@prisma/client'"**
```bash
npx prisma generate
npm run dev
```

### **Erro: "Database connection failed"**
1. Verifique se PostgreSQL está rodando
2. Verifique DATABASE_URL no .env
3. Teste a conexão:
```bash
npx prisma db push
```

### **Erro: "Migration failed"**
```bash
# Resetar banco (APENAS EM DEV - APAGA TUDO!)
npx prisma migrate reset
npx prisma migrate dev --name initial
```

### **Erro: "Port 5000 already in use"**
```bash
# Windows: Matar processo na porta 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Ou mudar porta no .env
PORT=3000
```

---

## 📊 CHECKLIST RÁPIDO

Execute e marque:

- [ ] `cd backend`
- [ ] `npm install`
- [ ] `.env` configurado
- [ ] `npx prisma migrate dev --name add-guest-checkout-support`
- [ ] `npm run dev` funcionando
- [ ] `http://localhost:5000/health` retorna OK
- [ ] Teste de criar pedido funciona

---

## 🎯 PRÓXIMO PASSO

Após tudo funcionando:

1. **Integrar frontend** - Ver `INTEGRACAO_CHECKOUT.md`
2. **Configurar credenciais reais** - Mercado Pago e PagBank
3. **Testar pagamentos** - PIX, Boleto, Cartão
4. **Deploy** - Render, Railway ou Heroku

---

## 📚 DOCUMENTAÇÃO

- `CORRECOES_APLICADAS.md` - O que foi corrigido
- `MIGRATION_GUIDE.md` - Detalhes da migração
- `SEGURANCA_CHECKOUT.md` - Sistema de segurança
- `PAGAMENTOS_COMPLETO.md` - Sistema de pagamentos
- `API_REFERENCE.md` - Todas as APIs

---

## 🆘 PRECISA DE AJUDA?

Se algo não funcionar:
1. Leia os arquivos de documentação
2. Verifique os logs do servidor
3. Use `npx prisma studio` para ver o banco
4. Verifique as variáveis do .env

---

**COMECE AGORA PELO PASSO 1! ⬆️**
