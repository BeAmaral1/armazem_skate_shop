import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Verificar se já existe
    const existing = await prisma.user.findUnique({
      where: { email: 'teste@armazemskate.com' }
    });

    if (existing) {
      console.log('⚠️  Usuário teste já existe!');
      console.log('📧 Email: teste@armazemskate.com');
      console.log('🔑 Senha: teste123');
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash('teste123', 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: 'teste@armazemskate.com',
        password: hashedPassword,
        name: 'Usuário Teste',
        role: 'CUSTOMER',
        active: true
      }
    });

    console.log('✅ Usuário de teste criado com sucesso!');
    console.log('📧 Email: teste@armazemskate.com');
    console.log('🔑 Senha: teste123');
    console.log('👤 Nome:', user.name);
    console.log('🎭 Role:', user.role);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
