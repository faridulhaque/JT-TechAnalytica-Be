import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TLoggers } from '@/infrastructure/types/enums';
import { ServiceLevelLogger } from '@/infrastructure';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    AuthService,
    {
      provide: TLoggers.AUTH,
      useValue: new ServiceLevelLogger(TLoggers.AUTH),
    },

    JwtService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
