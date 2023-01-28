import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {
    }

    async signup(dto: AuthDto) {
        // Generate pword hash
        const hash = await argon.hash(dto.password);

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
    }

    signin() {
        return { msg: 'I have signed in' };
    }

}