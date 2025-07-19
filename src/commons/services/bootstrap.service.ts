import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as argon from 'argon2';
import { Profile } from '../enums/profile.enum';
import { PrismaService } from './prisma.service';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(private readonly prismaService: PrismaService) {}

  async onApplicationBootstrap() {
    await this.createDefaultProfiles();
    await this.createSuperAdmin();
  }

  async createDefaultProfiles() {
    Logger.log('Creating default profiles...');

    // Créer les profils par défaut s'ils n'existent pas
    const profiles = [
      { libelle: Profile.CLIENT, description: 'Utilisateur client' },
      { libelle: Profile.ADMIN, description: 'Administrateur' },
      { libelle: Profile.SUPER_ADMIN, description: 'Super administrateur' },
    ];

    for (const profileData of profiles) {
      const existingProfile = await this.prismaService.profiles.findUnique({
        where: { libelle: profileData.libelle },
      });

      if (!existingProfile) {
        await this.prismaService.profiles.create({
          data: profileData,
        });
        Logger.log(`Profile ${profileData.libelle} created`);
      }
    }
  }

  async createSuperAdmin() {
    Logger.log('Creating super admin...');

    // Chercher les utilisateurs avec profil admin ou super admin
    const admins = await this.prismaService.users.findMany({
      where: {
        profile: {
          libelle: {
            in: [Profile.SUPER_ADMIN, Profile.ADMIN],
          },
        },
      },
    });

    if (admins.length === 0) {
      // Récupérer l'ID du profil SUPER_ADMIN
      const superAdminProfile = await this.prismaService.profiles.findUnique({
        where: { libelle: Profile.SUPER_ADMIN },
      });

      if (superAdminProfile) {
        await this.prismaService.users.create({
          data: {
            noms: 'DA',
            prenoms: 'Jack',
            email: 'jack.da@gmail.com',
            password: await argon.hash('password'),
            profile_id: superAdminProfile.id,
            is_active: true,
            mail_verified_at: new Date(),
          },
        });

        Logger.log('Super admin created');
      } else {
        Logger.error('Super admin profile not found');
      }
    } else {
      Logger.log('Admin users already exist');
    }
  }
}
