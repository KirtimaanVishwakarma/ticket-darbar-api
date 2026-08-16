import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from 'src/auth/dto/RegisterUser.dto';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserStatus } from './schemas/user.schema';
import { Model, QueryFilter } from 'mongoose';
import { SearchUsersDto } from './dto/searchUsers.dto';
import { pagination } from 'src/common/pagination/pagination.util';
import { PaginatedResponse } from 'src/common/pagination/pagination.interface';
import { UserIdDto } from './dto/deleteUser.dto';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    private saltOrRounds = 10;
    constructor(@InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private readonly configService: ConfigService,) { }


    private async emailVerificationToken(email: string): Promise<string> {
        return await this.jwtService.signAsync(
            {
                sub: email,
            },
            {
                secret:
                    this.configService.getOrThrow<string>(
                        'JWT_EMAIL_VERIFICATION_SECRET',
                    ),

                expiresIn:
                    this.configService.getOrThrow<number>(
                        'JWT_EMAIL_VERIFICATION_EXPIRES_IN',
                    ),
            },
        );
    }

    async findUserById(id: string): Promise<UserDocument | null> {
        return await this.userModel.findById(id)
    }

    async findUserByEmail(email: string) {
        return await this.userModel
            .findOne({ email: email.toLowerCase() })
            .select('+password');
    }

    async findUserByMobile(mobile: string) {
        return await this.userModel.findOne({ mobile });
    }

    async verifyEmailToken(token: string) {
        try {
            const verifyUser = await this.jwtService.verifyAsync<{
                sub: string;
            }>(token, {
                secret: this.configService.getOrThrow<string>(
                    'JWT_EMAIL_VERIFICATION_SECRET',
                ),
            });

            const user = await this.userModel.findOneAndUpdate({
                email: verifyUser.sub,
                isMobileVerified: false
            }, {
                $set: {
                    isEmailVerified: true,
                    emailVerificationToken: null
                }
            },
                { returnDocument: "after" })

            if (!user) {
                throw new BadRequestException(
                    'User not found or email is already verified',
                );
            }
            return user

        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new BadRequestException("Email verification link has expried")
            }
            if (error instanceof JsonWebTokenError) {
                throw new BadRequestException(
                    'Invalid email verification token',
                );
            }
        }
    }

    async registerUser(registerUserDto: RegisterUserDto): Promise<UserDocument> {
        const isUserAlreadyExistWithEmail = await this.findUserByEmail(
            registerUserDto.email,
        );
        if (isUserAlreadyExistWithEmail) {
            throw new ConflictException('Email already registered');
        }

        const isUserAlreadyExistWithMobile = await this.findUserByMobile(
            registerUserDto.mobile,
        );
        if (isUserAlreadyExistWithMobile) {
            throw new ConflictException('Mobile number already registered');
        }

        const hashPassword = await bcrypt.hash(
            registerUserDto.password,
            this.saltOrRounds,
        );

        const emailToken = await this.emailVerificationToken(registerUserDto.email)
        const registeredUser = new this.userModel({
            ...registerUserDto,
            password: hashPassword,
            emailVerificationToken: emailToken
        });
        return await registeredUser.save();
    }

    async searchUserList(
        searchQuery: SearchUsersDto,
    ): Promise<PaginatedResponse<User>> {
        const { limit, page, query, ...restFilter } = searchQuery;

        const filter: QueryFilter<UserDocument> = {};

        if (query?.trim()) {
            const regex = new RegExp(query.trim(), 'i');
            filter.$or = [{ fullName: regex }, { email: regex }, { mobile: regex }];
        }

        for (let key in restFilter) {
            if (restFilter[key]) {
                filter[key] = restFilter[key];
            }
        }

        return pagination(this.userModel, filter, {
            page,
            limit,
            sort: {
                createdAt: -1,
            },
            select: '-passwordHash',
        });
    }

    async deleteUserById(userIdDto: UserIdDto): Promise<UserIdDto> {
        const user = await this.userModel.findOneAndUpdate(
            {
                _id: userIdDto.userId,
                status: {
                    $ne: UserStatus.DELETED,
                },
            },
            {
                $set: {
                    status: UserStatus.DELETED,
                },
            },
            {
                returnDocument: 'after',
            },
        );
        if (!user) {
            throw new NotFoundException("User not found")
        }
        return {
            userId: user._id.toString(),
        };
    }
}
