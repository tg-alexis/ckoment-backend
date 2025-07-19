import { Injectable, Logger } from '@nestjs/common';
import { CustomRequest } from '../interfaces/custom_request';
import { RequestContextServiceProvider } from '../providers/request-context-service.provider';
import { RequestContextService } from './request-context.service';

@Injectable()
export class AppContextService {
  private static instance: AppContextService;
  private isBootstrapping = true;

  constructor() {
    AppContextService.instance = this;
  }

  /**
   * Marque la fin de la phase de bootstrap
   */
  setBootstrapComplete() {
    this.isBootstrapping = false;
    Logger.log('Application bootstrap completed', 'AppContextService');
  }

  /**
   * Vérifie si l'application est encore en phase de bootstrap
   */
  isInBootstrap(): boolean {
    return this.isBootstrapping;
  }

  /**
   * Obtient le service de contexte de requête de manière sécurisée
   */
  getRequestContextService(): RequestContextService | null {
    try {
      return RequestContextServiceProvider.getService();
    } catch (_error) {
      return null;
    }
  }

  /**
   * Obtient le contexte de requête actuel de manière sécurisée
   */
  getCurrentRequest(): CustomRequest | null {
    const service = this.getRequestContextService();
    if (!service) return null;

    try {
      return service.getContext();
    } catch (_error) {
      return null;
    }
  }

  /**
   * Vérifie si l'audit étendu est activé
   */
  getExtendedAudit(): boolean {
    const request = this.getCurrentRequest();
    return request?.extended_audit || false;
  }

  /**
   * Obtient l'instance globale
   */
  static getInstance(): AppContextService | null {
    return AppContextService.instance || null;
  }
}
