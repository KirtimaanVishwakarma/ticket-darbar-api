import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/user/schemas/user.schema';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { RegisterUserDto } from './dto/RegisterUser.dto';
import { MailService } from 'src/common/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService
    ) { }

    async getRefreshToken(user: UserDocument) {
        return await this.jwtService.signAsync(
            {
                sub: user._id.toString(),
            },
            {
                secret:
                    this.configService.getOrThrow<string>(
                        'JWT_REFRESH_SECRET',
                    ),

                expiresIn:
                    this.configService.getOrThrow<number>(
                        'JWT_REFRESH_EXPIRES_IN',
                    ),
            },
        );
    }

    async getAccessToken(user: UserDocument) {
        const { email, mobile, id, role } = user;
        const payload = { sub: id, email, role, mobile };
        return await this.jwtService.signAsync(payload)
    }

    async returnTokens(user: UserDocument) {
        const access_token = await this.getAccessToken(user)
        const refresh_token = await this.getRefreshToken(user)
        return {
            access_token,
            refresh_token
        }
    }

    async signIn(body: SignInDto) {
        const userByEmail = await this.usersService.findUserByEmail(body.email);
        if (!userByEmail) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(
            body.password,
            userByEmail.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalied Email or Passowrd');
        }

        return await this.returnTokens(userByEmail)
    }

    async refreshAccessToken(refreshTokenDto: RefreshAccessTokenDto) {
        const payload = await this.jwtService.verifyAsync<{
            sub: string;
        }>(refreshTokenDto.refreshToken, {
            secret: this.configService.getOrThrow<string>(
                'JWT_REFRESH_SECRET',
            ),
        });
        const userData = await this.usersService.findUserById(payload.sub)
        if (!userData || userData === null) {
            throw new UnauthorizedException("Invailed refresh toekm")
        }
        return await this.returnTokens(userData)
    }

    async registerNewUser(registerUserDto: RegisterUserDto): Promise<string> {
        const user = await this.usersService.registerUser(registerUserDto);
        await this.mailService.sendEmailVarification(user.email, user.fullName, user.emailVerificationToken)
        return `Verification mail sent on ${user.email}`
    }

    async verifyEmailToken(token:string){
        return await this.usersService.verifyEmailToken(token)
    }
}
