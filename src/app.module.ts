import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtConfigModule } from './common/jwt/jwt.module';
import { MailModule } from './common/mail/mail.module';
import { CityModule } from './city/city.module';
import { TheatreModule } from './theatre/theatre.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('connected'));
          connection.on('open', () => console.log('open'));
          connection.on('disconnected', () => console.log('disconnected'));
          connection.on('reconnected', () => console.log('reconnected'));
          connection.on('disconnecting', () => console.log('disconnecting'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    JwtConfigModule,
    UserModule,
    AuthModule,
    MailModule,
    CityModule,
    TheatreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
