import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });
      if (!user) {
        console.log(payload);
        throw new ForbiddenException('Wrong email or password');
      }
      return { id: payload.id };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Wrong email or password');
    }
  }
}
