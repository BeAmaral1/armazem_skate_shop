# Configurar variável de ambiente do frontend
"VITE_API_URL=http://localhost:5000/api" | Out-File -FilePath ".env.local" -Encoding UTF8 -NoNewline
Write-Host "Frontend .env.local configurado!" -ForegroundColor Green
