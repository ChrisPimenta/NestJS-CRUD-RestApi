import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {
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
            return user;

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

        delete user.hash;

        return user;


        // If not exists throw exception
        // Compare password
        // Password not correct exception

        // Return user
        return { msg: 'I have signed in' };
    }

}