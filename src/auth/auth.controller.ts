import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { RegisterUserDto } from './dto/RegisterUser.dto';
import { ApiOperation } from '@nestjs/swagger';
import { VerificationRegistrationDto } from './dto/verificationRegistration.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ResponseMessage('Verification mail sent on mail please verify')
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<string> {
    return await this.authService.registerNewUser(registerUserDto);
  }

  @Get("verify-email")
  @ResponseMessage("Email verified successfully")
  async verificationRegistration(@Query() query: VerificationRegistrationDto) {
    return await this.authService.verifyEmailToken(query.token)
    
  }

  @ApiOperation({
    summary: 'Login',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @Post("refresh-token")
  async refreshAccessToekn(@Body() refreshAccessTokenDto: RefreshAccessTokenDto) {
    return await this.authService.refreshAccessToken(refreshAccessTokenDto)
  }
}
