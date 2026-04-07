import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EnvironmentConfigModule, TypeOrmConfigModule } from './infrastructure';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TypeOrmConfigModule,
    JwtModule,
    EnvironmentConfigModule,
    AuthModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
