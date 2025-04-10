import { Injectable, ExecutionContext, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug('Tentative d\'authentification...');
    
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`Headers reçus: ${JSON.stringify(request.headers)}`);

    try {
      const result = await super.canActivate(context);
      this.logger.debug(`Résultat de l'authentification: ${result}`);
      return result as boolean;
    } catch (err) {
      this.logger.error(`Erreur d'authentification: ${err.message}`);
      throw new UnauthorizedException(err.message);
    }
  }

  handleRequest(err: any, user: any, info: any) {
    this.logger.debug(`HandleRequest - User: ${JSON.stringify(user)}, Info: ${JSON.stringify(info)}`);
    
    if (err || !user) {
      this.logger.error(`HandleRequest - Erreur: ${err?.message || 'Utilisateur non trouvé'}`);
      throw err || new UnauthorizedException();
    }
    return user;
  }
} 