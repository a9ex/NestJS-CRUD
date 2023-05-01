import { Controller, Post, Body, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UpdateDto } from './dto/index';
import { Request } from '@nestjs/common';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@Request() req) {
    return this.authService.me(req.user);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async update(@Request() req, @Body() updateDto: UpdateDto) {
    return this.authService.update(req.user, updateDto);
  }
}
