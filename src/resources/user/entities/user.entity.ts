import { AuditEntity } from 'src/commons/shared/entities/audit.entity';
import { ProfileEntity } from 'src/resources/profile/entities/profile.entity';

export class UserEntity extends AuditEntity {
  id: string;
  noms: string;
  prenoms: string;
  email: string;
  contact: string;
  is_active: boolean;
  is_first_login: boolean;
  mail_verified_at: Date;
  profile: ProfileEntity;
  password: string;
}
