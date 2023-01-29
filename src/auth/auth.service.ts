import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {
    }

    async signup(dto: AuthDto) {
        // Generate pword hash
        const hash = await argon.hash(dto.password);

        try {
            // Save new user in db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            })

            // Do not return the hash
            delete user.hash;

            // return the saved user
            return this.signToken(user.id, user.email);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // Violating unique field
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }

            throw error;
        }
    }

    async signin(dto: AuthDto) {
        // Find user using email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });

        if (!user) {
            throw new ForbiddenException('credentials not correct')
        }

        // Match password with hash
        const pwMatches = await argon.verify(user.hash, dto.password);

        if (!pwMatches) {
            throw new ForbiddenException('credentials not correct')
        }

        return this.signToken(user.id, user.email);
    }

    // Create a token to use for JWT
    // Use jwt.io to check the returned token
    private async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            // Unique identifier needed
            sub: userId,
            email,
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET'),
        });

        return {
            access_token: token
        }
    }
}