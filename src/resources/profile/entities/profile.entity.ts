import { AuditEntity } from 'src/commons/shared/entities/audit.entity';

export class ProfileEntity extends AuditEntity {
  id: number;
  libelle: string;
  description: string;
}
