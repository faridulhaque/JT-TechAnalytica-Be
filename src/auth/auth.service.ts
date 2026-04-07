import { UserEntity } from '@/entities/user.entity';
import { EnvironmentConfigService, ServiceLevelLogger } from '@/infrastructure';
import { TLoggers } from '@/infrastructure/types/enums';
import { Inject, Injectable } from '@nestjs/common';
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
}
