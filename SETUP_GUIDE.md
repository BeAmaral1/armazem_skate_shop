# 🛹 GUIA COMPLETO DE SETUP - ARMAZÉM SKATE SHOP

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Setup do Backend](#setup-do-backend)
4. [Setup do Frontend](#setup-do-frontend)
5. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
6. [Configuração de Pagamentos](#configuração-de-pagamentos)
7. [Criar Primeiro Admin](#criar-primeiro-admin)
8. [Testar Aplicação](#testar-aplicação)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 VISÃO GERAL

### **Stack Completa:**

**Frontend:**
- React 18 + Vite
- React Router v6
- Tailwind CSS
- Context API

**Backend:**
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- Winston Logger

**Pagamentos:**
- Mercado Pago (PIX + Boleto)
- PagBank (Cartão de Crédito)

**Funcionalidades:**
- ✅ E-commerce completo
- ✅ Sistema de autenticação
- ✅ Painel administrativo
- ✅ Gerenciamento de produtos
- ✅ Gerenciamento de pedidos
- ✅ Pagamentos integrados
- ✅ Sistema de logs completo
- ✅ Webhooks automáticos

---

## 📌 PRÉ-REQUISITOS

Instale as seguintes ferramentas:

### **1. Node.js (v18 ou superior)**
```bash
# Windows: Baixe em https://nodejs.org/

# Verificar instalação
node --version
npm --version
```

### **2. PostgreSQL (v14 ou superior)**

**Opções:**

**A) Local:**
```bash
# Windows: Baixe em https://www.postgresql.org/download/windows/
```

**B) Cloud (RECOMENDADO - GRÁTIS):**
- **Supabase**: https://supabase.com (500 MB grátis)
- **Railway**: https://railway.app (500 MB grátis)
- **Render**: https://render.com (256 MB grátis)

### **3. Git**
```bash
# Verificar instalação
git --version
```

---

## 🚀 SETUP DO BACKEND

### **Passo 1: Navegar até a pasta do backend**

```bash
cd backend
```

### **Passo 2: Instalar dependências**

```bash
npm install
```

### **Passo 3: Configurar variáveis de ambiente**

```bash
# Copiar arquivo de exemplo
cp .env.example .env
```

### **Passo 4: Editar o arquivo `.env`**

Abra o arquivo `.env` e configure:

```env
# ==================== DATABASE ====================
# Se usar Supabase, cole a Connection String fornecida por eles
DATABASE_URL="postgresql://usuario:senha@host:5432/armazem_skate"

# ==================== JWT ====================
# Gere uma chave segura (pode ser qualquer string longa)
JWT_SECRET="sua_chave_super_secreta_minimo_32_caracteres"
JWT_EXPIRES_IN=7d

# ==================== MERCADO PAGO ====================
# Pegar em: https://www.mercadopago.com.br/developers
MP_ACCESS_TOKEN_SANDBOX="TEST-sua_token_aqui"
MP_PUBLIC_KEY_SANDBOX="TEST-sua_public_key_aqui"
MP_MODE=development

# ==================== PAGBANK ====================
# Pegar em: https://pagseguro.uol.com.br/
PAGBANK_TOKEN_SANDBOX="seu_token_sandbox_aqui"
PAGBANK_EMAIL_SANDBOX="seu_email@example.com"
PAGBANK_SANDBOX=true

# ==================== URLs ====================
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:5173
```

### **Passo 5: Configurar banco de dados**

```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas no banco
npx prisma migrate dev --name init

# (Opcional) Popular banco com dados de teste
npm run prisma:seed
```

### **Passo 6: Iniciar servidor**

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

✅ **Backend rodando em: http://localhost:5000**

### **Verificar se está funcionando:**

```bash
# No navegador ou via curl
http://localhost:5000/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development",
  "database": "connected"
}
```

---

## 💻 SETUP DO FRONTEND

### **Passo 1: Abrir novo terminal na raiz do projeto**

```bash
# Voltar para a raiz
cd ..
```

### **Passo 2: Instalar dependências**

```bash
npm install
```

### **Passo 3: Configurar variável de ambiente**

Crie o arquivo `.env` na raiz do projeto frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

### **Passo 4: Iniciar aplicação**

```bash
npm run dev
```

✅ **Frontend rodando em: http://localhost:5173**

---

## 🗄️ CONFIGURAÇÃO DO BANCO DE DADOS

### **Opção A: PostgreSQL Local**

1. Instale PostgreSQL
2. Crie o banco:
```sql
CREATE DATABASE armazem_skate;
```

3. Configure no `.env`:
```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/armazem_skate"
```

### **Opção B: Supabase (RECOMENDADO)**

1. Acesse: https://supabase.com
2. Crie conta gratuita
3. New Project
4. Copie a **Connection String** em: Settings > Database
5. Cole no `.env`:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

### **Visualizar Banco de Dados:**

```bash
# Abrir Prisma Studio
npx prisma studio
```

Abre em: http://localhost:5555

---

## 💳 CONFIGURAÇÃO DE PAGAMENTOS

### **1. Mercado Pago (PIX + Boleto)**

**Obter Credenciais:**

1. Acesse: https://www.mercadopago.com.br/developers
2. Crie uma aplicação
3. Vá em: **Credenciais**
4. Copie:
   - **Access Token de Teste**
   - **Public Key de Teste**

5. Cole no `.env`:
```env
MP_ACCESS_TOKEN_SANDBOX="TEST-123456..."
MP_PUBLIC_KEY_SANDBOX="TEST-789abc..."
```

**Testar no Sandbox:**
- Use o app Mercado Pago em modo teste
- Documentação: https://www.mercadopago.com.br/developers/pt/docs

### **2. PagBank (Cartão de Crédito)**

**Obter Credenciais:**

1. Acesse: https://pagseguro.uol.com.br/
2. Crie conta de vendedor
3. Vá em: **Integrações > Gerar Token**
4. Copie o Token de Integração

5. Cole no `.env`:
```env
PAGBANK_TOKEN_SANDBOX="seu_token_aqui"
PAGBANK_EMAIL_SANDBOX="seu_email@example.com"
```

**Testar no Sandbox:**
- Cartões de teste:
  - Aprovado: `4111 1111 1111 1111`
  - Negado: `4000 0000 0000 0002`
- CVV: `123`
- Validade: `12/2025`

---

## 👨‍💼 CRIAR PRIMEIRO ADMIN

### **Método 1: Via Prisma Studio (RECOMENDADO)**

1. Abra Prisma Studio:
```bash
npx prisma studio
```

2. Vá em `User` > Add record

3. Preencha:
```
email: admin@armazemskate.com
password: (veja abaixo como gerar hash)
name: Administrador
role: SUPER_ADMIN
active: true
emailVerified: true
```

**Gerar hash da senha:**

Crie um arquivo temporário `hash-password.js` na pasta `backend/`:

```javascript
import bcrypt from 'bcrypt';

const password = 'senha123'; // Escolha uma senha forte
const hash = await bcrypt.hash(password, 10);
console.log('Hash:', hash);
```

Execute:
```bash
node hash-password.js
```

Copie o hash gerado e cole no campo `password`.

### **Método 2: SQL Direto**

```sql
INSERT INTO users (id, email, password, name, role, active, "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@armazemskate.com',
  '$2b$10$HASH_AQUI', -- Gere com bcrypt
  'Administrador',
  'SUPER_ADMIN',
  true,
  true,
  NOW(),
  NOW()
);
```

---

## 🧪 TESTAR APLICAÇÃO

### **1. Testar Backend**

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Login Admin:**
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@armazemskate.com",
    "password": "senha123"
  }'
```

Deve retornar um `token`.

**Testar Dashboard (com token):**
```bash
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### **2. Testar Frontend**

1. Abra: http://localhost:5173
2. Navegue pelo site
3. Crie uma conta de teste
4. Adicione produtos ao carrinho
5. Teste o checkout

### **3. Acessar Painel Admin**

1. Vá para: http://localhost:5173/admin/login
2. Faça login com:
   - Email: `admin@armazemskate.com`
   - Senha: `senha123`

3. Explore:
   - Dashboard
   - Produtos
   - Pedidos
   - Usuários
   - Logs

---

## 🛠️ TROUBLESHOOTING

### **Erro: "Can't connect to database"**

**Solução:**
1. Verifique se PostgreSQL está rodando
2. Confira `DATABASE_URL` no `.env`
3. Teste conexão:
```bash
npx prisma db push
```

### **Erro: "Prisma Client not generated"**

**Solução:**
```bash
npx prisma generate
```

### **Erro: "Port 5000 already in use"**

**Solução:**
1. Mate o processo na porta 5000
2. Ou mude no `.env`:
```env
PORT=5001
```

### **Erro: "JWT_SECRET is not defined"**

**Solução:**
Certifique-se que o `.env` está configurado e reinicie o servidor.

### **Erro: "Payment gateway error"**

**Solução:**
1. Verifique credenciais no `.env`
2. Confirme que está usando credenciais de **Teste/Sandbox**
3. Veja logs em: `backend/logs/combined.log`

### **Webhook não chega**

**Solução:**
1. Para desenvolvimento local, use **ngrok**:
```bash
ngrok http 5000
```

2. Configure webhook com URL do ngrok:
```
https://abc123.ngrok.io/api/payment/webhook/mercadopago
```

---

## 📊 PRÓXIMOS PASSOS

Agora que está tudo configurado:

1. ✅ **Popular produtos**
   - Use Prisma Studio ou seed script

2. ✅ **Testar fluxo completo**
   - Cadastro > Compra > Pagamento > Pedido

3. ✅ **Personalizar**
   - Logos, cores, textos
   - Adicione suas próprias categorias/produtos

4. ✅ **Deploy**
   - Backend: Render, Railway
   - Frontend: Vercel, Netlify
   - Database: Supabase

---

## 🚀 COMANDOS ÚTEIS

```bash
# Backend
cd backend
npm run dev              # Iniciar em desenvolvimento
npm start                # Iniciar em produção
npx prisma studio        # Visualizar banco
npx prisma migrate dev   # Criar migration
npm run prisma:seed      # Popular banco

# Frontend
npm run dev              # Iniciar desenvolvimento
npm run build            # Build para produção
npm run preview          # Visualizar build

# Logs
tail -f backend/logs/combined.log    # Ver logs em tempo real
```

---

## 📞 SUPORTE

**Documentações Oficiais:**
- Prisma: https://www.prisma.io/docs
- Mercado Pago: https://www.mercadopago.com.br/developers
- PagBank: https://dev.pagseguro.uol.com.br/

---

**🎉 PRONTO! Seu e-commerce está configurado e funcionando!**

**Qualquer dúvida, consulte os logs em `backend/logs/` ou use Prisma Studio para inspecionar o banco de dados.**
