import { RedisService } from '@liaoliaots/nestjs-redis';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserEntity } from '@yugo/nestjs-database/entities';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @Inject(RedisService) private readonly redisService: RedisService,
        @InjectDataSource() private readonly datasoure: DataSource,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: configService.getOrThrow('jwt.config').secret,
            passReqToCallback: true,
        });
    }
    async validate(req: Request, paylod: JwtPayload) {
        const { sub, id } = paylod;
        // @ts-expect-error this function exists but then type def doesnt exists
        const token: string = this._jwtFromRequest(req) as (
            req: Request,
        ) => string;
        const isBlackListed = await this.redisService.getOrNil()?.get(token);
        if (isBlackListed) {
            throw new UnauthorizedException('session expired');
        }
        const user = await this.datasoure.manager.findOne(UserEntity, {
            where: {
                id: id || sub,
            },
            relations: {
                roles: true,
            },
        });
        if (!user) {
            throw new UnauthorizedException('user not found');
        }
        if (!user.active) {
            throw new UnauthorizedException('Your account has been deactivated. Please contact administrator.');
        }
        return {
            ...user,
            roles: user.roles?.map((role) => role.name) || [],
        };
    }
}
