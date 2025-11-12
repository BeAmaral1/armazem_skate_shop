import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true
      }
    });

    console.log('\n📋 Usuários no banco de dados:\n');
    users.forEach(u => {
      console.log(`📧 ${u.email}`);
      console.log(`   Nome: ${u.name}`);
      console.log(`   Role: ${u.role}`);
      console.log(`   Ativo: ${u.active}`);
      console.log('');
    });
    console.log(`Total: ${users.length} usuário(s)\n`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
