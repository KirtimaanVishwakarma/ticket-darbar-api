import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { RegisterUserDto } from './dto/RegisterUser.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ResponseMessage('User registered successfully')
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<any> {
    const user = await this.authService.registerNewUser(registerUserDto);
    return user;
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
