import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const secret = configService.get('JWT_SECRET') || 'your-secret-key';
    super({
      jwtFromRequest: (req) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          this.logger.debug('Aucun header d\'autorisation trouvé');
          return null;
        }
        
        const token = authHeader.replace(/^Bearer\s+/, '');
        this.logger.debug('Token extrait:', token);
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: secret,
    });
    this.logger.debug(`Stratégie JWT initialisée avec le secret: ${secret}`);
  }

  async validate(payload: any) {
    this.logger.debug('Validation du payload JWT:', payload);
    try {
      const user = { 
        id: payload.sub, 
        email: payload.email,
        role: payload.role 
      };
      this.logger.debug('Utilisateur validé:', user);
      return user;
    } catch (error) {
      this.logger.error('Erreur lors de la validation du payload:', error);
      throw error;
    }
  }
} 