import { UserEntity } from '@/entities/user.entity';
import { EnvironmentConfigService, ServiceLevelLogger } from '@/infrastructure';
import { LoginDto } from '@/infrastructure/dto/loginDto';
import { TLoggers } from '@/infrastructure/types/enums';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @Inject(TLoggers.AUTH)
    private logger: ServiceLevelLogger,
    private readonly envConfig: EnvironmentConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(dto: LoginDto): Promise<{ token: string | null }> {
    this.logger.verbose('Started onboarding user');

    try {
      const existingUser = await this.userRepository.findOne({
        where: { username: dto.username },
      });

      if (!existingUser) {
        this.logger.warn(`User not found for username ${dto.username}`);
        return { token: null };
      }

      this.logger.log(`User authenticated: ${existingUser.id}`);

      const token = this.generateJWT(existingUser.id, existingUser.role);
      return { token };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error while logging in ${error?.message}`);
        throw new HttpException(
          error?.message || 'Failed to log in',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        this.logger.error(`Error while logging in: unknown error`);
        throw new HttpException(
          'Failed to log in',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private generateJWT(id: string, role: string): string {
    try {
      this.logger.debug('Json web token is generating');
      const token = this.jwtService.sign(
        { id: id, role },
        {
          secret: this.envConfig.getJwtSecret() as string,
          expiresIn: this.envConfig.getJwtExpiry() as any,
        },
      );
      this.logger.log('Token generated successfully');
      return token;
    } catch (error) {
      this.logger.error('Failed to generate JWT');
      throw new HttpException(
        'Failed to generate token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
