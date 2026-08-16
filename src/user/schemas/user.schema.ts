import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  THEATRE_OWNER = 'THEATRE_OWNER',
  THEATRE_STAFF = 'THEATRE_STAFF',
}

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({
    required: true,
    trim: true,
    maxLength: 50,
  })
  fullName!: string;

  @Prop({
    required: true,
    unique: true,
    trim: true,
    sparse: true,
  })
  mobile!: string;

  @Prop({
    default: false,
  })
  isMobileVerified?: boolean;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email!: string;

  @Prop({ default: null })
  emailVerificationToken!: string

  @Prop({ default: false })
  isEmailVerified?: boolean;

  @Prop({
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role!: UserRole;

  @Prop({
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @Prop({
    minLength: 6,
    required: true,
    trim: true,
    select: false,
  })
  password!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
