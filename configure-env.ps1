# Script para configurar o .env do backend

$envContent = @"
# ==================== SERVER ====================
NODE_ENV=development
PORT=5000

# ==================== DATABASE ====================
DATABASE_URL="postgresql://postgres.kljnenenurobrfromwts:Em280922!!@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# ==================== JWT ====================
JWT_SECRET=armazem_skate_super_secret_key_2024_producao_segura_minimo_32_chars
JWT_EXPIRES_IN=7d

# ==================== MERCADO PAGO (PIX + Boleto) ====================
MP_ACCESS_TOKEN_SANDBOX=TEST-sua_token_sandbox_aqui
MP_PUBLIC_KEY_SANDBOX=TEST-sua_public_key_sandbox_aqui
MP_ACCESS_TOKEN=APP-sua_token_producao_aqui
MP_PUBLIC_KEY=APP-sua_public_key_producao_aqui
MP_MODE=development

# ==================== PAGBANK (Cartão) ====================
PAGBANK_TOKEN_SANDBOX=seu_token_sandbox_pagbank_aqui
PAGBANK_EMAIL_SANDBOX=seu_email_sandbox@example.com
PAGBANK_TOKEN=seu_token_producao_pagbank_aqui
PAGBANK_EMAIL=seu_email@seusite.com
PAGBANK_SANDBOX=true

# ==================== URLs ====================
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

# ==================== CLOUDINARY (Upload de Imagens) ====================
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret

# ==================== EMAIL (Nodemailer) ====================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
EMAIL_FROM="Armazém Skate Shop <noreply@armazemskate.com>"

# ==================== CORS ====================
CORS_ORIGIN=http://localhost:5173

# ==================== LOGS ====================
LOG_LEVEL=info
LOG_FILE=logs/app.log
"@

# Criar o arquivo .env no backend
$envContent | Out-File -FilePath "backend\.env" -Encoding UTF8 -NoNewline

Write-Host "✅ Arquivo .env configurado com sucesso!" -ForegroundColor Green
Write-Host "📁 Localização: backend\.env" -ForegroundColor Cyan
