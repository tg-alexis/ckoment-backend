import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer les profils par défaut
  console.log('📝 Creating default profiles...');

  const profiles = [
    { libelle: 'CLIENT', description: 'Utilisateur client standard' },
    { libelle: 'ADMIN', description: 'Administrateur du système' },
    { libelle: 'SUPER_ADMIN', description: 'Super administrateur' },
  ];

  for (const profileData of profiles) {
    await prisma.profiles.upsert({
      where: { libelle: profileData.libelle },
      update: {},
      create: profileData,
    });
    console.log(`✅ Profile ${profileData.libelle} created/updated`);
  }

  // Créer les statuts par défaut
  console.log('📊 Creating default statuses...');

  const statuses = [
    { name: 'Brouillon', description: 'Contenu en cours de rédaction' },
    { name: 'En attente', description: 'Contenu en attente de validation' },
    { name: 'Publié', description: 'Contenu publié et visible' },
    { name: 'Archivé', description: 'Contenu archivé' },
    { name: 'Rejeté', description: 'Contenu rejeté' },
  ];

  for (const statusData of statuses) {
    await prisma.status.upsert({
      where: { name: statusData.name },
      update: {},
      create: statusData,
    });
    console.log(`✅ Status ${statusData.name} created/updated`);
  }

  // Créer les catégories par défaut
  console.log('📂 Creating default categories...');

  const categories = [
    {
      name: 'Technologie',
      slug: 'technologie',
      description:
        'Articles sur les nouvelles technologies, développement, IA, etc.',
    },
    {
      name: 'Actualité',
      slug: 'actualite',
      description: 'Actualités générales et informations importantes',
    },
    {
      name: 'Tutoriels',
      slug: 'tutoriels',
      description: 'Guides et tutoriels pratiques',
    },
    {
      name: 'Opinion',
      slug: 'opinion',
      description: "Articles d'opinion et analyses",
    },
    {
      name: 'Lifestyle',
      slug: 'lifestyle',
      description: 'Articles sur le style de vie, santé, bien-être',
    },
  ];

  for (const categoryData of categories) {
    await prisma.categories.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    });
    console.log(`✅ Category ${categoryData.name} created/updated`);
  }

  // Créer un utilisateur super admin par défaut
  console.log('👤 Creating default super admin...');

  const superAdminProfile = await prisma.profiles.findUnique({
    where: { libelle: 'SUPER_ADMIN' },
  });

  if (superAdminProfile) {
    const existingAdmin = await prisma.users.findUnique({
      where: { email: 'admin@ckoment.com' },
    });

    if (!existingAdmin) {
      await prisma.users.create({
        data: {
          noms: 'Admin',
          prenoms: 'Super',
          email: 'admin@ckoment.com',
          password: await argon.hash('AdminPassword123!'),
          profile_id: superAdminProfile.id,
          is_active: true,
          mail_verified_at: new Date(),
          contact: '+33123456789',
        },
      });
      console.log(
        '✅ Super admin created (email: admin@ckoment.com, password: AdminPassword123!)',
      );
    } else {
      console.log('✅ Super admin already exists');
    }
  }

  // Créer un utilisateur client par défaut
  console.log('👥 Creating default client user...');

  const clientProfile = await prisma.profiles.findUnique({
    where: { libelle: 'CLIENT' },
  });

  if (clientProfile) {
    const existingClient = await prisma.users.findUnique({
      where: { email: 'client@ckoment.com' },
    });

    if (!existingClient) {
      await prisma.users.create({
        data: {
          noms: 'Test',
          prenoms: 'Client',
          email: 'client@ckoment.com',
          password: await argon.hash('ClientPassword123!'),
          profile_id: clientProfile.id,
          is_active: true,
          mail_verified_at: new Date(),
          contact: '+33987654321',
        },
      });
      console.log(
        '✅ Client user created (email: client@ckoment.com, password: ClientPassword123!)',
      );
    } else {
      console.log('✅ Client user already exists');
    }
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
