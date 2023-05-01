import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto, UpdateDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    const password = await bcrypt.hash(data.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password,
        },
      });
      return {
        token: await this.jwtService.signAsync(
          { id: user.id },
          { expiresIn: '1d', secret: this.configService.get('JWT_SECRET') },
        ),
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Email already exists');
      }
      throw error;
    }
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Wrong email or password');
    }
    const passwordValid = await bcrypt.compare(data.password, user.password);
    if (!passwordValid) {
      throw new ForbiddenException('Wrong email or password');
    }
    return {
      token: await this.jwtService.signAsync(
        { id: user.id },
        { expiresIn: '1d', secret: this.configService.get('JWT_SECRET') },
      ),
    };
  }

  async me(payload: { id: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new ForbiddenException('Something went wrong');
    }

    delete user.password;

    return user;
  }

  async update(payload: { id: string }, data: UpdateDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: payload.id,
        },
        data,
      });
      delete user.password;
      return user;
    } catch (error) {
      throw new ForbiddenException('Something went wrong');
    }
  }
}
