import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@armazemskate.com' }
    });

    if (admin) {
      console.log('✅ Admin encontrado no banco:');
      console.log('📧 Email:', admin.email);
      console.log('👤 Nome:', admin.name);
      console.log('🔑 Role:', admin.role);
      console.log('✅ Ativo:', admin.active);
      console.log('🆔 ID:', admin.id);
    } else {
      console.log('❌ Admin NÃO encontrado no banco!');
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
