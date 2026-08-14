import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtConfigModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [
    UserModule,
    JwtConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
