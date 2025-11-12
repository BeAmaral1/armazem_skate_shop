import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔐 Criando usuário admin...\n');

    // Hash da senha
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Deletar se existir
    await prisma.user.deleteMany({
      where: { email: 'admin@armazemskate.com' }
    });

    // Criar admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@armazemskate.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'ADMIN',
        active: true
      }
    });

    console.log('✅ Admin criado com sucesso!\n');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Senha: admin123');
    console.log('👤 Role:', admin.role);

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
