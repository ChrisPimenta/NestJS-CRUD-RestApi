import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    // Keyword to identify the guard name. If left blank, automatically jwt.
    'jwt'
) {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        })
    }

    // This function is needed because it automatically appends the req.user object in the payload
    async validate(payload: {
        sub: number;
        email: string
    }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })

        delete user.hash;

        return user;
    }
}